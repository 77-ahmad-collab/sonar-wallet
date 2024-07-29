import { AppReduxState, DappSlice, NewWalletState } from "interfaces";
import {
  ACTIVITY_STATUS_TYPES,
  DUMMY_IMAGE_URL,
  NATIVE_TOKEN_ADDRESS,
  NETWORKCHAIN,
  TX_TYPES,
  Tx_METHODS,
  rpcsList,
} from "utils/constants";

export const AppStoreMockState: AppReduxState = {
  welcomeMessage: "I've never been on this system",
  isTestnet: false,
  isLoggedIn: true,
  isUserExists: true,
  colorTheme: "dark",
  graphQueryData: {
    ethereum: 0.009445909083512708,
    binancecoin: 0.15661977249507847,
    "crypto-com-chain": 17.415075290771846,
    fantom: 4.6455,
    "avalanche-2": 2.919750546874999,
    "matic-network": 0.12028425545734853,
  },
  graphData: [
    86.733198590309, 87.16722447743855, 86.10671653504934, 86.32285406600221,
    85.81903686713758, 84.1747213464945, 83.39135881101473, 82.89091274854431,
    85.16974157909438, 89.86469039674785, 89.48333295925191, 94.68701683880806,
    94.41351382271718, 106.30183567142494, 114.00436682629503,
  ],
  password: "Ahmed123*",
  isLoading: false,
  isNewWallet: false,
  isUserSavedMnemonic: false,
  generatedMnemonic:
    "U2FsdGVkX18DTYHU/pzM9WcyybPXtzQgdqVHSxlsUyopaghU8b+sOZ3ZATF2o6jIu3luzatPs9GNuujBv+M2uqu2T9CHANcif28tacNYkOuKg3uuXVhgJKOYomG2vgBi",
  isHoldFinish: false,
  expirationTime: 1673960512414,
  hashedPassword:
    "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35",
  showModalWalletNetwork: false,
  totalSum: 114.4480710259932,
  totalFilteredSum: 114.4480710259932,
  profit: {
    amount: 27.27,
    symbol: "",
    status: true,
  },
  isSendSnackBarOpen: false,
  isSwapSnackBarOpen: false,
  pendingTransactionLoaderStatus: false,
  addressBook: {},
  networkFeeSettings: {
    feeType: 1,
    gasInfo: {
      "0": {
        usd: 0,
        gwei: 0,
        time: 0,
      },
      "1": {
        usd: 0,
        gwei: 0,
        time: 0,
      },
      "2": {
        usd: 0,
        gwei: 0,
        time: 0,
      },
      "3": {
        usd: 0,
        gwei: 0,
        time: 0,
      },
    },
  },
  isSlideAnimationCompleted: false,
  slideAnimation: "contract",
  isTransactionCompleted: false,
  lastReceivedTransactionTime: 1673314288000,
  snackBarMessage: "Transaction has been completed",
  slippageToleranceSettings: {
    slippageType: 1,
    txDeadline: "1673957444259",
    slippageTolerance: {
      "0": {
        value: 0,
      },
      "1": {
        value: 0,
      },
      "2": {
        value: 0,
      },
      "3": {
        value: 0,
      },
    },
  },

  selectedInputId: "",
  recentSearchedKeywords: [],
  showGraph: false,
  alert: {
    open: false,
    heading: "Success",
    body: "Wallet Imported Successfully",
  },
  failedModalAlert: {
    open: false,
    funds: 0,
    gas: 0,
    message: "",
  },
  walletCreatedAlert: false,
  navigationPath: "/index.html",
  derivationPathSolana: "",
  seedPhraseExpirationTime: 1673957144259,
  isFirstWalletImported: true,
  inProgressTransactionHashes: {
    5: {
      75: [
        "0xb2c79b490609b998dc48831c39a9038a548442efc72e90869949e400120add0d",
      ],
      30: [
        "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad53",
      ],
      25: [
        "0xd94454f7065da86e339da08c2b59989f882e6225baba5850b459dc76be342ee6",
      ],
      26: [
        "0x11317877b8e78595a1228aac252c5293b25a08052c42a47b3f6ba78ec15d48ac",
      ],
      27: [
        "0xc2c6d9f844ba28e8d88687c31d7b7da17e39e7ddc089909fb14f553f756dcb84",
      ],
    },
    1: {
      31: [
        "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad54",
      ],
    },
    80001: {
      65: [
        "0x03ed4f6dd95087eb945ad854f93d175cfd8748ef35c8a26e8f4d38cb82f3c331",
      ],
    },
    56: {
      1: ["0x14259ddfc0a9228565790e42256094a3efff4b64369bc578dd717728d03a74c7"],
    },
  },
  loginExpiryPeriod: 3600000,
  networkFeePreference: 1,
  isDappRoutes: false,
  transactionTrigerredMessage: "",
  swapImportedTokens: [
    {
      address: NATIVE_TOKEN_ADDRESS,
      chainId: 1,
      decimals: 18,
      logoURI: DUMMY_IMAGE_URL,
      name: "Ethereum",
      symbol: "ETH",
    },
  ],
  txIntervalList: [],
  minimumSolTokenBalance: 0,
  NETWORKCHAIN,
  rpcsList,
  nonNativeDefaultAndTopTokens: {
    expiry: new Date().getTime(),
    tokens: {},
  },
  TokensToBeAddedInEachAccount: [],
};

