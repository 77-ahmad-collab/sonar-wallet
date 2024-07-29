import browser, { runtime } from "webextension-polyfill";
import { alias, wrapStore } from "webext-redux";
import deepDiff from "webext-redux/lib/strategies/deepDiff/diff";

import { Middleware, configureStore, isPlain } from "@reduxjs/toolkit";

import { PermissionRequest } from "../provider-bridge-shared";

import { decodeJSON, encodeJSON } from "./lib/utils";

import {
  BaseService,
  ChainService,
  EnrichmentService,
  IndexingService,
  InternalEthereumProviderService,
  KeyringService,
  NameService,
  PreferenceService,
  ProviderBridgeService,
  ServiceCreatorFunction,
  SigningService,
} from "./services";

import { HexString, KeyringTypes } from "./types";
import { SignedEVMTransaction } from "./networks";
import { AccountBalance, AddressOnNetwork, NameOnNetwork } from "./accounts";

import mainReducer from "store/index";
import {
  loadAccount,
  updateAccountBalance,
  updateAccountName,
  updateENSAvatar,
} from "store/accounts";

import { assetsLoaded, newPricePoint } from "store/assets";
import {
  keyringLocked,
  emitter as keyringSliceEmitter,
  keyringUnlocked,
  setKeyringToVerify,
  updateKeyrings,
} from "store/keyrings";
import { blockSeen } from "store/networks";
import {
  initializationLoadingTimeHitLimit,
  setDefaultWallet,
  setSnackbarMessage,
  emitter as uiSliceEmitter,
} from "store/ui";
import {
  TransactionConstructionStatus,
  clearCustomGas,
  clearTransactionState,
  estimatedFeesPerGas,
  rejectTransactionSignature,
  emitter as transactionConstructionSliceEmitter,
  transactionRequest,
  transactionSigned,
  updateTransactionData,
} from "store/transaction-construction";
import { selectDefaultNetworkFeeSettings } from "store/selectors/transactionConstructionSelectors";
import { allAliases } from "store/utils";
import {
  initializePermissions,
  emitter as providerBridgeSliceEmitter,
  requestPermission,
} from "store/dapp";
import {
  clearSigningState,
  rejectDataSignature,
  signDataRequest,
  signedData as signedDataAction,
  signedTypedData,
  signingSliceEmitter,
  typedDataRequest,
} from "store/signing";

import { SignDataRequest, SignTypedDataRequest } from "./utils/signing";

import { DAPP_SUPPORTED_NETWORKS_SONAR_WALLET } from "./constants";
import {
  SignatureResponse,
  SignerType,
  TXSignatureResponse,
} from "./services/signing";
import { REDUX_STATE_VERSION, migrateReduxState } from "store/migrations";
import { PermissionMap } from "./services/provider-bridge/utils";
import { TALLY_INTERNAL_ORIGIN } from "./services/internal-ethereum-provider/constants";
import {
  ACTIVITY_STATUS_TYPES,
  DAPPEVENTS,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NETWORKCHAIN,
  TX_TYPES,
} from "utils/constants";
import { setTransactionActivityData } from "@slices/newWalletSlice";
import { mergeNewAndOldActivityData } from "utils";
import {
  addInProgressTransactionHash,
  setPendingTransactionStates,
} from "@slices/appSlice";
import { getDetailSingleTokenInfoInDapp } from "utils/utils.api";
import {
  setDAppNetwork,
  setMethod,
  setOrigin,
  setPermChangeNetwork,
  setRequestAccountsData,
  setSignMessageData,
  setSignTransactionData,
  setSignTypedData,
  setSignedData,
  setSwitchNetworkData,
} from "@slices/dappInfoSlice";
import { getStateFromStorage } from "utils/utils.storage";

import { ethers } from "ethers";
import {
  getTransactions,
  onDappTransactionComplete,
  onDappTransactionFailure,
} from "utils/utils.activity";
import { generateNotification } from "utils/utils.notifications";

const reduxCache: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  if (process.env.WRITE_REDUX_CACHE === "true") {
    // Browser extension storage supports JSON natively, despite that we have
    // to stringify to preserve BigInts
    browser.storage.local.set({
      state: encodeJSON(state),
      version: REDUX_STATE_VERSION,
    });
  }

  return result;
};

