import { TokenSelected } from "interfaces";
import { NETWORKS } from "utils/constants";

const filterSwapTokensData = {
  tokens: [
    {
      chainId: 56,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      logoURI: "https://www.ankr.com/rpc/static/media/bsc.e1bfba92.svg",
    },
    {
      chainId: 56,
      name: "BNB",
      symbol: "BNB",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      logoURI: "https://www.ankr.com/rpc/static/media/bsc.e1bfba92.svg",
    },
    {
      chainId: 56,
      name: "PING",
      symbol: "PING",
      address: "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
      decimals: 9,
      logoURI:
        "https://res.cloudinary.com/deibhmy2d/image/upload/v1672224566/ping_gmgeva.png",
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
      decimals: 18,
      chainId: 56,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    {
      symbol: "WBNB",
      name: "Wrapped BNB",
      decimals: 18,
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      logoURI:
        "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png",
      wrappedNative: "true",
      tags: ["tokens", "PEG:BNB"],
      chainId: 56,
    },
    {
      symbol: "CHI",
      name: "Chi Gastoken by 1inch",
      decimals: 0,
      address: "0x0000000000004946c0e9f43f4dee607b0ef1fa1c",
      logoURI:
        "https://tokens.1inch.io/0x0000000000004946c0e9f43f4dee607b0ef1fa1c.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      decimals: 18,
      address: "0x55d398326f99059ff775485246999027b3197955",
      logoURI:
        "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
      tags: ["tokens", "PEG:USD"],
      chainId: 56,
    },
    {
      symbol: "CAKE",
      name: "PancakeSwap Token",
      decimals: 18,
      address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      logoURI:
        "https://tokens.1inch.io/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "ETH",
      name: "Ethereum Token",
      decimals: 18,
      address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      logoURI:
        "https://tokens.1inch.io/0x2170ed0880ac9a755fd29b2688956bd959f933f8.png",
      tags: ["tokens", "PEG:ETH"],
      chainId: 56,
    },
    {
      symbol: "BTCB",
      name: "BTCB Token",
      decimals: 18,
      address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
      logoURI:
        "https://tokens.1inch.io/0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "AUTO",
      name: "AUTOv2",
      decimals: 18,
      address: "0xa184088a740c695e156f91f5cc086a06bb78b827",
      logoURI:
        "https://tokens.1inch.io/0xa184088a740c695e156f91f5cc086a06bb78b827.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "BSCX",
      name: "BSCX",
      decimals: 18,
      address: "0x5ac52ee5b2a633895292ff6d8a89bb9190451587",
      logoURI:
        "https://tokens.1inch.io/0x5ac52ee5b2a633895292ff6d8a89bb9190451587.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "BDO",
      name: "bDollar",
      decimals: 18,
      address: "0x190b589cf9fb8ddeabbfeae36a813ffb2a702454",
      logoURI:
        "https://tokens.1inch.io/0x190b589cf9fb8ddeabbfeae36a813ffb2a702454.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "DOT",
      name: "DOT",
      decimals: 18,
      address: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
      logoURI:
        "https://tokens.1inch.io/0x7083609fce4d1d8dc0c979aab8c869ea2c873402.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "UST",
      name: "Wrapped UST Token",
      decimals: 18,
      address: "0x23396cf899ca06c4472205fc903bdb4de249d6fc",
      logoURI:
        "https://tokens.1inch.io/0xa47c8bf37f92abed4a126bda807a7b7498661acd.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "VAI",
      name: "VAI Stablecoin",
      decimals: 18,
      address: "0x4bd17003473389a42daf6a0a729f6fdb328bbbd7",
      logoURI:
        "https://tokens.1inch.io/0x4bd17003473389a42daf6a0a729f6fdb328bbbd7.png",
      eip2612: true,
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      decimals: 18,
      address: "0xbf5140a22578168fd562dccf235e5d43a02ce9b1",
      logoURI:
        "https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "LINK",
      name: "ChainLink Token",
      decimals: 18,
      address: "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
      logoURI:
        "https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 18,
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      logoURI:
        "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      tags: ["tokens", "PEG:USD"],
      chainId: 56,
    },
    {
      symbol: "zSEED",
      name: "zSeedToken",
      decimals: 18,
      address: "0x5cd50aae14e14b3fdf3ff13c7a40e8cf5ae8b0a5",
      logoURI:
        "https://tokens.1inch.io/0x5cd50aae14e14b3fdf3ff13c7a40e8cf5ae8b0a5.png",
      tags: ["tokens"],
      chainId: 56,
    },
    {
      symbol: "DAI",
      name: "Dai Token",
      decimals: 18,
      address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      logoURI:
        "https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
      tags: ["tokens", "PEG:USD"],
      chainId: 56,
    },
  ],
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
  tokenA: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    image:
      "data:image/png;base64,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",
    balance: 0.009967765,
    balanceInUsd: 3.2728159600999995,
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
};

const filterSwapTokensData2 = {
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
  tokenA: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    image:
      "data:image/png;base64,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",
    balance: 0.009967765,
    balanceInUsd: 3.2728159600999995,
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
  tokens: [],
};

const mockTokenSelected: TokenSelected = {
  token: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    chainId: 1,
    multiAccountExist: false,
    coingeckoId: "ethereum",
    price: 1,
  },
  from: {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    name: "Account 1",
    balance: 0.0094459, //user balance
    balanceInUsd: 14.807407,
    chainFamily: NETWORKS.EVM,
    walletName: "Wallet 1",
    rawBalance: "",
    nativeTokenBalance: 0.00001,
    nativeTokenBalanceInRaw: "222251545",
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

const mockTokenBSelected: TokenSelected = {
  token: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    chainId: 1,
    multiAccountExist: false,
    coingeckoId: "ethereum",
    price: 1,
  },
  from: {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    name: "Account 1",
    balance: 0.0094459, //user balance
    balanceInUsd: 14.807407,
    chainFamily: NETWORKS.EVM,
    walletName: "Wallet 1",
    rawBalance: "",
    nativeTokenBalance: 0.00001,
    nativeTokenBalanceInRaw: "222251545",
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
export {
  filterSwapTokensData,
  filterSwapTokensData2,
  mockTokenSelected,
  mockTokenBSelected,
};
