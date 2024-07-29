import {
  TransactionReceipt,
  Web3Provider,
  WebSocketProvider,
} from "@ethersproject/providers";
import { Logger } from "ethers/lib/utils";
import logger from "../../lib/logger";
import getBlockPrices from "../../lib/gas";
import { HexString, UNIXTime } from "../../types";
import { AccountBalance, AddressOnNetwork } from "../../accounts";
import {
  AnyEVMBlock,
  AnyEVMTransaction,
  BlockPrices,
  EIP1559TransactionRequest,
  EVMNetwork,
  LegacyEVMTransactionRequest,
  SignedEVMTransaction,
  sameNetwork,
} from "../../networks";
import { AssetTransfer } from "../../assets";
import {
  AVAX,
  AVAXT,
  Aurora,
  BSC,
  BSCT,
  Cronos,
  // CronosT,
  ETHEREUM,
  Fantom,
  FantomTestnet,
  GOERLI,
  HOUR,
  Mumbai,
  POLYGON,
} from "../../constants";
import { USE_MAINNET_FORK } from "../../features";
import PreferenceService from "../preferences";
import { ServiceCreatorFunction, ServiceLifecycleEvents } from "../types";
import { ChainDatabase, getOrCreateDB } from "./db";
import BaseService from "../base";
import {
  blockFromEthersBlock,
  enrichTransactionWithReceipt,
  ethersTransactionRequestFromEIP1559TransactionRequest,
  transactionFromEthersTransaction,
} from "./utils";
import { normalizeEVMAddress, sameEVMAddress } from "../../lib/utils";
import type {
  EnrichedEIP1559TransactionRequest,
  EnrichedEVMTransactionSignatureRequest,
} from "../enrichment";
import SerialFallbackProvider from "./serial-fallback-provider";
import AssetDataHelper from "./asset-data-helper";
import {
  ACTIVITY_STATUS_TYPES,
  NETWORKCHAIN,
  NODE_URL,
  SOCKET_URL,
  TX_TYPES,
  Tx_METHODS,
} from "../../../utils/constants";
import { checkSum, decryptMessage } from "utils";
import { getStateFromStorage } from "utils/utils.storage";
import { SwapTransactionData } from "interfaces";
import { getNounce, sendTransaction } from "utils/utils.web3";
import { getHashedPassword } from "utils/utils.wallets";

// How many queued transactions should be retrieved on every tx alarm, per
// network. To get frequency, divide by the alarm period. 5 tx / 5 minutes →
// max 1 tx/min.
const TRANSACTIONS_RETRIEVED_PER_ALARM = 5;

// The number of blocks to query at a time for historic asset transfers.
// Unfortunately there's no "right" answer here that works well across different
// people's account histories. If the number is too large relative to a
// frequently used account, the first call will time out and waste provider
// resources... resulting in an exponential backoff. If it's too small,
// transaction history will appear "slow" to show up for newly imported
// accounts.
const BLOCKS_FOR_TRANSACTION_HISTORY = 128000;

// The number of blocks before the current block height to start looking for
// asset transfers. This is important to allow nodes like Erigon and
// OpenEthereum with tracing to catch up to where we are.
const BLOCKS_TO_SKIP_FOR_TRANSACTION_HISTORY = 20;

// The number of asset transfer lookups that will be done per account to rebuild
// historic activity.
const HISTORIC_ASSET_TRANSFER_LOOKUPS_PER_ACCOUNT = 10;

// The number of milliseconds after a request to look up a transaction was
// first seen to continue looking in case the transaction fails to be found
// for either internal (request failure) or external (transaction dropped from
// mempool) reasons.
const TRANSACTION_CHECK_LIFETIME_MS = 10 * HOUR;

interface Events extends ServiceLifecycleEvents {
  newAccountToTrack: AddressOnNetwork;
  accountsWithBalances: AccountBalance[];
  transactionSend: HexString;
  transactionSendFailure: undefined;
  addTransactionInProgress: any;

  assetTransfers: {
    addressNetwork: AddressOnNetwork;
    assetTransfers: AssetTransfer[];
  };
  block: AnyEVMBlock;

  transaction: { forAccounts: string[]; transaction: AnyEVMTransaction };
  blockPrices: { blockPrices: BlockPrices; network: EVMNetwork };
}

