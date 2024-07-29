import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/providers";
import { setTransactionActivityData } from "@slices/newWalletSlice";
import axios from "axios";
import { ethers } from "ethers";
import { providers } from "near-api-js";

import {
  Activity,
  AmountTokenA,
  AmountTokenB,
  EthersRPCProvider,
  IAccount,
  ITokenA,
  ITokenB,
  StoreTransactionActivityData,
  SwapTransactionData,
  TransactionData,
} from "interfaces";
import { StaticStore } from "store/store";
import {
  checkSum,
  getNameFromAddressBook,
  matchAddresses,
  mergeNewAndOldActivityData,
} from "utils";
import {
  ACTIVITY_STATUS_TYPES,
  API,
  API_KEY,
  DUMMY_IMAGE_URL,
  LOGO,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  NEAR_ADDRESS,
  // NETWORKCHAIN,
  NETWORKS,
  NODE_URL,
  SOLANA_ADDRESS,
  TX_DATA_METHOD_IDs,
  TX_TYPES,
  TransactionFailureMessage,
  TransactionSuccessMessage,
  Tx_METHODS,
  ZERO_ADDRESS,
} from "./constants";
import {
  getDetailSingleTokenInfo,
  getDetailSingleTokenInfoInDapp,
} from "./utils.api";
import { ifTxMethodExists } from "./utils.dapp";
import {
  setCompletedTransactionStates,
  setFilteredTxIntervalList,
  setInProgressTransactionHash,
} from "@slices/appSlice";
import { generateNotification } from "./utils.notifications";
const EthDater = require("ethereum-block-by-date");
const { abi } = require("../abis/erc20abi.json");
/**
 * This function is responsible to take out all the states of the SWAP transactions  and populates
 * those attribute according to the activity architecture for SWAP type transaction.
 * @param {Object} transactionData The data that will be populated for the transaction type
 *@param  txType TX_TYPES
 *@param  hash string
 *@param  timeStamp number
 *@param  transactionFeeInUsd number
 *@param  from string
 *@param  to string
 *@param  chainId number
 *@param  address string
 *@param  isSpeedUpEnabled boolean
 *@param  isCancelEnabled boolean
 *@param  status ACTIVITY_STATUS_TYPES
 *@param  rawData? any
 *@param  tokenA Token
 *@param tokenB Token
 *@param makerBalance number
 *@param  makerBalanceInUsd number
 *@param  takerBalance number
 *@param  takerBalanceInUsd number
 *@param  tokenAprice number
 *@param  tokenBprice number
 *@param walletName string
 *@param receiverNameInTheAddressBook string
 *@param senderNameInTheAddressBook string
 *@param txMethod Tx_METHODS.normal
 *@param  nonce number
 *@param isDappTransaction boolean
 *
 * @returns Object of type SwapTransactionData
 * The type we are using for Swap type transaction data.
 */
export const getPopulatedSwapTxDetail = ({
  tokenA,
  tokenB,
  account,
  txMethod,
  nonce,
  isDappTransaction,
  amountTokenA,
  amountTokenB,
  transactionHash,
  transactionFeeInUsd,
  transactionObject,
  isCancelEnabled,
  isSpeedUpEnabled,
  status,
  timeStamp,
  tokenAprice,

  tokenBprice,
}: {
  tokenA: ITokenA;
  tokenB: ITokenB;
  account: IAccount;
  txMethod: Tx_METHODS;
  nonce: number;
  isDappTransaction: boolean;
  amountTokenA: AmountTokenA;
  amountTokenB: AmountTokenB;
  transactionHash: string;
  transactionFeeInUsd: number;
  transactionObject: any;
  isCancelEnabled: boolean;
  isSpeedUpEnabled: boolean;
  status: ACTIVITY_STATUS_TYPES;
  timeStamp: number;
  tokenAprice: number;
  tokenBprice: number;
}): SwapTransactionData => {
  const newWallet = StaticStore.getState().newWallet;
  const allWallets = newWallet.allWallets;
  const accounts = newWallet.accounts;
  const makerBalance = tokenA.balance - +amountTokenA.amount;
  const takerBalance = tokenB.balance + +amountTokenB.amount;

  const txDetails: SwapTransactionData = {
    address: account.address,
    chainId: tokenA.chainId,
    from: account.walletName,
    transactionHash,
    token: {
      address: tokenA.address,
      amount: +amountTokenA.amount,
      amountInUsd: +amountTokenA.amountInUsd,
      decimal: tokenA.decimals,
      image: tokenA.image,
      name: tokenA.name,
      symbol: tokenA.symbol,
    },
    tokenB: {
      address: tokenB.address,
      amount: +amountTokenB.amount,
      amountInUsd: +amountTokenA.amountInUsd,
      decimal: tokenB.decimals,
      image: tokenB.image,
      name: tokenB.name,
      symbol: tokenB.symbol,
    },
    makerBalance,
    makerBalanceInUsd: makerBalance * tokenAprice,
    takerBalance,
    takerBalanceInUsd: takerBalance * tokenBprice,
    timeStamp,
    to: account.address,
    status,
    txType: TX_TYPES.Swap,

    isCancelEnabled,
    isSpeedUpEnabled,
    transactionFeeInUsd,
    rawData: {
      transactionObject,
      chainId: tokenA.chainId,
    },
    tokenAprice,
    tokenBprice,
    walletName: allWallets[accounts[account.address].walletId].name,
    receiverNameInTheAddressBook: "",
    senderNameInTheAddressBook: getNameFromAddressBook(account.address),
    txMethod,
    nonce,
    isDappTransaction,
  };
  return txDetails;
};

//-----------------------------------------TRIGGERED FUNCTION TO STORE TRANSACTION ACTIVITY DATA

/**
 *
 * A promise which is responsible to store new transaction data of any chain (EVM AND NON-EVM) in redux
 * Transaction is of 3 types
 * 1 : SWAP
 * 2 : SENT
 * 3 : RECEIVE
 *
 * The function will take single transaction data as its argument,
 * Initially, it will call the mergeNewAndOldActivityData which will
 * merge the new transaction data with the activity object in redux.
 * Then a simple dispatch will store the newly updated Activity data object in redux
 *
 *
 * @param {transactionData}  // The data related to single Transaction of any of the 3 types.
 */
