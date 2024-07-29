const AURORA_MAINNET = {
  data: {
    speeds: {
      1: {
        gasPrice: 1,
      },
      2: {
        gasPrice: 1,
      },
      3: {
        gasPrice: 2,
      },
    },
  },
};

const CRONOS_MAINNET = {
  data: {
    result: "1000000000",
  },
};

const POLYGON_MAINNET = {
  data: {
    result: {
      SafeGasPrice: 1,
      ProposeGasPrice: 1.5,
      FastGasPrice: 2,
    },
  },
};

const BINANCE_MAINNET = {
  data: {
    result: {
      SafeGasPrice: 1,
      ProposeGasPrice: 1.5,
      FastGasPrice: 2,
    },
  },
};

const ETHEREUM_MAINNET = {
  data: {
    result: {
      SafeGasPrice: 10,
      ProposeGasPrice: 12,
      FastGasPrice: 15,
    },
  },
};

const addGas_payload = {
  chainId: 1,
  estimateGas: 21000,
};

const check_estimate_payload = {
  tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  chainId: 56,
};

const calculateNonEvmGasFee_payload = {
  gas: 1232,
  chainId: 102,
};

export {
  AURORA_MAINNET,
  CRONOS_MAINNET,
  POLYGON_MAINNET,
  BINANCE_MAINNET,
  ETHEREUM_MAINNET,
  addGas_payload,
  check_estimate_payload,
  calculateNonEvmGasFee_payload,
};