/**
 * ChainService is responsible for basic network monitoring and interaction.
 * Other services rely on the chain service rather than polling networks
 * themselves.
 *
 * The service should provide
 * * Basic cached network information, like the latest block hash and height
 * * Cached account balances, account history, and transaction data
 * * Gas estimation and transaction broadcasting
 * * Event subscriptions, including events whenever
 *   * A new transaction relevant to accounts tracked is found or first
 *     confirmed
 *   * A historic account transaction is pulled and cached
 *   * Any asset transfers found for newly tracked accounts
 *   * A relevant account balance changes
 *   * New blocks
 * * ... and finally, polling and websocket providers for supported networks, in
 *   case a service needs to interact with a network directly.
 */
export default class ChainService extends BaseService<Events> {
  providers: { evm: { [networkName: string]: SerialFallbackProvider } } = {
    evm: {},
  };

  subscribedAccounts: {
    account: string;
    provider: SerialFallbackProvider;
  }[];

  subscribedNetworks: {
    network: EVMNetwork;
    provider: SerialFallbackProvider;
  }[];

  /**
   * For each chain id, track an address's last seen nonce. The tracked nonce
   * should generally not be allocated to a new transaction, nor should any
   * nonces that precede it, unless the intent is deliberately to replace an
   * unconfirmed transaction sharing the same nonce.
   */
  private evmChainLastSeenNoncesByNormalizedAddress: {
    [chainID: string]: { [normalizedAddress: string]: number };
  } = {};

  /**
   * FIFO queues of transaction hashes per network that should be retrieved and
   * cached, alongside information about when that hash request was first seen
   * for expiration purposes.
   */
  private transactionsToRetrieve: {
    network: EVMNetwork;
    hash: HexString;
    firstSeen: UNIXTime;
  }[];

  static create: ServiceCreatorFunction<
    Events,
    ChainService,
    [Promise<PreferenceService>]
  > = async (preferenceService) => {
    return new this(await getOrCreateDB(), await preferenceService);
  };

  supportedNetworks: EVMNetwork[];
  supportedAlcehmyNetworks: EVMNetwork[];
  newSupportedNetworks: EVMNetwork[];

  assetData: AssetDataHelper;

  private constructor(
    private db: ChainDatabase,
    private preferenceService: PreferenceService
  ) {
    super({
      // queuedTransactions: {
      //   schedule: {
      //     delayInMinutes: 1,
      //     periodInMinutes: 1,
      //   },
      //   handler: () => {
      //     this.handleQueuedTransactionAlarm();
      //   },
      // },
      // historicAssetTransfers: {
      //   schedule: {
      //     periodInMinutes: 1,
      //   },
      //   handler: () => {
      //     this.handleHistoricAssetTransferAlarm();
      //   },
      //   runAtStart: false,
      // },
      // recentAssetTransfers: {
      //   schedule: {
      //     periodInMinutes: 1,
      //   },
      //   handler: () => {
      //     this.handleRecentAssetTransferAlarm();
      //   },
      // },
      // blockPrices: {
      //   runAtStart: false,
      //   schedule: {
      //     periodInMinutes:
      //       Number(process.env.GAS_PRICE_POLLING_FREQUENCY ?? "120") / 60,
      //   },
      //   handler: () => {
      //     this.pollBlockPrices();
      //   },
      // },
    });

    this.supportedNetworks = [
      ETHEREUM,
      GOERLI,
      POLYGON,
      Mumbai,
      BSC,
      BSCT,
      AVAX,
      AVAXT,
      Fantom,
      FantomTestnet,
      Cronos,
      // CronosT,
      Aurora,
    ];

    this.supportedAlcehmyNetworks = [ETHEREUM, POLYGON];
    this.newSupportedNetworks = [
      Mumbai,
      BSC,
      BSCT,
      AVAX,
      AVAXT,
      Fantom,
      FantomTestnet,
      Cronos,
      // CronosT,
      Aurora,
    ];

    this.providers = {
      evm: Object.fromEntries(
        this.supportedNetworks.map((network) => {
          const node_url =
            NETWORKCHAIN[Number(network.chainID) as keyof typeof NETWORKCHAIN][
              NODE_URL
            ];
          const socket_url =
            NETWORKCHAIN[Number(network.chainID) as keyof typeof NETWORKCHAIN][
              SOCKET_URL
            ];
          // if (
          //   network.chainID == "56" ||
          //   network.chainID == "97" ||
          //   network.chainID == "80001" ||
          //   network.chainID == "250" ||
          //   network.chainID == "4002" ||
          //   network.chainID == "43114" ||
          //   network.chainID == "43113"
          // ) {
          return [
            network.chainID,
            new SerialFallbackProvider(
              network,
              () => new WebSocketProvider(socket_url),
              () => new Web3Provider({ path: node_url })
            ),
          ];
          // }
          // else {
          //   return [
          //     network.chainID,
          //     new SerialFallbackProvider(
          //       network,
          //       () =>
          //         new AlchemyWebSocketProvider(
          //           getNetwork(Number(network.chainID)),
          //           ALCHEMY_KEY
          //         ),
          //       () =>
          //         new AlchemyProvider(
          //           getNetwork(Number(network.chainID)),
          //           ALCHEMY_KEY
          //         )
          //     ),
          //   ];
          // }
        })
      ),
    };

    console.log(this.providers, "this.providers");
    this.subscribedAccounts = [];
    this.subscribedNetworks = [];
    this.transactionsToRetrieve = [];

    this.assetData = new AssetDataHelper(this);
  }

