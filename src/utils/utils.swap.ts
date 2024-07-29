import { setSwapSelectedTokens } from "@slices/newWalletSlice";
import axios from "axios";
import { Transaction as TX } from "@ethereumjs/tx";
import { ethers } from "ethers";
import { ftGetTokensMetadata } from "@ref-finance/ref-sdk";

import {
  AmountTokenA,
  AmountTokenB,
  EthersRPCProvider,
  IAccount,
  ITokenA,
  ITokenB,
  SecondaryHoldings,
  SwapLocationState,
  SwapResponse,
  TokenSelected,
} from "interfaces";
import { StaticStore } from "store/store";
import {
  checkSum,
  convertBalanceToBaseUnit,
  decryptMessage,
  matchAddresses,
} from "utils";
import {
  DUMMY_IMAGE_URL,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  NETWORKS,
  NODE_URL,
  OX_API,
  SWAP_REFERRER_ADDRESS,
  SupportedChainId,
} from "./constants";
import { toFixed } from "./formatters";
import { ePingLogo, maticLogo, pingLogo } from "assets/images";
import { BASE_URL } from "api";
import { validateEVMAddress } from "./validateAddresses";
import { setSwapImportedTokens } from "@slices/appSlice";
import { fetchCoingeckoIDandPriceFromAddress } from "./utils.prices";
// import { GasInfo, NetworkFeeTypeChosen } from "@slices/appSlice";
const { reflectAbi } = require("../abis/reflectabi.json");
const { pancakeSwapv2 } = require("../abis/pancakeswapV2.json");
const { abi: ERC20Abi } = require("abis/erc20abi.json");
import { APPSCREENS } from "theme/constants";
import CachedService from "classes/cachedService";

/**
 * @description This function is used to calculate the amount, check reflection and return the swap quoatation!
 * @param selectToTokenAddress string
 * @param selectFromTokenAddress string
 * @param network number
 * @param web3 EthersRPCProvider
 * @param amountTokenA number
 * @param amountTokenB number
 * @param address string
 * @param slippageTolerance number
 * @param isTokenA boolean
 * @returns routerV2, newData, isReflection: reflectionValue, quote
 */
export const getSwapContractAdressAndContract = async (
  selectToTokenAddress: string,
  selectFromTokenAddress: string,
  network: number,
  web3: EthersRPCProvider,
  amountTokenA: number,
  amountTokenB: number,
  address: string,
  slippageTolerance: number,
  isTokenA: boolean
) => {
  console.log(
    selectToTokenAddress,
    selectFromTokenAddress,
    network,
    web3,
    amountTokenA,
    amountTokenB,
    address,
    slippageTolerance,
    isTokenA,
    " here you can extract"
  );
  const { NETWORKCHAIN } = StaticStore.getState().app;
  let amount;
  const BuyTokenContract = await initializeTokenContract(
    selectToTokenAddress,
    web3
  );
  const SellTokenContract = await initializeTokenContract(
    selectFromTokenAddress,
    web3
  );

  console.log("amountTokenA", isTokenA, amountTokenA, amountTokenB);

  if (isTokenA) {
    console.log("IDFFF");
    if (!matchAddresses(selectFromTokenAddress, NATIVE_TOKEN_ADDRESS)) {
      console.log("if match");
      amount = toFixed(
        await convertBalanceToBaseUnit(SellTokenContract, amountTokenA)
      );
    } else {
      console.log("if not match");
      amount = toFixed((amountTokenA * 10 ** 18).toFixed(0));
    }
  } else {
    console.log("esle");

    if (!matchAddresses(selectToTokenAddress, NATIVE_TOKEN_ADDRESS)) {
      amount = toFixed(
        await convertBalanceToBaseUnit(BuyTokenContract, amountTokenB)
      );
      console.log("match", amount);
    } else {
      amount = toFixed((amountTokenB * 10 ** 18).toFixed(0));
      console.log("else match", amount);
    }
  }

  console.log("amuont", amount);

  let routerV2;
  const newData = {
    to: NETWORKCHAIN[network].EXCHANGE_PROXY_ADDRESS_0X,
  };

  let reflectionValue = false;
  if (
    (await checkIfReflectToken(BuyTokenContract)) ||
    (await checkIfReflectToken(SellTokenContract))
  ) {
    // console.log("reflect ko truee kardooooooo");
    reflectionValue = true;
  }

  // console.log(selectFromTokenAddress, "selectFromTokenAddress", amount);
  const quote = await getSwapQuote(
    selectToTokenAddress,
    selectFromTokenAddress,
    toFixed(amount),
    address,
    network,
    reflectionValue,
    slippageTolerance,
    isTokenA
  );
  console.log("RETURNED DATAAAAAAAAAAAAAAAAAAAAAAA", quote);
  if (reflectionValue || quote.error === 400) {
    const ROUTER = NETWORKCHAIN[network].ROUTER;
    // console.log("ROUTER============", ROUTER);
    routerV2 = new ethers.Contract(ROUTER, pancakeSwapv2, web3);
    newData.to = ROUTER;
  }
  // console.log("isReflection in getSwapContractAdressAndContract", isReflection);
  return { routerV2, newData, isReflection: reflectionValue, quote };
};

