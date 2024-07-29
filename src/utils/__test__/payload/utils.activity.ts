import { StaticStore } from "store/store";
import {
  ACTIVITY_STATUS_TYPES,
  DUMMY_IMAGE_URL,
  NATIVE_TOKEN_ADDRESS,
  NETWORKS,
  TX_TYPES,
  Tx_METHODS,
} from "utils/constants";

const txItem1 = {
  account: {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    name: "Account 1",
    walletName: "Wallet 1",
    chainFamily: "EVM",
    nativeTokenBalance: 0.009967765,
    nativeTokenSymbol: "BNB",
    image:
      "data:image/png;base64,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",
    nativeTokenBalanceInRaw: "9967765000000000",
  },
  amountTokenA: {
    amount: "0.0001",
    amountInUsd: "0.032",
  },
  amountTokenB: {
    amount: "0.031960874480403086",
    amountInUsd: "0",
  },
  isCancelEnabled: true,
  isDappTransaction: false,
  isSpeedUpEnabled: true,
  nonce: 10,
  status: ACTIVITY_STATUS_TYPES.pending,
  timeStamp: 1676548380571,
  tokenA: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    image:
      "data:image/png;base64,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",
    balance: 0.009967765,
    balanceInUsd: 3.1896848,
    amount: 0,
    amountInUsd: 0,
    chainId: 56,
    reflectionExists: false,
    isNative: true,
    sellAmount: 1,
    coingeckoId: "binancecoin",
    rawBalance: "9967765000000000",
    price: 1,
  },
  tokenAprice: 320,
  tokenB: {
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    name: "Binance USD",
    symbol: "BUSD",
    decimals: 18,
    image:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
    balance: 0,
    balanceInUsd: 0,
    amount: 0,
    amountInUsd: 0,
    chainId: 56,
    reflectionExists: false,
    isNative: false,
    buyAmount: 1,
    rawBalance: "0",
    coingeckoId: "",
    price: 1,
  },
  tokenBprice: 1.00122416924546,
  transactionFeeInUsd: 0.4037950182,
  transactionHash: "",
  transactionObject: {
    nonce: "0x0a",
    gasLimit: "0x0341d4",
    gasPrice: "0x012a05f200",
    value: "0x5af3107a4000",
    data: "0x12aa3caf0000000000000000000000007f9e3430880580713b03670046c7e89a0a91403b000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d560000000000000000000000007f9e3430880580713b03670046c7e89a0a91403b0000000000000000000000006e99aef6bf2e9eb63bc2d3b5ddee79ceef52d84700000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000006e2432d9030651000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f90000000000000000000000000000000000db00004c00003200002c00000600206b4be0b9e021060846341a648747bc6044c8f4d3bc6be7f6125200000000000000000000002e90edd00000206b4be0b94041bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095cd0e30db00c20bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095cf455f6f7988b752f75488e2cccc030346d0cac726ae40711b8001e8480f455f6f7988b752f75488e2cccc030346d0cac721111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000000000000000000000000001bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000cfee7c08",
    from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    to: "0x1111111254eeb25477b68fb85ed929f73a960582",
  },
  txMethod: Tx_METHODS.normal,
};
const txItem2 = {
  txType: TX_TYPES.Sent,
  hash: "0xb87998d295bfac16bf7891762662476e9c62056e08f29bc6a142a05fb6c2e04f",
  timeStamp: 1674816463,
  decimal: 18,
  transactionFeeInUsd: 0.78,
  from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  to: "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c",
  chainId: 5,
  amount: 18402452.4771,
  name: "USD",
  symbol: "USDC",
  amountInUsd: 18402452,
  image: DUMMY_IMAGE_URL,
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  tokenAddress: "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c",
  isSpeedUpEnabled: false,
  isCancelEnabled: false,
  rawData: {},
  status: ACTIVITY_STATUS_TYPES.success,
  walletName: "Wallet 1",
  receiverNameInTheAddressBook: "",
  senderNameInTheAddressBook: "",
  txMethod: Tx_METHODS.normal,
  isDappTransaction: false,
};
const txItem3 = {
  txType: TX_TYPES.Sent,
  hash: "0xb87998d295bfac16bf7891762662476e9c62056e08f29bc6a142a05fb6c2e04f",
  timeStamp: 1674816463,
  decimal: 18,
  transactionFeeInUsd: 0.78,
  from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  to: "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c",
  chainId: 5,
  amount: 18402452.4771,
  name: "USD",
  symbol: "USDC",
  amountInUsd: 18402452,
  image: DUMMY_IMAGE_URL,
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  tokenAddress: "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c",
  isSpeedUpEnabled: false,
  isCancelEnabled: false,
  rawData: {},
  status: ACTIVITY_STATUS_TYPES.success,
  walletName: "Wallet 1",
  receiverNameInTheAddressBook: "",
  senderNameInTheAddressBook: "",
  txMethod: Tx_METHODS.normal,
  isDappTransaction: false,
};
const deleteActivityItem_payload = {
  address: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
  chainId: 101,
  previousTransactionActivityData: StaticStore.getState().newWallet.activity,
  hash: "4Tnv1D1BAZUHwFzAsp7RFjnrYWQKs168a4PaVHP6pqSf",
};