// Declared out here so ReduxStoreType can be used in Main.store type
// declaration.
export const initializeStore = (main: Main, preloadedState = {}) =>
  configureStore({
    preloadedState,
    reducer: mainReducer,
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        serializableCheck: {
          isSerializable: (value: unknown) =>
            isPlain(value) || typeof value === "bigint",
        },
        thunk: { extraArgument: { main } },
        // thunk: true,
      });

      // It might be tempting to use an array with `...` destructuring, but
      // unfortunately this fails to preserve important type information from
      // `getDefaultMiddleware`. `push` and `pull` preserve the type
      // information in `getDefaultMiddleware`, including adjustments to the
      // dispatch function type, but as a tradeoff nothing added this way can
      // further modify the type signature. For now, that's fine, as these
      // middlewares don't change acceptable dispatch types.
      //
      // Process aliases before all other middleware, and cache the redux store
      // after all middleware gets a chance to run.
      middleware.unshift(alias(allAliases));
      middleware.push(reduxCache);

      return middleware;
    },
    devTools: process.env.NODE_ENV !== "production",
    enhancers: [],
  });

type ReduxStoreType = ReturnType<typeof initializeStore>;

export const popupMonitorPortName = "popup-monitor";

// TODO Rename ReduxService or CoordinationService, move to services/, etc.
export default class Main extends BaseService<never> {
  /**
   * The redux store for the wallet core. Note that the redux store is used to
   * render the UI (via webext-redux), but it is _not_ the source of truth.
   * Services interact with the various external and internal components and
   * create persisted state, and the redux store is simply a view onto those
   * pieces of canonical state.
   */
  store: ReduxStoreType;

  static create: ServiceCreatorFunction<never, Main, []> = async () => {
    const preferenceService = PreferenceService.create();
    const chainService = ChainService.create(preferenceService);
    const indexingService = IndexingService.create(
      preferenceService,
      chainService
    );
    const nameService = NameService.create(chainService, preferenceService);
    const enrichmentService = EnrichmentService.create(
      chainService,
      indexingService,
      nameService
    );
    const keyringService = KeyringService.create();
    const internalEthereumProviderService =
      InternalEthereumProviderService.create(chainService, preferenceService);
    const providerBridgeService = ProviderBridgeService.create(
      internalEthereumProviderService,
      preferenceService
    );

    const signingService = SigningService.create(keyringService, chainService);

    let savedReduxState = {};
    // Setting READ_REDUX_CACHE to false will start the extension with an empty
    // initial state, which can be useful for development
    if (process.env.READ_REDUX_CACHE === "true") {
      const { state, version } = await browser.storage.local.get([
        "state",
        "version",
      ]);

      if (state) {
        const restoredState = decodeJSON(state);
        if (typeof restoredState === "object" && restoredState !== null) {
          // If someone managed to sneak JSON that decodes to typeof "object"
          // but isn't a Record<string, unknown>, there is a very large
          // problem...
          savedReduxState = migrateReduxState(
            restoredState as Record<string, unknown>,
            version || undefined
          );
        } else {
          throw new Error(`Unexpected JSON persisted for state: ${state}`);
        }
      }
    }

    return new this(
      savedReduxState,
      await preferenceService,
      await chainService,
      await enrichmentService,
      await indexingService,
      await keyringService,
      await nameService,
      await internalEthereumProviderService,
      await providerBridgeService,
      await signingService
    );
  };