export const NewWalletMockState: NewWalletState = {
  allWallets: {
    "2a6280e4-e1b0-4750-837f-28e0660470dd": {
      name: "Wallet 1",
      walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
      seedphrase:
        "U2FsdGVkX18DTYHU/pzM9WcyybPXtzQgdqVHSxlsUyopaghU8b+sOZ3ZATF2o6jIu3luzatPs9GNuujBv+M2uqu2T9CHANcif28tacNYkOuKg3uuXVhgJKOYomG2vgBi",
      EVM: ["0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"],
      SOLANA: ["EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q"],
      NEAR: [
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      ],
      balanceInUsd: 0,
    },
    "c5121ff6-8d02-43d1-a026-e10a42ba3471": {
      name: "New Wallet",
      walletId: "c5121ff6-8d02-43d1-a026-e10a42ba3471",
      seedphrase:
        "U2FsdGVkX1/JqtNzhrLAdHJIPdGxfdWY267U7YFDWlZd0ZkdVoFJ4pX1oY8lFGTH4K+HYVhkR040XI4WCDDtGHurHpBIViWAYc5VEZotoauCkZNmSi09lv3+QnI46d7+eQpuV2ma1k1IfCOprmHX+w==",
      EVM: ["0xa22920874156B8F80b8E22280828cB12185bD1A4"],
      SOLANA: ["D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3"],
      NEAR: [
        "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559",
      ],
      balanceInUsd: 0,
    },
  },
  accounts: {
    "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
      name: "Account 1",
      address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
      secret:
        "U2FsdGVkX18cU7wEPSE+XgadbD0++M0U6DvXz/Gjt1r2iUbaIzSb3DD/+MXh+XKL/kcvnYwEUEjWO9ol6X0M5H4haqIW++OYGOuq7undfgNPCf/Nr8UjpDSGK2Br80Y3",
      walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
      createdAt: 1673956876251,
      isImported: false,
      chainFamily: "EVM",
      balanceInUsd: 0,
    },
    EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
      name: "Account 1",
      address: "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
      secret:
        "U2FsdGVkX1/ZQfccndXkaFf/8yw0IKkOfJ5Y6mp4VVrrIFZwAs1xAtlkIJ+mNcPdm10X/hYUAyNrYPskBNNnc1Xp1lEvLNvBCtlnyTQm76ZsY7AxSTFdImhjfMsNQVeCi6EELMP6adtQdZcK5ESM+A==",
      createdAt: 1673956876397,
      isImported: false,
      walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
      chainFamily: "SOLANA",
      balanceInUsd: 0,
      derivationpath: "m/44'/501'/0'",
    },
    "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti": {
      name: "Account 1",
      address: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
      secret:
        "U2FsdGVkX1/ZQfccndXkaFf/8yw0IKkOfJ5Y6mp4VVrrIFZwAs1xAtlkIJ+mNcPdm10X/hYUAyNrYPskBNNnc1Xp1lEvLNvBCtlnyTQm76ZsY7AxSTFdImhjfMsNQVeCi6EELMP6adtQdZcK5ESM+A==",
      createdAt: 1673956876397,
      isImported: false,
      walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
      chainFamily: "SOLANA",
      balanceInUsd: 0,
      derivationpath: "m/44'/501'/0'",
    },
    "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
      name: "Near Account 1",
      address:
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      secret:
        "U2FsdGVkX18pm1XwLMCW6noTwTXe8QgW5KoLYNA/TgDzD9UmmSClBjLVAhlP6NMaS3GtBk29ouWuQevuj5ZJiAvhflmRdABj8COO/IA7Ycg8uH8jKqXq7OGcHfg8kfR66d+VzjMSDnScX+fl/t4GYnUaOF7fJ2UmCOGebv5ktbY=",
      createdAt: 1673956876486,
      walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
      isImported: false,
      chainFamily: "NEAR",
      balanceInUsd: 0,
    },
    "0xa22920874156B8F80b8E22280828cB12185bD1A4": {
      name: "Account 1",
      address: "0xa22920874156B8F80b8E22280828cB12185bD1A4",
      secret:
        "U2FsdGVkX18pIoF0UDpbgL+1L2Tv1PWWEDvcPp33P0MO1nMSQc37jo8AxIw2keEK81+HsvG+mEHNJbxd1og0/wmxY3yoKK5/3Khj9R3J7BHsGr/ZQxI3Y9QmzAJIo//a",
      walletId: "c5121ff6-8d02-43d1-a026-e10a42ba3471",
      createdAt: 1673956912218,
      isImported: false,
      chainFamily: "EVM",
      balanceInUsd: 0,
    },
    D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3: {
      name: "Account 1",
      address: "D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3",
      secret:
        "U2FsdGVkX18STeheqX0l4rJqxv9CSbZfoPSdrhAciV58u3tGuFKWLNRi+UA30R+jb+YKcemiCWhlNIWAnRTV/Rw5488odPf8ZjPqmUXSbd+t2vPTzlD6he7KWzyXVW605lvGiG6BadII6QfcoKLm5A==",
      createdAt: 1673956912286,
      isImported: false,
      walletId: "c5121ff6-8d02-43d1-a026-e10a42ba3471",
      chainFamily: "SOLANA",
      balanceInUsd: 0,
      derivationpath: "m/44'/501'/0'",
    },
    "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559": {
      name: "Near Account 1",
      address:
        "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559",
      secret:
        "U2FsdGVkX1/IkxvCPxykoHuXEctTx8ME+wQXbUY/wNEkSx8jrmea+UoL+WaRpKt/i3C9Ty2irVC1HAqjQjrIefFlVHJz111yZrHaAtCpUUfub7+FfyOTAo3wFHwK9tCV7MY6/0crwdV9ena+Z4kqfs3jJrN0ywf5wTSRBdXMeDc=",
      createdAt: 1673956912387,
      walletId: "c5121ff6-8d02-43d1-a026-e10a42ba3471",
      isImported: false,
      chainFamily: "NEAR",
      balanceInUsd: 0,
    },
  },
  tokenHoldings: {
    "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
      "1": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "0",
          symbol: "ETH",
        },
        "0xC7B89491Bb148551547837ea6ccB4Bb5144d8E47": {
          rawAmount: "0",

          symbol: "ePING",
        },
        "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
          symbol: "USDT",
          rawAmount: "0",
        },
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": {
          symbol: "USDC",
          rawAmount: "0",
        },
      },
      "5": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "9445909083512708",
          symbol: "ETH",
        },
      },
      "25": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "0",
          symbol: "CRO",
        },
      },
      "56": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "9967765000000000",

          symbol: "BNB",
        },
        "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5": {
          rawAmount: "8384549",

          symbol: "PING",
        },
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": {
          rawAmount: "0",

          symbol: "BUSD",
        },
        "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": {
          rawAmount: "0",

          symbol: "Cake",
        },
      },
      "97": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "156619772495078459",

          symbol: "BNB",
        },
      },
      "137": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "0",

          symbol: "MATIC",
        },
      },
      "250": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "0",

          symbol: "FTM",
        },
      },
      "338": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "17415075290771846300",

          symbol: "CRO",
        },
      },
      "4002": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "4645500000000000000",

          symbol: "FTM",
        },
      },
      "43113": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "2919750546874999400",

          symbol: "AVAX",
        },
      },
      "43114": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "0",

          symbol: "AVAX",
        },
        "0xb54f16fB19478766A268F172C9480f8da1a7c9C3": {
          rawAmount: "31441",

          symbol: "TIME",
        },
      },
      "80001": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "120284255457348529",

          symbol: "MATIC",
        },
      },
      "1313161554": {
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          rawAmount: "0",

          symbol: "ETH",
        },
      },
    },
    "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
      "101": {
        near: {
          rawAmount: "994837982944607",

          symbol: "NEAR",
        },
        "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near": {
          rawAmount: "0",

          symbol: "USDC.e",
        },
        "wrap.near": {
          rawAmount: "0",

          symbol: "wNEAR",
        },
        "usdt.tether-token.near": {
          rawAmount: "0",

          symbol: "USDt",
        },
        "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near": {
          rawAmount: "0",

          symbol: "USDT.e",
        },
      },
    },
    EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
      "102": {
        So11111111111111111111111111111111111111112: {
          rawAmount: "0",

          symbol: "SOL",
        },
      },
      "103": {
        So11111111111111111111111111111111111111112: {
          rawAmount: "0",

          symbol: "SOL",
        },
      },
    },
  },
  tokenInfo: {
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_ETH": {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      isActive: true,
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
      coingeckoId: "ethereum",
      price: 1567.6,
    },
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_MATIC": {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      isActive: true,
      image:
        "data:image/png;base64,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",
      coingeckoId: "matic-network",
      price: 1.014,
    },
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_BNB": {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      isActive: true,
      image:
        "data:image/png;base64,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",
      coingeckoId: "binancecoin",
      price: 301.91,
    },
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_FTM": {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      isActive: true,
      image: "/images/40755d1e29ac5914081c.png",
      coingeckoId: "fantom",
      price: 0.328207,
    },
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_CRO": {
      name: "CRONOS",
      symbol: "CRO",
      decimals: 18,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      isActive: true,
      image:
        "data:image/png;base64,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",
      coingeckoId: "crypto-com-chain",
      price: 0.078389,
    },
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_AVAX": {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      isActive: true,
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAArjSURBVHgB7Z1bcBvVGcf/e3ZXlmTJkRJbiZ1ANiaXCYFcSrl1pkXmmoTQOEAIhZDYjgtJWrBdZtonJkqnpTxhZ2gfaEPiQIGQPsRhaIHOMFZapvQGNVMeoJRmQ5wYXyVbjm7W7vYcAZ44tq67WtlOfjMeWdpPo/Ffe/a77jGHInKqrs7lWrTIG/voI4mLRNdwdpukDo9I0DRwdrsERfnSkOPAqVpQjcdl4rAHNUWRyaJFp0GIv/zGG7u4+vogigQHE2GCOQFvorfXSyXZrEWjEvTCxHU6ZN5q9Sux2ImwJPmXtLWZJqgpAvbv3u1V+webMDLs1RIJFwoIcbsBJdFOrl13ovxnvg4UmIIJeKq52eU4d65Ji8aa1VCooKKlgrNaZc5Rut/Z0OC3bdggowAYLmDA53NhYKgp/umnzVo8VhThpkAWF0vt89oP7YfBGCrgQMP365SzZ/Zp8biEaQjndMr83Hn7y9sPtcMgDBGwp65OEoLDh5XhYS9mAMLCqo6x0dGWyo4OGTrRLeDg1m1NiWDAV2jnYDScKAa5ue4Wz9Gj7dBB3gImnUR39z5lKNDM4rYZCQ2B+PkL2ipefbkFeZKXgJFXX5WGj7zUgVh0DWYB/MKqLmHp0i1un09GjuQsYE9trURi8U5DguBpBHMw6tUrayqfeUbO6X25GPd4vRJH+E66ZCXMRggva87SmlycC8nWkHlajp/F4jFURSLxsU72t2b7lqwE7Nm9W+LO9XRCncXifYUWiUhcb19npLVVysY+KwH5/sEOjI1JMBmupCT5Yzr0+j76/r+OBw4fzhiaZRSw7847W9WhQdO9reX661H+8m8x78UjsN56K8xGOdu9NuE/uS+TXVoB+zZurFPHEs0wGeJ0ouxHLSBz54KvqEBZSzOIxwOzUc6caQ489VTavz+lgMzjamOJVhSB0rqdNMCdP/6cKy2F4+GHYTo0QYj/5b19tEAipTJJKaBQ4WktRnrGV1XBdtddk1633bMJltXXwmw0VXUlPv74cKrjUwrYt3VrnTIwUIsiUPbE46ycP+Uxx569KAZKb5834Ptp3VTHphRQGwllvHgWAnHVKlhuuCH18RXLYb39dhSD+Af/3Bc4fnzSipwk4OD2HcWp59HE3vnooxnNSh9+CJzLDbPRQqOS2tk5yaFMEDBy6pQ0dra7DkXAvnEjxGuvyWgnLF4M+90bUAwSstwUaG2dcBZOEDD0gye89EGCybBguXTnjqztHQ0NIOXlMBt6FrrQ2z/hLJwgoCaQolz7HPX1uQnClvuuBhSDxLmzTRc+HxdwYM+eWi0UkmAyhMZ7Nrp8c8VKQx3LqqthNjS4dvU3Nnq/fj4uoCJ/XpSwxdlQD9p6RD7Ytz9CA0ceZsOFw+NnYVLAQG2tCzzZCZMRly2D9Y47kC8l31g3IWMxC3V4xJts3+IrARWPx6udPw+zce7ZDV2IYlGciRoOM/G87PcvBewfNH352tbfBXHtWuiF47OuCRtKrKvLyx6Tn84J/C0wEdp/QOn27dCNqkIdCqAY0F7IZvZIArQ9abb3tdPCACsa6CX+/gdInD6NYsDxgsSugyQ6EFyrxWIwC0KFK33gAeiGlppGDx1CsVCHhuh1yOYlBKoXJuKkGQdXVga9RE+exNgnn6CYxD7okoja0yPBJITqakOqKVo4jJFf/grFhoTDawgnWhbDJMoe/2EyDdNL9O0/QmNLqMhwVotEOItgStXZ6r0F4hr9vSm1txehF1/EdIA4HBIhFouEAsOqLY7HHoMRhNqPQBsexnRAGRkBUU2YIrVv3mxIysVCltg772DaIFokAfExFBIybx7sW++HEYw8+yxooyutjbh6NRyPbEfiv5/h/GvHoAYLGGhTZyYUerbP2diYFFEv8ffew9i/P0prw1dWwv30z5NNKct11yXboUz0gkEdItEsIgqFsHAhSmq80IsWjSL0/K8z2pXS3vGFHT3bprshXpO5TZAv7LMIB05GgShraQFnsUAvkTffROLzz9PalNx0Y7JAcTHJig9n6Cz9OJwoBAlns6EQsCUk0nqdXtRgEOeP/S6tDfuSHPRSATK5MiOuXAn7li0oBGrovEwQicowGHbtce7dAyM4/8KhZOyXDtumTcksJxXJVqgB6eMkNDVIlHDY8HKG7bZbISxZAr3Q/gMinZ1pbVhBtfR7D6a3cbvhrCtAwV1JyISzWrtgIGyyyr5tG4wg9JuDybw3HSxkycbLWzdsoD3lK2Ek3JIlp0nJsuUyDKR0165kOKGX+N//gdi776a1YU32bDt6LBtiTs1QLBY/gfyZn3M4YATJyarbb4MRhJ5/PqON84nHc+rKsSC75Fs3wwjYShNWreoi7o6OoBaPyzAANtuSarIqFyJv/B6JU6fS2lhramBZl7uXd+7dC0NOGIdDdtfXB7/0+6p2AjphU1Ul3/k29KIODGA0Q7WFfUn5dvTYKrHffx/0wjsdfvaYFFBYWu2HHtioReMuGEH49deTIqbDft+9utqZpffeC+FKfQ5FmzMnedIlBeR7evy0PZj3bfJsolRYuhR6Ubq7Ec4QNDMHxQTQA1vCpQ8+iHzh6ZfH2+1+9ntSQHYdhNN5Enli++490A1tUYYO0rAlHk9rZtuwHtycOdCL9c47QCoqkA+ckmh3+3zJE24891E1rQ15wums6LCu4PDTv0DsT3/OwjYOI2BlMU7Mo5DC7vBc981xnzEhy+5/YFtA6e/PucAqLl+Osqam5KQVJwiZ78BjgisKlEAAsb/+jfY43kaCZh3ZwM6aMpomshyXJgG5FwroZ7PPDR87RosUbyFXiMcje147Op5mTRSwsdGnfPa/oswIzhRI5YJ6zyuvtI8/v/CgkHC0sTu5cZlUyBUvvOC/8IUJArrb24JYMP8ALjMl/FXVR2j5T77wtUkFNEt1dRtEUcZlJkBcLrni4EHfpNcvfoG5Z2HFcsP3V5npkPmeKTVJ6cL6Ntd2qiMjXlwGwqIrOspfOjJlWTvldKJos9ZTdS95h0KvecGx0HDKOlhKAd1Hj8rCVdWX9lJmO8O55qbdoCdjFPrFlvvaEAw04VLEZj+w4A9v5He/8NeULL7CR1xuQ8v+MwFyxZUfZhIvaZfJwN3WFhRXLNtyKYU2nLVEFleuyGrwPutEsmd9rURbeJ00CZcwm7FY5JJ1N9W4n8luF6PcNt5Zv17i4vFOaObfkGgGtEEvq7FoTaXfL2f7npxusqh86y1Z83hq2CmOWUZy66fKBTmJl3wf8qCnuVniu7uPq4ND+u+UmQbQAu2HZT/5ca3t5ptl5IiuqZsZH+LQOE+oWniAv63G585zK2XdY0t9G++p0+LRVk1RZtQGjMRmDaKqar/n4MG8K/EMY7YApc6FNprbtIHBzZgBEE+FX6ysrKchmgydGDo41/fQQ3VqILAP0ZiEaQir5dGa3v7y555rh0EUZPKwf8cOn3Kmm41DSZgG0EZ80LLq6gOulSvbjN42vmAbcUcOH5ZCJ054tUi0aNsi0yJokHM6Dgi0SPx1G9JoTNkKfuDJJ2vHPv5PLRH4ndrICAoJZykJ8nPK/HxV5QF6jfOjwJj8zwiaXfbeT7yc1V5Lz8pbtEhYMuIuAc5ukzmOO0GqqvxsYsA92/4ZQSrY/baJL75Yi3jCq57rXswJoqSNjrpQYpVAONe4uDzPBi1lEB58WRlNtyIy7Ql/KK5eLSMYNFWwi/k/BqqpPIC2ADIAAAAASUVORK5CYII=",
      coingeckoId: "avalanche-2",
      price: 16.9,
    },
    near_NEAR: {
      name: "NEAR",
      symbol: "NEAR",
      decimals: 24,
      address: "near",
      isActive: true,
      image:
        "data:image/png;base64,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",
      coingeckoId: "near",
      price: 2.23,
    },
    So11111111111111111111111111111111111111112_SOL: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
      address: "So11111111111111111111111111111111111111112",
      isActive: true,
      image:
        "data:image/png;base64,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",
      coingeckoId: "solana",
      price: 23.76,
    },
    "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5_PING": {
      name: "PING",
      symbol: "PING",
      decimals: 9,
      address: "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
      isActive: true,
      image: "/images/f5579e3d76e8eed53b0e.png",
      coingeckoId: "sonar",
      price: 0.00083465,
    },
    "0xC7B89491Bb148551547837ea6ccB4Bb5144d8E47_ePING": {
      name: "ePING",
      symbol: "ePING",
      decimals: 9,
      address: "0xC7B89491Bb148551547837ea6ccB4Bb5144d8E47",
      isActive: true,
      image: "/images/a50794537f8cf722c8fa.png",
      coingeckoId: "",
      price: 0,
    },
    "0xdAC17F958D2ee523a2206206994597C13D831ec7_USDT": {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      isActive: true,
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      coingeckoId: "tether",
      price: 0.999322,
    },
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56_BUSD": {
      name: "Binance USD",
      symbol: "BUSD",
      decimals: 18,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      isActive: true,
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
      coingeckoId: "binance-usd",
      price: 1.001,
    },
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48_USDC": {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      isActive: true,
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      coingeckoId: "usd-coin",
      price: 0.999348,
    },
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82_Cake": {
      name: "PancakeSwap Token",
      symbol: "Cake",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
      decimals: 18,
      address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      isActive: false,
      coingeckoId: "pancakeswap-token",
      price: 3.75,
    },
    "0xb54f16fB19478766A268F172C9480f8da1a7c9C3_TIME": {
      name: "Time",
      symbol: "TIME",
      image: "",
      decimals: 9,
      address: "0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
      isActive: false,
      coingeckoId: "wonderland",
      price: 11.64,
    },
    "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near_USDC.e": {
      name: "USD Coin",
      symbol: "USDC.e",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      decimals: 6,
      address: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
      isActive: true,
      coingeckoId: "usd-coin",
      price: 0.999348,
    },
    "wrap.near_wNEAR": {
      name: "Wrapped NEAR fungible token",
      symbol: "wNEAR",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      decimals: 24,
      address: "wrap.near",
      isActive: false,
      coingeckoId: "wrapped-near",
      price: 2.22,
    },
    /**
     * @Ahmed
     */
    // "usdt.tether-token.near_USDt": {
    //   name: "Tether USD",
    //   symbol: "USDt",
    //   image:
    //     "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
    //   decimals: 6,
    //   address: "usdt.tether-token.near",
    //   isActive: false,
    //   coingeckoId: "",
    //   price: 0,
    // },
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU_USDC": {
      name: "USD Coin",
      symbol: "USDC",
      image:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      decimals: 6,
      address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      isActive: true,
      coingeckoId: "usd-coin",
      price: 0.999348,
    },
    "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near_USDT.e": {
      name: "Tether USD",
      symbol: "USDT.e",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      decimals: 6,
      address: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
      isActive: false,
      coingeckoId: "tether",
      price: 0.999322,
    },
  },
  filteredAccounts: {
    "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
      isSelected: true,
    },
    EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
      isSelected: true,
    },
    "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
      isSelected: true,
    },
    "0xa22920874156B8F80b8E22280828cB12185bD1A4": {
      isSelected: true,
    },
    D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3: {
      isSelected: true,
    },
    "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559": {
      isSelected: true,
    },
  },
  accountsSum: {
    "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
      balanceInUsd: 114.4480710259932,
    },
    EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
      balanceInUsd: 0,
    },
    "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
      balanceInUsd: 0,
    },
    "0xa22920874156B8F80b8E22280828cB12185bD1A4": {
      balanceInUsd: 0,
    },
    D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3: {
      balanceInUsd: 0,
    },
    "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559": {
      balanceInUsd: 0,
    },
  },
  walletsSum: {
    "2a6280e4-e1b0-4750-837f-28e0660470dd": {
      balanceInUsd: 114.4480710259932,
    },
    "c5121ff6-8d02-43d1-a026-e10a42ba3471": {
      balanceInUsd: 0,
    },
  },
  filteredHoldings: {
    "5": {
      name: "Ethereum Görli Chain",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
      balanceInUsd: 14.80740707931452,
      tokens: {
        Ethereum_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_ETH: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          isActive: true,
          balance: 0.009445909083512708,
          balanceInUsd: 14.80740707931452,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.009445909083512708,
              balanceInUsd: 14.80740707931452,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "97": {
      name: "Binance Smart Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 47.28507551398914,
      tokens: {
        BNB_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_BNB: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 0.15661977249507847,
          balanceInUsd: 47.28507551398914,
          rawBalance: "1111111",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.15661977249507847,
              balanceInUsd: 47.28507551398914,
              walletName: "Wallet 1",
              rawBalance: "1111111",
            },
          },
        },
      },
    },
    "102": {
      name: "Solana Chain Devnet",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 0,
      tokens: {
        Solana_So11111111111111111111111111111111111111112_SOL: {
          address: "So11111111111111111111111111111111111111112",
          name: "Solana",
          symbol: "SOL",
          decimals: 9,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 0,
          balanceInUsd: 0,
          accounts: {},
          rawBalance: "1122",
        },
      },
    },
    "338": {
      name: "Cronos Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 1.3651503369683142,
      tokens: {
        CRONOS_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_CRO: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "CRONOS",
          symbol: "CRO",
          decimals: 18,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 17.415075290771846,
          balanceInUsd: 1.3651503369683142,
          rawBalance: "111",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 17.415075290771846,
              balanceInUsd: 1.3651503369683142,
              walletName: "Wallet 1",
              rawBalance: "1211",
            },
          },
        },
      },
    },
    "4002": {
      name: "Fantom Chain",
      image: "/images/40755d1e29ac5914081c.png",
      balanceInUsd: 1.5246856185000002,
      tokens: {
        Fantom_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_FTM: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Fantom",
          symbol: "FTM",
          decimals: 18,
          image: "/images/40755d1e29ac5914081c.png",
          isActive: true,
          balance: 4.6455,
          balanceInUsd: 1.5246856185000002,
          rawBalance: "112",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 4.6455,
              balanceInUsd: 1.5246856185000002,
              walletName: "Wallet 1",
              rawBalance: "222",
            },
          },
        },
      },
    },
    "43113": {
      name: "Avalanche Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 49.34378424218748,
      tokens: {
        Avalanche_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_AVAX: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Avalanche",
          symbol: "AVAX",
          decimals: 18,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 2.919750546874999,
          balanceInUsd: 49.34378424218748,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 2.919750546874999,
              balanceInUsd: 49.34378424218748,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "80001": {
      name: "Polygon Mumbai Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 0.12196823503375141,
      tokens: {
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
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.12028425545734853,
              balanceInUsd: 0.12196823503375141,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
  },
  secondaryHoldings: {
    "5": {
      name: "Ethereum Görli Chain",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
      balanceInUsd: 14.80740707931452,
      tokens: {
        Ethereum_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_ETH: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          isActive: true,
          balance: 0.009445909083512708,
          balanceInUsd: 14.80740707931452,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.009445909083512708,
              balanceInUsd: 14.80740707931452,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "1": {
      name: "Ethereum Görli Chain",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
      balanceInUsd: 14.80740707931452,
      tokens: {
        Ethereum_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_ETH: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          isActive: true,
          balance: 0.009445909083512708,
          balanceInUsd: 14.80740707931452,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.009445909083512708,
              balanceInUsd: 14.80740707931452,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "97": {
      name: "Binance Smart Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 47.28507551398914,
      tokens: {
        BNB_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_BNB: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 0.15661977249507847,
          balanceInUsd: 47.28507551398914,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.15661977249507847,
              balanceInUsd: 47.28507551398914,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "102": {
      name: "Solana Chain Devnet",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 0,
      tokens: {
        Solana_So11111111111111111111111111111111111111112_SOL: {
          address: "So11111111111111111111111111111111111111112",
          name: "Solana",
          symbol: "SOL",
          decimals: 9,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 0,
          balanceInUsd: 0,
          accounts: {},
          rawBalance: "55333",
        },
      },
    },
    "338": {
      name: "Cronos Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 1.3651503369683142,
      tokens: {
        CRONOS_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_CRO: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "CRONOS",
          symbol: "CRO",
          decimals: 18,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 17.415075290771846,
          balanceInUsd: 1.3651503369683142,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 17.415075290771846,
              balanceInUsd: 1.3651503369683142,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "4002": {
      name: "Fantom Chain",
      image: "/images/40755d1e29ac5914081c.png",
      balanceInUsd: 1.5246856185000002,
      tokens: {
        Fantom_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_FTM: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Fantom",
          symbol: "FTM",
          decimals: 18,
          image: "/images/40755d1e29ac5914081c.png",
          isActive: true,
          balance: 4.6455,
          balanceInUsd: 1.5246856185000002,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 4.6455,
              balanceInUsd: 1.5246856185000002,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "43113": {
      name: "Avalanche Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 49.34378424218748,
      tokens: {
        Avalanche_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE_AVAX: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Avalanche",
          symbol: "AVAX",
          decimals: 18,
          image:
            "data:image/png;base64,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",
          isActive: true,
          balance: 2.919750546874999,
          balanceInUsd: 49.34378424218748,
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 2.919750546874999,
              balanceInUsd: 49.34378424218748,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
    "80001": {
      name: "Polygon Mumbai Chain",
      image:
        "data:image/png;base64,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",
      balanceInUsd: 0.12196823503375141,
      tokens: {
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
          rawBalance: "55333",
          accounts: {
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
              name: "Account 1",
              balance: 0.12028425545734853,
              balanceInUsd: 0.12196823503375141,
              walletName: "Wallet 1",
              rawBalance: "55333",
            },
          },
        },
      },
    },
  },
  tokenSelected: {
    token: {
      address: "",
      name: "",
      symbol: "",
      decimals: 18,
      image: "",
      chainId: 0,
      multiAccountExist: false,
      coingeckoId: "",
      price: 0,
    },
    from: {
      address: "",
      name: "",
      balance: 0,
      balanceInUsd: 0,
      chainFamily: "",
      walletName: "",
      rawBalance: "",
      nativeTokenBalance: 0,
      nativeTokenBalanceInRaw: "",
    },
    to: {
      address: "",
      amount: 0,
      amountInUsd: 0,
      ens: "",
    },
    error: {
      message: "",
      open: false,
    },
    transactionObject: {
      from: "",
      nonce: "",
      gasLimit: "",
      gasPrice: "",
      to: "",
      value: "",
    },
    hexData: "",
    makeTransaction: true,
    loading: false,
  },
  activity: {
    "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
      101: {
        "4Tnv1D1BAZUHwFzAsp7RFjnrYWQKs168a4PaVHP6pqSf": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
          token: {
            address: "near",
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,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",
            name: "NEAR",
            symbol: "NEAR",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 1,
          chainId: 101,
          transactionHash: "4Tnv1D1BAZUHwFzAsp7RFjnrYWQKs168a4PaVHP6pqSf",
          address:
            "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.success,
          tokenB: {
            address:
              "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: false,
        },
        "6szqxzWh4w8h61mQXb7WicXHeaJTRnMk2vp8w8XuwAy4": {
          txType: TX_TYPES.Received,
          from: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
          to: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
          token: {
            name: "NEAR",
            symbol: "NEAR",
            address: "near",
            image:
              "data:image/png;base64,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",
            amount: 0.0001,
            amountInUsd: 0.0003,
            decimal: 24,
          },
          transactionFeeInUsd: 0.0001,
          timeStamp: 1674209311472,
          nonce: 0,
          chainId: 101,
          transactionHash: "6szqxzWh4w8h61mQXb7WicXHeaJTRnMk2vp8w8XuwAy4",
          address:
            "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.success,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: false,
        },
      },
    },
    "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
      1: {
        "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad54": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
          token: {
            address: NATIVE_TOKEN_ADDRESS,
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,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",
            name: "ETH",
            symbol: "ETH",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 31,
          chainId: 5,
          transactionHash:
            "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad54",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.cancel,
          isDappTransaction: true,
        },
      },
      5: {
        "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad53": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
          token: {
            address: NATIVE_TOKEN_ADDRESS,
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,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",
            name: "ETH",
            symbol: "ETH",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 30,
          chainId: 5,
          transactionHash:
            "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad53",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: true,
        },

        "0xb2c79b490609b998dc48831c39a9038a548442efc72e90869949e400120add0d": {
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
          nonce: 75,
          chainId: 5,
          transactionHash:
            "0xb2c79b490609b998dc48831c39a9038a548442efc72e90869949e400120add0d",
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
        "0xd94454f7065da86e339da08c2b59989f882e6225baba5850b459dc76be342ee6": {
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
          nonce: 25,
          chainId: 5,
          transactionHash:
            "0xd94454f7065da86e339da08c2b59989f882e6225baba5850b459dc76be342ee6",
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
        "0x11317877b8e78595a1228aac252c5293b25a08052c42a47b3f6ba78ec15d48ac": {
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
      },
      56: {
        "0x14259ddfc0a9228565790e42256094a3efff4b64369bc578dd717728d03a74c7": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
          token: {
            address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAgaSURBVHgB7Z1diExvHMd/s0UblilJ3qdIXLD/lQsXsrOKvFysf0kKmZAk2c1LSrS7REJ2l0RJ3i+4YeUGMVy4kGi5oBTnIIlkFxGF3//3O2fO/mdmZ87zMudtd33q15lmnnPOM9953n6/53nOxCBEEDFOhyRZgqwyc0xkPk7kJe8kM7OOr8jukLXHYrFOCIkYBEiWYGy10F0kXUywxWzjY5iC+gIJlyS7TNaBwXCKbBH0ZLi0kTUEKFohDLIUWQJ6ChgN4fIxyBog6qD9axsYXQyyFEQNylSCLI09B26PExAFKCN1GK3qKgvnOQVhgXZb14w9n2YoAa1xINrF/wrYg9/eQDvZvzR+NEERZQEz4qXBu0FwVDDJalRFVBKwF4vnYIKiiNIC9gHxHExQEFFKwD4knoMJkiLKCsiNbG/pMGTh71wjCkyUgYBMN9/XxGP+ISvN/UPbNZPi9u3bOG/ePBw+fDiWl5djRUUFVldX48mTJzFMjh8/buUjHo/jyJEjcc6cOXjv3j2VS9SDDmi7Z1IeRlNTE/IpxWzZsmX4588fDJJv377h/Pnzi+Zp165dspdiDRKgCtr+opB0Ou0qnmPbt2/HINm2bZswT1xrJEmDCqhQdWfPni0lIFtzczCe3/3796XyM3fuXJXLpkAWVAhJcdsiK2C/fv3w1q1b6CdcdROJhFR+hg4dqnJpA+0pCaF4DQoXlRbPsVGjRqFhGOgXW7ZsUcqPIo0i8bjjMFSuqCogG5eQT58+odfItsclCMgdStxNQOm2z0FHQLaZM2fijx8/0Cu+fv0qXXVLEJBpdBPQQEV0BWTzsmfesGGDVh406Cgm3iLUoBQB2bzomW/cuKF9f02ShQQ8jRq4ZW7FihU4efJk4Ze4evUq6vL+/fuiVbehoUHYqWhyOV+8OGrilrkTJ05YPe6wYcNc0/Fw4sWLF6jDmjVrul2vrKwMjx49an2+f/9+PwTM7UxQs/oyIgGZBw8e4KBBg1zTcinq6FCbm2prayv4Y1y/fr0rjU8CMtbKByca4+syiOnTp8OhQ4dc05imCQsXLoRfv36BDG/evIG6urqc9+hHAPJCgDwMCIBk1yssYTIcJEqgw+bNm4Xt4aZNm6Tuu3r16pzzKisrrfYwHx9LoOGIp93+MSoCMkuXLhWK2NLS4nrPCxcu5KSvra0tOjD3UUAm7qyc0kZVwM7OTpw4caLreRQFzmnHsnn9+nVOr8vjP7dQmc8CLirLqcsBMGTIECBxgBr7omn4d1myZAlQD97tMxLEai8ZiunBkSNHgASHkEiwgAkIGG7sb968CQMGDCia5vPnz0ChMqB2Lef98ePHA0WA4Ny5c7Bz504ImUr+tdNYAqBYhbPhsRoI2sNp06aVFM32uQqnuQSKY1w+sX79etixY4drmkePHlnpIko4VTib3bt3w/Lly13T0MQQHDx4EKJIqCXQgWbugMZxrmm2bt0K5HlAxEgI54WDoH///nDt2jUYPXq0a7pUKgXPnj2DKBEJARkWj0XkHrYYNIa03L2PHz9CVIiMgAxX42PHjrmm4bEhTeBDVGABTYgQ5OoJx3cPHz6MSs/cGakS6MAexuLFi13TcEnds2cPhIwZuRLowJ7GlClTXNPwGPLixYsQIlYJfAUhc/jwYctHbm1t7XqvvLzc6lRGjBjheu66devg+fPnEBJWCWyHEGlqarICo1++fAEKSeV8NnbsWKC5XqAQfdHzuWeuqamxAqwh8KqkcD4Dmr4wzwmvXLkyJ6T/4cOHgmnPnz8v9JmnTp2KP3/+7Hauz75wMvCAKvP27VtrzV522rt377reh5ejiURctWpVt/N8D6iCfRUDNVEVkGJ5OGnSpJx0GzdulLpXfhi/kPFUZja+h/QzAragJioCtre3W4uLstNw1aXYn9S9qJ3EqqoqoYiXLl3qOsdHAU+xdk7rfAd85syZMzBjxgyg6pvzPg9DBg8eLHWNiooKK5rNAVk31q5dC0+ePAGf+T+ygXY7qLVhECRK4IEDBwp+LjsDl8/Tp09x4MCBrvceM2aM1db6WAJznXZ64wpqAIL2iBcQFfqMq+73799Rl7NnzwqrMld38mj8EPAU5IOas3OiL1HMeLVCqezbt0/7/iUKWHghAmpUY51M84Ifryi0NsZnAQ0oBn3YiIqoZpirrpdbHrgHl+mZPRQw5SagcmeimmEeynjNu3fvcNy4cUEIaKBozwgqlkKVzOYPcr3k5cuX1u4onwVsBBFol0JD9oq8nEwmoxMmTMDfv3+jn/AAWkU83qKhgAGyoMJic96sIsooTRppL6BUZe/evdIC8iYhBVKgAkquWOCNM6KMNjYq900lUV9fLyWgKICRxWVQBRU2G7pFSjhk5XfVzYfDWgsWLHAVz/fNhhkR62XvwltIuTrzllJuWyjIiRSWxzBhV3LWrFnW8mLegstbcXkHp8ImQyblppFwXRhdoIUOddA3aY3FYq77hWUEZKc5DfYO7r7EYxJP+J2F05qZZwb8CxGdvfMJEyQX3v997El3TPD6sScOfUBEE/x68I5DLxbRBI1HPykv7cjcoAZCnk/2mMegIR6jtTaGb0RWRS9boefD3yGpI54noO0399QHMOo9E8Zr0Hb7tOZUQiKNUXyyL/59CK03oB2UNTA6cHXlPIW+oF4atKt12CWy5wlXCLRXgJ3GYGDR+LFVSQiAsP6MgP3MavD2zwisPyKAgP+MILRtjkxGUI54JMnGgS1oPOuYjZl1ZHucOYb67w3/ATaekrCeauj8AAAAAElFTkSuQmCC",
            name: "WETH",
            symbol: "WETH",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 1,
          chainId: 56,
          transactionHash:
            "0x14259ddfc0a9228565790e42256094a3efff4b64369bc578dd717728d03a74c7",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: false,
        },
        "0xc4de04fc31623bfc003f1e509c210ab1b4ed624319767f4b337ce80f63551cc6": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
          token: {
            address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAgaSURBVHgB7Z1diExvHMd/s0UblilJ3qdIXLD/lQsXsrOKvFysf0kKmZAk2c1LSrS7REJ2l0RJ3i+4YeUGMVy4kGi5oBTnIIlkFxGF3//3O2fO/mdmZ87zMudtd33q15lmnnPOM9953n6/53nOxCBEEDFOhyRZgqwyc0xkPk7kJe8kM7OOr8jukLXHYrFOCIkYBEiWYGy10F0kXUywxWzjY5iC+gIJlyS7TNaBwXCKbBH0ZLi0kTUEKFohDLIUWQJ6ChgN4fIxyBog6qD9axsYXQyyFEQNylSCLI09B26PExAFKCN1GK3qKgvnOQVhgXZb14w9n2YoAa1xINrF/wrYg9/eQDvZvzR+NEERZQEz4qXBu0FwVDDJalRFVBKwF4vnYIKiiNIC9gHxHExQEFFKwD4knoMJkiLKCsiNbG/pMGTh71wjCkyUgYBMN9/XxGP+ISvN/UPbNZPi9u3bOG/ePBw+fDiWl5djRUUFVldX48mTJzFMjh8/buUjHo/jyJEjcc6cOXjv3j2VS9SDDmi7Z1IeRlNTE/IpxWzZsmX4588fDJJv377h/Pnzi+Zp165dspdiDRKgCtr+opB0Ou0qnmPbt2/HINm2bZswT1xrJEmDCqhQdWfPni0lIFtzczCe3/3796XyM3fuXJXLpkAWVAhJcdsiK2C/fv3w1q1b6CdcdROJhFR+hg4dqnJpA+0pCaF4DQoXlRbPsVGjRqFhGOgXW7ZsUcqPIo0i8bjjMFSuqCogG5eQT58+odfItsclCMgdStxNQOm2z0FHQLaZM2fijx8/0Cu+fv0qXXVLEJBpdBPQQEV0BWTzsmfesGGDVh406Cgm3iLUoBQB2bzomW/cuKF9f02ShQQ8jRq4ZW7FihU4efJk4Ze4evUq6vL+/fuiVbehoUHYqWhyOV+8OGrilrkTJ05YPe6wYcNc0/Fw4sWLF6jDmjVrul2vrKwMjx49an2+f/9+PwTM7UxQs/oyIgGZBw8e4KBBg1zTcinq6FCbm2prayv4Y1y/fr0rjU8CMtbKByca4+syiOnTp8OhQ4dc05imCQsXLoRfv36BDG/evIG6urqc9+hHAPJCgDwMCIBk1yssYTIcJEqgw+bNm4Xt4aZNm6Tuu3r16pzzKisrrfYwHx9LoOGIp93+MSoCMkuXLhWK2NLS4nrPCxcu5KSvra0tOjD3UUAm7qyc0kZVwM7OTpw4caLreRQFzmnHsnn9+nVOr8vjP7dQmc8CLirLqcsBMGTIECBxgBr7omn4d1myZAlQD97tMxLEai8ZiunBkSNHgASHkEiwgAkIGG7sb968CQMGDCia5vPnz0ChMqB2Lef98ePHA0WA4Ny5c7Bz504ImUr+tdNYAqBYhbPhsRoI2sNp06aVFM32uQqnuQSKY1w+sX79etixY4drmkePHlnpIko4VTib3bt3w/Lly13T0MQQHDx4EKJIqCXQgWbugMZxrmm2bt0K5HlAxEgI54WDoH///nDt2jUYPXq0a7pUKgXPnj2DKBEJARkWj0XkHrYYNIa03L2PHz9CVIiMgAxX42PHjrmm4bEhTeBDVGABTYgQ5OoJx3cPHz6MSs/cGakS6MAexuLFi13TcEnds2cPhIwZuRLowJ7GlClTXNPwGPLixYsQIlYJfAUhc/jwYctHbm1t7XqvvLzc6lRGjBjheu66devg+fPnEBJWCWyHEGlqarICo1++fAEKSeV8NnbsWKC5XqAQfdHzuWeuqamxAqwh8KqkcD4Dmr4wzwmvXLkyJ6T/4cOHgmnPnz8v9JmnTp2KP3/+7Hauz75wMvCAKvP27VtrzV522rt377reh5ejiURctWpVt/N8D6iCfRUDNVEVkGJ5OGnSpJx0GzdulLpXfhi/kPFUZja+h/QzAragJioCtre3W4uLstNw1aXYn9S9qJ3EqqoqoYiXLl3qOsdHAU+xdk7rfAd85syZMzBjxgyg6pvzPg9DBg8eLHWNiooKK5rNAVk31q5dC0+ePAGf+T+ygXY7qLVhECRK4IEDBwp+LjsDl8/Tp09x4MCBrvceM2aM1db6WAJznXZ64wpqAIL2iBcQFfqMq+73799Rl7NnzwqrMld38mj8EPAU5IOas3OiL1HMeLVCqezbt0/7/iUKWHghAmpUY51M84Ifryi0NsZnAQ0oBn3YiIqoZpirrpdbHrgHl+mZPRQw5SagcmeimmEeynjNu3fvcNy4cUEIaKBozwgqlkKVzOYPcr3k5cuX1u4onwVsBBFol0JD9oq8nEwmoxMmTMDfv3+jn/AAWkU83qKhgAGyoMJic96sIsooTRppL6BUZe/evdIC8iYhBVKgAkquWOCNM6KMNjYq900lUV9fLyWgKICRxWVQBRU2G7pFSjhk5XfVzYfDWgsWLHAVz/fNhhkR62XvwltIuTrzllJuWyjIiRSWxzBhV3LWrFnW8mLegstbcXkHp8ImQyblppFwXRhdoIUOddA3aY3FYq77hWUEZKc5DfYO7r7EYxJP+J2F05qZZwb8CxGdvfMJEyQX3v997El3TPD6sScOfUBEE/x68I5DLxbRBI1HPykv7cjcoAZCnk/2mMegIR6jtTaGb0RWRS9boefD3yGpI54noO0399QHMOo9E8Zr0Hb7tOZUQiKNUXyyL/59CK03oB2UNTA6cHXlPIW+oF4atKt12CWy5wlXCLRXgJ3GYGDR+LFVSQiAsP6MgP3MavD2zwisPyKAgP+MILRtjkxGUI54JMnGgS1oPOuYjZl1ZHucOYb67w3/ATaekrCeauj8AAAAAElFTkSuQmCC",
            name: "WETH",
            symbol: "WETH",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 1,
          chainId: 56,
          transactionHash:
            "0xc4de04fc31623bfc003f1e509c210ab1b4ed624319767f4b337ce80f63551cc6",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: false,
        },
        "0xc97bc320bd1e4e8b28c74f7860dc49e9b08aaf76f11dca02831e4008f6c9e0d9": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
          token: {
            address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,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",
            name: "WETH",
            symbol: "WETH",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 1,
          chainId: 56,
          transactionHash:
            "0xc97bc320bd1e4e8b28c74f7860dc49e9b08aaf76f11dca02831e4008f6c9e0d9",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: true,
        },
        "0xbcd22a765ee66419c2fb742cbf017c20603cebb9b6beed14ecf1458187cb78bb": {
          txType: TX_TYPES.Swap,
          from: "Wallet 1",
          to: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
          token: {
            address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            amount: 0.0001,
            amountInUsd: 0.000207,
            decimal: 24,
            image:
              "data:image/png;base64,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",
            name: "WETH",
            symbol: "WETH",
          },
          transactionFeeInUsd: 0,
          timeStamp: 1674209386088,
          nonce: 1,
          chainId: 56,
          transactionHash:
            "0xbcd22a765ee66419c2fb742cbf017c20603cebb9b6beed14ecf1458187cb78bb",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: false,
          isCancelEnabled: false,
          status: ACTIVITY_STATUS_TYPES.pending,
          tokenB: {
            address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
            amount: 0.000291003279247147,
            amountInUsd: 0,
            decimal: 18,
            image:
              "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F4B731' fill-rule='nonzero' cx='16' cy='16' r='16'/%3E%3Cpath d='M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E",
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          makerBalance: 0.37976346881694606,
          makerBalanceInUsd: 0.7861103804510783,
          takerBalance: 0.000291003279247147,
          takerBalanceInUsd: 0,
          tokenAprice: 2.07,
          tokenBprice: 0,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: true,
        },
      },
      80001: {
        "0x03ed4f6dd95087eb945ad854f93d175cfd8748ef35c8a26e8f4d38cb82f3c331": {
          txType: TX_TYPES.Sent,
          from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          to: "0x2d7044d07cEf44580F7780C829d6A10FDa34D5dd",
          token: {
            name: "Polygon",
            symbol: "MATIC",
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            image:
              "data:image/png;base64,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",
            amount: 0.0002,
            amountInUsd: 0.000266,
            decimal: 18,
          },
          transactionFeeInUsd: 0.00002869076,
          timeStamp: 1675937682785,
          nonce: 65,
          chainId: 80001,
          transactionHash: "",
          address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          isSpeedUpEnabled: true,
          isCancelEnabled: true,
          rawData: {
            transactionObject: {
              from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
              nonce: "0x41",
              gasLimit: "0x5208",
              gasPrice: "0x3b9aca00",
              to: "0x2d7044d07cEf44580F7780C829d6A10FDa34D5dd",
              value: "0xb5e620f48000",
            },
            chainId: 80001,
          },
          status: ACTIVITY_STATUS_TYPES.pending,
          walletName: "Wallet 1",
          receiverNameInTheAddressBook: "a",
          senderNameInTheAddressBook: "",
          txMethod: Tx_METHODS.normal,
          isDappTransaction: false,
        },
      },
    },
  },
  swapSelectedTokens: {
    account: {
      address: "",
      name: "",
      walletName: "",
      chainFamily: "",
      nativeTokenBalance: 0,
      nativeTokenSymbol: "",
      nativeTokenBalanceInRaw: "",
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
    },
    tokenA: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      balance: 0.001,
      balanceInUsd: 0.0,

      chainId: 1,
      reflectionExists: false,
      isNative: true,

      coingeckoId: "ethereum",
      rawBalance: "",
      price: 0,
    },
    tokenB: {
      address: "",
      name: "",
      symbol: "",
      decimals: 1,
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      balance: 0,
      balanceInUsd: 0,

      chainId: 0,
      reflectionExists: false,
      isNative: false,
      rawBalance: "",
      coingeckoId: "",
      price: 0,
    },
    warning: "",
    error: {
      message: "",
      open: false,
    },
    txDeadline: "1673957633634",
    transactionObject: {},
    hexData: "",
    makeTransaction: false,
    allowance: 0,
    loading: false,
    initialSlippage: 0,
    transactionsRef: [],
  },
  numOfTokens: {
    active: 7,
    inActive: 0,
    total: 7,
  },
  filteredWallets: {
    "2a6280e4-e1b0-4750-837f-28e0660470dd": {
      "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
        isSelected: true,
      },
      EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
        isSelected: true,
      },
      "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
        isSelected: true,
      },
    },
    "c5121ff6-8d02-43d1-a026-e10a42ba3471": {
      "0xa22920874156B8F80b8E22280828cB12185bD1A4": {
        isSelected: true,
      },
      D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3: {
        isSelected: true,
      },
      "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559": {
        isSelected: true,
      },
    },
  },
};

export const dappInfoMockState: DappSlice = {
  defaultWallet: "false",
  dAppNetwork: "",
  method: "",
  route: "",
  dAppConnectAddress: "",
  origin: "",
  signedData: null,
  dappMethodParam: [],
  signTypedData: null,
  permission: {
    origin: "test",
    accountAddress: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    chainID: "1",
    faviconUrl: "ddd",
    key: "test",
    state: "allow",
    title: "tetsing",
  },
  transactionObject: {},
  permChangeNetwork: "false",
  popupClosingAfterConfirm: false,
};
