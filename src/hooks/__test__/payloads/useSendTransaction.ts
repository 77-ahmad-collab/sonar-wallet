const systemProgram_transfer_return_value = {
  keys: [
    {
      pubkey: "BeeZ6MeKNYhsUHD9Ta8yHnvRX4YvDJkmzUgJ5c1uk5mB",
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
      isSigner: false,
      isWritable: true,
    },
  ],
  programId: "11111111111111111111111111111111",
  data: [2, 0, 0, 0, 128, 119, 142, 6, 0, 0, 0, 0],
};

const sendMoney_return_value = {
  transaction: {
    hash: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
  },
};

const functionCall_return_value = {
  transaction: {
    hash: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
  },
};

const connection_return_value = {
  provider: {
    txStatus: jest.fn().mockReturnValue({
      receipts_outcome: [
        {
          block_hash: "2rfxGVzWpDoTaUeqcdXPDctzH7mVzyAkpfbYcfGNJgu5",
          id: "C9xk7AhwJmGo2DaMErG7xiXyow52WPHo5ZDE3Jgj7sSs",
          outcome: {
            executor_id:
              "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
            gas_burnt: 424555062500,
            logs: [],
            metadata: { gas_profile: [], version: 1 },
            receipt_ids: ["F4iUCs52phTDEr1AsFx2vkJQ6tn3YEDqHzAGoKXrBk9S"],
            status: { SuccessValue: "" },
            tokens_burnt: "42455506250000000000",
          },
          proof: [
            {
              direction: "Right",
              hash: "4rzSe6J2RqNNhFE8BvJRErkwvEPYuZ1GeFysUE54muHi",
            },
            {
              direction: "Right",
              hash: "8NVBfrvPjrs4Tq1ZY4UG6VJK3jNzjp8Uj82wUAGnp1a4",
            },
            {
              direction: "Left",
              hash: "HEdobKCtmkRDLmTeb8e5j7fvpaKVe7feJnEJ6PP4pV7m",
            },
          ],
        },
        {
          block_hash: "CFkrcToi6CFJQkM5tPPYFNiK6frDJYYfD4RJ7n8hGGxh",
          id: "F4iUCs52phTDEr1AsFx2vkJQ6tn3YEDqHzAGoKXrBk9S",
          outcome: {
            executor_id:
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
            gas_burnt: 424555062500,
            logs: [],
            metadata: { gas_profile: [], version: 1 },
            receipt_ids: [],
            status: { SuccessValue: "" },
            tokens_burnt: "0",
          },
          proof: [
            {
              direction: "Left",
              hash: "CdRYHHamqBPK3rGvgBHYeQpQwUE9dcGBTZV3JVVVLDY4",
            },
            {
              direction: "Left",
              hash: "3SM6kqFqmopRpUrLKhENb5jSxouuacy8w8K5sAvPg9hG",
            },
          ],
        },
      ],
      status: { SuccessValue: "" },
      transaction: {
        actions: [{ Transfer: { deposit: "100000000000000000000" } }],
        hash: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
        nonce: 81143639000028,
        public_key: "ed25519:5iMxq1LUzy4Fx89HQCaPt8gea6xgAPcAGcdqDveUSXcY",
        receiver_id:
          "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
        signature:
          "ed25519:XpXvb1uVZTXZEi5dAX8XiYWijELw6N3o7CBjgDDJ4FoLv3KLJqrNy2TXLKRX1zi51hhA6rdz5cYy8GJNy35sfgG",
        signer_id:
          "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      },
      transaction_outcome: {
        block_hash: "4Fv7Kh9qsVMhLXhRjJ6xsWJpdkyhED26AnnkVoaYPA1R",
        id: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
        outcome: {
          executor_id:
            "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
          gas_burnt: 424555062500,
          logs: [],
          metadata: { gas_profile: null, version: 1 },
          receipt_ids: ["C9xk7AhwJmGo2DaMErG7xiXyow52WPHo5ZDE3Jgj7sSs"],
          status: {
            SuccessReceiptId: "C9xk7AhwJmGo2DaMErG7xiXyow52WPHo5ZDE3Jgj7sSs",
          },
          tokens_burnt: "42455506250000000000",
        },
        proof: [
          {
            direction: "Left",
            hash: "HmnFWBBwsexFEeaBNZFCPm3JgrSLfv1NhDaYo4gtotf8",
          },
          {
            direction: "Right",
            hash: "CPWKBNGbL6ux2qG51DPPBLUQ1aVZ1tBBViqvUTHQhRpz",
          },
          {
            direction: "Right",
            hash: "6S8bKHeL9UUh8ShnNqhPaUVXgjuKQvA2fokGJAXqNxAJ",
          },
        ],
      },
    }),
  },
};

const keyPair_value = {
  fromString: jest.fn().mockReturnValue({
    publicKey: {
      keyType: 0,
      data: {
        0: 70,
        1: 7,
        2: 67,
        3: 103,
        4: 230,
        5: 217,
        6: 206,
        7: 117,
        8: 118,
        9: 90,
        10: 16,
        11: 239,
        12: 157,
        13: 112,
        14: 100,
        15: 17,
        16: 235,
        17: 254,
        18: 233,
        19: 126,
        20: 50,
        21: 73,
        22: 107,
        23: 247,
        24: 183,
        25: 183,
        26: 30,
        27: 63,
        28: 18,
        29: 70,
        30: 118,
        31: 61,
      },
    },
    secretKey:
      "3V1EKJwptyYhHPbj1e1R4ksSd5rSEkSY8XmXYP6PGqeMVzw3B6bkkNQ1DkgktjRbLiiD8HVf2qhacKfqLy7t2dRe",
    getPublicKey: jest.fn().mockReturnValue({
      keyType: 0,
      data: {
        0: 70,
        1: 7,
        2: 67,
        3: 103,
        4: 230,
        5: 217,
        6: 206,
        7: 117,
        8: 118,
        9: 90,
        10: 16,
        11: 239,
        12: 157,
        13: 112,
        14: 100,
        15: 17,
        16: 235,
        17: 254,
        18: 233,
        19: 126,
        20: 50,
        21: 73,
        22: 107,
        23: 247,
        24: 183,
        25: 183,
        26: 30,
        27: 63,
        28: 18,
        29: 70,
        30: 118,
        31: 61,
      },
    }),
  }),
};

const tokenSelection1 = {
  token: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    image:
      "data:image/png;base64,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",
    chainId: 80001,
    multiAccountExist: false,
    coingeckoId: "matic-network",
  },
  from: {
    address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    name: "Account 1",
    balance: 0.12028425545734853,
    balanceInUsd: 0.1539638469854061,
    chainFamily: "EVM",
    walletName: "Wallet 1",
    rawBalance: "120284255457348529",
  },
  to: {
    address: "0x2d7044d07cEf44580F7780C829d6A10FDa34D5dd",
    amount: 0.3007106386433713,
    amountInUsd: 0.38490961746351526,
    ens: "",
  },
  error: {
    message: "",
    open: false,
  },
  transactionObject: {
    from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
    nonce: "0x3b",
    gasLimit: "0x5208",
    gasPrice: "0xee6b2800",
    to: "0x2d7044d07cEf44580F7780C829d6A10FDa34D5dd",
    value: "0x6ad57927a6e2ea",
  },
  hexData: "",
  makeTransaction: true,
  loading: false,
};

