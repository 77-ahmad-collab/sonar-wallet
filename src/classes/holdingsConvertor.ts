import { MAINNET_CHAINS, TESTNET_CHAINS } from "../utils/chains";

import {
  Accounts,
  AllWallets,
  FilteredAccounts,
  GraphQueryData,
  NumOfTokens,
  SecondaryHoldings,
  TokenHoldings,
  TokenInfo,
} from "interfaces";
import { toFixed } from "utils/formatters";
import { formatUnits } from "ethers/lib/utils";
import { StaticStore } from "store/store";

/**
 * @class converts tokenHoldings to secondaryHoldings and filteredHoldings
 */
export class HoldingsConvertor {
  secondaryHoldings: SecondaryHoldings;
  filteredHoldings: SecondaryHoldings;
  isTestnet: boolean;
  numOfTokens: NumOfTokens;
  graphQueryData: GraphQueryData;

  /**
   * @param isTestnet type boolean
   */
  constructor(isTestnet: boolean) {
    this.secondaryHoldings = {};
    this.filteredHoldings = {};
    this.isTestnet = isTestnet;
    this.numOfTokens = { active: 0, inActive: 0, total: 0 };
    this.graphQueryData = {};
  }

  /**
   * converts tokenHoldings to secondaryHoldings format and filterHoldings
   * which are then rendered everywhere on the app
   * @param tokenHoldings type TokenHoldings
   * @param tokenInfo type TokenInfo
   * @param filteredAccounts type FilteredAccounts
   * @param accounts type Accounts
   * @param wallets type AllWallets
   */
  toSecondaryHoldings(
    tokenHoldings: TokenHoldings,
    tokenInfo: TokenInfo,
    filteredAccounts: FilteredAccounts,
    accounts: Accounts,
    wallets: AllWallets
  ) {
    const networkChains = this.isTestnet ? TESTNET_CHAINS : MAINNET_CHAINS;

    Object.keys(tokenHoldings).forEach((accAddress) => {
      const thisAccHoldings = tokenHoldings[accAddress];

      Object.keys(thisAccHoldings).forEach((chainId) => {
        if (networkChains[Number(chainId) as keyof typeof networkChains]) {
          const thisChainHoldings = thisAccHoldings[chainId];
          Object.keys(thisChainHoldings).forEach((tokenAddress) => {
            const thisTokenHoldings = thisChainHoldings[tokenAddress];

            const tokenInfoIdentity = `${tokenAddress}_${thisTokenHoldings.symbol}`;
            const { name, address, symbol, isActive, price, decimals } =
              tokenInfo[tokenInfoIdentity];

            //convert rawAmount into amount and calculate usd prices
            const amount = Number(
              toFixed(formatUnits(thisTokenHoldings.rawAmount, decimals))
            );
            const amountInUsd = Number(toFixed(amount * price));

            // count active and inactive token
            this.numOfTokens.total++;
            isActive ? this.numOfTokens.active++ : this.numOfTokens.inActive++;
            //---------------------------------
            const tokenIdentity = `${name}_${address}_${symbol}`;
            const accountName = accounts[accAddress].name;
            const walletName = wallets[accounts[accAddress].walletId].name;
            const NETWORKCHAIN = StaticStore.getState().app.NETWORKCHAIN;

            const initialHoldings = {
              name: NETWORKCHAIN[Number(chainId) as keyof typeof NETWORKCHAIN]
                .NAME,
              image:
                NETWORKCHAIN[Number(chainId) as keyof typeof NETWORKCHAIN].LOGO,
              balanceInUsd: 0,
              tokens: {},
            };

            // if account is selected and token is Active then also convert them in FilteredHolding as well
            if (filteredAccounts[accAddress].isSelected && isActive) {
              const copyFilteredHoldings: SecondaryHoldings = JSON.parse(
                JSON.stringify(this.filteredHoldings)
              );

              copyFilteredHoldings[chainId] ??
                (copyFilteredHoldings[chainId] = initialHoldings);

              this.filteredHoldings = JSON.parse(
                JSON.stringify(
                  this.#processData(
                    chainId,
                    accAddress,
                    copyFilteredHoldings,
                    tokenIdentity,
                    {
                      amount,
                      amountInUsd,
                      rawAmount: thisTokenHoldings.rawAmount,
                    },
                    tokenInfo[tokenInfoIdentity],
                    accountName,
                    walletName
                  )
                )
              );

              // collect the coingecko id and amount to query for graph and profit
              this.#processGraphQueryData(
                tokenInfo[tokenInfoIdentity].coingeckoId,
                amount
              );
            }

            const copySecondary: SecondaryHoldings = JSON.parse(
              JSON.stringify(this.secondaryHoldings)
            );

            copySecondary[chainId] ??
              (copySecondary[chainId] = initialHoldings);

            this.secondaryHoldings = JSON.parse(
              JSON.stringify(
                this.#processData(
                  chainId,
                  accAddress,
                  copySecondary,
                  tokenIdentity,
                  {
                    amount,
                    amountInUsd,
                    rawAmount: thisTokenHoldings.rawAmount,
                  },
                  tokenInfo[tokenInfoIdentity],
                  accountName,
                  walletName
                )
              )
            );
          });
        }
      });
    });
  }

  /**
   * Core logic to convert tokenHolding to secondaryHoldings
   * @param chainId type string
   * @param accAddress type string
   * @param copySecondary type SecondaryHoldings
   * @param tokenIdentity string
   * @param thisTokenHoldings type {
   *  amount: number;
      amountInUsd: number;
   * }
   * @param thisTokenInfo type TokenInfo["tokenAddress_symbol"]
   * @param accountName type string
   * @param walletName type string
   * @returns formatted data in SecondaryHolding
   */
  #processData(
    chainId: string,
    accAddress: string,
    copySecondary: SecondaryHoldings,
    tokenIdentity: string,
    thisTokenHoldings: {
      amount: number;
      rawAmount: string;
      amountInUsd: number;
    },
    thisTokenInfo: TokenInfo["tokenAddress_symbol"],
    accountName: string,
    walletName: string
  ) {
    const { name, symbol, image, address, decimals, isActive, price } =
      thisTokenInfo;

    const usdAmouunt = thisTokenHoldings.amount * price;

    if (copySecondary[chainId].tokens[tokenIdentity]) {
      if (thisTokenHoldings.amount > 0) {
        // if the same token in same chain already exists in secondary holding then only add the amounts and accounts
        // add another account
        copySecondary[chainId].tokens[tokenIdentity].accounts = {
          ...copySecondary[chainId].tokens[tokenIdentity].accounts,
          [accAddress]: {
            name: accountName,
            balance: thisTokenHoldings.amount,
            rawBalance: thisTokenHoldings.rawAmount,
            balanceInUsd: usdAmouunt,
            walletName,
          },
        };
        // accumulate the chain sum in usd
        copySecondary[chainId].balanceInUsd =
          copySecondary[chainId].balanceInUsd + usdAmouunt;

        // accumulate the token balance
        copySecondary[chainId].tokens[tokenIdentity].balance =
          copySecondary[chainId].tokens[tokenIdentity].balance +
          thisTokenHoldings.amount;

        // accumulate the token raw balance
        copySecondary[chainId].tokens[tokenIdentity].rawBalance = toFixed(
          Number(copySecondary[chainId].tokens[tokenIdentity].rawBalance) +
            Number(thisTokenHoldings.rawAmount)
        );

        // accumulate the token balance in usd
        copySecondary[chainId].tokens[tokenIdentity].balanceInUsd =
          copySecondary[chainId].tokens[tokenIdentity].balanceInUsd +
          usdAmouunt;
      }
    } else {
      // else add a fresh new token with account
      copySecondary[chainId] = {
        ...copySecondary[chainId],
        balanceInUsd: copySecondary[chainId].balanceInUsd + usdAmouunt,
        tokens: {
          ...copySecondary[chainId].tokens,
          [tokenIdentity]: {
            address,
            name,
            symbol,
            decimals,
            image,
            isActive,
            balance: thisTokenHoldings.amount,
            rawBalance: thisTokenHoldings.rawAmount,
            balanceInUsd: usdAmouunt,
            accounts:
              thisTokenHoldings.amount > 0
                ? {
                    [accAddress]: {
                      name: accountName,
                      balance: thisTokenHoldings.amount,
                      rawBalance: thisTokenHoldings.rawAmount,
                      balanceInUsd: usdAmouunt,
                      walletName,
                    },
                  }
                : {},
          },
        },
      };
    }

    return copySecondary;
  }

  #processGraphQueryData(coingeckoId: string, amount: number) {
    if (coingeckoId !== "" && amount > 0) {
      this.graphQueryData = {
        ...this.graphQueryData,
        [coingeckoId]: amount,
      };
    }
  }
}