  private constructor(
    savedReduxState: Record<string, unknown>,
    /**
     * A promise to the preference service, a dependency for most other services.
     * The promise will be resolved when the service is initialized.
     */
    private preferenceService: PreferenceService,
    /**
     * A promise to the chain service, keeping track of base asset balances,
     * transactions, and network status. The promise will be resolved when the
     * service is initialized.
     */
    private chainService: ChainService,
    /**
     *
     */
    private enrichmentService: EnrichmentService,
    /**
     * A promise to the indexing service, keeping track of token balances and
     * prices. The promise will be resolved when the service is initialized.
     */
    private indexingService: IndexingService,
    /**
     * A promise to the keyring service, which stores key material, derives
     * accounts, and signs messagees and transactions. The promise will be
     * resolved when the service is initialized.
     */
    private keyringService: KeyringService,
    /**
     * A promise to the name service, responsible for resolving names to
     * addresses and content.
     */
    private nameService: NameService,
    /**
     * A promise to the internal ethereum provider service, which acts as
     * web3 / ethereum provider for the internal and external dApps to use.
     */
    private internalEthereumProviderService: InternalEthereumProviderService,
    /**
     * A promise to the provider bridge service, handling and validating
     * the communication coming from dApps according to EIP-1193 and some tribal
     * knowledge.
     */
    private providerBridgeService: ProviderBridgeService,
    /**
     * A promise to the claim service, which saves the eligibility data
     * for efficient storage and retrieval.
     */
    /**
     * A promise to the telemetry service, which keeps track of extension
     * storage usage and (eventually) other statistics.
     */
    /**
     * A promise to the Ledger service, handling the communication
     * with attached Ledger device according to ledgerjs examples and some
     * tribal knowledge. ;)
     */

    /**
     * A promise to the signing service which will route operations between the UI
     * and the exact signing services.
     */
    private signingService: SigningService
  ) {
    super({
      initialLoadWaitExpired: {
        schedule: { delayInMinutes: 2.5 },
        handler: () => this.store.dispatch(initializationLoadingTimeHitLimit()),
      },
    });

    // Start up the redux store and set it up for proxying.
    this.store = initializeStore(this, savedReduxState); //this in 2nd param

    wrapStore(this.store, {
      serializer: encodeJSON,
      deserializer: decodeJSON,
      diffStrategy: deepDiff,
      dispatchResponder: async (
        dispatchResult: Promise<unknown>,
        send: (param: { error: string | null; value: unknown | null }) => void
      ) => {
        try {
          send({
            error: null,
            value: encodeJSON(await dispatchResult),
          });
        } catch (error) {
          // logger.error(
          //   "Error awaiting and dispatching redux store result: ",
          //   error
          // );
          send({
            error: encodeJSON(error),
            value: null,
          });
        }
      },
    });

    this.initializeRedux();
  }

  protected async internalStartService(): Promise<void> {
    await super.internalStartService();

    this.indexingService
      .started()
      .then(async () => this.chainService.started());

    const servicesToBeStarted = [
      this.preferenceService.startService(),
      this.chainService.startService(),
      this.indexingService.startService(),
      this.enrichmentService.startService(),
      this.keyringService.startService(),
      this.nameService.startService(),
      this.internalEthereumProviderService.startService(),
      this.providerBridgeService.startService(),
      this.signingService.startService(),
    ];

    await Promise.all(servicesToBeStarted);
  }

  protected async internalStopService(): Promise<void> {
    const servicesToBeStopped = [
      this.preferenceService.stopService(),
      this.chainService.stopService(),
      this.indexingService.stopService(),
      this.enrichmentService.stopService(),
      this.keyringService.stopService(),
      this.nameService.stopService(),
      this.internalEthereumProviderService.stopService(),
      this.providerBridgeService.stopService(),
      this.signingService.stopService(),
    ];

    await Promise.all(servicesToBeStopped);
    await super.internalStopService();
  }

  async initializeRedux(): Promise<void> {
    this.connectIndexingService();
    this.connectKeyringService();
    this.connectNameService();
    this.connectInternalEthereumProviderService();
    this.connectProviderBridgeService();
    this.connectPreferenceService();
    this.connectEnrichmentService();
    this.connectSigningService();
    await this.connectChainService();

    // FIXME Should no longer be necessary once transaction queueing enters the
    // FIXME picture.
    this.store.dispatch(
      clearTransactionState(TransactionConstructionStatus.Idle)
    );
    this.connectPopupMonitor();
  }

  async addAccount(addressNetwork: AddressOnNetwork): Promise<void> {
    await this.chainService.addAccountToTrack(addressNetwork);
  }

  addOrEditAddressName({
    address,
    network,
    name,
  }: AddressOnNetwork & { name: string }): void {
    this.preferenceService.addOrEditNameInAddressBook({
      address,
      network,
      name,
    });
  }