const tokenSelection2 = {
  token: {
    address: "near",
    name: "NEAR",
    symbol: "NEAR",
    decimals: 24,
    image:
      "data:image/png;base64,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",
    chainId: 101,
    multiAccountExist: false,
    coingeckoId: "near",
  },
  from: {
    address: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
    name: "Near Account 1",
    balance: 0.3637520457217527,
    balanceInUsd: 0.9312052370476869,
    chainFamily: "NEAR",
    walletName: "Wallet 1",
    rawBalance: "0.3637520457217527",
  },
  to: {
    address: "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
    amount: "0.00009093801143043817",
    amountInUsd: 0.00023280130926192172,
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

const tokenSelection3 = {
  token: {
    address: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    image:
      "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
    chainId: 101,
    multiAccountExist: false,
    coingeckoId: "dai",
  },
  from: {
    address: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
    name: "Near Account 1",
    balance: 0.26729491903460245,
    balanceInUsd: 0.267221947521706,
    chainFamily: "NEAR",
    walletName: "Wallet 1",
    rawBalance: "267294919034602424",
  },
  to: {
    address: "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
    amount: "0.001",
    amountInUsd: 0.000999727,
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

const tokenSelection4 = {
  token: {
    address: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    image:
      "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
    chainId: 101,
    multiAccountExist: false,
    coingeckoId: "dai",
  },
  from: {
    address: "",
    name: "Near Account 1",
    balance: 0.26729491903460245,
    balanceInUsd: 0.267221947521706,
    chainFamily: "NEAR",
    walletName: "Wallet 1",
    rawBalance: "267294919034602424",
  },
  to: {
    address: "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
    amount: "0.001",
    amountInUsd: 0.000999727,
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

const tokenSelection5 = {
  token: {
    address: "So11111111111111111111111111111111111111112",
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    image:
      "data:image/png;base64,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",
    chainId: 103,
    multiAccountExist: false,
    coingeckoId: "solana",
  },
  from: {
    address: "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
    name: "sol",
    balance: 0.44816315,
    balanceInUsd: 10.2226014515,
    chainFamily: "SOLANA",
    walletName: "Wallet 1",
    rawBalance: 448163150,
  },
  to: {
    address: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
    amount: "0.11",
    amountInUsd: 2.5090999999999997,
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

const tokenSelection6 = {
  token: {
    address: "7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx",
    name: "GMT",
    symbol: "GMT",
    decimals: 9,
    image:
      "https://assets.coingecko.com/coins/images/23597/thumb/gmt.png?1644658792",
    chainId: 103,
    multiAccountExist: false,
    coingeckoId: "stepn",
  },
  from: {
    address: "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
    name: "sol",
    balance: 0.335109083,
    balanceInUsd: 0.16799822592589198,
    chainFamily: "SOLANA",
    walletName: "Wallet 1",
    rawBalance: 0.335109083,
  },

  to: {
    address: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
    amount: "0.001",
    amountInUsd: 0.000501324,
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

const tokenSelection7 = {
  token: {
    address: "7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx",
    name: "GMT",
    symbol: "GMT",
    decimals: 9,
    image:
      "https://assets.coingecko.com/coins/images/23597/thumb/gmt.png?1644658792",
    chainId: 103,
    multiAccountExist: false,
    coingeckoId: "stepn",
  },
  from: {
    address: "",
    name: "sol",
    balance: 0.335109083,
    balanceInUsd: 0.16799822592589198,
    chainFamily: "SOLANA",
    walletName: "Wallet 1",
    rawBalance: 0.335109083,
  },

  to: {
    address: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
    amount: "0.001",
    amountInUsd: 0.000501324,
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
  systemProgram_transfer_return_value,
  sendMoney_return_value,
  functionCall_return_value,
  connection_return_value,
  keyPair_value,
  tokenSelection1,
  tokenSelection2,
  tokenSelection3,
  tokenSelection4,
  tokenSelection5,
  tokenSelection6,
  tokenSelection7,
};