export const storeTransactionActivityData = async ({
  transactionData,
}: StoreTransactionActivityData) => {
  /*
   * Used static store in order to get the most recent state of activity object in redux
   */
  const previousActivity = { ...StaticStore.getState().newWallet.activity };
  /*
   * await is used for the proxy store
   */
  await StaticStore.dispatch(
    setTransactionActivityData(
      mergeNewAndOldActivityData({
        transactionData,
        previousTransactionActivityData: previousActivity,
      })
    )
  );
};

/**
 * A promise which is responsible to return the activity object, while with the removed transaction data of the provided hash
 * The function will loop over the transactions of that particular address and its chainId, and will not
 * add the transaction data of the transaction hash thats need to be filtered out.
 * Then this particular address and chainId data will be over ride in the object.
 * That object becomes our returned output
 *
 * @param address string
 * @param chainId ChainId of the transaction
 * @param previousTransactionActivityData  The transaction data from which we have to remove the transaction
 * @param hash Hash of the transaction, whose data we want to remove from the activity object
 *
 * @returns {Object} Returns the filtered activity object
 * */

export const deleteActivityItem = ({
  address,
  chainId,
  previousTransactionActivityData,
  hash,
}: {
  hash: string;
  chainId: number;
  address: string;
  previousTransactionActivityData: Activity;
}) => {
  let newTransactionActivity = { ...previousTransactionActivityData };
  const data = {};
  Object.keys(newTransactionActivity[address][chainId]).forEach((key) => {
    if (key !== hash)
      Object.assign(data, {
        [key]: newTransactionActivity[address][chainId][key],
      });
  });

  newTransactionActivity = {
    ...newTransactionActivity,
    [address]: {
      ...newTransactionActivity[address],
      [chainId]: data,
    },
  };

  return newTransactionActivity;
};
/**
   * This function is responsible to take out all the states of the transaction  and populates 
   * those attribute according to the activity architecture for send or receive type transaction.

   *@param  txType  TX_TYPES
   *@param  hash  string
   *@param  timeStamp  number
   *@param  decimal  number
   *@param  transactionFeeInUsd  number
   *@param from  string
   *@param  to  string
   *@param  chainId  number
   *@param  amount  number
   *@param  name  string
   *@param  symbol  string
   *@param  amountInUsd  number
   *@param  image  string
   *@param  address  string
   *@param tokenAddres  string
   *@param isSpeedUpEnabled  boolean
   *@param  isCancelEnabled  boolean
   *@param status  ACTIVITY_STATUS_TYPES
   *@param  rawData?  any
   *@param walletName  string
   *@param  receiverNameInTheAddressBook  string
   *@param  senderNameInTheAddressBook  string
   *@param  txMethod  Tx_METHODS
   *@param  isDappTransaction  boolean
   *
   * @returns Object of type TransactionData
   * The type we are using for send or receive type transaction data.
   */

export const getPopulatedTxDetail = ({
  txType,
  hash,
  timeStamp,
  decimal,
  transactionFeeInUsd,
  from,
  to,
  chainId,
  amount,
  name,
  symbol,
  amountInUsd,
  image,
  address,
  tokenAddress,
  isSpeedUpEnabled,
  isCancelEnabled,
  rawData,
  status,
  walletName,
  receiverNameInTheAddressBook,
  senderNameInTheAddressBook,
  txMethod,
  isDappTransaction,
}: {
  txType: TX_TYPES;
  hash: string;
  timeStamp: number;
  decimal: number;
  transactionFeeInUsd: number;
  from: string;
  to: string;
  chainId: number;
  amount: number;
  name: string;
  symbol: string;
  amountInUsd: number;
  image: string;
  address: string;
  tokenAddress: string;
  isSpeedUpEnabled: boolean;
  isCancelEnabled: boolean;
  status: ACTIVITY_STATUS_TYPES;
  rawData?: any;
  walletName: string;
  receiverNameInTheAddressBook: string;
  senderNameInTheAddressBook: string;
  txMethod: Tx_METHODS;
  isDappTransaction: boolean;
}) => {
  const txDetails: TransactionData = {
    txType,
    from: from,
    to: to,
    token: {
      name,
      symbol,
      address: tokenAddress,
      image: image || DUMMY_IMAGE_URL,
      amount,
      amountInUsd,
      decimal,
    },
    transactionFeeInUsd,
    timeStamp,
    nonce: 0,
    chainId,
    transactionHash: hash,

    address: address,
    isSpeedUpEnabled,
    isCancelEnabled,
    rawData,
    status,
    walletName,
    receiverNameInTheAddressBook,
    senderNameInTheAddressBook,
    txMethod,
    isDappTransaction,
  };
  return txDetails;
};

/**
 * This promise is responsible to fetch the transactions of the particular account through the scans api.
 *
 * @param chainId number
 * @param web3 Web3
 * @param address string
 *
 * We have stored the last received transaction time, so we should fetch only those transactions that we do not have by giving the startBlock dynamically.
 * THe startBlock is determined through the package used ethdater, in which we pass our timestamp through which we have to fetch the transactions.
 *
 * Afterwards, request response is filtered out and transaction hash and account address is extracted from each item.
 *
 * @returns txHistory  ->  List of hashes with account address
 */