  async internalStartService(): Promise<void> {
    await super.internalStartService();

    // const accounts = await this.getAccountsToTrack();

    // get the latest blocks and subscribe for all support networks
    // TODO revisit whether we actually want to subscribe to new heads
    // if a user isn't tracking a relevant addressOnNetwork
    // this.supportedNetworks.forEach(async (network) => {
    //   const provider = this.providerForNetwork(network);
    //   // console.log("provider", provider);
    //   if (provider) {
    //     Promise.all([
    //       provider.getBlockNumber().then(async (n) => {
    //         const result = await provider.getBlock(n);
    //         const block = blockFromEthersBlock(network, result);
    //         await this.db.addBlock(block);
    //       }),

    //       this.subscribeToNewHeads(network),
    //     ]).catch((e) => {
    //       logger.error("Error getting block number or new head", e);
    //     });
    //   } else {
    //     logger.error(`Couldn't find provider for supported network ${network}`);
    //   }
    // });

    // Promise.allSettled(
    //   accounts.flatMap((an) => [
    //     // subscribe to all account transactions
    //     // this.subscribeToAccountTransactions(an).catch((e) => {
    //     //   logger.error(e);
    //     // }),
    //     // do a base-asset balance check for every account
    //     this.getLatestBaseAccountBalance(an).catch((e) => {
    //       logger.error(e);
    //     }),
    //   ])
    //   // .concat(
    //   //   // Schedule any stored unconfirmed transactions for
    //   //   // retrieval---either to confirm they no longer exist, or to
    //   //   // read/monitor their status.
    //   //   this.supportedNetworks.map((network) =>
    //   //     this.db
    //   //       .getNetworkPendingTransactions(network)
    //   //       .then((pendingTransactions) => {
    //   //         pendingTransactions.forEach(({ hash, firstSeen }) => {
    //   //           logger.debug(
    //   //             `Queuing pending transaction ${hash} for status lookup.`
    //   //           );
    //   //           this.queueTransactionHashToRetrieve(
    //   //             network,
    //   //             hash,
    //   //             firstSeen
    //   //           ).catch((e) => {
    //   //             logger.error(e);
    //   //           });
    //   //         });
    //   //       })
    //   //       .catch((e) => {
    //   //         logger.error(e);
    //   //       })
    //   //   )
    //   // )
    // );
  }

  /**
   * Finds a provider for the given network, or returns undefined if no such
   * provider exists.
   */
  providerForNetwork(network: EVMNetwork): SerialFallbackProvider | undefined {
    return this.providers.evm[network.chainID];
  }

  /**
   * Finds a provider for the given network, or returns undefined if no such
   * provider exists.
   */
  providerForNetworkOrThrow(network: EVMNetwork): SerialFallbackProvider {
    const provider = this.providerForNetwork(network);
    if (!provider) {
      logger.error(
        "Request received for operation on unsupported network",
        network,
        "expected",
        this.supportedNetworks
      );
      throw new Error(`Unexpected network ${network}`);
    }
    return provider;
  }

