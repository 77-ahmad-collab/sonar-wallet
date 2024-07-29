import { ethers, utils } from "ethers";
import axios from "axios";

import {
  AVG_GAS_FEE,
  GAS_PRIORITY_FEE,
  GAS_UNITS,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NODE_URL,
  SupportedChainId,
} from "./constants";
import { getDetailSingleTokenInfo } from "./utils.api";
import { StaticStore } from "store/store";
import { GasInfo, NetworkFeeTypeChosen } from "interfaces";
import { initializeWalletWithAddress } from "./utils.web3";
import { BASE_URL } from "../api";
import { toReadableAmount } from "./formatters";
const { abi } = require("abis/erc20abi.json");

/**
 * /**
 * Calculates the gas price in GWEI and usd for a given chain ID.
 * Also calculate the estimated time.
 * @param { number } chainId - The chain ID for which to calculate gas price
 * @param { number } estimateGas - The estimated gas to be used for the transaction
 * After formulating the object, it will be returned
 * @return { GasInfo } gasInfo - An object with information about the gas prices for the chain
 */
export const addGas = async (chainId: number, estimateGas: number) => {
  const gasPrice = await calculateGasSpeed(chainId, estimateGas);

  // console.log("gassPrices", gasPrice);

  const gasInfo: GasInfo = {
    [NetworkFeeTypeChosen.Slow]: {
      usd: gasPrice.safeLow,
      gwei: gasPrice.safeLowGwei,
      time: gasPrice.safeLowWait,
    },
    [NetworkFeeTypeChosen.Average]: {
      usd: gasPrice.average,
      gwei: gasPrice.averageGwei,
      time: gasPrice.avgWait,
    },
    [NetworkFeeTypeChosen.Fast]: {
      usd: gasPrice.fast,
      gwei: gasPrice.fastGwei,
      time: gasPrice.fastWait,
    },
    [NetworkFeeTypeChosen.Custom]: {
      usd: gasPrice.custom,
      gwei: gasPrice.customGwei,
      time: gasPrice.customWait,
    },
  };
  return gasInfo;
};

/**
 * This function calculates the gas units in GWEI and the corresponding amount in usd.
 * the estimated time it will take to process the transaction at each gas speed.
 *
 * @param {number} network The network to use for the calculation
 * @param {number} estimateGas The estimated gas of the transaction
 *
 * @returns {Object} An object containing the cost in US dollars, the cost in gwei, and the estimated time it will take to process the transaction at each rate
 */