//-------------FUNCTION TO GET TRANSACTIONS OF NATIVE  +  STANDARD TOKENS ON EVM
const getEVMTxHistoryByExplorerApis = async (
  chainId: number,
  web3: EthersRPCProvider,

  address: string
) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const txHistory: {
    transactionHash: string;
    address: string;
  }[] = [];
  const api = NETWORKCHAIN[chainId][API];
  const apiKey = NETWORKCHAIN[chainId][API_KEY];
  const dater = new EthDater(
    web3 // Web3 object, required.
  );
  // const lastReceivedTransactionTime =
  //   StaticStore.getState().app.lastReceivedTransactionTime;
  // // Getting block by date:
  // const block = await dater.getDate(lastReceivedTransactionTime, true, false);

  const startblock = (await web3.getBlockNumber()) - 700;
  // const endblock = await web3.getBlockNumber();

  const requests = await Promise.all([
    await axios.get(
      `${api}?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${"latest"}&page=1&offset=10&sort=asc&apikey=${apiKey}`
    ),
    await axios.get(
      `${api}?module=account&action=tokentx&address=${address}&startblock=${startblock}&endblock=${"latest"}&page=1&offset=10&sort=asc&apikey=${apiKey}`
    ),
  ]);

  requests.forEach((request) => {
    if (
      request?.data?.result?.length > 0 &&
      Array.isArray(request?.data?.result)
    ) {
      request?.data?.result.forEach((item: { hash: string }) => {
        txHistory.push({ transactionHash: item.hash, address });
      });
    }
  });
  return txHistory;
};

/**
 * This promise is responsible to fetch the transactions of the particular account through the Ankr api.
 *
 * @param chainId number
 * @param address string
 *
 * We have stored the last received transaction time, so we should fetch only those transactions that we do not have by giving the timestamp field in the post request.
 *In case of ankr these are post requests not the get requests.
 * Afterwards, request response is filtered out and transaction hash and account address is extracted from each item.
 *
 * @returns txHistory  ->  List of hashes with account address
 */

//-----------------------------------DECODING FUNCTIONS FOR EVM AND NON-EVM---------------------------------
/**
 * This promise do decode the non native send or receive type transactions details.
 * @param web3 Web3
 * @param txDetails TransactionData
 * @param tokenReceipt Transaction
 * @param receiptErc20 TransactionReceipt
 * @param address string
 *
 * In this method, transfer log will be carried, in order to fetch out the token details using the contract. Token amount will be calculated that has been used
 * in the transaction. Transaction type as well, either send or receive.
 *
 * @returns TransactionData | null
 */
const getErc20ReceivedTxDetails = async (
  web3: EthersRPCProvider,
  txDetails: TransactionData,
  tokenReceipt: ethers.providers.TransactionResponse,
  receiptErc20: ethers.providers.TransactionReceipt,
  address: string
) => {
  txDetails.from = receiptErc20.from;
  const tokenInfo = StaticStore.getState().newWallet.tokenInfo;
  if (
    receiptErc20.logs.length > 0 &&
    receiptErc20.logs[0].topics[0] ===
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
    receiptErc20.logs[0].data !== "0x"
  ) {
    const log = receiptErc20.logs[0];

    const contract = new ethers.Contract(log.address, abi, web3);
    let [amountInUsd, image] = [1, DUMMY_IMAGE_URL];
    const [name, symbol, decimal] = [
      await contract.name(),
      await contract.symbol(),
      Number(await contract.decimals()),
    ];
    const AbiDecoder = new ethers.utils.AbiCoder();

    const amount =
      Number(AbiDecoder.decode(["uint256"], log.data)) / 10 ** decimal;

    // THIS SECTION NEEEDS TO BE UNCOMMENTED, ONCE THE SERVER IS UP

    // START---------------------------

    const coingeckoID = tokenInfo?.[`${log.address}_${symbol}`]?.coingeckoId;
    if (coingeckoID) {
      const fetchData = await getDetailSingleTokenInfo(coingeckoID);
      [amountInUsd, image] = [
        Number(
          Number(amount) * Number(fetchData.market_data.current_price.usd)
        ),
        tokenInfo[`${checkSum(log?.address)}_${symbol}`].image ||
          fetchData.image.thumb,
      ];
    }
    // END---------------------------------------------------------

    txDetails.token = {
      name,
      symbol,
      address: checkSum(log?.address),
      amount,
      amountInUsd,
      image,
      decimal,
    };
    txDetails.nonce = tokenReceipt.nonce;
    if (matchAddresses(receiptErc20.from, address)) {
      txDetails.txType = TX_TYPES.Sent;
      txDetails.from = address;
    } else {
      txDetails.txType = TX_TYPES.Received;
      txDetails.to = address;
      txDetails.from = receiptErc20?.from?.toLowerCase();
    }

    txDetails.senderNameInTheAddressBook = getNameFromAddressBook(
      txDetails.from
    );
    txDetails.receiverNameInTheAddressBook = getNameFromAddressBook(
      txDetails.to
    );

    return txDetails;
  }
  // }

  return null;
};
/**
 * On EVM chains
 * This promise is responsible to get all the transaction details of send or receive type transaction, corresponds to transaction hash of the  account
 * @param txHistory  ->  List of hashes with account address
 * @param chainId number -> On which chain this particular transaction hash belongs.
 *
 * This method iterates over all the transaction hashes.
 * While iterating, native and non-native transaction decoding are being separated.
 * Gas cost and transaction fee calculation is same.
 *
 * In case of native token, we will calculate the native token amount, its transaction type, from and to address.
 * In case of non-native tokens, a function named as getErc20ReceivedTxDetails will called, which will fetch the necessary details.
 *
 * @returns result of type (TransactionData)[]
 */