const mockTokenSelected = {
  token: {
    address: "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c",
    name: "USD",
    symbol: "USDC",
    decimals: 18,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    chainId: 5,
    multiAccountExist: false,
    coingeckoId: "ethereum",
  },
  from: {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    name: "Account 1",
    balance: 0.0094459, //user balance
    balanceInUsd: 14.807407,
    chainFamily: NETWORKS.EVM,
    walletName: "Wallet 1",
  },
  to: {
    address: "0xd2ffE9246458e9e7F3c51e15Ae3F1d69797fDc60",
    amount: 0.000001, //entered amount
    amountInUsd: 0.00011,
    ens: "",
  },
  error: {
    message: "",
    open: false,
  },
  transactionObject: {},
  hexData: "",
  makeTransaction: true,
  loading: false,
};

const decodeEvmSwapTx_payload = {
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  transactionHash:
    "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad53",
  chainId: 5,
};

const decodeNear_payload = {
  txHistory: [
    {
      address:
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      transactionHash: "4Tnv1D1BAZUHwFzAsp7RFjnrYWQKs168a4PaVHP6pqSf",
      timeStamp: 1674209386088,
    },
  ],
  chainId: 101,
};

const getReceivedTransactionsNear_payload = {
  address: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
  chainId: 101,
};

const getReceivedTransactionsSolana_payload = {
  address: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
  chainId: 103,
};

const getReceivedTransactionEVM_payload = {
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  chainId: 5,
};

const payload1 = {
  transaction: {
    txType: TX_TYPES.Sent,
    from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    to: "0x68b000F8e550b8FAAfAaADCcEBd244c7ac390F06",
    token: {
      name: "ETH",
      symbol: "ETH",
      address: NATIVE_TOKEN_ADDRESS,
      image:
        "data:image/png;base64,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",
      amount: 0.0001,
      amountInUsd: 0.0003,
      decimal: 18,
    },
    transactionFeeInUsd: 0.0001,
    timeStamp: 1674209311472,
    nonce: 26,
    chainId: 5,
    transactionHash:
      "0x11317877b8e78595a1228aac252c5293b25a08052c42a47b3f6ba78ec15d48ac",
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    isSpeedUpEnabled: false,
    isCancelEnabled: false,
    status: ACTIVITY_STATUS_TYPES.pending,
    walletName: "Wallet 1",
    receiverNameInTheAddressBook: "",
    senderNameInTheAddressBook: "",
    txMethod: Tx_METHODS.normal,
    isDappTransaction: false,
  },
};

const payload2 = {
  transaction: {
    txType: TX_TYPES.Sent,
    from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    to: "0x68b000F8e550b8FAAfAaADCcEBd244c7ac390F06",
    token: {
      name: "ETH",
      symbol: "ETH",
      address: NATIVE_TOKEN_ADDRESS,
      image:
        "data:image/png;base64,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",
      amount: 0.0001,
      amountInUsd: 0.0003,
      decimal: 18,
    },
    transactionFeeInUsd: 0.0001,
    timeStamp: 1674209311472,
    nonce: 27,
    chainId: 5,
    transactionHash:
      "0xc2c6d9f844ba28e8d88687c31d7b7da17e39e7ddc089909fb14f553f756dcb84",
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    isSpeedUpEnabled: false,
    isCancelEnabled: false,
    status: ACTIVITY_STATUS_TYPES.pending,
    walletName: "Wallet 1",
    receiverNameInTheAddressBook: "",
    senderNameInTheAddressBook: "",
    txMethod: Tx_METHODS.normal,
    isDappTransaction: false,
  },
};
export {
  txItem1,
  txItem2,
  txItem3,
  deleteActivityItem_payload,
  mockTokenSelected,
  decodeEvmSwapTx_payload,
  decodeNear_payload,
  getReceivedTransactionsNear_payload,
  getReceivedTransactionsSolana_payload,
  getReceivedTransactionEVM_payload,
  payload1,
  payload2,
};