export const calculateGasSpeed = async (
  network: number,
  estimateGas: number
) => {
  try {
    const { NETWORKCHAIN, networkFeeSettings } = StaticStore.getState().app;
    const NATIVE_TOKEN_ID = NETWORKCHAIN[+network][NATIVE_TOKEN_COINGECKO_ID];
    const gasData = await getGasPrice(network);
    let PriceInUSd = 0;
    const {
      market_data: { current_price },
    } = await getDetailSingleTokenInfo(NATIVE_TOKEN_ID);
    if (+current_price.usd == 0) {
      const tokenInfo = await StaticStore.getState().newWallet.tokenInfo;
      const tokenKey = `${NATIVE_TOKEN_ADDRESS}_${NETWORKCHAIN[network].NATIVE_TOKEN_SYMBOL}`;
      PriceInUSd = tokenInfo?.[tokenKey].price || 0;
    } else {
      PriceInUSd = +current_price.usd;
    }

    const safeLow = ((gasData.safeLow * estimateGas) / 10 ** 9) * PriceInUSd;
    const average = ((gasData.average * estimateGas) / 10 ** 9) * PriceInUSd;
    const fast = ((gasData.fast * estimateGas) / 10 ** 9) * PriceInUSd;
    const [safeLowWait, fastWait, avgWait] = [
      gasData.safeLowWait,
      gasData.fastWait,
      gasData.avgWait,
    ];

    const customGas = networkFeeSettings.gasInfo[3];
    const customGwei = customGas.gwei;

    const custom = ((customGwei * estimateGas) / 10 ** 9) * PriceInUSd;

    const customWait =
      +customGwei > gasData.fast
        ? fastWait - 0.3
        : +customGwei > gasData.average
        ? avgWait - 0.3
        : +customGwei > gasData.safeLow
        ? safeLowWait - 0.3
        : safeLowWait + 0.3;

    return {
      safeLow, //usd values
      average,
      fast,
      custom,

      safeLowGwei: gasData.safeLow, //values in gwei
      averageGwei: gasData.average,
      fastGwei: gasData.fast,
      customGwei,

      safeLowWait, //timing
      fastWait,
      avgWait,
      customWait,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error in gas speed");
  }
};

export const getGasPrice = async (network: number) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const ethersProvider = new ethers.providers.JsonRpcProvider(
    NETWORKCHAIN[network].NODE_URL
  );
  if (!ethersProvider) {
    const request = await axios.get(`${BASE_URL}/gas/data/${network}`);
    return request.data.data;
  }

  let [safeLow, average, fast] = [0, 0, 0];
  if (
    network === SupportedChainId.BINANCE_SMART_CHAIN ||
    network === SupportedChainId.BSC_TESTNET ||
    network === SupportedChainId.AURORA_MAINNET
  ) {
    const gasPrice = await ethersProvider.getGasPrice();
    const gasPriceInGwei = +utils.formatUnits(gasPrice, "gwei");
    safeLow = gasPriceInGwei + GAS_PRIORITY_FEE[network].slow;
    average = gasPriceInGwei + GAS_PRIORITY_FEE[network].medium;
    fast = gasPriceInGwei + GAS_PRIORITY_FEE[network].fast;
  } else {
    const priority = await ethersProvider.getFeeData();
    safeLow = +utils.formatUnits(priority.lastBaseFeePerGas || 0, "gwei");
    fast = +utils.formatUnits(priority.maxFeePerGas || 0, "gwei");
    average = Math.ceil((fast + safeLow) / 2);
  }

  return {
    safeLow: Math.ceil(safeLow),
    average: Math.ceil(average),
    fast: Math.ceil(fast),
    avgWait: 1,
    fastWait: 0.5,
    safeLowWait: 1.5,
  };
};

/**
 * This method is responsible to fetch the latest gas prices from the scan apis according to EVM chain
 * @param network number
 *
 * @returns an object containing data about the gas price for the given network.
 */

// export const getGasPrice = async (network: number) => {
//   try {
//     let data: any;
//     if (
//       network === SupportedChainId.AVALANCHE_MAINNET ||
//       network === SupportedChainId.AVALANCHE_TESTNET
//     ) {
//       const res: any = await axios.get(
//         NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
//       );
//       // console.log("PRICE RESPONSE FROM API", res);
//       const gasPriceInGwei = Number(res.data.result) / Math.pow(10, 9);
//       // console.log("gasPriceInGwei", gasPriceInGwei, gasPriceInGwei * 1.2);
//       data = {
//         safeLow: gasPriceInGwei + GAS_PRIORITY_FEE[network].slow,
//         average: gasPriceInGwei + GAS_PRIORITY_FEE[network].medium,
//         fast: gasPriceInGwei + GAS_PRIORITY_FEE[network].fast,
//         avgWait: 1,
//         fastWait: 0.5,
//         safeLowWait: 1.5,
//       };
//     } else if (
//       network === SupportedChainId.CRONOS_MAINNET ||
//       network === SupportedChainId.CRONOS_TESTNET ||
//       network === SupportedChainId.BSC_TESTNET ||
//       network === SupportedChainId.POLYGON_TESTNET
//     ) {
//       const res: any = await axios.get(
//         NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
//       );
//       // console.log("PRICE RESPONSE FROM API", res);
//       const gasPriceInGwei = parseInt(res.data.result) / Math.pow(10, 9);
//       // console.log("gasPriceInGwei", gasPriceInGwei);
//       data = {
//         safeLow: gasPriceInGwei + GAS_PRIORITY_FEE[network].slow,
//         average: gasPriceInGwei + GAS_PRIORITY_FEE[network].medium,
//         fast: gasPriceInGwei + GAS_PRIORITY_FEE[network].fast,
//         avgWait: 1,
//         fastWait: 0.5,
//         safeLowWait: 1.5,
//       };
//     } else if (
//       network === SupportedChainId.POLYGON_MAINNET ||
//       network === SupportedChainId.FANTOM_MAINNET ||
//       network === SupportedChainId.FANTOM_TESTNET
//     ) {
//       const res: any = await axios.get(
//         NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
//       );
//       data = {
//         safeLow:
//           +res.data.result.proposeGasPrice + GAS_PRIORITY_FEE[network].slow,
//         average:
//           +res.data.result.ProposeGasPrice + GAS_PRIORITY_FEE[network].medium,
//         fast: +res.data.result.FastGasPrice + GAS_PRIORITY_FEE[network].fast,
//         // safeLow: +res.data.result.SafeGasPrice,
//         // average: +res.data.result.ProposeGasPrice,
//         // fast: ,
//         avgWait: 1,
//         fastWait: 0.5,
//         safeLowWait: 1.5,
//       };
//     } else if (network === SupportedChainId.BINANCE_SMART_CHAIN) {
//       const res: any = await axios.get(
//         NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
//       );