export const decodeEvm = async (
  txHistory: { transactionHash: string; address: string }[],
  chainId: number,

  to: string
) => {
  const newWallet = StaticStore.getState().newWallet;
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const allWallets = newWallet.allWallets;
  const accounts = newWallet.accounts;
  const chainInformation = NETWORKCHAIN[chainId];
  const {
    market_data: { current_price },
  } = await getDetailSingleTokenInfo(
    chainInformation[NATIVE_TOKEN_COINGECKO_ID]
  );

  const usdRate = current_price.usd;

  const web3 = new ethers.providers.JsonRpcProvider(
    NETWORKCHAIN[chainId].NODE_URL
  );
  const result = await Promise.all(
    txHistory.map(async ({ transactionHash, address }) => {
      const txDetails: TransactionData = {
        txType: TX_TYPES.Received,
        from: "",
        to,
        token: {
          name: "",
          symbol: "",
          address: "",
          image: "",
          amount: 0,
          amountInUsd: 0,
          decimal: 0,
        },
        transactionFeeInUsd: 0,
        timeStamp: new Date().getTime(),
        nonce: 0,
        chainId: chainId,
        transactionHash: transactionHash,
        status: ACTIVITY_STATUS_TYPES.success,
        walletName: allWallets[accounts[checkSum(address)].walletId].name,
        address: address,
        receiverNameInTheAddressBook: "",
        senderNameInTheAddressBook: "",
        txMethod: Tx_METHODS.normal,
        isDappTransaction: false,
      };
      //----------------------RECEIPTS------------------------------

      const receiptErc20: TransactionReceipt = await web3.getTransactionReceipt(
        transactionHash
      );

      const tokenReceipt: TransactionResponse = await web3.getTransaction(
        transactionHash
      );

      //-----------------------GAS AND TRANSACTION FEE CALCULATION
      const endblock = await web3.getBlockNumber();
      const [gasUsed, gasPrice, transaction] = [
        Number(receiptErc20?.gasUsed?.toString()) ||
          Number(tokenReceipt?.gasLimit) ||
          0,
        Number(receiptErc20?.effectiveGasPrice?.toString()) ||
          Number(tokenReceipt?.gasPrice) ||
          0,
        await web3.getBlock(tokenReceipt?.blockNumber || endblock),
      ];
      const gasCost = gasUsed * gasPrice;

      txDetails.timeStamp =
        transaction?.timestamp && tokenReceipt?.blockNumber
          ? +transaction.timestamp * 1000
          : new Date().getTime();

      const transactionCostInEther = parseFloat(
        ethers.utils.formatEther(gasCost.toString())
      );

      txDetails.transactionFeeInUsd = +(transactionCostInEther * usdRate);
      //--------------INCASE OF ERC-20 TRANSFER
      if (
        tokenReceipt.data !== "0x" &&
        ifTxMethodExists(TX_DATA_METHOD_IDs.transfer, tokenReceipt.data)
      ) {
        return await getErc20ReceivedTxDetails(
          web3,
          txDetails,
          tokenReceipt,
          receiptErc20,
          address
        );
      } else {
        //-----------INCASE OF NATIVE TRANSFER
        //-----------STORE THE REMAINING TRANSACTION DETAILS

        if (matchAddresses(receiptErc20?.from, address)) {
          txDetails.txType = TX_TYPES.Sent;

          txDetails.from = address;
        } else {
          txDetails.txType = TX_TYPES.Received;
          txDetails.to = address;
          txDetails.from = receiptErc20?.from?.toLowerCase();
        }

        const amount = Number(ethers.utils.formatEther(tokenReceipt?.value));
        txDetails.token = {
          name: chainInformation.NATIVE_TOKEN_NAME,
          symbol: chainInformation.NATIVE_TOKEN_SYMBOL,
          address: NATIVE_TOKEN_ADDRESS,
          amount,
          amountInUsd: +(amount * Number(usdRate)),
          image: chainInformation.LOGO,
          decimal: 0,
        };

        txDetails.nonce = tokenReceipt?.nonce;
        // if (tokenReceipt?.to) txDetails.to = tokenReceipt?.to?.toLowerCase();
        txDetails.senderNameInTheAddressBook = getNameFromAddressBook(
          checkSum(txDetails.from)
        );
        txDetails.receiverNameInTheAddressBook = getNameFromAddressBook(
          checkSum(txDetails.to)
        );

        return txDetails;
      }
    })
  );

  return result.filter(Boolean);
};

/**
 * This promise is responsible to fetch the token balance of any particular account address through the contract and simply returns it.
 * @param address string -> token address
 * @param from string -> account address
 * @param web3 Web3
 * @param chainId number
 *
 * @returns {Object}  balance number
 */
const getTokenBalance = async ({
  address,

  from,
  web3,
  chainId,
}: {
  address: string;

  from: string;
  web3: EthersRPCProvider;
  chainId: number;
}) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  let balance = 0,
    decimals = 0;
  if (
    !matchAddresses(address, NATIVE_TOKEN_ADDRESS) &&
    !matchAddresses(address, ZERO_ADDRESS)
  ) {
    const contract = new ethers.Contract(address, abi, web3);
    decimals = Number(await contract.decimals());
    balance = Number(await contract.balanceOf(from));
  } else {
    balance = Number(await web3.getBalance(from));
    decimals = NETWORKCHAIN[chainId].DECIMALS;
  }

  return {
    balance: balance / 10 ** decimals,
  };
};

/**
 *This promise is responsible to get all the transaction details of SWAP type transaction, corresponds to transaction hash of the account.
 * @param transactionHash string
 * @param address string
 * @param chainId number
 *
 * Transaction fee is being calculated, and swap tokens balance by using the getTokenBalance function. After fetching those tokens detail, a complete
 * populated item will be returned.
 *
 * @returns item: SwapTransactionData
 */
export const decodeEvmSwapTx = async ({
  transactionHash,
  address,
  chainId,
}: {
  transactionHash: string;
  address: string;
  chainId: number;
}) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const web3 = new ethers.providers.JsonRpcProvider(
    NETWORKCHAIN[chainId].NODE_URL
  );

  const receiptErc20 = await web3.getTransactionReceipt(transactionHash);
  const tokenReceipt: TransactionResponse = await web3.getTransaction(
    transactionHash
  );
  const {
    market_data: { current_price },
  } = await getDetailSingleTokenInfo(
    NETWORKCHAIN[chainId][NATIVE_TOKEN_COINGECKO_ID]
  );

  const usdRate = current_price.usd;

  const item = {
    ...StaticStore.getState().newWallet.activity?.[address]?.[chainId]?.[
      transactionHash
    ],
  } as SwapTransactionData;

  const [gasUsed, gasPrice] = [
    Number(receiptErc20?.gasUsed?.toString()) ||
      Number(tokenReceipt?.gasLimit) ||
      0,
    Number(receiptErc20?.effectiveGasPrice?.toString()) ||
      Number(tokenReceipt?.gasPrice) ||
      0,
  ];

  const gasCost = gasUsed * gasPrice;
  item.transactionFeeInUsd =
    +(
      parseFloat(ethers.utils.formatEther(gasCost.toString())) * usdRate
    ).toFixed(6) || item.transactionFeeInUsd;

  const [tokenAData, tokenBdata] = await Promise.all([
    getTokenBalance({
      address: item.token.address,
      from: receiptErc20.from,
      web3,
      chainId,
    }),
    getTokenBalance({
      address: item.tokenB.address,
      from: receiptErc20.from,
      web3,
      chainId,
    }),
  ]);
  item.makerBalance = tokenAData.balance;
  item.takerBalance = tokenBdata.balance;
  item.makerBalanceInUsd = item.makerBalance * item.tokenAprice;
  item.takerBalanceInUsd = item.takerBalance * item.tokenBprice;
  item.status = ACTIVITY_STATUS_TYPES.success;

  return item;
};

