import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { setAllWallets, setDefaultTokens } from "@slices/newWalletSlice";
import { useAppDispatch, useAppSelector } from "store/store";
import { encryptMessage } from "utils";
import { NETWORKS, NON_NATIVE_DEFAULT } from "utils/constants";
import { setExpirationTime } from "@slices/appSlice";
import { useAccounts } from "./useAccounts";
import { ProcessHoldings } from "classes";
import { AllWallets } from "interfaces";

export const useAllWallets = () => {
  const dispatch = useAppDispatch();
  const { createEVMAccount, createSolanaAccount, createNearAccounts } =
    useAccounts();

  const { tokenHoldings, tokenInfo, allWallets } = useAppSelector(
    (state) => state.newWallet
  );

  const {
    loginExpiryPeriod,

    TokensToBeAddedInEachAccount,
  } = useAppSelector((state) => state.app);

  /**
   * create accouts of all the chain Families e.g EVM, SOLANA, NEAR.
   * adds default list of tokens in it. then dispatch in redux.
   * @param generatedMnemonic type string
   * @param hashedPassword type string
   * @param importWallet type boolean
   * @param initialImport type boolean
   * @param walletName type string
   */
  const addWallet = useCallback(
    async (
      generatedMnemonic: string,
      hashedPassword: string,
      importWallet: boolean,
      initialImport?: boolean,
      walletName?: string
    ) => {
      const HoldingsProcessor = new ProcessHoldings(tokenHoldings, tokenInfo);

      const encryptedMnemonic = encryptMessage(
        generatedMnemonic,
        hashedPassword
      );

      const walletCount = Object.keys(allWallets).length;

      const walletId = uuidv4(); //`wallet${walletCount}`;

      const evmAccount = createEVMAccount(
        generatedMnemonic,
        hashedPassword,
        walletCount,
        walletId,
        true
      );
      const solanaAccount = await createSolanaAccount(
        generatedMnemonic,
        hashedPassword,
        walletCount,
        walletId,
        true
      );
      const allNearAccounts = await createNearAccounts(
        generatedMnemonic,
        hashedPassword,
        walletCount,
        importWallet,
        walletId,
        true
      );

      const walletFormat: AllWallets["walletName"] = {
        name: walletName ? walletName : `Wallet ${walletCount + 1}`,
        walletId,
        seedphrase: encryptedMnemonic,
        EVM: [Object.keys(evmAccount)[0]],
        SOLANA: [Object.keys(solanaAccount)[0]],
        NEAR: [Object.keys(allNearAccounts[NETWORKS.NEAR])[0]],
        // NEAR_TESTNET: [
        //   Object.keys(allNearAccounts[NETWORKS.NEAR_TESTNET])[0],
        // ],
        balanceInUsd: 0,
      };

      const newWallet: AllWallets = {
        [walletId]: walletFormat,
      };

      // add default tokens while importing a wallet through seedphrase
      HoldingsProcessor.addDefaultTokens(
        [
          1, 5, 137, 80001, 56, 97, 250, 4002, 25, 338, 43114, 43113,
          1313161554, 101, 102, 103,
        ],
        walletFormat,
        [...TokensToBeAddedInEachAccount, ...NON_NATIVE_DEFAULT]
      );
      dispatch(
        setDefaultTokens({
          tokenHoldings: HoldingsProcessor.allHoldings,
          tokenInfo: HoldingsProcessor.allTokenInfo,
        })
      );

      dispatch(setAllWallets(newWallet));
      await dispatch(
        setExpirationTime(new Date().getTime() + loginExpiryPeriod)
      );
      // await dispatch(setHashedPassword(hashedPassword));
    },
    [allWallets, tokenHoldings, tokenInfo]
  );

  return { addWallet };
};