//       const [safeGasPrice, proposeGasPrice, fastGasPrice] = [
//         +res.data.result.SafeGasPrice,
//         +res.data.result.ProposeGasPrice,
//         +res.data.result.FastGasPrice,
//       ];
//       data = {
//         safeLow: proposeGasPrice + GAS_PRIORITY_FEE[network].slow,
//         average: proposeGasPrice + GAS_PRIORITY_FEE[network].medium,
//         fast: fastGasPrice + GAS_PRIORITY_FEE[network].fast,
//         avgWait: 1,
//         fastWait: 0.5,
//         safeLowWait: 1.5,
//       };
//     } else if (
//       network === SupportedChainId.ETHEREUM_MAINNET ||
//       // network === SupportedChainId.ETHEREUM_ROPSTEN ||
//       // network === SupportedChainId.ETHEREUM_RINKEBY ||
//       network === SupportedChainId.ETHEREUM_GOERLI
//     ) {
//       const res: any = await axios.get(
//         NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
//       );
//       data = {
//         safeLow: +res.data.result.FastGasPrice + GAS_PRIORITY_FEE[network].slow,
//         average:
//           +res.data.result.FastGasPrice + GAS_PRIORITY_FEE[network].medium,
//         fast: +res.data.result.FastGasPrice + GAS_PRIORITY_FEE[network].fast,
//         avgWait: 1,
//         fastWait: 0.5,
//         safeLowWait: 1.5,
//       };
//     } else if (
//       network === SupportedChainId.AURORA_MAINNET
//       // || network === SupportedChainId.AURORA_TESTNET
//     ) {
//       const res: any = await axios.get(
//         NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
//       );

//       data = {
//         safeLow: +res.data.speeds[2].gasPrice + GAS_PRIORITY_FEE[network].slow,
//         average:
//           +res.data.speeds[2].gasPrice + GAS_PRIORITY_FEE[network].medium,
//         fast: +res.data.speeds[3].gasPrice + GAS_PRIORITY_FEE[network].fast,
//         avgWait: 1,
//         fastWait: 0.5,
//         safeLowWait: 1.5,
//       };
//     }
//     return data;
//   } catch (e) {
//     console.log(e);
//   }
// };

/*
 * estimateGasLimit()
 *
 * This function is used to estimate the gas limit of a given transfer function according to the  token address, address and chainId.
 *
 * @param tokenAddress {string} - The address of the token
 * @param address {string} - The address of the sender
 * @param chainId {number} - The chainId
 *
 * @returns {number} - The estimated gas limit
 */
