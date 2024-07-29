import { ethers } from "ethers";

import {
  ACTIVITY_STATUS_TYPES,
  NATIVE_TOKEN_ADDRESS,
  NETWORKCHAIN,
  TX_TYPES,
  Tx_METHODS,
} from "utils/constants";

const payload1 = {
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  web3: new ethers.providers.JsonRpcProvider(NETWORKCHAIN[5].NODE_URL),
  transaction: {
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
  // chainId: 5,
  // method: Tx_METHODS.normal,
  // nonce: 75,
  // to: "0x68b000F8e550b8FAAfAaADCcEBd244c7ac390F06",
  // transactionHash:
  //   "0xb2c79b490609b998dc48831c39a9038a548442efc72e90869949e400120add0d",
  // txType: TX_TYPES.Sent,
};

const payload2 = {
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  web3: new ethers.providers.JsonRpcProvider(NETWORKCHAIN[5].NODE_URL),
  transaction: {
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
  // chainId: 5,
  // method: Tx_METHODS.normal,
  // nonce: 30,
  // to: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  // transactionHash:
  //   "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad53",
  // txType: TX_TYPES.Swap,
};

const payload3 = {
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  web3: new ethers.providers.JsonRpcProvider(NETWORKCHAIN[1].NODE_URL),
  transaction: {
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
  // chainId: 1,
  // method: Tx_METHODS.cancel,
  // nonce: 31,
  // to: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  // transactionHash:
  //   "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad54",
  // txType: TX_TYPES.Sent,
};

const payload4 = {
  address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
  transaction: {
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
  // chainId: 5,

  // transactionHash:
  //   "0xd94454f7065da86e339da08c2b59989f882e6225baba5850b459dc76be342ee6",
  // nonce: 25,
  // txType: TX_TYPES.Sent,
};

export { payload1, payload2, payload3, payload4 };