  async removeAccount(
    address: HexString,
    signerType?: SignerType
  ): Promise<void> {
    // TODO Adjust to handle specific network.
    await this.signingService.removeAccount(address, signerType);
  }

  async getAccountEthBalanceUncached(
    addressNetwork: AddressOnNetwork
  ): Promise<bigint> {
    const accountBalance = await this.chainService.getLatestBaseAccountBalance(
      addressNetwork
    );

    return accountBalance.assetAmount.amount;
  }

  async checkPendingTx() {
    const interval = setInterval(async () => {
      const tx = getTransactions(this.store);
      const isTestNetwork = this.store.getState().app.isTestnet;
      const pendingTransactions = await tx.filter((item) => {
        return (
          (item.status == ACTIVITY_STATUS_TYPES.pending ||
            item.status == ACTIVITY_STATUS_TYPES.inProgress) &&
          NETWORKCHAIN[item.chainId].isTestnet == isTestNetwork &&
          item.isDappTransaction
        );
      });

      await Promise.allSettled(
        pendingTransactions.map(async (transaction) => {
          const ethersProvider = new ethers.providers.JsonRpcProvider(
            NETWORKCHAIN[transaction.chainId].NODE_URL
          );

          const tokenReceipt = await ethersProvider.getTransactionReceipt(
            transaction.transactionHash
          );

          if (tokenReceipt) {
            if (tokenReceipt.status) {
              await onDappTransactionComplete({
                transaction: transaction,
                store: this.store,
              });
              generateNotification(
                "dapp Transaction",
                "Transaction has been completed"
              );
              // console.log("GENERATED NOTIFICATION");
              clearInterval(interval);
            } else {
              await onDappTransactionFailure({
                transaction: transaction,
                store: this.store,
              });
              generateNotification(
                "dapp Transaction",
                "Transaction has been failed"
              );
              clearInterval(interval);
            }
          }
        })
      );
    }, 2000);
  }
  async connectChainService(): Promise<void> {
    // Wire up chain service to account slice.
    this.chainService.emitter.on(
      "accountsWithBalances",
      (accountWithBalance) => {
        // The first account balance update will transition the account to loading.
        this.store.dispatch(updateAccountBalance(accountWithBalance));
      }
    );

    this.chainService.emitter.on("block", (block) => {
      this.store.dispatch(blockSeen(block));
    });

    this.chainService.emitter.on("addTransactionInProgress", async (data) => {
      const staticStore = this.store.getState();
      const allWallets = staticStore.newWallet.allWallets;
      const accounts = staticStore.newWallet.accounts;
      const { gasInfo, feeType } = staticStore.app.networkFeeSettings;
      const txDetails = {
        ...data.txDetails,
        from: allWallets[accounts[data.txDetails.address].walletId].name,
        transactionFeeInUsd: gasInfo[feeType].usd,
      };

      if (txDetails.token.amount) {
        const {
          market_data: { current_price },
        } = await getDetailSingleTokenInfoInDapp(
          NETWORKCHAIN[txDetails.chainId][NATIVE_TOKEN_COINGECKO_ID]
        );

        const usdRate = current_price.usd;

        const nativeValueInWei = Number(txDetails.token.amount);

        const nativeValue =
          nativeValueInWei /
          Math.pow(10, NETWORKCHAIN[txDetails.chainId].DECIMALS);

        const nativeValueInUsd = nativeValue * usdRate;

        txDetails.token.amountInUsd = nativeValueInUsd;
        txDetails.token.address = NATIVE_TOKEN_ADDRESS;
        txDetails.token.symbol =
          NETWORKCHAIN[+txDetails.chainId].NATIVE_TOKEN_SYMBOL;
      } else txDetails.token.amountInUsd = 0;
      if (txDetails.transactionHash) {
        this.store.dispatch(
          setTransactionActivityData(
            mergeNewAndOldActivityData({
              transactionData: txDetails,
              previousTransactionActivityData:
                this.store.getState().newWallet.activity,
            })
          )
        );
        this.store.dispatch(
          addInProgressTransactionHash({
            chainId: txDetails.chainId,
            nonce: Number(txDetails.nonce),
            transactionHash: txDetails.transactionHash,
          })
        );
        this.store.dispatch(
          setPendingTransactionStates({
            isTransactionCompleted: false,
            isHoldFinish: false,
            isSlideAnimationCompleted: false,
            slideAnimation: "contract",
            txType: TX_TYPES.Swap,
          })
        );
        // this.emitter.emit("trackpendingtransaction");
        this.checkPendingTx();
      }
    });

    this.chainService.emitter.on("transactionSend", (txData) => {
      // console.log("transactionSend", txData);
      this.store.dispatch(
        setSnackbarMessage("Transaction signed, broadcasting...")
      );
    });

    this.chainService.emitter.on("transactionSendFailure", () => {
      this.store.dispatch(
        setSnackbarMessage("Transaction failed to broadcast.")
      );
    });

    transactionConstructionSliceEmitter.on(
      "updateTransaction",
      async (options) => {
        const { network } = options;

        const {
          values: { maxFeePerGas, maxPriorityFeePerGas },
        } = selectDefaultNetworkFeeSettings(this.store.getState());

        const { transactionRequest: populatedRequest, gasEstimationError } =
          await this.chainService.populatePartialEVMTransactionRequest(
            network,
            {
              ...options,
              maxFeePerGas: options.maxFeePerGas ?? maxFeePerGas,
              maxPriorityFeePerGas:
                options.maxPriorityFeePerGas ?? maxPriorityFeePerGas,
            }
          );

        const { annotation } =
          await this.enrichmentService.enrichTransactionSignature(
            network,
            populatedRequest,
            2 /* TODO desiredDecimals should be configurable */
          );

        const enrichedPopulatedRequest = {
          ...populatedRequest,
          annotation,
        };

        if (typeof gasEstimationError === "undefined") {
          this.store.dispatch(
            transactionRequest({
              transactionRequest: enrichedPopulatedRequest,
              transactionLikelyFails: false,
            })
          );
        } else {
          this.store.dispatch(
            transactionRequest({
              transactionRequest: enrichedPopulatedRequest,
              transactionLikelyFails: true,
            })
          );
        }
      }
    );

    transactionConstructionSliceEmitter.on(
      "broadcastSignedTransaction",
      async (transaction: SignedEVMTransaction) => {
        // console.log("broadcastSignedTransaction", transaction);
        this.chainService.broadcastSignedTransaction(transaction);
      }
    );

    transactionConstructionSliceEmitter.on(
      "requestSignature",
      async ({ transaction, method }) => {
        try {
          const signedTransactionResult =
            await this.signingService.signTransaction(transaction, method);
          // console.log("signedTransactionResult", signedTransactionResult);
          await this.store.dispatch(transactionSigned(signedTransactionResult));
        } catch (exception) {
          // logger.error("Error signing transaction", exception);
          this.store.dispatch(
            clearTransactionState(TransactionConstructionStatus.Idle)
          );
        }
      }
    );
    signingSliceEmitter.on(
      "requestSignTypedData",
      async ({ typedData, account, accountSigner }) => {
        try {
          const signedData = await this.signingService.signTypedData({
            typedData,
            account,
            accountSigner,
          });
          this.store.dispatch(signedTypedData(signedData));
        } catch (err) {
          // logger.error("Error signing typed data", typedData, "error: ", err);
          this.store.dispatch(clearSigningState);
        }
      }
    );
    signingSliceEmitter.on(
      "requestSignData",
      async ({ rawSigningData, account, accountSigner }) => {
        const signedData = await this.signingService.signData(
          account,
          rawSigningData,
          accountSigner
        );
        this.store.dispatch(signedDataAction(signedData));
      }
    );

    // Set up initial state.
    const existingAccounts = await this.chainService.getAccountsToTrack();
    existingAccounts.forEach((addressNetwork) => {
      // Mark as loading and wire things up.
      this.store.dispatch(loadAccount(addressNetwork));

      // Force a refresh of the account balance to populate the store.
      this.chainService.getLatestBaseAccountBalance(addressNetwork);
    });

    this.chainService.emitter.on("blockPrices", ({ blockPrices, network }) => {
      this.store.dispatch(
        estimatedFeesPerGas({ estimatedFeesPerGas: blockPrices, network })
      );
    });

    // Report on transactions for basic activity. Fancier stuff is handled via
    // connectEnrichmentService
  }