export const estimateGasLimit = async (
  tokenAddress: string,
  address: string,
  chainId: number
) => {
  try {
    const { NETWORKCHAIN } = StaticStore.getState().app;
    const web3 = new ethers.providers.JsonRpcProvider(
      NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN][NODE_URL]
    );

    const EthersWallet = await initializeWalletWithAddress(address, web3);
    console.log("🚀 ~ file: utils.gas.ts:315 ~ EthersWallet:", EthersWallet);
    const contract = new ethers.Contract(
      tokenAddress || NATIVE_TOKEN_ADDRESS,
      abi,
      EthersWallet
    );
    const estimateGas = await contract.estimateGas.transfer(address, "123");
    return estimateGas.toNumber();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Calculate the non-EVM Gas fee for a given chain
 * @param {number} chainId - The id of the chain to calculate the fee
 * @param {number} [gas] - The amount of gas to use, if not provided the average gas fee is used
 * @returns {Object} - An object containing the gas fee in usd, the gas fee in the native gas unit and the transaction cost
 */
export const calculateNonEvmGasFee = async (chainId: number, gas?: number) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const {
    market_data: { current_price },
  } = await getDetailSingleTokenInfo(
    NETWORKCHAIN[chainId][NATIVE_TOKEN_COINGECKO_ID]
  );
  const nativeTokenPrice = current_price.usd;
  const chainFamily = NETWORKCHAIN[chainId].chain;

  const chainGasFee = AVG_GAS_FEE[chainId as keyof typeof AVG_GAS_FEE];

  const gasInDefaultGasUnit = gas
    ? gas * chainGasFee
    : GAS_UNITS[chainFamily] * chainGasFee;

  const transactionCost = gasInDefaultGasUnit / 10 ** 12;

  const gasFeeInUsd = transactionCost * nativeTokenPrice;

  return {
    gasFeeInUsd,
    gasInDefaultGasUnit,
    transactionCost,
  };
};

/**
 *  Fetches the transaction cost in native currency based on the estimated gas and gwei provided
 *  @param {number} estimateGas - The estimated gas used for the transaction
 *  @param {number} gwei - The gas price in gwei
 *  @return {number} The cost of transaction in native currency
 */
export const fetchTransactionCostInEther = async (
  estimateGas: number,
  gwei: number
) => {
  console.log("tx cost", estimateGas, gwei);
  const transactionCostInGwei = estimateGas * gwei;
  const transactionCostInEther = toReadableAmount(transactionCostInGwei, 9); //transactionCostInGwei / 10 ** 9;
  return transactionCostInEther;
};

/**
 * This function is used to derive the increased gas price when speed-up or cancel. There are different deviation factors, depends upon the gas price used
 * in the initial transaction
 *
 * @param previousGasPriceInWei number
 *
 * @returns string -> increased gas price
 */
export const getSpeedUpCancelGasPriceInWei = (
  previousGasPriceInWei: number
) => {
  const previousGasPriceInGwei = previousGasPriceInWei / Math.pow(10, 9);
  if (previousGasPriceInGwei > 0 && previousGasPriceInGwei <= 30)
    return Math.ceil(previousGasPriceInWei * 3).toString();
  else if (previousGasPriceInGwei > 30 && previousGasPriceInGwei <= 100)
    return Math.ceil(previousGasPriceInWei * 1.5).toString();
  else if (previousGasPriceInGwei > 100 && previousGasPriceInGwei <= 200)
    return Math.ceil(previousGasPriceInWei * 1.4).toString();
  else if (previousGasPriceInGwei > 200 && previousGasPriceInGwei <= 300)
    return Math.ceil(previousGasPriceInWei * 1.3).toString();
  else if (previousGasPriceInGwei > 300 && previousGasPriceInGwei <= 400)
    return Math.ceil(previousGasPriceInWei * 1.2).toString();
  else return Math.ceil(previousGasPriceInWei * 1.2).toString();
};
