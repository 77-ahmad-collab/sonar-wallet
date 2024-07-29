import axios from "axios";
import { Account } from "near-api-js/lib/account";
import { Near, connect } from "near-api-js";

import { SingleEthHistory } from "interfaces";
import {
  API,
  CONFIG,
  DUMMY_IMAGE_URL,
  SupportedChainId,
} from "utils/constants";
import { ProcessHoldings } from "classes";
import {
  ChoresAfterHoldingProcess,
  processNormalTokenHolding,
} from "./utils.holdings";
import BigNumber from "bignumber.js";
import { toFixed } from "./formatters";
import { StaticStore } from "store/store";

/**
 * loops through all the NEAR accounts and fetch balance
 * @param allNEARaccounts string[]
 */
export const handleNEARholdings = async (allNEARaccounts: string[]) => {
  const HoldingsProcessor = new ProcessHoldings();

  const holdingres = await Promise.allSettled(
    [SupportedChainId.NEAR].map(async (chainId) => {
      try {
        return await Promise.allSettled(
          allNEARaccounts.map(async (address) => {
            const holdings = await fetchNearTokenHolding(address, chainId);
            if (typeof holdings === "object") {
              return { holdings, chainId, address };
            } else {
              return Promise.reject();
            }
          })
        );
      } catch (error) {
        console.log(error);
      }
    })
  );

  processNormalTokenHolding(holdingres, HoldingsProcessor);

  await ChoresAfterHoldingProcess(HoldingsProcessor);
};

export const fetchNearTokenHolding = async (
  nearAccountId: string,
  network: number
) => {
  try {
    const { NETWORKCHAIN } = StaticStore.getState().app;
    const nearToken = {
      tokenName: NETWORKCHAIN[SupportedChainId.NEAR].NAME,
      tokenSymbol: NETWORKCHAIN[SupportedChainId.NEAR].NATIVE_TOKEN_SYMBOL,
      tokenBalance: 0,
      tokenBalanceRawInteger: "0",
      priceInUSD: 0,
      tokenAddress: NETWORKCHAIN[SupportedChainId.NEAR].NATIVE_TOKEN_ADDRESS,
      tokenDecimal: NETWORKCHAIN[SupportedChainId.NEAR].DECIMALS,
      image: NETWORKCHAIN[SupportedChainId.NEAR].LOGO,
      tokenPrice: "0",
    };

    const near = await connect(CONFIG[network]);
    const account = await near.account(nearAccountId);
    const { availableNativeBalance, availableNativeBalanceInRaw } =
      await fetchNearBalance(account);

    const allTokens = await showAllHoldingsNear(nearAccountId, near, network);
    if (availableNativeBalance > 0) {
      Object.assign(nearToken, {
        tokenBalance: availableNativeBalance,
        tokenBalanceRawInteger: availableNativeBalanceInRaw.toString(),
      });
    }

    return [...allTokens, nearToken];
  } catch (error) {
    // console.log("near error", error);
    return [];
  }
};

export const fetchNearBalance = async (account: Account) => {
  const balance = await account.getAccountBalance();
  const availableNear = new BigNumber(balance.total)
    .minus(new BigNumber(balance.stateStaked))
    .minus(new BigNumber(50000000000000000000000)) // 0.05 * 10 ** 24
    .toString();

  return {
    availableNativeBalance: Number(availableNear) / 10 ** 24,
    availableNativeBalanceInRaw: toFixed(availableNear),
  };
};

export const showAllHoldingsNear = async (
  accountID: string,
  near: Near,
  network: number
) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const { data } = await axios.get(
    `${
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API]
    }/account/${accountID}/likelyTokens`
  );
  const account = await near.account(accountID);
  const tokensInfo: SingleEthHistory[] = [];

  await Promise.all(
    data.map(async (token: string) => {
      try {
        const tokenInfo = await account.viewFunction(token, "ft_metadata", {
          account_id: accountID,
        });

        const balance = await account.viewFunction(token, "ft_balance_of", {
          account_id: accountID,
        });

        tokensInfo.push({
          tokenName: tokenInfo.name,
          tokenSymbol: tokenInfo.symbol,
          tokenBalance: balance / 10 ** tokenInfo.decimals,
          tokenBalanceRawInteger: balance.toString(),
          tokenAddress: token,
          tokenDecimal: tokenInfo.decimals,
          image: DUMMY_IMAGE_URL,
          priceInUSD: 0, //balance / 10 ** tokenInfo.decimals, //! need to correct this
          tokenPrice: "0", //! get coingecko id to fetch usd rate
        });
      } catch (error) {
        return false;
      }
    })
  );

  return tokensInfo;
};
