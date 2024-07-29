import { AddressBalanceMap } from "eth-balance-checker/lib/common";
import { getAddressesBalances } from "eth-balance-checker/lib/ethers";
import _ from "lodash";

import {
  AddressWithChainId,
  DynamicBalanceEVM,
  EthersRPCProvider,
  ITokens,
  ObjectOfStringsArray,
  SecondaryHoldings,
  SingleEthHistory,
  TokenHoldings,
  TokenInfo,
} from "interfaces";
import {
  MAINNET_CHAINS,
  MAX_ACCOUNTS_LIMIT,
  MAX_ACCOUNTS_LIMIT_WITH_PING,
  MAX_WALLETS_LIMIT,
  MAX_WALLETS_LIMIT_WITH_PING,
  MIN_PING_HOLDING_LIMIT,
  NATIVE_TOKEN_ADDRESS,
  NETWORKS,
  NON_NATIVE_DEFAULT,
  SupportedChainId,
  TESTNET_CHAINS,
  ZERO_ADDRESS,
} from "utils/constants";
import { StaticStore } from "store/store";
import { matchAddresses } from "utils";
import { fetchCoingeckoIDandPriceFromAddress } from "./utils.prices";
import { getAllAccountsOfSingleWallet } from "./utils.wallets";
import {
  setNewTokenIntroduction,
  setTokenHoldings,
  setTokenInfo,
} from "@slices/newWalletSlice";
import { ProcessHoldings } from "classes";
import CachedService from "classes/cachedService";
import { handleEVMholdings } from "./utils.holdingsEVM";
import { handleSOLANAholdings } from "./utils.holdingsSOLANA";
import { handleNEARholdings } from "./utils.holdingsNEAR";

export const getTokenHoldingGlobally = (
  tokenAddress: string,
  chainId: number
) => {
  const tokenHolding = StaticStore.getState().newWallet.tokenHoldings;
  const tokenAmount = {
    amount: 0,
  };

  for (const accAddress in tokenHolding) {
    if (Object.prototype.hasOwnProperty.call(tokenHolding, accAddress)) {
      const thisAddressHolding = tokenHolding[accAddress];
      if (thisAddressHolding[chainId]) {
        const tokenOfThisAddress = thisAddressHolding[chainId][tokenAddress];
        if (tokenOfThisAddress) {
          // const amount =
          //   +tokenOfThisAddress.rawAmount / 10 ** tokenOfThisAddress.decimals;
          // tokenAmount.amount = tokenAmount.amount + amount;
          //TODO: get holding values from secondaryholding
        }
      }
    }
  }

  return tokenAmount;
};

export const checkPingFeasibility = () => {
  const { name, symbol, address } = NON_NATIVE_DEFAULT[0];
  const binanceChain =
    StaticStore.getState().newWallet.secondaryHoldings[
      SupportedChainId.BINANCE_SMART_CHAIN
    ];
  const pingHolding = binanceChain
    ? binanceChain.tokens[`${name}_${address}_${symbol}`].balance
    : getTokenHoldingGlobally(address, SupportedChainId.BINANCE_SMART_CHAIN)
        .amount;

  return pingHolding >= MIN_PING_HOLDING_LIMIT;
};

export const checkWalletFeasibility = () => {
  const hasEnoughPing = checkPingFeasibility();
  const limit = hasEnoughPing ? MAX_WALLETS_LIMIT_WITH_PING : MAX_WALLETS_LIMIT;
  const permission =
    Object.keys(StaticStore.getState().newWallet.allWallets).length < limit;
  return {
    permission,
    hasEnoughPing,
  };
};

export const checkAccountFeasibility = (walletId: string) => {
  const hasEnoughPing = checkPingFeasibility();
  const limit = hasEnoughPing
    ? MAX_ACCOUNTS_LIMIT_WITH_PING
    : MAX_ACCOUNTS_LIMIT;
  const permission = getAllAccountsOfSingleWallet(walletId).length < limit;
  return {
    permission,
    hasEnoughPing,
  };
};

/**
 * Filters and sorts tokens by holdings based on the parameters that are passed to the function. If sortHolding set to false then returned holding won't be in sorted order
 * @param {string} string - filter string.
 * @param {SecondaryHoldings} Holdings - object containing tokens and balances.
 * @param {boolean} showZeroHoldings - show tokens with 0 holdings.
 * @param {boolean} sortHoldings - sort tokens by holdings.
 *
 * @returns {SecondaryHoldings} filteredTokens - object containing tokens and balances.
 */
