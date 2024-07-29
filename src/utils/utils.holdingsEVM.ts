import { ethers } from "ethers";
import axios from "axios";

import {
  AddressWithChainId,
  EthersRPCProvider,
  SingleEthHistory,
  TransactionHistoryResult,
} from "interfaces";
import {
  API,
  API_KEY,
  DUMMY_IMAGE_URL,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  NETWORKS,
  NODE_URL,
  SupportedChainId,
  WRAPPED_ADDRESS,
} from "utils/constants";
import { checkSum } from "utils";
import { ProcessHoldings } from "classes";
import {
  ChoresAfterHoldingProcess,
  processNormalTokenHolding,
} from "./utils.holdings";
import { StaticStore } from "store/store";
import { BASE_URL } from "api";

const { abi } = require("../abis/erc20abi.json");

/**
 * Fetches token holdings from an alternate service from server for the given account addresses.
 * Processes the fetched holdings using the provided HoldingsProcessor.
 * @param {string[]} accountAddressAssestsTobeFetched - The account addresses for which token holdings are to be fetched.
 * @param {ProcessHoldings} HoldingsProcessor - The processor function to handle the fetched holdings.
 */

const fetchTokenHoldingFromAlternateService = async (
  accountAddressAssestsTobeFetched: string[],
  HoldingsProcessor: ProcessHoldings
) => {
  if (accountAddressAssestsTobeFetched.length > 0) {
    const result = await axios.post(`${BASE_URL}/tokens/holdings`, {
      addresses: accountAddressAssestsTobeFetched,
    });

    Object.keys(result.data).forEach((chainId) => {
      Object.keys(result.data[chainId]).forEach((address) => {
        HoldingsProcessor.processTokenHoldings(
          result.data[chainId][address].holdings,
          +chainId,
          address
        );
      });
    });
  }
};

/**
 * loops through all the EVM accounts and fetch balance
 * for mainnet it uses Ankr, for testnet, aurora, cronos it
 * uses the conventional txHistory way to fetch balances
 *
 * @param allEVMaccounts
 * @param allChainIds
 * @param isTestnet
 */
export const handleEVMholdings = async (
  allEVMaccounts: string[],
  allChainIds: number[],
  isTestnet: boolean
) => {
  const HoldingsProcessor = new ProcessHoldings();
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const txHistoryAddresses: AddressWithChainId[] = [];

  // FOR EVM MAINNET ONLY
  if (!isTestnet) {
    // const RawAnkrAllHolding: AxiosResponse<AnkrAccountBalanceResponse, any>[] =
    const RawAnkrAllHolding: any = await Promise.allSettled(
      allEVMaccounts.map((address) =>
        axios.post(
          "https://dev-api.sonar.studio/wallet/ankr/getAccountBalance",
          {
            walletAddress: address,
          }
        )
      )
    );
    const accountAddressAssestsTobeFetched: string[] = [];

    allEVMaccounts.forEach((address, i) => {
      if (
        RawAnkrAllHolding[i].status === "fulfilled" &&
        RawAnkrAllHolding[i].value.data.result
      ) {
        HoldingsProcessor.processAnkrHoldings(
          RawAnkrAllHolding[i].value.data.result.assets,
          address
        );
      } else {
        // console.log("for this address we have to fetch", address);
        accountAddressAssestsTobeFetched.push(address);
      }
    });

    /* Calls when ankr fails, will fetch the holdings of these addresses on all supported EVm Chains */
    if (accountAddressAssestsTobeFetched.length > 0)
      fetchTokenHoldingFromAlternateService(
        accountAddressAssestsTobeFetched,
        HoldingsProcessor
      );
  }

  // For testnet, CRONOS, AURORA
  const holdingres = await Promise.allSettled(
    allChainIds.map(async (chainId) => {
      const currentChainInfo =
        NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN];
      const chainFamily = currentChainInfo.chain;
      if (
        chainFamily === NETWORKS.EVM &&
        (isTestnet ||
          currentChainInfo.CHAIN_ID === SupportedChainId.AURORA_MAINNET ||
          currentChainInfo.CHAIN_ID === SupportedChainId.CRONOS_MAINNET)
      ) {
        const web3 = new ethers.providers.JsonRpcProvider(
          NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN][NODE_URL]
        );
        return await Promise.allSettled(
          allEVMaccounts.map(async (address) => {
            txHistoryAddresses.push({
              address,
              chainId,
            });
            const holdings = await fetchTxHistoryAction(
              address,
              currentChainInfo[API],
              currentChainInfo[API_KEY],
              currentChainInfo[NODE_URL],
              chainId,
              currentChainInfo[WRAPPED_ADDRESS],
              currentChainInfo[NATIVE_TOKEN_COINGECKO_ID],
              web3,
              currentChainInfo[NATIVE_TOKEN_NAME],
              currentChainInfo[NATIVE_TOKEN_SYMBOL],
              currentChainInfo.LOGO
            );
            if (typeof holdings === "object") {
              return { holdings, chainId, address };
            } else {
              return Promise.reject();
            }
          })
        );
      }
    })
  );
  console.log("🚀 ~ file: utils.holdingsEVM.ts:238 ~ holdingres:", holdingres);
  // console.log("holdingres", holdingres);

  processNormalTokenHolding(holdingres, HoldingsProcessor);

  await ChoresAfterHoldingProcess(HoldingsProcessor, txHistoryAddresses);
};