/**
 * On NEAR chains
 * This promise is responsible to get all the transaction details of send or receive type transaction, corresponds to transaction hash of the  account
 * on near chain.
 * @param txHistory  ->  List of hashes with account address
 * @param chainId number -> On which chain this particular transaction hash belongs.
 *
 * This method calculates the gas fee and ultimately the transaction cost. Further, the token name, symbol, from and too address.
 *
 * @returns result of type (TransactionData)[]
 */

export const decodeNear = async ({
  txHistory,
  chainId,
}: {
  txHistory: {
    address: string;
    transactionHash: string;
    timeStamp: number;
  }[];
  chainId: number;
}) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const [nativeTokenSymbol, decimal] = [
    NETWORKCHAIN[chainId][NATIVE_TOKEN_SYMBOL],
    24,
  ];

  const newWallet = StaticStore.getState().newWallet;
  const allWallets = newWallet.allWallets;
  const accounts = newWallet.accounts;
  const {
    market_data: { current_price },
  } = await getDetailSingleTokenInfo(
    NETWORKCHAIN[chainId][NATIVE_TOKEN_COINGECKO_ID]
  );
  const usdRate = current_price.usd;

  const nodeUrl =
    "https://near-mainnet.infura.io/v3/43f9079016584c7d9ef5c0497878dec1";

  let [amount, txType] = [0, TX_TYPES.Sent];

  const provider = new providers.JsonRpcProvider(nodeUrl);

  const result = await Promise.all(
    txHistory.map(async ({ address, timeStamp, transactionHash }) => {
      const transactionData: providers.FinalExecutionOutcome =
        await provider.txStatus(transactionHash, address);

      const gasUsed =
        // @ts-ignore
        transactionData?.transaction_outcome?.outcome?.tokens_burnt /
          10 ** decimal || 0;

      amount =
        transactionData?.transaction?.actions[0].Transfer?.deposit /
          10 ** decimal || 0;
      if (matchAddresses(transactionData?.transaction?.receiver_id, address)) {
        txType = TX_TYPES.Received;
      } else {
        txType = TX_TYPES.Sent;
      }

      return getPopulatedTxDetail({
        txType,
        hash: transactionHash,
        timeStamp,
        decimal,
        transactionFeeInUsd: +(gasUsed * usdRate).toFixed(4),
        from: transactionData?.transaction?.signer_id,
        to: transactionData?.transaction?.receiver_id,
        chainId,
        amount,
        name: NETWORKCHAIN[chainId].NATIVE_TOKEN_NAME,
        symbol: nativeTokenSymbol,
        amountInUsd: Number((+amount * usdRate).toFixed(4)),
        image: NETWORKCHAIN[chainId].LOGO,
        address,
        tokenAddress: NEAR_ADDRESS,
        isCancelEnabled: false,
        isSpeedUpEnabled: false,
        status: ACTIVITY_STATUS_TYPES.success,
        walletName: allWallets[accounts[address].walletId]?.name,
        senderNameInTheAddressBook: getNameFromAddressBook(
          transactionData?.transaction?.signer_id
        ),
        receiverNameInTheAddressBook: getNameFromAddressBook(
          transactionData?.transaction?.receiver_id
        ),
        txMethod: Tx_METHODS.normal,
        isDappTransaction: false,
      });
    })
  );

  return result.filter((val) => val !== undefined);
};
//-----------------------------------FUNCTIONS TO GET RECEIVE TRANSACTIONS----------------------------------------

/**
 * This promise is responsible to fetch transactions of the account address through the scan apis.
 * @param address string
 * @param chainId number
 *
 * If transactions exist on that address on that particular chains, then decodeEvm function will be called.
 *  While, Sent types transactions will be removed, as we are already caching the sent transaction data, when making a transaction through the wallet,
 *  and only decode  those details, that are required. But, for receive transaction we need that data.
 *
 * @returns data -> List of transaction data, that has been decoded on EVM chain.
 */
export const getReceivedTransactionEVM = async ({
  address,
  chainId,
}: {
  address: string;

  chainId: number;
}) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const nodeURL = NETWORKCHAIN[chainId][NODE_URL];
  let txHistory: {
    transactionHash: string;
    address: string;
  }[] = [];
  let data;
  // if (chainId === 97) nodeURL = "https://bsc-dataseed1.binance.org/";
  const web3 = new ethers.providers.JsonRpcProvider(nodeURL);

  // if (AnkerChainIds[chainId]) {
  //   txHistory = await getEVMTxHistoryByAnkrApis({ address, chainId });
  // } else
  txHistory = await getEVMTxHistoryByExplorerApis(chainId, web3, address);

  if (txHistory.length > 0)
    data = (await decodeEvm(txHistory, chainId, "")).filter(
      (item) => item?.txType !== TX_TYPES.Sent
    );
  if (data && data?.length > 0) {
    let updatedActivity = StaticStore.getState().newWallet.activity;
    data.forEach((tx) => {
      if (tx) {
        updatedActivity = mergeNewAndOldActivityData({
          previousTransactionActivityData: updatedActivity,
          transactionData: tx,
        });
      }
    });
    StaticStore.dispatch(setTransactionActivityData(updatedActivity));
  }

  return data;
};
/**
 * This method is responsible to fetch the receive  transaction details on Solana chain.
 * @param address string
 * @param chainId  number
 *
 * Her we will fetch the native and non-native tokens transfers through the api.
 *
 * @returns TransactionData[]
 */