  /**
   * Populates the provided partial EIP1559 transaction request with all fields
   * except the nonce. This leaves the transaction ready for user review, and
   * the nonce ready to be filled in immediately prior to signing to minimize the
   * likelihood for nonce reuse.
   *
   * Note that if the partial request already has a defined nonce, it is not
   * cleared.
   */
  async populatePartialEVMTransactionRequest(
    network: EVMNetwork,
    partialRequest: EnrichedEVMTransactionSignatureRequest
  ): Promise<{
    transactionRequest: EnrichedEIP1559TransactionRequest;
    gasEstimationError: string | undefined;
  }> {
    // Basic transaction construction based on the provided options, with extra data from the chain service
    const transactionRequest: EnrichedEIP1559TransactionRequest = {
      from: partialRequest.from,
      to: partialRequest.to,
      value: partialRequest.value ?? 0n,
      gasLimit: partialRequest.gasLimit ?? 0n,
      maxFeePerGas: partialRequest.maxFeePerGas ?? 0n,
      maxPriorityFeePerGas: partialRequest.maxPriorityFeePerGas ?? 0n,
      input: partialRequest.input ?? null,
      type: 2 as const,
      network,
      chainID: network.chainID,
      nonce: partialRequest.nonce,
      annotation: partialRequest.annotation,
    };

    // Always estimate gas to decide whether the transaction will likely fail.
    let estimatedGasLimit: bigint | undefined;
    let gasEstimationError: string | undefined;
    try {
      estimatedGasLimit = await this.estimateGasLimit(
        network,
        transactionRequest
      );
    } catch (error) {
      // Try to identify unpredictable gas errors to bubble that information
      // out.
      if (error instanceof Error) {
        // Ethers does some heavily loose typing around errors to carry
        // arbitrary info without subclassing Error, so an any cast is needed.

        const anyError: any = error;

        if (
          "code" in anyError &&
          anyError.code === Logger.errors.UNPREDICTABLE_GAS_LIMIT
        ) {
          gasEstimationError = anyError.error ?? "unknown transaction error";
        }
      }
    }

    // We use the estimate as the actual limit only if user did not specify the
    // gas explicitly or if it was set below the minimum network-allowed value.
    if (
      typeof estimatedGasLimit !== "undefined" &&
      (typeof partialRequest.gasLimit === "undefined" ||
        partialRequest.gasLimit < 21000n)
    ) {
      transactionRequest.gasLimit = estimatedGasLimit;
    }

    return { transactionRequest, gasEstimationError };
  }

  /**
   * Populates the nonce for the passed EIP1559TransactionRequest, provided
   * that it is not yet populated. This process generates a new nonce based on
   * the known on-chain nonce state of the service, attempting to ensure that
   * the nonce will be unique and an increase by 1 over any other confirmed or
   * pending nonces in the mempool.
   *
   * Returns the transaction request with a guaranteed-defined nonce, suitable
   * for signing by a signer.
   */
  async populateEVMTransactionNonce(
    transactionRequest: EIP1559TransactionRequest
  ): Promise<EIP1559TransactionRequest & { nonce: number }> {
    if (typeof transactionRequest.nonce !== "undefined") {
      // TS undefined checks don't narrow the containing object's type, so we
      // have to cast `as` here.
      return transactionRequest as EIP1559TransactionRequest & {
        nonce: number;
      };
    }
    const activeNetwork = this.supportedNetworks.filter(
      (network) => network.chainID === transactionRequest.chainID
    )[0];
    // console.log("populateEVMTransactionNonce", transactionRequest);
    transactionRequest.network = activeNetwork;

    const chainNonce = await getNounce(transactionRequest);

    // const existingNonce = web3.eth.getTransactionCount(normalizedAddress);
    // this.evmChainLastSeenNoncesByNormalizedAddress[chainID]?.[
    //   normalizedAddress
    // ] ?? chainNonce;

    // console.log("existingNonce", existingNonce);

    // this.evmChainLastSeenNoncesByNormalizedAddress[chainID] || {};
    // this.evmChainLastSeenNoncesByNormalizedAddress[chainID] ??= {};
    // Use the network count, if needed. Note that the assumption here is that
    // all nonces for this address are increasing linearly and continuously; if
    // the address has a pending transaction floating around with a nonce that
    // is not an increase by one over previous transactions, this approach will
    // allocate more nonces that won't mine.
    // TODO Deal with multi-network.
    // this.evmChainLastSeenNoncesByNormalizedAddress[chainID][normalizedAddress] =
    //   Math.max(existingNonce, chainNonce);

    // // Allocate a new nonce by incrementing the last seen one.
    // this.evmChainLastSeenNoncesByNormalizedAddress[chainID][
    //   normalizedAddress
    // ] += 1;
    // const knownNextNonce =
    //   this.evmChainLastSeenNoncesByNormalizedAddress[chainID][
    //     normalizedAddress
    //   ];

    // logger.debug(
    //   "Got chain nonce",
    //   chainNonce,
    //   "existing nonce",
    //   existingNonce,
    //   "using",
    //   knownNextNonce
    // );

    return {
      ...transactionRequest,
      nonce: chainNonce,
    };
  }