  async connectNameService(): Promise<void> {
    this.nameService.emitter.on(
      "resolvedName",
      async ({
        from: { addressOnNetwork },
        resolved: {
          nameOnNetwork: { name },
        },
      }) => {
        this.store.dispatch(updateAccountName({ ...addressOnNetwork, name }));
      }
    );
    this.nameService.emitter.on(
      "resolvedAvatar",
      async ({ from: { addressOnNetwork }, resolved: { avatar } }) => {
        this.store.dispatch(
          updateENSAvatar({ ...addressOnNetwork, avatar: avatar.toString() })
        );
      }
    );
  }

  async connectIndexingService(): Promise<void> {
    this.indexingService.emitter.on(
      "accountsWithBalances",
      async (accountsWithBalances) => {
        const assetsToTrack = await this.indexingService.getAssetsToTrack();

        const filteredBalancesToDispatch: AccountBalance[] = [];

        accountsWithBalances.forEach((balance) => {
          // TODO support multi-network assets
          const doesThisBalanceHaveAnAlreadyTrackedAsset =
            !!assetsToTrack.filter(
              (t) => t.symbol === balance.assetAmount.asset.symbol
            )[0];

          if (
            balance.assetAmount.amount > 0 ||
            doesThisBalanceHaveAnAlreadyTrackedAsset
          ) {
            filteredBalancesToDispatch.push(balance);
          }
        });

        this.store.dispatch(updateAccountBalance(filteredBalancesToDispatch));
      }
    );

    this.indexingService.emitter.on("assets", (assets) => {
      this.store.dispatch(assetsLoaded(assets));
    });

    this.indexingService.emitter.on("price", (pricePoint) => {
      this.store.dispatch(newPricePoint(pricePoint));
    });
  }