export const getReceivedTransactionsSolana = async ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  const { NETWORKCHAIN, lastReceivedTransactionTime } =
    StaticStore.getState().app;
  let usdRate = 1;
  // const lastReceivedTransactionTime =
  //   StaticStore.getState().app.lastReceivedTransactionTime;
  const newWallet = StaticStore.getState().newWallet;
  const allWallets = newWallet.allWallets;
  const accounts = newWallet.accounts;
  const time = Math.floor(lastReceivedTransactionTime / 1000);

  const url = "https://public-api.solscan.io";
  const [splTransfersResponse, solTransfersResponse, request] =
    await Promise.all([
      await axios.get(
        `${url}/account/splTransfers?account=${address}&fromTime=${time}&limit=20`
      ),
      await axios.get(
        `${url}/account/solTransfers?account=${address}&fromTime=${time}&limit=10`
      ),
      await axios.get(`${url}/token/meta?tokenAddress=${SOLANA_ADDRESS}`),
    ]);

  if (request.data) {
    usdRate = request.data.price;
  }
  const solTransfers = solTransfersResponse.data.data;
  const splTransfers = splTransfersResponse.data.data;
  const solList: TransactionData[] = [];
  let splList: TransactionData[] = [];

  if (solTransfers.length > 0) {
    solTransfers.forEach(
      ({
        txHash,
        blockTime,
        decimals,
        src,
        dst,
        lamport,
        fee,
      }: {
        txHash: string;
        blockTime: number;
        decimals: number;
        src: string;
        dst: string;
        lamport: number;
        fee: number;
      }) => {
        if (matchAddresses(dst, address)) {
          const transactionFeeInUsd = +(
            (fee / 10 ** decimals) *
            usdRate
          ).toFixed(4);

          const amount = lamport / 10 ** decimals;
          const amountInUsd = (Number(amount) * Number(usdRate)).toFixed(4);
          solList.push(
            getPopulatedTxDetail({
              txType: TX_TYPES.Received,
              hash: txHash,
              timeStamp: blockTime * 1000,
              decimal: decimals,
              transactionFeeInUsd,
              from: src,
              to: dst,
              chainId,
              amount,
              name: NETWORKCHAIN[chainId][NATIVE_TOKEN_NAME],
              symbol: NETWORKCHAIN[chainId][NATIVE_TOKEN_SYMBOL],
              amountInUsd: +amountInUsd,
              image: NETWORKCHAIN[chainId][LOGO],
              address,
              tokenAddress: SOLANA_ADDRESS,
              isSpeedUpEnabled: false,
              isCancelEnabled: false,
              status: ACTIVITY_STATUS_TYPES.success,
              walletName: allWallets[accounts[address].walletId].name,
              senderNameInTheAddressBook: getNameFromAddressBook(src),
              receiverNameInTheAddressBook: getNameFromAddressBook(dst),
              txMethod: Tx_METHODS.normal,
              isDappTransaction: false,
            })
          );
        }
      }
    );
  }
  if (splTransfers.length > 0) {
    let [symbol, image, amountInUsd, amount] = ["token", DUMMY_IMAGE_URL, 0, 0];
    splList = await Promise.all(
      splTransfers.map(
        async ({
          address,
          blockTime,
          changeAmount,
          decimals,
          fee,
          owner,
          signature,
          tokenAddress,
        }: {
          changeAmount: number;
          signature: string[];
          blockTime: number;
          decimals: number;
          fee: number;
          owner: string;
          address: string;
          tokenAddress: string;
        }) => {
          if (+changeAmount > 0) {
            amount = changeAmount / 10 ** decimals;
            const request = await axios.get(
              `${url}/token/meta?tokenAddress=${tokenAddress}`
            );
            if (request.data) {
              symbol = request.data.symbol;
              image = request.data.icon || DUMMY_IMAGE_URL;
              amountInUsd = Number(amount) * request.data.price || 1;
            } else {
              symbol = "token";
              image = DUMMY_IMAGE_URL;
              amountInUsd = 1;
            }
            return getPopulatedTxDetail({
              txType: TX_TYPES.Received,
              hash: signature[0],
              address: owner,
              amount,
              amountInUsd,
              chainId,
              decimal: decimals,
              from: address,
              image,
              name: request?.data?.name || "token",
              symbol,
              timeStamp: blockTime ? blockTime * 1000 : new Date().getTime(),
              to: owner,
              tokenAddress,
              transactionFeeInUsd: (fee / 10 ** 9) * usdRate,
              isCancelEnabled: false,
              isSpeedUpEnabled: false,
              status: ACTIVITY_STATUS_TYPES.success,
              walletName: allWallets[accounts[owner].walletId].name,
              senderNameInTheAddressBook: getNameFromAddressBook(address),
              receiverNameInTheAddressBook: getNameFromAddressBook(owner),
              txMethod: Tx_METHODS.normal,
              isDappTransaction: false,
            });
          }
          return null;
        }
      )
    );
  }
  const data = [...solList, ...splList].filter(Boolean);

  if (data && data?.length > 0) {
    let updatedActivity = StaticStore.getState().newWallet.activity;
    data.forEach((tx) => {
      if (tx) {
        updatedActivity = mergeNewAndOldActivityData({
          previousTransactionActivityData: updatedActivity,
          transactionData: tx,
        });
      }
    });
    StaticStore.dispatch(setTransactionActivityData(updatedActivity));
  }

  return;
};

/**
 * This method is responsible to fetch the receive  transaction details on Near chain.
 * @param address string
 * @param chainId  number
 *
 * Her we will fetch the native and non-native tokens transfers through the api.
 *
 * @returns TransactionData[]
 */