export const getFilteredTokensList = (
  string: string,
  Holdings: SecondaryHoldings,
  showZeroHoldings: boolean,
  sortHoldings: boolean
): SecondaryHoldings => {
  return Object.keys(Holdings).reduce((previous, chainId) => {
    const filteredTokens: ITokens = Object.keys(
      Holdings[chainId].tokens
    ).reduce((prev, token) => {
      //show tokens that holdings are positive
      if (!showZeroHoldings && Holdings[chainId].tokens[token].balance <= 0) {
        return { ...prev };
      }

      if (token.toLowerCase().includes(string.trim().toLowerCase())) {
        return {
          ...prev,
          [token]: Holdings[chainId].tokens[token],
        };
      } else {
        return { ...prev };
      }
    }, {});

    //sort by holdings 0.1, 0.2, 0.3, 0.4 ---
    const sortedFilteredTokens = sortHoldings
      ? sortByHoldings(filteredTokens)
      : filteredTokens;

    if (Object.keys(sortedFilteredTokens).length) {
      return {
        ...previous,
        ...{
          [chainId]: {
            ...Holdings[chainId],
            tokens: sortedFilteredTokens,
          },
        },
      };
    } else {
      return { ...previous };
    }
  }, {});
};

/**
 * Sorts a tokens objects by their  holdings
 * @param {Object} obj - An object of tokens
 *
 * @returns {Object} An object of tokens sorted by holdings
 */
export const sortByHoldings = (obj: ITokens) => {
  const order: {
    [key: string]: number;
  } = {};
  const res: ITokens = {};

  Object.keys(obj).forEach((key) => {
    return (order[key] = obj[key]["balance"]);
  });

  const sortable = Object.fromEntries(
    Object.entries(order).sort(([, a], [, b]) => b - a)
  );

  Object.keys(sortable).forEach((key) => {
    res[key] = obj[key];
  });

  return res;
};

export const dynamicBalanceUpdater = async (
  dynamicBalanceChecker: DynamicBalanceEVM
) => {
  const newWalletState = StaticStore.getState().newWallet;
  await Promise.allSettled(
    Object.keys(dynamicBalanceChecker).map(async (chainId) => {
      const response: AddressBalanceMap = await getAddressesBalances(
        dynamicBalanceChecker[+chainId].web3Instance,
        dynamicBalanceChecker[+chainId].addresses,
        dynamicBalanceChecker[+chainId].tokens
          .concat(ZERO_ADDRESS)
          .filter((e) => e !== NATIVE_TOKEN_ADDRESS), //Multicall suppose ZERO_ADDRESS as a native token address
        {
          contractAddress: dynamicBalanceChecker[+chainId].contractAddress,
        }
      );

      return { chainId, response };
    })
  ).then((values) => {
    const copyTokenHoldings: TokenHoldings = JSON.parse(
      JSON.stringify(newWalletState.tokenHoldings)
    );

    let isHoldingChanged = false;

    values.forEach((value) => {
      if (value.status === "fulfilled" && value.value) {
        const { chainId, response } = value.value;
        Object.keys(response).forEach((address) => {
          Object.keys(response[address]).forEach((tokenAddress) => {
            const rawAmount = response[address][tokenAddress] || "0";

            if (matchAddresses(tokenAddress, ZERO_ADDRESS)) {
              tokenAddress = NATIVE_TOKEN_ADDRESS;
            }

            if (copyTokenHoldings[address]?.[chainId]?.[tokenAddress]) {
              if (
                copyTokenHoldings[address][chainId][tokenAddress].rawAmount !==
                rawAmount
              ) {
                isHoldingChanged = true;
              }
              copyTokenHoldings[address][chainId][tokenAddress].rawAmount =
                rawAmount;
            }
          });
        });
      }
    });

    if (isHoldingChanged) {
      StaticStore.dispatch(setTokenHoldings(copyTokenHoldings));
    }
  });
};

export const getSortedAccounts = () => {
  const accountsByChainFamily: ObjectOfStringsArray = {};

  const { accounts } = StaticStore.getState().newWallet;
  Object.values(accounts).forEach((account) =>
    accountsByChainFamily[account.chainFamily]
      ? accountsByChainFamily[account.chainFamily].push(account.address)
      : (accountsByChainFamily[account.chainFamily] = [account.address])
  );
  return accountsByChainFamily;
};