  /**
   * Releases the specified nonce for the given network and address. This
   * updates internal service state to allow that nonce to be reused. In cases
   * where multiple nonces were seen in a row, this will make internally
   * available for reuse all intervening nonces.
   */
  releaseEVMTransactionNonce(
    transactionRequest:
      | (EIP1559TransactionRequest & {
          nonce: number;
        })
      | (LegacyEVMTransactionRequest & { nonce: number })
      | SignedEVMTransaction
  ): void {
    const { nonce } = transactionRequest;
    const chainID =
      "chainID" in transactionRequest
        ? transactionRequest.chainID
        : transactionRequest.network.chainID;

    const normalizedAddress = normalizeEVMAddress(transactionRequest.from);
    const lastSeenNonce =
      this.evmChainLastSeenNoncesByNormalizedAddress[chainID][
        normalizedAddress
      ];

    // TODO Currently this assumes that the only place this nonce could have
    // TODO been used is this service; however, another wallet or service
    // TODO could have broadcast a transaction with this same nonce, in which
    // TODO case the nonce release shouldn't take effect! This should be a
    // TODO relatively rare edge case, but we should handle it at some point.
    if (nonce === lastSeenNonce) {
      this.evmChainLastSeenNoncesByNormalizedAddress[chainID][
        normalizedAddress
      ] -= 1;
    } else if (nonce < lastSeenNonce) {
      // If the nonce we're releasing is below the latest allocated nonce,
      // release all intervening nonces. This risks transaction replacement
      // issues, but ensures that we don't start allocating nonces that will
      // never mine (because they will all be higher than the
      // now-released-and-therefore-never-broadcast nonce).
      this.evmChainLastSeenNoncesByNormalizedAddress[chainID][
        normalizedAddress
      ] = lastSeenNonce - 1;
    }
  }

  async getAccountsToTrack(): Promise<AddressOnNetwork[]> {
    return this.db.getAccountsToTrack();
  }

  async removeAccountToTrack(address: string): Promise<void> {
    await this.db.removeAccountToTrack(address);
  }

  async getLatestBaseAccountBalance({
    address,
    network,
  }: AddressOnNetwork): Promise<AccountBalance> {
    const balance = await this.providerForNetworkOrThrow(network).getBalance(
      address
    );
    const accountBalance: AccountBalance = {
      address,
      network,
      assetAmount: {
        asset: network.baseAsset,
        amount: balance.toBigInt(),
      },
      dataSource: "alchemy", // TODO do this properly (eg provider isn't Alchemy)
      retrievedAt: Date.now(),
    };
    this.emitter.emit("accountsWithBalances", [accountBalance]);
    await this.db.addBalance(accountBalance);
    return accountBalance;
  }

  async addAccountToTrack(addressNetwork: AddressOnNetwork): Promise<void> {
    await this.db.addAccountToTrack(addressNetwork);
    this.emitter.emit("newAccountToTrack", addressNetwork);
    this.getLatestBaseAccountBalance(addressNetwork).catch((e) => {
      logger.error(
        "chainService/addAccountToTrack: Error getting latestBaseAccountBalance",
        e
      );
    });

    // this.loadRecentAssetTransfers(addressNetwork).catch((e) => {
    //   logger.error(
    //     "chainService/addAccountToTrack: Error loading recent asset transfers",
    //     e
    //   );
    // });
  }

  async getBlockHeight(network: EVMNetwork): Promise<number> {
    const cachedBlock = await this.db.getLatestBlock(network);
    if (cachedBlock) {
      return cachedBlock.blockHeight;
    }
    return this.providerForNetworkOrThrow(network).getBlockNumber();
  }

  /**
   * Return cached information on a block if it's in the local DB.
   *
   * Otherwise, retrieve the block from the specified network, caching and
   * returning the object.
   *
   * @param network the EVM network we're interested in
   * @param blockHash the hash of the block we're interested in
   */
  async getBlockData(
    network: EVMNetwork,
    blockHash: string
  ): Promise<AnyEVMBlock> {
    const cachedBlock = await this.db.getBlock(network, blockHash);
    if (cachedBlock) {
      return cachedBlock;
    }

    // Looking for new block
    const resultBlock = await this.providerForNetworkOrThrow(network).getBlock(
      blockHash
    );

    const block = blockFromEthersBlock(network, resultBlock);

    await this.db.addBlock(block);
    this.emitter.emit("block", block);
    return block;
  }

