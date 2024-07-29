import {
  Accounts,
  AccountsSum,
  FilteredAccounts,
  SecondaryHoldings,
  WalletsSum,
} from "interfaces";
import { MAINNET_CHAINS, TESTNET_CHAINS } from "utils/chains";

/**
 * @class A class to calculate all kinds of usd holdings sums of accounts,
 * chains, and wallets.
 */
export class CalculateSums {
  allAccountsSum: AccountsSum;
  allWalletsSum: WalletsSum;
  totalSum: number;
  filteredSum: number;
  isTestnet: boolean;

  constructor(isTestnet: boolean) {
    this.allAccountsSum = {};
    this.isTestnet = isTestnet;
    this.allWalletsSum = {};
    this.totalSum = 0;
    this.filteredSum = 0;
  }

  /**
   * add up total chain sum in usd and total address holding sum in usd
   * and all the accumulated sum based on the active tokens
   * @param Accounts type Accounts
   * @param secondaryHoldings type SecondaryHoldings
   */
  calculateAccountsSum(
    Accounts: Accounts,
    secondaryHoldings: SecondaryHoldings
  ) {
    const networkChainIds = Object.keys(
      this.isTestnet ? TESTNET_CHAINS : MAINNET_CHAINS
    ).map(Number);
    let totalSum = 0;

    Object.keys(Accounts).forEach((accAddress) => {
      let thisAddressSum = 0;

      networkChainIds.forEach((chainId) => {
        let thisChainSum = 0;

        if (secondaryHoldings[chainId]) {
          Object.keys(secondaryHoldings[chainId].tokens).forEach((token) => {
            if (
              secondaryHoldings[chainId].tokens[token]?.isActive &&
              secondaryHoldings[chainId].tokens[token]?.accounts[accAddress]
            ) {
              thisChainSum =
                thisChainSum +
                secondaryHoldings[chainId].tokens[token].accounts[accAddress]
                  .balanceInUsd;
            }
          });
        }

        thisAddressSum = thisAddressSum + thisChainSum;
      });

      this.allAccountsSum[accAddress] = {
        balanceInUsd: thisAddressSum,
      };
      totalSum = totalSum + thisAddressSum;
    });
    this.totalSum = totalSum;
  }

  /**
   * calculate the total usd holdings sum of each wallet
   *
   * @param accountsSum type AccountsSum
   * @param accounts type Accounts
   */
  calculateWalletSum(accountsSum: AccountsSum, accounts: Accounts) {
    Object.keys(accountsSum).forEach((accAddress) => {
      const walletId = accounts[accAddress].walletId;
      const balanceInUsd = accountsSum[accAddress].balanceInUsd;
      this.allWalletsSum[walletId] ??
        (this.allWalletsSum[walletId] = { balanceInUsd: 0 });
      const previousBalance = this.allWalletsSum[walletId].balanceInUsd;
      this.allWalletsSum[walletId] = {
        balanceInUsd: previousBalance + balanceInUsd,
      };
    });
  }

  /**
   * calculate the total usd holdings of all the selected accounts to
   * be shown on wallet dashboard
   *
   * @param accountsSum type AccountsSum
   * @param filteredAccounts type FilteredAccounts
   */
  calculateFilteredSums(
    accountsSum: AccountsSum,
    filteredAccounts: FilteredAccounts
  ) {
    // console.log(
    //   // "🚀 ~ file: calculateSums.ts:105 ~ CalculateSums ~ filteredAccounts",
    //   filteredAccounts,
    //   accountsSum
    // );
    let filteredSum = 0;
    Object.keys(accountsSum).forEach((accAddress) => {
      if (filteredAccounts[accAddress]?.isSelected) {
        filteredSum = filteredSum + accountsSum[accAddress].balanceInUsd;
      }
    });
    this.filteredSum = filteredSum;
  }
}
