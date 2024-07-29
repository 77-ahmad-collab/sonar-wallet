import { useEffect, useMemo, useState } from "react";
import * as Bip39 from "bip39";

import { useAppDispatch } from "store/store";
import { setGeneratedMnemonic, setwalletCreatedAlert } from "@slices/appSlice";
import { useNavigate } from "react-router";
import { AUTHSCREENS } from "theme/constants";
import { encryptMessage } from "utils";
import CachedService from "classes/cachedService";

export const useStep4 = () => {
  type Tabs = {
    createWalletDisabled: boolean;
    importWalletDisabled: boolean;
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const password = useMemo(() => CachedService.getPassword(), []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    status: false,
  });
  const [actionOptions, setActionOptions] = useState<Tabs>({
    createWalletDisabled: false,
    importWalletDisabled: false,
  });

  // uses Bip39 to generate a new random mnemonic
  const spitMnemonic = async () => {
    const generatedMnemonic = Bip39.generateMnemonic();

    const encryptedMnemonic = encryptMessage(
      generatedMnemonic,
      CachedService.getHashedPassword()
    );

    await dispatch(
      setGeneratedMnemonic({
        mnemonic: encryptedMnemonic,
      })
    );
  };

  const onImportWallet = () => {
    if (!actionOptions.createWalletDisabled) {
      setIsLoading(true);
      setActionOptions((prev) => {
        return { ...prev, createWalletDisabled: true };
      });
      setTimeout(() => {
        navigate(AUTHSCREENS.ImportWallet);
      }, 1000);
    }
  };

  const handleLogin = () => {
    try {
      setIsLoading(true);
      setActionOptions((prev) => {
        return { ...prev, importWalletDisabled: true };
      });

      setTimeout(() => {
        spitMnemonic();
        dispatch(setwalletCreatedAlert(true));
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initialTime = setTimeout(() => {
      setError({
        message: "",
        status: false,
      });
    }, 3000);
    return () => clearTimeout(initialTime);
  }, [error.status]);

  return {
    setError,
    error,
    actionOptions,
    setActionOptions,
    isLoading,
    handleLogin,
    onImportWallet,
  };
};