  /**
   * Return cached information on a transaction, if it's both confirmed and
   * in the local DB.
   *
   * Otherwise, retrieve the transaction from the specified network, caching and
   * returning the object.
   *
   * @param network the EVM network we're interested in
   * @param txHash the hash of the unconfirmed transaction we're interested in
   */
  async getTransaction(
    network: EVMNetwork,
    txHash: HexString
  ): Promise<AnyEVMTransaction> {
    const cachedTx = await this.db.getTransaction(network, txHash);
    if (cachedTx) {
      return cachedTx;
    }
    const gethResult = await this.providerForNetworkOrThrow(
      network
    ).getTransaction(txHash);
    const newTransaction = transactionFromEthersTransaction(
      gethResult,
      network
    );

    if (!newTransaction.blockHash && !newTransaction.blockHeight) {
      this.subscribeToTransactionConfirmation(network, newTransaction);
    }

    // TODO proper provider string
    this.saveTransaction(newTransaction);
    return newTransaction;
  }

  /**
   * Queues up a particular transaction hash for later retrieval.
   *
   * Using this method means the service can decide when to retrieve a
   * particular transaction. Queued transactions are generally retrieved on a
   * periodic basis.
   *
   * @param network The network on which the transaction has been broadcast.
   * @param txHash The tx hash identifier of the transaction we want to retrieve.
   * @param firstSeen The timestamp at which the queued transaction was first
   *        seen; used to treat transactions as dropped after a certain amount
   *        of time.
   */
  async queueTransactionHashToRetrieve(
    network: EVMNetwork,
    txHash: HexString,
    firstSeen: UNIXTime
  ): Promise<void> {
    const seen = this.transactionsToRetrieve.some(
      ({ network: queuedNetwork, hash }) =>
        sameNetwork(network, queuedNetwork) && hash === txHash
    );

    if (!seen) {
      // @TODO Interleave initial transaction retrieval by network
      this.transactionsToRetrieve.push({ hash: txHash, network, firstSeen });
    }
  }

  /**
   * Estimate the gas needed to make a transaction. Adds 10% as a safety net to
   * the base estimate returned by the provider.
   */
  async estimateGasLimit(
    network: EVMNetwork,
    transactionRequest: EIP1559TransactionRequest
  ): Promise<bigint> {
    if (USE_MAINNET_FORK) {
      return 350000n;
    }
    const estimate = await this.providerForNetworkOrThrow(network).estimateGas(
      ethersTransactionRequestFromEIP1559TransactionRequest(transactionRequest)
    );

    // Add 10% more gas as a safety net
    const uppedEstimate = estimate.add(estimate.div(10));
    return BigInt(uppedEstimate.toString());
  }

