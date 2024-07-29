import { NETWORKCHAIN, SupportedChainId } from "./constants";

export const MAINNET_CHAINS = {
  [SupportedChainId.ETHEREUM_MAINNET]:
    NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET],
  [SupportedChainId.POLYGON_MAINNET]:
    NETWORKCHAIN[SupportedChainId.POLYGON_MAINNET],
  [SupportedChainId.BINANCE_SMART_CHAIN]:
    NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN],
  [SupportedChainId.FANTOM_MAINNET]:
    NETWORKCHAIN[SupportedChainId.FANTOM_MAINNET],
  [SupportedChainId.AURORA_MAINNET]:
    NETWORKCHAIN[SupportedChainId.AURORA_MAINNET],
  [SupportedChainId.AVALANCHE_MAINNET]:
    NETWORKCHAIN[SupportedChainId.AVALANCHE_MAINNET],
  [SupportedChainId.CRONOS_MAINNET]:
    NETWORKCHAIN[SupportedChainId.CRONOS_MAINNET],
  [SupportedChainId.SOLANA_MAINNET]:
    NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET],
  [SupportedChainId.NEAR]: NETWORKCHAIN[SupportedChainId.NEAR],
};

export const TESTNET_CHAINS = {
  // [SupportedChainId.ETHEREUM_RINKEBY]:
  //   NETWORKCHAIN[SupportedChainId.ETHEREUM_RINKEBY],
  // [SupportedChainId.ETHEREUM_ROPSTEN]:
  //   NETWORKCHAIN[SupportedChainId.ETHEREUM_ROPSTEN],
  [SupportedChainId.ETHEREUM_GOERLI]:
    NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI],
  [SupportedChainId.POLYGON_TESTNET]:
    NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET],
  [SupportedChainId.BSC_TESTNET]: NETWORKCHAIN[SupportedChainId.BSC_TESTNET],
  [SupportedChainId.FANTOM_TESTNET]:
    NETWORKCHAIN[SupportedChainId.FANTOM_TESTNET],
  // [SupportedChainId.AURORA_TESTNET]:
  //   NETWORKCHAIN[SupportedChainId.AURORA_TESTNET],
  [SupportedChainId.AVALANCHE_TESTNET]:
    NETWORKCHAIN[SupportedChainId.AVALANCHE_TESTNET],
  [SupportedChainId.CRONOS_TESTNET]:
    NETWORKCHAIN[SupportedChainId.CRONOS_TESTNET],
  [SupportedChainId.SOLANA_DEVNET]:
    NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET],
  // [SupportedChainId.NEAR_TESTNET]: NETWORKCHAIN[SupportedChainId.NEAR_TESTNET],
};

export const getMainNetConstants = () => {
  return MAINNET_CHAINS;
};