/**
 *
 * @param tokenAddress string
 * @param web3 EthersRPCProvider
 * @returns contract instance
 */
export const initializeTokenContract = async (
  tokenAddress: string,
  web3: EthersRPCProvider
) => {
  const contract = new ethers.Contract(tokenAddress, reflectAbi, web3);
  return contract;
};

/**
 *
 * @param contract any
 * @returns boolean
 */
export const checkIfReflectToken = async (contract: ethers.Contract) => {
  try {
    await contract._maxTxAmount();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * @description This function is used to fetch tokenA and TokenB from 0x api endpoint with respective chain.
 * @param buyToken string
 * @param sellToken string
 * @param amount string in Wei
 * @param takerAddress
 * @param network number
 * @param isReflection boolean
 * @param slippage number
 * @param isTokenA boolean
 * @returns Quote: any
 */
export const getSwapQuote = async (
  buyToken: string,
  sellToken: string,
  amount: string,
  takerAddress: string,
  network: number,
  isReflection: boolean,
  slippage: number,
  isTokenA: boolean
) => {
  try {
    const { NETWORKCHAIN } = StaticStore.getState().app;
    let amountParams = "";
    if (isTokenA) {
      amountParams = `sellAmount=${amount}`;
    } else {
      amountParams = `buyAmount=${amount}`;
    }

    const initialSlippage =
      StaticStore.getState().newWallet.swapSelectedTokens.initialSlippage;

    const slipp = slippage - initialSlippage;

    const slippagePercentage = slipp ? slipp / 100 : 3 / 100;

    const BASE_URL = NETWORKCHAIN[network][OX_API];
    const { data } = await axios.get(
      `${BASE_URL}/swap/v1/quote?takerAddress=${takerAddress}&buyToken=${buyToken}&sellToken=${sellToken}&${amountParams}&slippagePercentage=${slippagePercentage}&enableSlippageProtection=false&feeRecipient=${SWAP_REFERRER_ADDRESS}&buyTokenPercentageFee=0.002&skipValidation=true${
        isReflection ? "&includedSources=PancakeSwap_V2,Uniswap" : ""
      }`
    );
    // console.log("getSwapQuote response", data);
    data.gas = (Number(data.gas) * 1.5).toFixed(0).toString();
    // data.value = web3.utils.toHex(data.value);
    // data.gasLimit: web3.utils.toHex(Number(data.gas * 1.05).toFixed(0))
    // data.gasPrice = Number(data.gasPrice) + 50000000;
    // data.gasPrice = web3.utils.toHex(data.gasPrice + 5000000000);
    // data.gas = web3.utils.toHex(data.gas * 4);
    // data.estimatedGas = web3.utils.toHex(data.estimatedGas);
    return data;
  } catch (error: any) {
    console.log("error in swap quote ===", error);
    console.log(error.response.data, "error.response.data");
    // if (error?.response?.data?.validationErrors?.length > 0) {
    //   return new Error(error?.response?.data?.validationErrors[0].reason);
    // }
    // if (error?.response?.data?.reason) {
    //   return new Error(error?.response?.data?.reason);
    // }
    return {
      error: error.response.status,
      message:
        error.response.data.validationErrors[0].reason ||
        error.response.data.reason ||
        "Whoops something went wrong",
    };
  }
};

/**
 *
 * @param web3 EthersRPCProviderp
 * @param abi AbiItem | AbiItem[]
 * @param address string
 * @param tokenAddress string
 * @param ProxyAddress string
 * @returns allowance boolean
 */
export const checkAllowance = async (
  web3: EthersRPCProvider,
  abi: ethers.ContractInterface,
  address: string,
  tokenAddress: string,
  ProxyAddress: string
) => {
  let contract;
  let allowance;
  if (tokenAddress && tokenAddress !== NATIVE_TOKEN_ADDRESS) {
    contract = new ethers.Contract(tokenAddress, abi, web3);
    allowance = Number(await contract.allowance(address, ProxyAddress));
    console.log("alloo=======", allowance);
  } else {
    console.log("allo else");
    allowance = 0;
    contract = "";
  }

  return { allowance, contract };
};

/**
 * @description Get SWAPs token list
 * @param network number
 * @param page number
 * @param search string
 * @returns tokens: SwapResponse, hasMorePages: boolean
 */
export const getSwapTokens = async (
  network: number,
  page: number,
  search: string
) => {
  try {
    console.log("ELSE");
    const { NETWORKCHAIN } = StaticStore.getState().app;
    //get tokens for NEAR chain in the SWAP
    if (NETWORKCHAIN[network].chain === NETWORKS.NEAR) {
      const { tokens, hasMorePages } = await getSwapTokensNEAR(network, search);
      return {
        tokens: tokens,
        hasMorePages: hasMorePages,
      };
    } else {
      const { tokens, hasMorePages } = await getSwapTokensEVM(
        network,
        page,
        search
      );
      return {
        tokens: tokens,
        hasMorePages: hasMorePages,
      };
    }
  } catch (error) {
    console.log("error in swap Tokens ===", error);
    return { tokens: [], hasMorePages: false };
  }
};

/**
 * @description This function is used to get tokes from the Ref-Finance SDK and filter them.
 * @param network number
 * @param search string
 * @returns tokens: SwapResponse, hasMorePages: boolean
 */
const getSwapTokensNEAR = async (network: number, search: string) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const tokens = await ftGetTokensMetadata();

  const filteredTokens: SwapResponse = Object.keys(tokens).map((key) => ({
    chainId: network,
    address: tokens[key].id,
    name: tokens[key].name,
    symbol: tokens[key].symbol,
    decimals: tokens[key].decimals,
    logoURI: tokens[key].icon,
  }));

  filteredTokens.unshift({
    chainId: SupportedChainId.NEAR,
    name: NETWORKCHAIN[SupportedChainId.NEAR].NATIVE_TOKEN_NAME,
    symbol: NETWORKCHAIN[SupportedChainId.NEAR].NATIVE_TOKEN_SYMBOL,
    address: NETWORKCHAIN[SupportedChainId.NEAR].NATIVE_TOKEN_ADDRESS,
    decimals: NETWORKCHAIN[SupportedChainId.NEAR].DECIMALS,
    logoURI: NETWORKCHAIN[SupportedChainId.NEAR].LOGO,
  });

  if (search.length > 0) {
    const queryString = search.toLowerCase();
    const tokensList = filteredTokens.filter((token) => {
      return (
        token.name.toLowerCase().includes(queryString) ||
        token.symbol.toLowerCase().includes(queryString) ||
        token.address.toLowerCase() === queryString
      );
    });

    return {
      hasMorePages: false,
      tokens: tokensList,
    };
  } else {
    return { tokens: filteredTokens, hasMorePages: false };
  }
};

/**
 * @description Get SWAPs token list from sonar server
 * @param network number
 * @param page number
 * @param search string
 * @returns tokens: SwapResponse, hasMorePages: boolean
 */
const getSwapTokensEVM = async (
  network: number,
  page: number,
  search: string
) => {
  const controller = new AbortController();
  let tokens: SwapResponse = [];
  let hasMorePages = false;

  const { swapImportedTokens, NETWORKCHAIN } = StaticStore.getState().app;

  const filteredSwapImportedTokens = swapImportedTokens.filter(
    (token) => token.chainId === network
  );

  //first concat custom imported tokens
  if (page === 1 && search.length === 0) {
    tokens = [...filteredSwapImportedTokens];
  }

  //get tokens from server for EVM chain
  const params = search.length > 0 ? { search } : { page };
  await axios
    .get(`${BASE_URL}/tokens/swapTokenBlist/${network}`, {
      params,
      signal: controller.signal,
    })
    .then(function ({ data }) {
      tokens = [...tokens, ...data.tokens];
      hasMorePages = data.hasMorePages;
    });

  // cancel the request
  controller.abort();

  //if token is searched by address and not found then initialize contract token
  if (tokens.length === 0 && search.length > 0 && validateEVMAddress(search)) {
    const nodeURL = NETWORKCHAIN[network][NODE_URL];
    const web3 = new ethers.providers.JsonRpcProvider(nodeURL);
    const contract = new ethers.Contract(search, ERC20Abi, web3);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    tokens.push({
      chainId: network,
      address: search,
      name,
      symbol,
      decimals,
      logoURI: DUMMY_IMAGE_URL,
    });
  }

  if (search.length > 0) {
    const queryString = search.toLowerCase();
    const tokensList = filteredSwapImportedTokens.filter((token) => {
      return (
        token.name.toLowerCase().includes(queryString) ||
        token.symbol.toLowerCase().includes(queryString) ||
        token.address.toLowerCase() === queryString
      );
    });

    tokens = [...tokens, ...tokensList];
  }

  return {
    hasMorePages,
    tokens,
  };
};

/**
 * @description This function is used to convert SwapResponse to SecondaryHoldings, get balance if any and return filtered results
 * @param tokens SwapResponse
 * @param network number
 * @param account IAccount
 * @param tokenA ITokenA
 * @returns toTokens SecondaryHoldings
 */
export const filterSwapTokens = (
  tokens: SwapResponse,
  network: number,
  account: IAccount,
  tokenA: ITokenA
) => {
  const { secondaryHoldings, tokenInfo } = StaticStore.getState().newWallet;
  const { NETWORKCHAIN } = StaticStore.getState().app;
  let buysTokens: SecondaryHoldings = {};

  let toTokens = tokens;
  // let toTokens = tokens.sort(
  //   (a: { symbol: string }, b: { symbol: string }) =>
  //     a.symbol > b.symbol ? 1 : b.symbol > a.symbol ? -1 : 0
  // );

  //TODO: remove same token from tokenB
  if (tokenA.address) {
    toTokens = toTokens.filter((tk) => {
      return !matchAddresses(tk.address, tokenA.address);
    });
  }

  toTokens.forEach((value) => {
    const checkSumAddress = checkSum(value.address);
    let tokenId = `${value.name}_${checkSumAddress}_${value.symbol}`;

    if (tokenInfo[`${checkSumAddress}_${value.symbol}`]) {
      const thisTokenInfo = tokenInfo[`${checkSumAddress}_${value.symbol}`];
      tokenId = `${thisTokenInfo.name}_${checkSumAddress}_${thisTokenInfo.symbol}`;
    }

    const balance =
      secondaryHoldings[+network]?.tokens?.[tokenId]?.accounts[account.address]
        ?.balance || 0;
    const rawBalance =
      secondaryHoldings[+network]?.tokens?.[tokenId]?.accounts[account.address]
        ?.rawBalance || "0";
    const balanceInUsd =
      secondaryHoldings[+network]?.tokens?.[tokenId]?.accounts[account.address]
        ?.balanceInUsd || 0;

    if (buysTokens[network as keyof typeof buysTokens] !== undefined) {
      buysTokens[network].tokens = {
        ...buysTokens[network].tokens,
        [`${value.name}_${checkSumAddress}_${value.symbol}`]: {
          address: checkSumAddress,
          name: value.name,
          symbol: value.symbol,
          decimals: value.decimals,
          image: value.logoURI,
          balance,
          rawBalance,
          balanceInUsd,
          isActive: true,
          accounts: {
            [account.address]: {
              name: "",
              balance,
              rawBalance,
              balanceInUsd,
              walletName: "",
            },
          },
        },
      };
    } else {
      buysTokens = {
        [network]: {
          name: NETWORKCHAIN[network].NAME,
          image: NETWORKCHAIN[network].LOGO,
          balanceInUsd: 0,
          tokens: {
            [`${value.name}_${checkSumAddress}_${value.symbol}`]: {
              address: checkSumAddress,
              name: value.name,
              symbol: value.symbol,
              decimals: value.decimals,
              image: value.logoURI,
              balance,
              rawBalance,
              balanceInUsd,
              isActive: true,
              accounts: {
                [account.address]: {
                  name: "",
                  balance,
                  rawBalance,
                  balanceInUsd,
                  walletName: "",
                },
              },
            },
          },
        },
      };
    }
  });

  return { toTokens: buysTokens };
};

/**
 * @description Descrypt private key and sign tx
 * @param data any
 * @param common any
 * @param address string
 * @param hashedPassword string
 * @returns raw string
 */
export const getSwapTransactionRawData = async (
  data: any,
  common: any,
  address: string,
  hashedPassword: string
) => {
  const { accounts } = StaticStore.getState().newWallet;

  const privateKey = decryptMessage(accounts[address].secret, hashedPassword);

  const pvtKey = Buffer.from(privateKey, "hex");
  console.log("🚀 ~ file: utils.swap.ts:746 ~ pvtKey", pvtKey);
  const tx = new TX(data, { common });
  const signedTx = tx.sign(pvtKey);
  const serializedTx = signedTx.serialize();
  const raw = "0x" + serializedTx.toString("hex");
  return raw;
};

/**
 * @description When a tokenA is selected from the token list, it will be stored in the redux.
 * @param tokenSelected TokenSelected
 */
export const dispatchSwapTokenA = async (tokenSelected: TokenSelected) => {
  const { token, from } = tokenSelected;
  const { NETWORKCHAIN } = StaticStore.getState().app;

  const {
    swapSelectedTokens: { tokenA, account },
  } = StaticStore.getState().newWallet;

  const selectedAccount: IAccount = {
    ...account,
    address: from.address,
    chainFamily: from.chainFamily,
    name: from.name,
    walletName: from.walletName,
    nativeTokenBalance: from.nativeTokenBalance,
    nativeTokenBalanceInRaw: from.nativeTokenBalanceInRaw,
    nativeTokenSymbol: NETWORKCHAIN[token.chainId].NATIVE_TOKEN_SYMBOL,
    image: NETWORKCHAIN[token.chainId].LOGO,
  };
  const selectedTokenA: ITokenA = {
    ...tokenA,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    image: token.image,
    balance: from.balance,
    rawBalance: from.rawBalance || "0",
    balanceInUsd: from.balanceInUsd,
    chainId: token.chainId,
    reflectionExists: false,
    isNative: matchAddresses(token.address, NATIVE_TOKEN_ADDRESS),
    coingeckoId: token.coingeckoId,
    price: token.price,
  };

  await StaticStore.dispatch(
    setSwapSelectedTokens({
      account: selectedAccount,
      tokenA: selectedTokenA,
      error: {
        message: "",
        open: false,
      },
      warning: "",
    })
  );

  CachedService.navigation(APPSCREENS.swap, {
    state: {
      selectToken: true,
    } as SwapLocationState,
  });
};

/**
 * @description When a tokenB is selected from the token list, it will be stored in the redux.
 * @param tokenSelected TokenSelected
 */
export const dispatchSwapTokenB = async (tokenSelected: TokenSelected) => {
  const { token, from } = tokenSelected;

  const {
    swapSelectedTokens: { tokenB },
  } = StaticStore.getState().newWallet;

  const { swapImportedTokens } = StaticStore.getState().app;

  const selectedTokenB: ITokenB = {
    ...tokenB,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    image: token.image,
    balance: from.balance,
    rawBalance: from.rawBalance,
    balanceInUsd: from.balanceInUsd,
    chainId: token.chainId,
    reflectionExists: false,
    isNative: matchAddresses(token.address, NATIVE_TOKEN_ADDRESS),
    coingeckoId: token.coingeckoId,
    price: token.price,
  };

  await StaticStore.dispatch(
    setSwapSelectedTokens({
      tokenB: selectedTokenB,
    })
  );

  const swapImportedSingleToken: SwapResponse = [
    {
      chainId: token.chainId,
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.image,
    },
  ];

  await StaticStore.dispatch(
    setSwapImportedTokens([...swapImportedSingleToken, ...swapImportedTokens])
  );

  CachedService.navigation(APPSCREENS.swap, {
    state: {
      selectToken: true,
    } as SwapLocationState,
  });

  if (!selectedTokenB.coingeckoId) {
    const { id, price } = await fetchCoingeckoIDandPriceFromAddress(
      selectedTokenB.address
    );
    if (id && price > 0) {
      StaticStore.dispatch(
        setSwapSelectedTokens({
          tokenB: { ...selectedTokenB, coingeckoId: id, price },
        })
      );
    }
  }
};

/**
 * This ideal is shifted to the server side.
 * @param chainId number
 * @returns SwapResponse
 */
export const getSwapIdealTokenLists = (chainId: number) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const lists: { [chainId: string]: SwapResponse } = {
    [SupportedChainId.ETHEREUM_MAINNET]: [
      {
        chainId: SupportedChainId.ETHEREUM_MAINNET,
        name: NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET][
          NATIVE_TOKEN_NAME
        ],
        symbol:
          NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET][NATIVE_TOKEN_SYMBOL],
        address:
          NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET][
            "NATIVE_TOKEN_ADDRESS"
          ],
        decimals: NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET]["DECIMALS"],
        logoURI: NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET]["LOGO"],
      },
      {
        chainId: SupportedChainId.ETHEREUM_MAINNET,
        name: "USD Coin",
        symbol: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        name: "ePING",
        symbol: "ePING",
        logoURI: ePingLogo,
        decimals: 9,
        chainId: SupportedChainId.ETHEREUM_MAINNET,
        address: "0xc7b89491bb148551547837ea6ccb4bb5144d8e47",
      },
      {
        name: "Tether",
        symbol: "USDT",
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        decimals: 6,
        chainId: SupportedChainId.ETHEREUM_MAINNET,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
    ],
    [SupportedChainId.ETHEREUM_GOERLI]: [
      {
        chainId: SupportedChainId.ETHEREUM_GOERLI,
        name: NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI][NATIVE_TOKEN_NAME],
        symbol:
          NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI][NATIVE_TOKEN_SYMBOL],
        address:
          NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI][
            "NATIVE_TOKEN_ADDRESS"
          ],
        decimals: NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI]["DECIMALS"],
        logoURI: NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI]["LOGO"],
      },
      {
        chainId: SupportedChainId.ETHEREUM_GOERLI,
        name: "USD Coin",
        symbol: "USDC",
        address: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
        decimals: 6,
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        chainId: SupportedChainId.ETHEREUM_GOERLI,
        name: "Dai",
        symbol: "DAI",
        address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
        decimals: 18,
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      },
    ],
    [SupportedChainId.POLYGON_TESTNET]: [
      {
        chainId: SupportedChainId.POLYGON_TESTNET,
        name: NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET][NATIVE_TOKEN_NAME],
        symbol:
          NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET][NATIVE_TOKEN_SYMBOL],
        address:
          NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET][
            "NATIVE_TOKEN_ADDRESS"
          ],
        decimals: NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET]["DECIMALS"],
        logoURI: NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET]["LOGO"],
      },
      {
        chainId: SupportedChainId.POLYGON_TESTNET,
        name: "USDC",
        symbol: "USDC",
        address: "0xe11A86849d99F524cAC3E7A0Ec1241828e332C62",
        decimals: 18,
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        chainId: SupportedChainId.POLYGON_TESTNET,
        name: "Wrapped Matic",
        symbol: "WMATIC",
        address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        decimals: 18,
        logoURI: maticLogo,
      },
    ],
    [SupportedChainId.BINANCE_SMART_CHAIN]: [
      {
        chainId: SupportedChainId.BINANCE_SMART_CHAIN,
        name: NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN][
          NATIVE_TOKEN_NAME
        ],
        symbol:
          NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN][
            NATIVE_TOKEN_SYMBOL
          ],
        address:
          NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN][
            "NATIVE_TOKEN_ADDRESS"
          ],
        decimals:
          NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN]["DECIMALS"],
        logoURI: NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN]["LOGO"],
      },
      {
        chainId: SupportedChainId.BINANCE_SMART_CHAIN,
        name: "PING",
        symbol: "PING",
        address: "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
        decimals: 9,
        logoURI: pingLogo,
      },
      {
        name: "Binance USD",
        symbol: "BUSD",
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
        decimals: 18,
        chainId: SupportedChainId.BINANCE_SMART_CHAIN,
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      },
    ],
  };

  let finalList: SwapResponse = [];
  if (lists[chainId] !== undefined) {
    finalList = lists[chainId];
  }

  return finalList;
};