  async connectEnrichmentService(): Promise<void> {
    this.enrichmentService.emitter.on(
      "enrichedEVMTransaction",
      (transactionData) => {
        this.indexingService.notifyEnrichedTransaction(
          transactionData.transaction
        );
      }
    );
  }

  async connectSigningService(): Promise<void> {
    this.keyringService.emitter.on("address", (address) =>
      this.signingService.addTrackedAddress(address, "keyring")
    );
  }

  async connectKeyringService(): Promise<void> {
    this.keyringService.emitter.on("keyrings", (keyrings) => {
      this.store.dispatch(updateKeyrings(keyrings));
    });

    this.keyringService.emitter.on("address", (address) => {
      this.chainService.supportedNetworks.forEach((network) => {
        // Mark as loading and wire things up.
        this.store.dispatch(
          loadAccount({
            address,
            network,
          })
        );

        this.chainService.addAccountToTrack({
          address,
          network,
        });
      });
    });

    this.keyringService.emitter.on("locked", async (isLocked) => {
      if (isLocked) {
        this.store.dispatch(keyringLocked());
      } else {
        this.store.dispatch(keyringUnlocked());
      }
    });

    keyringSliceEmitter.on("createPassword", async (password) => {
      await this.keyringService.unlock(password, true);
    });

    keyringSliceEmitter.on("unlockKeyrings", async (password) => {
      await this.keyringService.unlock(password);
    });

    keyringSliceEmitter.on("deriveAddress", async (keyringID) => {
      await this.signingService.deriveAddress({
        type: "keyring",
        keyringID,
      });
    });

    keyringSliceEmitter.on("generateNewKeyring", async () => {
      // TODO move unlocking to a reasonable place in the initialization flow
      const generated: {
        id: string;
        mnemonic: string[];
      } = await this.keyringService.generateNewKeyring(
        KeyringTypes.mnemonicBIP39S256
      );

      this.store.dispatch(setKeyringToVerify(generated));
    });

    keyringSliceEmitter.on(
      "importKeyring",
      async ({ mnemonic, path, source }) => {
        await this.keyringService.importKeyring(mnemonic, source, path);
      }
    );
  }

