import { useMemo } from "react";
import { useAppSelector } from "store/store";
import { MAINNET_CHAINS, TESTNET_CHAINS } from "utils/chains";

/**
 * @returns current chain IDs array based on testnet or mainnet
 */
export const useNetwork = () => {
  const { isTestnet } = useAppSelector((state) => state.app);

  const currentChainIDs = useMemo(
    () => Object.keys(isTestnet ? TESTNET_CHAINS : MAINNET_CHAINS).map(Number),
    [isTestnet]
  );

  return { currentChainIDs };
};
