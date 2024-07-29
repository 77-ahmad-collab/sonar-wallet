import { SupportedChainId } from "utils/constants";
import { EVMNetwork, Network } from "../networks";
import {
  AVAX_Currency,
  Aurora_Currency,
  BSC_Currency,
  BTC,
  Cronos_Currency,
  ETH,
  FTM,
  MATIC,
} from "./currencies";

export const ETHEREUM: EVMNetwork = {
  name: "Ethereum",
  baseAsset: ETH,
  chainID: "1",
  family: "EVM",
};

export const POLYGON: EVMNetwork = {
  name: "Polygon",
  baseAsset: MATIC,
  chainID: "137",
  family: "EVM",
};

export const Mumbai: EVMNetwork = {
  name: "Mumbai",
  baseAsset: MATIC,
  chainID: "80001",
  family: "EVM",
};

export const ARBITRUM_ONE: EVMNetwork = {
  name: "Arbitrum",
  baseAsset: ETH,
  chainID: "42161",
  family: "EVM",
};

export const OPTIMISM: EVMNetwork = {
  name: "Optimism",
  baseAsset: ETH,
  chainID: "10",
  family: "EVM",
};

export const GOERLI: EVMNetwork = {
  name: "Goerli",
  baseAsset: ETH,
  chainID: "5",
  family: "EVM",
};

export const KOVAN: EVMNetwork = {
  name: "Kovan",
  baseAsset: ETH,
  chainID: "42",
  family: "EVM",
};

export const BITCOIN: Network = {
  name: "Bitcoin",
  baseAsset: BTC,
  family: "BTC",
};

export const FORK: EVMNetwork = {
  name: "Ethereum",
  baseAsset: ETH,
  chainID: process.env.MAINNET_FORK_CHAIN_ID ?? "1337",
  family: "EVM",
};

export const BSC: EVMNetwork = {
  name: "Binance Smart Chain",
  baseAsset: BSC_Currency,
  family: "EVM",
  chainID: "56",
};

export const BSCT: EVMNetwork = {
  name: "Binance Smart Chain Testnet",
  baseAsset: BSC_Currency,
  family: "EVM",
  chainID: "97",
};

export const Fantom: EVMNetwork = {
  name: "Fantom",
  baseAsset: FTM,
  family: "EVM",
  chainID: "250",
};

export const FantomTestnet: EVMNetwork = {
  name: "Fantom Testnet",
  baseAsset: FTM,
  family: "EVM",
  chainID: "4002",
};

export const AVAX: EVMNetwork = {
  name: "Avalanche C-Chain",
  baseAsset: AVAX_Currency,
  family: "EVM",
  chainID: "43114",
};

export const AVAXT: EVMNetwork = {
  name: "Avalanche Fuji Testnet",
  baseAsset: AVAX_Currency,
  family: "EVM",
  chainID: "43113",
};

export const Cronos: EVMNetwork = {
  name: "Cronos Mainnet Beta",
  baseAsset: Cronos_Currency,
  family: "EVM",
  chainID: "25",
};

export const CronosT: EVMNetwork = {
  name: "Cronos Testnet",
  baseAsset: Cronos_Currency,
  family: "EVM",
  chainID: "338",
};

export const Aurora: EVMNetwork = {
  name: "Aurora Mainnet",
  baseAsset: Aurora_Currency,
  family: "EVM",
  chainID: "1313161554",
};

export const DAPP_SUPPORTED_NETWORKS_SONAR_WALLET: {
  [chainId: number]: EVMNetwork;
} = {
  [SupportedChainId.ETHEREUM_MAINNET]: ETHEREUM,
  [SupportedChainId.ETHEREUM_GOERLI]: GOERLI,
  [SupportedChainId.POLYGON_MAINNET]: POLYGON,
  [SupportedChainId.POLYGON_TESTNET]: Mumbai,
  [SupportedChainId.BINANCE_SMART_CHAIN]: BSC,
  [SupportedChainId.BSC_TESTNET]: BSCT,
  [SupportedChainId.AVALANCHE_MAINNET]: AVAX,
  [SupportedChainId.AVALANCHE_TESTNET]: AVAXT,
  [SupportedChainId.FANTOM_MAINNET]: Fantom,
  [SupportedChainId.FANTOM_TESTNET]: FantomTestnet,
  [SupportedChainId.CRONOS_MAINNET]: Cronos,
  // [SupportedChainId.CRONOS_TESTNET]: CronosT,
  [SupportedChainId.AURORA_MAINNET]: Aurora,
};