export const fetchTxHistoryAction = async (
  address: string,
  baseURL: string,
  apiKey: string,
  nodeUrl: string,
  bitqueryNetwork: number,
  wrappedAddress: string,
  coingeckoId: string,
  web3: EthersRPCProvider,
  nativeTokenName: string,
  nativeTokenSymbol: string,
  image: string
) => {
  try {
    //all tokens other than native token
    const updatedData = await fetchAllHoldingTokens(
      address,
      baseURL,
      apiKey,
      nodeUrl,
      bitqueryNetwork
    );

    //this is for nativeToken
    const { balance, balanceInUSD, rawBalance, price } =
      await balanceInThatChain(address, coingeckoId, web3);

    const tokensHistory = updatedData;
    const nativeTokenBalance = {
      balance,
      balanceInUSD,
      symbol: coingeckoId,
      rawBalance,
      price,
    };
    if (parseFloat(nativeTokenBalance.balance) > 0) {
      tokensHistory?.unshift({
        tokenName: nativeTokenName,
        tokenSymbol: nativeTokenSymbol,
        tokenBalance: parseFloat(nativeTokenBalance.balance),
        tokenBalanceRawInteger: nativeTokenBalance.rawBalance.toString(),
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        tokenDecimal: 18,
        priceInUSD: nativeTokenBalance?.balanceInUSD,
        image: image,
        tokenPrice: nativeTokenBalance.price,
      });
    }

    return tokensHistory;
  } catch (error) {
    return Promise.reject();
  }
};

export const fetchAllHoldingTokens = async (
  address: string,
  url: string,
  key: string,
  nodeURL: string,
  network: number
) => {
  try {
    const web3 = new ethers.providers.JsonRpcProvider(nodeURL);

    const obj: {
      [key: string]: TransactionHistoryResult;
    } = {};
    let erc20 = [];

    const response = await axios.get(
      `${url}?module=account&action=tokentx&address=${address}&sort=asc&apikey=${key}`
    );

    const result: TransactionHistoryResult[] = response.data.result.slice(
      0,
      500
    );

    if (result.length > 0 && result && Array.isArray(result)) {
      erc20 = await Promise.all(
        result?.map(async (res) => {
          if (!obj[res.contractAddress]) {
            obj[res.contractAddress] = {
              tokenName: res.tokenName,
              tokenSymbol: res.tokenSymbol,
              tokenDecimal: res.tokenDecimal,
              contractAddress: checkSum(res.contractAddress),
            };

            const contract = new ethers.Contract(
              res.contractAddress,
              abi,
              web3
            );

            const tokenBalance = (await contract.balanceOf(address)).toString();
            if (Number(tokenBalance) && res.tokenName) {
              return {
                tokenName: res.tokenName,
                tokenSymbol: res.tokenSymbol,
                tokenBalance:
                  Number(tokenBalance) / 10 ** Number(res.tokenDecimal),
                tokenBalanceRawInteger: tokenBalance.toString(),
                tokenAddress: checkSum(res.contractAddress),
                tokenDecimal: +res.tokenDecimal,
                priceInUSD: 0,
                image: DUMMY_IMAGE_URL,
                tokenPrice: "0", //! get coingeckoid to get token price is usd for testnet tokens
              };
            }
          }
        })
      );
      const filtered: SingleEthHistory[] = [];

      erc20?.forEach((token) => {
        if (token) {
          filtered.push(token);
        }
      });

      return filtered;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * get native token balance and usd price
 * @param address type string
 * @param nativeTokenNetwork type string
 * @param web3 type EthersRPCProvider
 */
export const balanceInThatChain = async (
  address: string,
  nativeTokenNetwork: string,
  web3: EthersRPCProvider
) => {
  const { balance, rawBalance } = await fetchChainBalance(address, web3);
  return {
    balance,
    rawBalance,
    balanceInUSD: 0 * parseFloat(balance),
    price: "0",
  };
};

/**
 * fetch native token balance of a given address from
 * that specific chain
 * @param address type string
 * @param web3 type EthersRPCProvider
 * @returns
 */
export const fetchChainBalance = async (
  address: string,
  web3: EthersRPCProvider
) => {
  const balance = await web3.getBalance(address);

  return { balance: ethers.utils.formatUnits(balance), rawBalance: balance };
};