/**
 * The gateway function that executes holding functions
 * based on the chainFamily provided.
 * @param NetworksArray type Array of chainFamilies
 */
export const getHoldings = async (
  NetworksArray: Array<keyof typeof NETWORKS>
) => {
  try {
    const allAccounts = getSortedAccounts();
    const hashedPassword = CachedService.getHashedPassword();
    const { isTestnet } = StaticStore.getState().app;
    const allChainIds = Object.keys(
      isTestnet ? TESTNET_CHAINS : MAINNET_CHAINS
    ).map(Number);
    if (!_.isEmpty(allAccounts) && hashedPassword) {
      NetworksArray.forEach((chainFamily) => {
        switch (chainFamily) {
          case NETWORKS.EVM:
            handleEVMholdings(allAccounts[chainFamily], allChainIds, isTestnet);
            break;
          case NETWORKS.SOLANA:
            handleSOLANAholdings(allAccounts[chainFamily], isTestnet);
            break;
          case NETWORKS.NEAR:
            handleNEARholdings(allAccounts[chainFamily]);
            break;
          default:
            break;
        }
      });
    }
  } catch (error) {
    console.log("getHoldings error", error);
  }
};

/**
 * introduce new token to the state instantly
 * so that it is available to fetch dynamic balance immediately
 */
export const introduceNewToken = async ({
  accAddress,
  chainId,

  tokenInfo,
}: {
  accAddress: string;
  chainId: number;
  provider?: EthersRPCProvider;
  tokenInfo: TokenInfo["tokenAddress_symbol"];
}) => {
  const state = StaticStore.getState();
  const prevTokenHolding = state.newWallet.tokenHoldings;
  console.log(
    "🚀 ~ file: utils.holdings.ts:930 ~ prevTokenHolding:",
    prevTokenHolding
  );
  const holdingOfThisAddress =
    prevTokenHolding[accAddress] ?? (prevTokenHolding[accAddress] = {});
  console.log(
    "🚀 ~ file: utils.holdings.ts:931 ~ holdingOfThisAddress:",
    holdingOfThisAddress
  );
  const holdingOfThisAdressAndChain =
    holdingOfThisAddress[chainId] ?? (holdingOfThisAddress[chainId] = {});
  console.log(
    "🚀 ~ file: utils.holdings.ts:937 ~ holdingOfThisAdressAndChain:",
    holdingOfThisAdressAndChain
  );
  const tokenIdentity = `${tokenInfo.address}_${tokenInfo.symbol}`;
  console.log(
    "🚀 ~ file: utils.holdings.ts:944 ~ tokenIdentity:",
    tokenIdentity
  );
  const isTokenInfoExistForThisToken = Boolean(
    state.newWallet.tokenInfo[tokenIdentity]
  );
  console.log(
    "🚀 ~ file: utils.holdings.ts:947 ~ isTokenInfoExistForThisToken:",
    isTokenInfoExistForThisToken
  );
  const isHoldingExistForThisToken = Boolean(
    holdingOfThisAdressAndChain[tokenInfo.address]
  );
  console.log(
    "🚀 ~ file: utils.holdings.ts:957 ~ isHoldingExistForThisToken:",
    isHoldingExistForThisToken
  );

  // if the new token already exists for that address
  if (isTokenInfoExistForThisToken && isHoldingExistForThisToken) {
    // check if it is already active then no need to do anything
    if (state.newWallet.tokenInfo[tokenIdentity].isActive) return;

    // enable the token in tokenInfo and do nothing else

    console.log(
      "tokeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee enable hoa"
    );
    await StaticStore.dispatch(
      setTokenInfo({
        [tokenIdentity]: {
          ...state.newWallet.tokenInfo[tokenIdentity],
          isActive: true,
        },
      })
    );
    return;
  }

  // if code reaches here that means both tokenInfo and token Holding
  // needs to be updated
  let updatedTokenInfo = { ...tokenInfo };
  const updatedHolding = {
    [accAddress]: {
      ...holdingOfThisAddress,
      [chainId]: {
        ...holdingOfThisAdressAndChain,
        [tokenInfo.address]: {
          rawAmount: "0",
          symbol: tokenInfo.symbol,
        },
      },
    },
  };
  console.log(
    "🚀 ~ file: utils.holdings.ts:988 ~ updatedHolding:",
    updatedHolding
  );

  // if tokenInfo already exist then surely we need to enable the token only
  if (isTokenInfoExistForThisToken) {
    updatedTokenInfo = {
      ...state.newWallet.tokenInfo[tokenIdentity],
      isActive: true,
    };
  } else {
    // if tokenInfo does not exist then we will have to find it's
    // coingecko id and current token price
    const { id, price } = await fetchCoingeckoIDandPriceFromAddress(
      tokenInfo.address
    );
    updatedTokenInfo.price = price;
    updatedTokenInfo.coingeckoId = id;
  }

  // update both tokenInfo and TokenHoldings
  await StaticStore.dispatch(
    setNewTokenIntroduction({
      tokenInfo: { [tokenIdentity]: updatedTokenInfo },
      tokenHolding: updatedHolding,
    })
  );
};

