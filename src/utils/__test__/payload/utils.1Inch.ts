const mockedTxData = {
  data: {
    tx: {
      gas: 21000,
      from: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
      to: "0x2d7044d07cEf44580F7780C829d6A10FDa34D5dd",
      value: "1000000000000000",
      data: "f86d4184b2d05e0083016378942d7044d07cef44580f7780c829d6a10fda34d5dd86b5e620f480008083027126a09d8925d84ed764bc73788f2466c66860656de63e21ed5d1a0ba8a295bd7b5be3a010256dfaa36fa806792bc0845cee2c2a3ad754bab272e8e8e1646fa2dcbd137b",
    },
  },
};

const amount = "1000000";
const slippage = "3";
const fee = "0.2";
const gasPrice = "14000000000";
const referrerAddress = "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847";
const fromAddress = "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847";
const fromTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const toTokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const findTheBestQuoteData = {
  chainId: 1,
  fromTokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  toTokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  amount: "10000000000000",
  fee: "2",
  data: {
    data: {
      allowance: 1220,
      status: 200,
    },
  },
};
const findTheBestQuoteData_wrongInput = {
  chainId: 0,
  fromTokenAddress: "0x12345",
  toTokenAddress: "0x67891",
  amount: "100",
  fee: "2",
  data: {
    data: {
      allowance: 1220,
      status: 400,
    },
  },
};

export {
  mockedTxData,
  amount,
  fee,
  fromAddress,
  fromTokenAddress,
  gasPrice,
  referrerAddress,
  slippage,
  toTokenAddress,
  findTheBestQuoteData,
  findTheBestQuoteData_wrongInput,
};
