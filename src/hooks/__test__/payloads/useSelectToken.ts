import { TokenSelected } from "interfaces";
import { NETWORKS } from "utils/constants";

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
    nativeTokenBalance: 0.02,
    nativeTokenBalanceInRaw: "200000000000",
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

const swapTokens = {
  tokens: [
    {
      chainId: 1,
      name: "Ethereum",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      logoURI: "https://www.ankr.com/rpc/static/media/eth.3ee8ddd4.svg",
    },
    {
      chainId: 1,
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    {
      name: "ePING",
      symbol: "ePING",
      logoURI:
        "https://res.cloudinary.com/deibhmy2d/image/upload/v1672234468/eping_twb0pw.png",
      decimals: 9,
      chainId: 1,
      address: "0xC7B89491Bb148551547837ea6ccB4Bb5144d8E47",
    },
  ],
  hasMorePages: true,
};

const mock_useLocation_return_value1 = {
  state: {
    isSwap: {
      forTokenA: false,
      forTokenB: true,
    },
  },
  key: "",
  hash: "",
  pathname: "/swap",
  search: "",
};

const mock_useLocation_return_value2 = {
  state: {
    isSwap: {
      forTokenA: true,
      forTokenB: false,
    },
  },
  key: "",
  hash: "",
  pathname: "/swap",
  search: "",
};

export {
  mockTokenSelected,
  swapTokens,
  mock_useLocation_return_value1,
  mock_useLocation_return_value2,
};