export const getReceivedTransactionsNear = async ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  let [baseUrl, nodeUrl] = ["", ""];
  let nearTransactionData: TransactionData[] = [];
  const txHistory: {
    address: string;
    transactionHash: string;
    timeStamp: number;
  }[] = [];
  if (NETWORKCHAIN[chainId].isTestnet)
    baseUrl = "https://testnet-api.kitwallet.app";
  else baseUrl = "https://api.kitwallet.app";

  if (address.length > 1) {
    nodeUrl = `${baseUrl}/account/${address}/activity`;
    const response = await axios({
      method: "GET",
      url: nodeUrl,
    });

    if (response.data) {
      response.data.forEach(
        ({
          receiver_id,
          action_kind,
          hash,
          block_timestamp,
        }: {
          receiver_id: string;
          action_kind: string;
          hash: string;
          signer_id: string;
          block_timestamp: number;
        }) => {
          if (
            matchAddresses(receiver_id, address) &&
            action_kind === "TRANSFER"
          ) {
            txHistory.push({
              address,
              transactionHash: hash,
              timeStamp: Math.floor(Number(block_timestamp) / 1000000),
            });
          }
        }
      );

      if (txHistory.length > 0) {
        nearTransactionData = await (
          await decodeNear({ txHistory, chainId })
        ).filter((item) => item.txType !== TX_TYPES.Sent);
      }

      if (nearTransactionData && nearTransactionData.length > 0) {
        let updatedActivity = StaticStore.getState().newWallet.activity;
        nearTransactionData.forEach((tx) => {
          if (tx) {
            updatedActivity = mergeNewAndOldActivityData({
              previousTransactionActivityData: updatedActivity,
              transactionData: tx,
            });
          }
        });
        StaticStore.dispatch(setTransactionActivityData(updatedActivity));
      }
    }
  }

  return nearTransactionData;
};
// -----------------------------------AFTER NEW TRANSACTION, BRING RECEIVE TRANSACTION AS EVENT TRIGGERED--------------------------
// -----------------------------------TRANSACTION CAN BE BETWEEN THE ACCOUNT OR EXTERNAL

/**
 * This method is responsible to fetch the receive  transaction on all the chains. It will iterate through all the accounts that have holdings, on all the
 * chains. Once all the activity, has been received, it will be stored in the redux.
 *
 *
 * @returns TransactionData[]
 */
export const getAllReceivedTransactions = async () => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const newWallet = StaticStore.getState().newWallet;
  const accountsSum = newWallet.accountsSum;
  const tokenHoldings = newWallet.tokenHoldings;
  const tokenHoldingAccounts = Object.keys(tokenHoldings);

  const isTestnetNetwork = StaticStore.getState().app.isTestnet;
  for (let i = 0; i < tokenHoldingAccounts.length; i++) {
    if (accountsSum[tokenHoldingAccounts[i]]?.balanceInUsd > 0) {
      const chains = Object.keys(tokenHoldings[tokenHoldingAccounts[i]]);

      // const result = await Promise.all(
      chains.forEach(async (chainId) => {
        if (
          NETWORKCHAIN[+chainId]?.chain === NETWORKS.EVM &&
          NETWORKCHAIN[+chainId].isTestnet === isTestnetNetwork
        ) {
          getReceivedTransactionEVM({
            address: tokenHoldingAccounts[i],
            // createdAt: accounts[tokenHoldingAccounts[i]].createdAt,
            chainId: +chainId,
          });

          // return txData;
          //-----------------------------DONT REMOVE FOR NOW PART
        } else if (
          NETWORKCHAIN[+chainId]?.chain === NETWORKS.SOLANA &&
          NETWORKCHAIN[+chainId].isTestnet === isTestnetNetwork
        ) {
          getReceivedTransactionsSolana({
            address: tokenHoldingAccounts[i],

            chainId: +chainId,
          });
        } else if (
          NETWORKCHAIN[+chainId]?.chain === NETWORKS.NEAR &&
          NETWORKCHAIN[+chainId].isTestnet === isTestnetNetwork
        ) {
          getReceivedTransactionsNear({
            address: tokenHoldingAccounts[i],
            chainId: +chainId,
          });
        }
      });
      // );

      // let updatedActivity = StaticStore.getState().newWallet.activity;
      // result.forEach((item) => {
      //   if (item && item?.length > 0) {
      //     item.forEach((tx) => {
      //       if (tx) {
      // updatedActivity = mergeNewAndOldActivityData({
      //   previousTransactionActivityData: updatedActivity,
      //   transactionData: tx,
      // });
      //       }
      //     });
      //   }
      // });

      // StaticStore.dispatch(setTransactionActivityData(updatedActivity));
    }
  }
};

/**
 * This function is responsible when the transaction is completed and successfully executed when made through the dapp.
 * @param transaction: TransactionData | SwapTransactionData;
 *
 * This method will update the necessary states on transaction completion and it is also calculating transaction fee, according to the transaction type.
 */
export const onDappTransactionComplete = async ({
  transaction,
  store,
}: {
  transaction: TransactionData | SwapTransactionData;
  store: any;
}) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  await StaticStore.dispatch(
    setCompletedTransactionStates({
      txType: transaction.txType,
      message: TransactionSuccessMessage,
    })
  );
  storeTransactionActivityData({
    transactionData: {
      ...transaction,
      status: ACTIVITY_STATUS_TYPES.success,
    },
  });
  const updatedActivity = store.getState().newWallet.activity;

  const { chainId, nonce, address, transactionHash, txMethod } = transaction;
  const transactions = store.getState().app.inProgressTransactionHashes;

  const updateTxStatusHashes = transactions[chainId][nonce];
  const web3 = new ethers.providers.JsonRpcProvider(
    NETWORKCHAIN[+chainId].NODE_URL
  );

  const tx = await web3.getTransactionReceipt(transaction.transactionHash);
  const tokenReceipt = await web3.getTransaction(transaction.transactionHash);

  const chainInformation = NETWORKCHAIN[+chainId];
  const {
    market_data: { current_price },
  } = await getDetailSingleTokenInfoInDapp(
    chainInformation[NATIVE_TOKEN_COINGECKO_ID]
  );

  const [gasUsed, gasPrice] = [
    Number(tx?.gasUsed?.toString()) || Number(tokenReceipt?.gasLimit) || 0,
    Number(tx?.effectiveGasPrice?.toString()) ||
      Number(tokenReceipt?.gasPrice) ||
      0,
  ];

  const gasCost = gasUsed * gasPrice;

  const transactionFeeInUsd = +(
    parseFloat(ethers.utils.formatUnits(gasCost.toString(), "ether")) *
    current_price.usd
  );

  const item = {
    ...transaction,
    transactionFeeInUsd,
    status:
      txMethod === Tx_METHODS.cancel
        ? ACTIVITY_STATUS_TYPES.cancel
        : ACTIVITY_STATUS_TYPES.success,
  };
  // await getWalletHoldings();
  await updateStatesAfterTxStatusFinalized({
    address,
    chainId: +chainId,
    message: TransactionSuccessMessage,
    transactionData: item,
    transactionHash,
    updateTxStatusHashes,
    updatedActivity,
    store,
  });
  clearSameNoncetransactions(chainId, nonce, store);
  generateNotification("Dapp transaction", "Transaction has been completed");
};

