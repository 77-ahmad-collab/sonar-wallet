import axios from "axios";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { Transaction as Tx } from "ethereumjs-tx";

import { StaticStore } from "store/store";
import { decryptMessage } from "utils";
import { EthersRPCProvider } from "interfaces";
import Common from "@ethereumjs/common";
import { CHAIN_TX, COINGECKO_ID } from "./constants";
import CachedService from "classes/cachedService";

const apiBaseUrl = "https://api.1inch.io/v5.0/";
const broadcastApiUrl = "https://tx-gateway.1inch.io/v1.1/";

const apiRequestUrl = (
  methodName: string,
  queryParams:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
) => {
  return (
    apiBaseUrl +
    methodName +
    "?" +
    new URLSearchParams(queryParams).toString() +
    `&timestamp=${new Date().getTime()}`
  );
};

/**
 * @description check user allowances
 * @param chainId number
 * @param tokenAddress string
 * @param walletAddress string
 * @returns string
 */
export const checkAllowance = (
  chainId: number,
  tokenAddress: string,
  walletAddress: string
) => {
  return axios
    .get(
      apiRequestUrl(`${chainId}/approve/allowance`, {
        tokenAddress,
        walletAddress,
      })
    )
    .then((res) => res.data.allowance);
};

/**
 * @description Gets the tokens prices from 1inch API endpoint
 * @param chainId number
 * @param fromTokenAddress string
 * @param toTokenAddress string
 * @param amount string
 * @param fee string
 * @returns Promise<any>
 */
export const findTheBestQuote = (
  chainId: number,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  fee: string
) => {
  return axios
    .get(
      apiRequestUrl(`${chainId}/quote`, {
        fromTokenAddress,
        toTokenAddress,
        amount,
        fee,
      })
    )
    .then((res) => res.data);
};

/**
 * @description Sign transactions and broadcast it to the blockchain then return transaction Hash
 * @param chainId number
 * @param provider EthersRPCProvider
 * @param walletAddress string
 * @param transaction TransactionRequest
 * @returns transactionHash
 */
export const signAndSendTransaction = async (
  chainId: number,
  provider: EthersRPCProvider,
  walletAddress: string,
  transaction: TransactionRequest
) => {
  const hashedPassword = CachedService.getHashedPassword();
  const { accounts } = StaticStore.getState().newWallet;
  const { NETWORKCHAIN } = StaticStore.getState().app;

  const fromPrivateKey = decryptMessage(
    accounts[walletAddress].secret,
    hashedPassword
  );

  //for local node
  // if (
  //   chainId === SupportedChainId.ETHEREUM_MAINNET ||
  //   chainId === SupportedChainId.BINANCE_SMART_CHAIN ||
  //   chainId === SupportedChainId.FANTOM_MAINNET
  // ) {
  //   const txx = await new ethers.Wallet(
  //     fromPrivateKey,
  //     provider
  //   ).signTransaction(transaction);
  //   console.log(txx, "txx");
  //   const { hash } = await provider.sendTransaction(txx);
  //   console.log("hash", hash);
  //   return hash;
  // }

  const chainTx = NETWORKCHAIN[chainId][CHAIN_TX];
  const coingeckoID = NETWORKCHAIN[chainId][COINGECKO_ID];

  let common;
  if (coingeckoID === "ethereum") {
    common = new Common({ chain: chainTx });
  } else {
    //@ts-ignore
    common = Common.custom(chainTx);
  }

  //@ts-ignore
  const tx = new Tx(transaction, { common: common });
  // sign the transaction
  tx.sign(Buffer.from(fromPrivateKey, "hex"));

  // send the transaction
  // return await broadCastRawTransaction(
  //   chainId,
  //   "0x" + tx.serialize().toString("hex")
  // );
  const { hash } = await provider.sendTransaction(
    "0x" + tx.serialize().toString("hex")
  );

  return hash;
};

/**
 * @description Broadcast Raw transaction to the blockchain
 * @param chainId number
 * @param rawTransaction string | undefined
 * @returns transaction Hash
 */
export const broadCastRawTransaction = async (
  chainId: number,
  rawTransaction: string | undefined
) => {
  console.log("here broadCastRawTransaction");

  const postData = JSON.stringify({ rawTransaction });
  const axiosConfig = {
    headers: { "Content-Type": "application/json" },
  };

  return axios
    .post(`${broadcastApiUrl}${chainId}/broadcast`, postData, axiosConfig)
    .then((response) => response.data.transactionHash);
};