  async connectInternalEthereumProviderService(): Promise<void> {
    this.internalEthereumProviderService.emitter.on(
      "transactionSignatureRequest",
      async ({ payload, resolver, rejecter }) => {
        this.store.dispatch(
          clearTransactionState(TransactionConstructionStatus.Pending)
        );
        this.store.dispatch(updateTransactionData(payload));

        const clear = () => {
          // Mutual dependency to handleAndClear.

          this.signingService.emitter.off("signingTxResponse", handleAndClear);

          transactionConstructionSliceEmitter.off(
            "signatureRejected",
            // Mutual dependency to rejectAndClear.

            rejectAndClear
          );
        };

        const handleAndClear = (response: TXSignatureResponse) => {
          clear();
          switch (response.type) {
            case "success-tx":
              resolver(response.signedTx);
              break;
            default:
              rejecter();
              break;
          }
        };

        const rejectAndClear = () => {
          clear();
          rejecter();
        };

        this.signingService.emitter.on("signingTxResponse", handleAndClear);

        transactionConstructionSliceEmitter.on(
          "signatureRejected",
          rejectAndClear
        );
      }
    );
    this.internalEthereumProviderService.emitter.on(
      "signTypedDataRequest",
      async ({
        payload,
        resolver,
        rejecter,
      }: {
        payload: SignTypedDataRequest;
        resolver: (result: string | PromiseLike<string>) => void;
        rejecter: () => void;
      }) => {
        const enrichedsignTypedDataRequest =
          await this.enrichmentService.enrichSignTypedDataRequest(payload);
        this.store.dispatch(setSignTypedData(payload));
        this.store.dispatch(typedDataRequest(enrichedsignTypedDataRequest));

        const clear = () => {
          this.signingService.emitter.off(
            "signingDataResponse",
            // Mutual dependency to handleAndClear.

            handleAndClear
          );

          signingSliceEmitter.off(
            "signatureRejected",
            // Mutual dependency to rejectAndClear.

            rejectAndClear
          );
        };

        const handleAndClear = (response: SignatureResponse) => {
          clear();
          switch (response.type) {
            case "success-data":
              resolver(response.signedData);
              break;
            default:
              rejecter();
              break;
          }
        };

        const rejectAndClear = () => {
          clear();
          rejecter();
        };

        this.signingService.emitter.on("signingDataResponse", handleAndClear);

        signingSliceEmitter.on("signatureRejected", rejectAndClear);
      }
    );
    this.internalEthereumProviderService.emitter.on(
      "signDataRequest",
      async ({
        payload,
        resolver,
        rejecter,
      }: {
        payload: SignDataRequest;
        resolver: (result: string | PromiseLike<string>) => void;
        rejecter: () => void;
      }) => {
        this.store.dispatch(signDataRequest(payload));

        const clear = () => {
          this.signingService.emitter.off(
            "personalSigningResponse",
            // Mutual dependency to handleAndClear.

            handleAndClear
          );

          signingSliceEmitter.off(
            "signatureRejected",
            // Mutual dependency to rejectAndClear.

            rejectAndClear
          );
        };

        const handleAndClear = (response: SignatureResponse) => {
          clear();
          switch (response.type) {
            case "success-data":
              resolver(response.signedData);
              break;
            default:
              rejecter();
              break;
          }
        };

        const rejectAndClear = () => {
          clear();
          rejecter();
        };

        this.signingService.emitter.on(
          "personalSigningResponse",
          handleAndClear
        );

        signingSliceEmitter.on("signatureRejected", rejectAndClear);
      }
    );

    uiSliceEmitter.on("newSelectedNetwork", async (network) => {
      // console.log("newSelectedNetwork", network);
      const origin = (await getStateFromStorage()).dappInfo.origin;
      this.internalEthereumProviderService.routeSafeRPCRequest(
        DAPPEVENTS.switchNetwork,
        [{ chainId: network.chainID }],
        origin || TALLY_INTERNAL_ORIGIN
      );
      this.store.dispatch(clearCustomGas());
    });

    // redux dispatch events
    this.internalEthereumProviderService.emitter.on(
      "setDappNetworkEvent",
      async ({ payload, resolver }) => {
        this.store.dispatch(setDAppNetwork(payload));
        resolver();
      }
    );
    this.internalEthereumProviderService.emitter.on(
      "setSignedDataEvent",
      async ({ payload, resolver }) => {
        this.store.dispatch(setSignedData(payload));
        resolver();
      }
    );
  }