  /**
   * Broadcast a signed EVM transaction.
   *
   * @param transaction A signed EVM transaction to broadcast. Since the tx is signed,
   *        it needs to include all gas limit and price params.
   */
  async broadcastSignedTransaction(transaction: any): Promise<void> {
    try {
      //  const state: any = await getStorageSyncValue("state");
      console.log(
        "🚀 ~ file: index.ts:782 ~ ChainService ~ broadcastSignedTransaction ~ transaction:",
        transaction
      );
      const state = await getStateFromStorage();

      const accounts = state.newWallet.accounts;
      const hashedPassword = await getHashedPassword();
      const CurrentDappChainId = state.dappInfo.dAppConnectAddress;
      const chainId =
        +transaction?.network?.chainID ?? Number(CurrentDappChainId);

      const checkSumAddress = checkSum(transaction.from);
      // console.log(
      //   "broadcast",
      //   transaction,
      //   "checkSumAddress",
      //   checkSumAddress,
      //   "state",
      //   state
      // );

      let privateKey = decryptMessage(
        accounts[checkSumAddress]
          ? accounts[checkSumAddress].secret
          : accounts[transaction.from].secret,
        hashedPassword
      );
      // TODO make proper use of tx.network to choose provider

      privateKey = privateKey.startsWith("0x") ? privateKey : "0x" + privateKey;

      const saveTx = (transactionObj: any, p: any) => {
        this.emitter.emit(
          "transactionSend",
          JSON.stringify({
            hash: p.transactionHash,
            network: chainId,
            address: p.from,
            takerUSDPrice: 0,
            makerUSDPrice: 0,
            takerBalance: 0,
            makerBalance: 0,
          })
        );
        this.saveTransaction(enrichTransactionWithReceipt(transactionObj, p));
        this.saveTransaction(transaction);
      };

      const onTxHashReceive = (transactionObj: any, txHash: string) => {
        // this.addTransactionActivityToWallet({ transaction, transactionObj });
        const address = checkSum(transactionObj.from);
        const txDetails: SwapTransactionData = {
          txType: TX_TYPES.Swap,
          from: address,
          to: address,
          token: {
            address: "",
            amount: transactionObj.value,
            amountInUsd: 0,
            decimal: 18,
            image: "",
            name: "",
            symbol: "",
          },

          transactionFeeInUsd: 1,
          timeStamp: Date.now(),
          nonce: transactionObj.nonce,
          chainId,
          transactionHash: txHash,
          address: address,
          isSpeedUpEnabled: true,
          isCancelEnabled: true,
          rawData: {
            chainId,
            transactionObject: transactionObj,
          },
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "",
            amount: 0,
            amountInUsd: 1,
            decimal: 18,
            image: "",
            name: "",
            symbol: "",
          },
          makerBalance: 0,
          makerBalanceInUsd: 1,
          takerBalance: 0,
          takerBalanceInUsd: 1,
          tokenAprice: 1,
          tokenBprice: 1,
          walletName: "",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: true,
        };

        this.emitter.emit("addTransactionInProgress", { txDetails });
      };

      const hash = await sendTransaction(
        privateKey,
        transaction,
        saveTx,
        onTxHashReceive
      );
      // console.log("TRANSACTION SENT WITH NEW METHOD");
      return hash as any;
    } catch (error) {
      this.emitter.emit("transactionSendFailure");
      logger.error("Error broadcasting transaction", error);

      throw error;
    }
  }

  /*
   * Periodically fetch block prices and emit an event whenever new data is received
   * Write block prices to IndexedDB so we have them for later
   */
  async pollBlockPrices(): Promise<void> {
    await Promise.allSettled(
      this.subscribedNetworks.map(async ({ network, provider }) => {
        const blockPrices = await getBlockPrices(network, provider);
        this.emitter.emit("blockPrices", { blockPrices, network });
      })
    );
  }

  async send(
    method: string,
    params: unknown[],
    network: EVMNetwork
  ): Promise<unknown> {
    const res = await this.providerForNetworkOrThrow(network).send(
      method,
      params
    );
    return res;
  }

  /* *****************
   * PRIVATE METHODS *
   * **************** */

  /**
   * Load recent asset transfers from an account on a particular network. Backs
   * off exponentially (in block range, not in time) on failure.
   *
   * @param addressNetwork the address and network whose asset transfers we need
   */
  private async loadRecentAssetTransfers(
    addressNetwork: AddressOnNetwork
  ): Promise<void> {
    const blockHeight =
      (await this.getBlockHeight(addressNetwork.network)) -
      BLOCKS_TO_SKIP_FOR_TRANSACTION_HISTORY;
    let fromBlock = blockHeight - BLOCKS_FOR_TRANSACTION_HISTORY;
    try {
      return await this.loadAssetTransfers(
        addressNetwork,
        BigInt(fromBlock),
        BigInt(blockHeight)
      );
    } catch (err) {
      logger.error(
        "Failed loaded recent assets, retrying with shorter block range",
        addressNetwork,
        err
      );
    }

    // TODO replace the home-spun backoff with a util function
    fromBlock = blockHeight - Math.floor(BLOCKS_FOR_TRANSACTION_HISTORY / 2);
    try {
      return await this.loadAssetTransfers(
        addressNetwork,
        BigInt(fromBlock),
        BigInt(blockHeight)
      );
    } catch (err) {
      logger.error(
        "Second failure loading recent assets, retrying with shorter block range",
        addressNetwork,
        err
      );
    }

    fromBlock = blockHeight - Math.floor(BLOCKS_FOR_TRANSACTION_HISTORY / 4);
    try {
      return await this.loadAssetTransfers(
        addressNetwork,
        BigInt(fromBlock),
        BigInt(blockHeight)
      );
    } catch (err) {
      logger.error(
        "Final failure loading recent assets for account",
        addressNetwork,
        err
      );
    }
    return Promise.resolve();
  }

  /**
   * Load asset transfers from an account on a particular network within a
   * particular block range. Emit events for any transfers found, and look up
   * any related transactions and blocks.
   *
   * @param addressOnNetwork the address and network whose asset transfers we need
   */
  private async loadAssetTransfers(
    addressOnNetwork: AddressOnNetwork,
    startBlock: bigint,
    endBlock: bigint
  ): Promise<void> {
    // TODO this will require custom code for Arbitrum and Optimism support
    // as neither have Alchemy's assetTransfers endpoint

    const assetTransfers = await this.assetData.getAssetTransfers(
      addressOnNetwork,
      Number(startBlock),
      Number(endBlock)
    );

    await this.db.recordAccountAssetTransferLookup(
      addressOnNetwork,
      startBlock,
      endBlock
    );

    this.emitter.emit("assetTransfers", {
      addressNetwork: addressOnNetwork,
      assetTransfers,
    });

    const firstSeen = Date.now();

    /// send all found tx hashes into a queue to retrieve + cache
    assetTransfers.forEach((a) =>
      this.queueTransactionHashToRetrieve(
        addressOnNetwork.network,
        a.txHash,
        firstSeen
      )
    );
  }

  /**
   * Save a transaction to the database and emit an event.
   *
   * @param transaction The transaction to save and emit. Uniqueness and
   *        ordering will be handled by the database.
   * @param dataSource Where the transaction was seen.
   */
  private async saveTransaction(transaction: any): Promise<void> {
    if (transaction.transactionHash) {
      // Merge existing data into the updated transaction data. This handles
      // cases where an existing transaction has been enriched by e.g. a receipt,
      // and new data comes in.
      // console.log("saveTransaction", transaction, dataSource);
      // const existing = await this.db.getTransaction(
      //   transaction.network,
      //   transaction.transactionHash
      // );
      // console.log("existing", existing);
      // const finalTransaction = {
      //   ...existing,
      //   ...transaction,
      // };

      let error: unknown = null;
      // try {
      //   await this.db.addOrUpdateTransaction(
      //     {
      //       // Don't lose fields the existing transaction has pulled, e.g. from a
      //       // transaction receipt.
      //       ...existing,
      //       ...finalTransaction,
      //     },
      //     dataSource
      //   );
      // } catch (err) {
      //   error = err;
      //   logger.error(`Error saving tx ${finalTransaction}`, error);
      // }
      try {
        // const accounts = await this.getAccountsToTrack();
        // console.log("accounts", accounts);

        // const forAccounts = accounts
        //   .filter(
        //     ({ address }) =>
        //       sameEVMAddress(finalTransaction.from, address) ||
        //       sameEVMAddress(finalTransaction.to, address)
        //   )
        //   .map(({ address }) => {
        //     return normalizeEVMAddress(address);
        //   });

        // // emit in a separate try so outside services still get the tx
        await this.emitter.emit("transaction", {
          transaction,
          forAccounts: [transaction.from],
        });
      } catch (err) {
        error = err;
        // console.log(err);
      }
      if (error) {
        throw error;
      }
    }
  }

  /**
   * Given a list of AddressOnNetwork objects, return only the ones that
   * are currently being tracked.
   */
  async filterTrackedAddressesOnNetworks(
    addressesOnNetworks: AddressOnNetwork[]
  ): Promise<AddressOnNetwork[]> {
    const accounts = await this.getAccountsToTrack();

    return addressesOnNetworks.filter(({ address, network }) =>
      accounts.some(
        ({ address: trackedAddress, network: trackedNetwork }) =>
          sameEVMAddress(trackedAddress, address) &&
          network.name === trackedNetwork.name
      )
    );
  }

  /**
   * Track an pending transaction's confirmation status, saving any updates to
   * the database and informing subscribers via the emitter.
   *
   * @param network the EVM network we're interested in
   * @param transaction the unconfirmed transaction we're interested in
   */
  private async subscribeToTransactionConfirmation(
    network: EVMNetwork,
    transaction: any
  ): Promise<void> {
    if (transaction.transactionHash) {
      // console.log("subscribeToTransactionConfirmation", network, transaction);
      const provider = this.providerForNetworkOrThrow(network);
      // console.log("PROIDER=====", provider);
      provider.once(
        transaction.transactionHash,
        (confirmedReceipt: TransactionReceipt) => {
          // console.log("ONCE==============", confirmedReceipt);
          this.saveTransaction(
            enrichTransactionWithReceipt(transaction, confirmedReceipt)
          );
        }
      );
    }
  }

  // TODO removing an account to track
}