/**
 * This function is responsible when the transaction is completed and failed when made through the dapp.
 *
 * @param transaction: TransactionData | SwapTransactionData;
 *
 * This method will update the states and failure messages, according to the transaction type.
 */

export const onDappTransactionFailure = async ({
  transaction,
  store,
}: {
  transaction: TransactionData | SwapTransactionData;
  store: any;
}) => {
  await StaticStore.dispatch(
    setCompletedTransactionStates({
      txType: transaction.txType,
      message: TransactionFailureMessage,
    })
  );
  storeTransactionActivityData({
    transactionData: {
      ...transaction,
      status: ACTIVITY_STATUS_TYPES.failed,
    },
  });
  const updatedActivity = store.getState().newWallet.activity;
  const transactions = store.getState().app.inProgressTransactionHashes;
  const { chainId, nonce, address, transactionHash } = transaction;
  const updateTxStatusHashes = transactions[chainId][nonce];
  const item = {
    ...transaction,

    status: ACTIVITY_STATUS_TYPES.failed,
  };
  // await getWalletHoldings();
  await updateStatesAfterTxStatusFinalized({
    address,
    chainId: +chainId,
    message: TransactionFailureMessage,
    transactionData: item,
    transactionHash,
    updateTxStatusHashes,
    updatedActivity,
    store: StaticStore,
  });
  clearSameNoncetransactions(chainId, nonce, store);
};
/**
 * This method will clear all those transaction from in progress transaction  hashes related to same nonce of the particular account
 *
 * @param chainId number
 * @param nonce number
 *
 * This function will iterate all the transaction hashes and remove the hashes with the same nonce  as passed in function argument.
 * Then the filtered in progress transaction hashes will be stored in the redux.
 */
export const clearSameNoncetransactions = async (
  chainId: number,
  nonce: number,
  store: any
) => {
  const staticStore = store.getState();
  let transactions = staticStore.app.inProgressTransactionHashes;

  const [inProgressNonceTransactions, inProgressTransactionHashes] = [
    transactions[chainId],
    staticStore.app.inProgressTransactionHashes,
  ];
  let newTransactionsHashes = {};

  for (const property in inProgressNonceTransactions) {
    if (+property !== nonce) {
      newTransactionsHashes = {
        ...newTransactionsHashes,
        [+property]: inProgressTransactionHashes[chainId][+property],
      };
    }
  }
  transactions = { ...transactions, [chainId]: newTransactionsHashes };

  await store.dispatch(setInProgressTransactionHash(transactions));
};

/**
 * A generalized function that will update necessary states after the transaction completion, either success or failure.
 * @param updatedActivity Activity
 * @param transactionData TransactionData | SwapTransactionData
 * @param updateTxStatusHashes string[]
 * @param address string
 * @param chainId number
 * @param transactionHash string
 * @param  message string
 *
 * It will add the newly confirmed transaction data and will delete that transaction hashes from in progress as the transaction is completed.
 * Snackbar confirmed States will also be updated and the message to be displayed.
 */
export const updateStatesAfterTxStatusFinalized = async ({
  updatedActivity,
  transactionData,
  updateTxStatusHashes,
  address,
  chainId,
  transactionHash,
  message,
  store,
}: {
  updatedActivity: Activity;
  transactionData: TransactionData | SwapTransactionData;
  updateTxStatusHashes: string[];
  address: string;
  chainId: number;
  transactionHash: string;
  message: string;
  store: any;
}) => {
  updatedActivity = mergeNewAndOldActivityData({
    transactionData,
    previousTransactionActivityData: updatedActivity,
  });

  updateTxStatusHashes?.forEach((txHash: string) => {
    if (txHash !== transactionHash) {
      updatedActivity = deleteActivityItem({
        address: address,
        chainId: chainId,
        hash: txHash,
        previousTransactionActivityData: updatedActivity,
      });
    }
  });
  const txIntervalList = store
    .getState()
    .app.txIntervalList.filter((hash: string) => {
      return !updateTxStatusHashes.includes(hash);
    });

  store.dispatch(setTransactionActivityData(updatedActivity));

  // await store.dispatch(
  //   setCompletedTransactionStates({
  //     txType: transactionData.txType,
  //     message,
  //   })
  // );
  await store.dispatch(setFilteredTxIntervalList(txIntervalList));
};

/**
 * This function is responsible to return all the transactions of all the accounts on all the chainId's.
 *
 * This function is looping all over the activity object and pushing each transaction in to an array.
 *
 * @returns  (TransactionData | SwapTransactionData)[]
 */
export const getTransactions = (store: any) => {
  const transactions: (TransactionData | SwapTransactionData)[] = [];
  const LatestActivity = store.getState().newWallet.activity;

  Object.keys(LatestActivity).forEach((accAddress) => {
    Object.keys(LatestActivity[accAddress]).forEach((chainId) => {
      Object.keys(LatestActivity[accAddress][+chainId]).forEach(
        (transactionHash) => {
          const transaction =
            LatestActivity[accAddress][+chainId][transactionHash];
          transactions.push(transaction);
        }
      );
    });
  });
  const tx = transactions.sort((a, b) => b.timeStamp - a.timeStamp);

  return tx;
};
