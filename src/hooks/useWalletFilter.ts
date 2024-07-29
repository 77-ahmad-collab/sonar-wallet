import { useMemo } from "react";

import { NETWORKS, NETWORK_LOGOS } from "utils/constants";
import { useAppSelector } from "store/store";
import { Account, FilteredWallet } from "components/WalletFilterCheckbox";

type FilteredWallets = {
  [walletName: string]: FilteredWallet;
};

export const useWalletFilter = () => {
  const { isTestnet } = useAppSelector((state) => state.app);
  const { allWallets, accounts, filteredAccounts, accountsSum, walletsSum } =
    useAppSelector((state) => state.newWallet);

  const filteredWallets = useMemo(() => {
    let newFilteredWallets: FilteredWallets = {};
    const chainFamilies = Object.keys(NETWORKS);

    Object.keys(allWallets).forEach(function (walletId) {
      const name = allWallets[walletId].name;
      const rawAccounts: Account[] = [];

      chainFamilies.forEach((family) => {
        const wallet = allWallets[walletId][family as keyof typeof NETWORKS];

        wallet.forEach((walletAccount) => {
          if (family === NETWORKS.NEAR && isTestnet) {
            return;
          }
          // else if (
          //   family === NETWORKS.NEAR_TESTNET &&
          //   !isTestnet
          // ) {
          //   return;
          // }

          rawAccounts.push({
            address: walletAccount,
            isSelected: filteredAccounts[walletAccount].isSelected,
            image: NETWORK_LOGOS[family as keyof typeof NETWORKS],
            name: accounts[walletAccount].name,
            // family === NETWORKS.EVM
            //   ? `Multi ${i + 1}`
            //   : // family === NETWORKS.NEAR_TESTNET
            //     // ? NETWORKS.NEAR :
            //     family,
            chainFamily: family === NETWORKS.EVM ? `(${family})` : "",
            balanceInUsd: accountsSum[walletAccount].balanceInUsd || 0,
          });
        });
      });

      newFilteredWallets = Object.assign(newFilteredWallets, {
        [walletId]: {
          name,
          accounts: rawAccounts,
          balanceInUsd: walletsSum[walletId].balanceInUsd || 0,
        },
      });
    });

    return newFilteredWallets;
  }, [
    allWallets,
    accounts,
    filteredAccounts,
    isTestnet,
    accountsSum,
    walletsSum,
  ]);

  return {
    filteredWallets,
  };
};
