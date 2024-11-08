import { ethers } from "ethers";
import { NETWORKCHAIN } from "utils/constants";

const mockAccount1 = {
  getAccountBalance: jest.fn().mockResolvedValue({
    available: "100000000000000000000000000",
    stateStaked: "1000000000",
    total: "10000000000000000000000000000000",
  }),
};

const mockAccount2 = {
  getAccountBalance: jest.fn(() => ({
    available: -1000,
    stateStaked: 0,
    total: "10000000",
  })),
};
const ethersProvider = new ethers.providers.JsonRpcProvider(
  NETWORKCHAIN[56].NODE_URL
);

const dynamicBalanceChecker = {
  56: {
    addresses: ["0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"],
    contractAddress: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4",
    tokens: [
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
      "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    ],
    web3Instance: ethersProvider,
  },
};

const obj = {
  Polygon_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_MATIC: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    image:
      "data:image/png;base64,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",
    isActive: true,
    balance: 0.12028425545734853,
    balanceInUsd: 0.12196823503375141,
    rawBalance: "11110.01",
    accounts: {
      "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
        name: "string",
        walletName: "string",
        balance: 2,
        balanceInUsd: 1,
        rawBalance: "11110.01",
      },
    },
  },
  ETH_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    image:
      "data:image/png;base64,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",
    isActive: true,
    balance: 1.028425545734853,
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    balanceInUsd: 1.02196823503375141,
    rawBalance: "11110.01",
    accounts: {
      "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
        name: "string",
        walletName: "string",
        balance: 2,
        balanceInUsd: 1,
        rawBalance: "11110.01",
      },
    },
  },
};

export { mockAccount1, mockAccount2, dynamicBalanceChecker, obj };