/**
 * Prompt the error message to the user
 */
export const dispatchInsufficientFundsMsg = () => {
  StaticStore.dispatch(
    setSwapSelectedTokens({
      error: {
        message: "Insufficient funds for gas",
        open: true,
      },
      loading: false,
    })
  );
};

/**
 * Prompt loading message to the user
 */
export const dispatchFetchingMsg = () => {
  StaticStore.dispatch(
    setSwapSelectedTokens({
      error: {
        message: "Fetching...",
        open: true,
      },
      warning: "",
    })
  );
};

/**
 * Prompt the error message to the user
 * @param {string} message
 */
export const dispatchDynamicSwapMsg = (message: string) => {
  StaticStore.dispatch(
    setSwapSelectedTokens({
      error: {
        message,
        open: true,
      },
    })
  );
};

/**
 * Validate the swap values
 * @returns {Object} {message: string, open: boolean}
 */
export const validateSwapSelectedTokensData = (
  amountTokenA: AmountTokenA,
  amountTokenB: AmountTokenB,
  tokenA: ITokenA,
  tokenB: ITokenB
) => {
  let [message, open] = ["", false];

  if (
    // Number(amountTokenA.amount) <= 0 &&
    !tokenA.address
  ) {
    message = "Choose Sell token";
    open = true;
  }

  // if (
  //   Number(amountTokenA.amount) <= 0 &&
  //   tokenA.address &&
  //   Number(amountTokenB.amount) <= 0 &&
  //   tokenB.address
  // ) {
  //   message = "Please enter the valid amount";
  //   open = true;
  // }

  if (tokenA.address && !tokenB.address) {
    message = "Choose Buy token";
    open = true;
  }

  return { message, open };
};
