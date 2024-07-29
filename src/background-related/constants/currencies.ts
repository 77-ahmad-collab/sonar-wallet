import { CoinGeckoAsset, FiatCurrency, FungibleAsset } from "../assets";
import { NetworkBaseAsset } from "../networks";
import { coinTypesByAssetSymbol } from "./coin-types";

export const USD: FiatCurrency = {
  name: "United States Dollar",
  symbol: "USD",
  decimals: 10,
};

export const EUR: FiatCurrency = {
  name: "euro",
  symbol: "EUR",
  decimals: 10,
};

export const CNY: FiatCurrency = {
  name: "renminbi",
  symbol: "CNY",
  decimals: 10,
};

export const FIAT_CURRENCIES = [USD, EUR, CNY];

export const ETH: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.ETH,
  metadata: {
    coinGeckoID: "ethereum",
    coinGeckoPlatformID: "ethereum",
    tokenLists: [],
    websiteURL: "https://ethereum.org",
  },
};

export const BSC_Currency: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "BNB",
  symbol: "BNB",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.BNB,
  metadata: {
    coinGeckoID: "binancecoin",
    coinGeckoPlatformID: "binancecoin",
    tokenLists: [],
    websiteURL: "https://www.binance.com",
  },
};

export const MATIC: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Matic Token",
  symbol: "MATIC",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.MATIC,
  metadata: {
    coinGeckoID: "matic-network",
    coinGeckoPlatformID: "polygon-pos",
    tokenLists: [],
    websiteURL: "https://polygon.technology/",
  },
};

export const BTC: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Bitcoin",
  symbol: "BTC",
  decimals: 8,
  coinType: coinTypesByAssetSymbol.BTC,
  metadata: {
    coinGeckoID: "bitcoin",
    coinGeckoPlatformID: "bitcoin",
    tokenLists: [],
    websiteURL: "https://bitcoin.org",
  },
};

export const FTM: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Fantom",
  symbol: "FTM",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.FTM,
  metadata: {
    coinGeckoID: "fantom",
    coinGeckoPlatformID: "fantom",
    tokenLists: [],
    websiteURL: "https://fantom.foundation/",
  },
};

export const AVAX_Currency: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset =
  {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    coinType: coinTypesByAssetSymbol.AVAX,
    metadata: {
      coinGeckoID: "avalanche-2",
      coinGeckoPlatformID: "avalanche-2",
      tokenLists: [],
      websiteURL: "https://www.avax.network/",
    },
  };

export const Cronos_Currency: FungibleAsset &
  CoinGeckoAsset &
  NetworkBaseAsset = {
  name: "Cronos",
  symbol: "CRO",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.CRO,
  metadata: {
    coinGeckoID: "crypto-com-chain",
    coinGeckoPlatformID: "crypto-com-chain",
    tokenLists: [],
    websiteURL: "https://www.avax.network/",
  },
};

export const Aurora_Currency: FungibleAsset &
  CoinGeckoAsset &
  NetworkBaseAsset = {
  name: "Aurora",
  symbol: "AURORA",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.AVAX,
  metadata: {
    coinGeckoID: "aurora-near",
    coinGeckoPlatformID: "aurora-near",
    tokenLists: [],
    websiteURL: "https://www.avax.network/",
  },
};

export const BASE_ASSETS = [ETH, BTC, MATIC];

export const BASE_ASSETS_BY_SYMBOL = BASE_ASSETS.reduce<{
  [assetSymbol: string]: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset;
}>((acc, asset) => {
  const newAcc = {
    ...acc,
  };
  newAcc[asset.symbol] = asset;
  return newAcc;
}, {});