/**
 * @description Get raw data from 1inch API for Approval Transaction and return TransactionRequest
 * @param chainId number
 * @param provider EthersRPCProvider
 * @param tokenAddress string
 * @param walletAddress string
 * @returns TransactionRequest
 */
export const buildTxForApproveTradeWithRouter = async (
  chainId: number,
  provider: EthersRPCProvider,
  tokenAddress: string,
  walletAddress: string
) => {
  const { networkFeeSettings } = StaticStore.getState().app;
  const { gasInfo, feeType } = networkFeeSettings;

  const url = apiRequestUrl(`${chainId}/approve/transaction`, { tokenAddress });

  const transaction: TransactionRequest = await axios
    .get(url)
    .then((res) => res.data);

  const gasLimit = await provider.estimateGas({
    ...transaction,
    from: walletAddress,
  });
  const txCount = await provider.getTransactionCount(walletAddress);
  console.log("Approval tx", transaction);

  return {
    ...transaction,
    nonce: ethers.utils.hexlify(txCount),
    gasLimit: ethers.utils.hexlify(gasLimit),
    gasPrice: ethers.utils
      .parseUnits(gasInfo[feeType].gwei.toString(), "gwei")
      .toHexString(),
    value: ethers.utils
      .parseEther(transaction?.value?.toString() ?? "0")
      .toHexString(),
  };
};

/**
 * @description Get Quotation from 1Inch API then return TransactionRequest
 * @param chainId number
 * @param provider
 * @param fromTokenAddress string
 * @param toTokenAddress string
 * @param amount string
 * @param fromAddress string
 * @param slippage string
 * @param referrerAddress string
 * @param fee string
 * @param gasPrice string
 * @returns TransactionRequest
 */
export const buildTxForSwap = async (
  chainId: number,
  provider: EthersRPCProvider,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  fromAddress: string,
  slippage: string,
  referrerAddress: string,
  fee: string,
  gasPrice: string
) => {
  const { networkFeeSettings } = StaticStore.getState().app;
  const { gasInfo, feeType } = networkFeeSettings;

  const compatibilityMode = "true";

  const url = apiRequestUrl(`${chainId}/swap`, {
    fromTokenAddress,
    toTokenAddress,
    amount,
    fromAddress,
    slippage,
    referrerAddress,
    fee,
    gasPrice,
    compatibilityMode,
  });

  const swap = await axios.get(url).then((res) => res.data);

  const tx = swap.tx;
  // const gasLimit = await provider.estimateGas({
  //   ...tx,
  //   from: fromAddress,
  // });
  const txCount = await provider.getTransactionCount(fromAddress);

  return {
    ...swap,
    tx: {
      nonce: ethers.utils.hexlify(txCount),
      // gasLimit: ethers.utils.hexlify(gasLimit),
      gasLimit: ethers.utils.hexlify(tx.gas),
      gasPrice: ethers.utils
        .parseUnits(gasInfo[feeType].gwei.toString(), "gwei")
        .toHexString(),
      value: ethers.utils
        .parseEther(ethers.utils.formatEther(tx.value))
        .toHexString(),
      data: tx.data,
      from: tx.from,
      to: tx.to,
    },
  };
};

//!not in use
// export const getGasUnitForTxSwap = async (
//   chainId: number,
//   provider: EthersRPCProvider,
//   fromTokenAddress: string,
//   toTokenAddress: string,
//   amount: string,
//   fromAddress: string,
//   slippage: string,
//   referrerAddress: string,
//   fee: string,
//   gasPrice: string
// ) => {
//   const url = apiRequestUrl(`${chainId}/swap`, {
//     fromTokenAddress,
//     toTokenAddress,
//     amount,
//     fromAddress,
//     slippage,
//     referrerAddress,
//     fee,
//     gasPrice,
//   });

//   const swap = await axios.get(url).then((res) => res.data);

//   const tx = swap.tx;
//   const gasLimit = await provider.estimateGas({
//     ...tx,
//     from: fromAddress,
//   });

//   return {
//     ...tx,
//     gas: gasLimit.toNumber(),
//   };
// };
