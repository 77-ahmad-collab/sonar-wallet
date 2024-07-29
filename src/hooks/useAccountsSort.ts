import { useMemo } from "react";

import { ObjectOfStringsArray } from "interfaces";
import { useAppSelector } from "store/store";

/**
 * sort account addresses in an array categorized
 * by their chainFamily
 * @example
 * {
 *  EVM: [...],
 *  SOLANA: [...],
 *  NEAR: [...]
 * }
 */
export const useAccountsSort = () => {
  const { accounts } = useAppSelector((state) => state.newWallet);

  const sortedAccountsByChainFamily = useMemo(() => {
    const accountsByChainFamily: ObjectOfStringsArray = {};

    Object.values(accounts).forEach((account) =>
      accountsByChainFamily[account.chainFamily]
        ? accountsByChainFamily[account.chainFamily].push(account.address)
        : (accountsByChainFamily[account.chainFamily] = [account.address])
    );
    return accountsByChainFamily;
  }, [accounts]);

  return { sortedAccountsByChainFamily };
};
