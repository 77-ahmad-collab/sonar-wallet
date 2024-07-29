const selectedAccount1 = [
  {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    value: false,
  },
];

const selectedAccount2 = [
  {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    value: false,
  },
  {
    address: "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
    value: false,
  },
];

const selectedAccount3 = [
  {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    value: false,
  },
  {
    address: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
    value: false,
  },
  {
    address: "0xa22920874156B8F80b8E22280828cB12185bD1A4",
    value: false,
  },
  {
    address: "D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3",
    value: false,
  },
  {
    address: "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559",
    value: false,
  },
];

const isActive = true;
const singleTokenInfo = {
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  isActive: true,
  image:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
  coingeckoId: "",
  price: expect.any(Number),
};

const fetchImageAndUpdateTokenPriceData = {
  isActive: true,
  singleTokenInfo: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    isActive: true,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    coingeckoId: "",
    price: expect.any(Number),
  },
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  symbol: "ETH",
};

const fetchImageAndUpdateTokenPriceData2 = {
  isActive: true,
  singleTokenInfo: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    isActive: true,
    image: "",
    coingeckoId: "ethereum",
    price: expect.any(Number),
  },
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  symbol: "ETH",
};
export {
  selectedAccount1,
  selectedAccount2,
  selectedAccount3,
  fetchImageAndUpdateTokenPriceData,
  fetchImageAndUpdateTokenPriceData2,
};