  async connectProviderBridgeService(): Promise<void> {
    this.providerBridgeService.emitter.on(
      "requestPermission",
      (permissionRequest: PermissionRequest) => {
        this.store.dispatch(requestPermission(permissionRequest));
      }
    );

    this.providerBridgeService.emitter.on(
      "initializeAllowedPages",
      async (allowedPages: PermissionMap) => {
        this.store.dispatch(initializePermissions(allowedPages));
      }
    );

    this.providerBridgeService.emitter.on(
      "setOriginEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setOrigin(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setPermChangeNetworkEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setPermChangeNetwork(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setSwitchNetworkDataEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setSwitchNetworkData(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setDappNetworkEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setDAppNetwork(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setRequestAccountsDataEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setRequestAccountsData(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setMethodEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setMethod(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setSignMessageEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setSignMessageData(payload));
        resolver();
      }
    );

    this.providerBridgeService.emitter.on(
      "setSignTransactionDataEvent",
      ({ payload, resolver }) => {
        this.store.dispatch(setSignTransactionData(payload));
        resolver();
      }
    );

    providerBridgeSliceEmitter.on("grantPermission", async (permission) => {
      await Promise.all(
        Object.values(DAPP_SUPPORTED_NETWORKS_SONAR_WALLET).map(
          async (network) => {
            await this.providerBridgeService.grantPermission({
              ...permission,
              chainID: network.chainID,
            } as PermissionRequest);
          }
        )
      );
    });

    providerBridgeSliceEmitter.on(
      "grantChangeNetworkPermission",
      async (permission) => {
        await this.providerBridgeService.grantNetworkChangePermission(
          permission
        );
      }
    );
    providerBridgeSliceEmitter.on(
      "rejectChangeNetworkPermission",
      async (permission) => {
        await this.providerBridgeService.rejectNetworkChangePermission(
          permission
        );
      }
    );
    providerBridgeSliceEmitter.on(
      "denyOrRevokePermission",
      async (permission) => {
        await Promise.all(
          this.chainService.supportedNetworks.map(async (network) => {
            await this.providerBridgeService.denyOrRevokePermission({
              ...permission,
              chainID: network.chainID,
            });
          })
        );
      }
    );
  }

  async connectPreferenceService(): Promise<void> {
    this.preferenceService.emitter.on(
      "initializeDefaultWallet",
      async (isDefaultWallet: boolean) => {
        await this.store.dispatch(setDefaultWallet(isDefaultWallet));
      }
    );

    uiSliceEmitter.on("newSelectedAccount", async (addressNetwork) => {
      // console.log("uiSliceEmitter===========", addressNetwork);
      this.providerBridgeService.notifyContentScriptsAboutAddressChange(
        //@ts-ignore
        addressNetwork.address
      );
    });

    uiSliceEmitter.on(
      "newDefaultWalletValue",
      async (newDefaultWalletValue) => {
        // console.log("LAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", newDefaultWalletValue);

        await this.preferenceService.setDefaultWalletValue(
          newDefaultWalletValue
        );

        this.providerBridgeService.notifyContentScriptAboutConfigChange(
          newDefaultWalletValue
        );
      }
    );

    uiSliceEmitter.on("refreshBackgroundPage", async () => {
      self.location.reload();
    });
  }

  async resolveNameOnNetwork(
    nameOnNetwork: NameOnNetwork
  ): Promise<AddressOnNetwork | undefined> {
    try {
      return await this.nameService.lookUpEthereumAddress(nameOnNetwork);
    } catch (error) {
      // logger.info("Error looking up Ethereum address: ", error);
      return undefined;
    }
  }

  private connectPopupMonitor() {
    runtime.onConnect.addListener((port) => {
      if (port.name !== popupMonitorPortName) return;
      port.onDisconnect.addListener(() => {
        this.onPopupDisconnected();
      });
    });
  }

  private onPopupDisconnected() {
    this.store.dispatch(rejectTransactionSignature());
    this.store.dispatch(rejectDataSignature());
  }
}