/**
 * takes in newHolding and previous holding (from redux) and
 * make a deep merging of the two objects down to three layers
 *
 * @param newHolding type TokenHoldings
 * @param previousHolding type TokenHoldings
 */
export const mergeTokenHoldings = (
  newHolding: TokenHoldings,
  previousHolding: TokenHoldings
) => {
  let mergedAddressHolding: TokenHoldings = {};
  for (const address in newHolding) {
    mergedAddressHolding[address] ?? (mergedAddressHolding[address] = {});
    const newAddressHolding = newHolding[address];
    const prevAddressHolding =
      previousHolding[address] ?? (previousHolding[address] = {});

    let mergedChainHolding = {};

    for (const chain in newAddressHolding) {
      const newChainHolding = newAddressHolding[chain];
      const prevChainHolding =
        prevAddressHolding[chain] ?? (prevAddressHolding[chain] = {});
      mergedChainHolding = {
        ...mergedChainHolding,
        [chain]: Object.assign({}, prevChainHolding, newChainHolding),
      };
    }

    mergedAddressHolding = {
      ...mergedAddressHolding,
      [address]: Object.assign({}, prevAddressHolding, mergedChainHolding),
    };
  }
  return mergedAddressHolding;
};

/**
 * Proccess every holding response except Ankr's. it's accepts nested SettledPromises
 * of an array of object { holdings, chainId, address }.
 * @param holdingres
 * @param HoldingsProcessor
 */
export const processNormalTokenHolding = (
  holdingres: PromiseSettledResult<
    | PromiseSettledResult<{
        holdings: SingleEthHistory[];
        chainId: number;
        address: string;
      }>[]
    | undefined
  >[],
  HoldingsProcessor: ProcessHoldings
) => {
  // iterate over the nested promises and process only the fulfilled promises
  holdingres.forEach((ParentPromiseArr) => {
    if (ParentPromiseArr.status === "fulfilled" && ParentPromiseArr.value) {
      const childPromiseArr = ParentPromiseArr.value;
      childPromiseArr.forEach((childPromiseArr) => {
        if (childPromiseArr.status === "fulfilled" && childPromiseArr.value) {
          const res = childPromiseArr.value;
          if (res.holdings.length) {
            HoldingsProcessor.processTokenHoldings(
              res.holdings,
              res.chainId,
              res.address
            );
          }
        }
      });
    }
  });
};

/**
 * Calls after the holdings have been fetched and processed
 * accepts an Object of ProcessHoldings class
 * @param HoldingsProcessor type ProcessHoldings
 */
export const ChoresAfterHoldingProcess = async (
  HoldingsProcessor: ProcessHoldings,
  txHistoryAddresses: AddressWithChainId[] = []
) => {
  // fetch coingeckoIds for the token addresses
  await HoldingsProcessor.injectCoingeckoIdsInTokenInfo();

  console.log({ HoldingsProcessor }, "HOLDING PROCESSOR");
  // fetch tokens usd prices for those who's coingecko id exist
  await HoldingsProcessor.fetchTokenPrices();

  if (txHistoryAddresses.length) {
    HoldingsProcessor.calculateRemainingBalanceInUsds(txHistoryAddresses);
  }

  // add to redux
  await StaticStore.dispatch(setTokenInfo(HoldingsProcessor.allTokenInfo));

  // make a deep copy of tokenholdings to merge
  const prevHoldings = JSON.parse(
    JSON.stringify(StaticStore.getState().newWallet.tokenHoldings)
  );
  await StaticStore.dispatch(
    setTokenHoldings(
      mergeTokenHoldings(HoldingsProcessor.allHoldings, prevHoldings)
    )
  );
  HoldingsProcessor.clearAllTokenInfo();
  HoldingsProcessor.clearAllHoldings();
  HoldingsProcessor.cleartokenAddandIdentitiesCoingeckoIds();
};
