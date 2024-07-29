import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import { checkIfMobile, decryptMessage, keyDownListener } from "utils";
import { EVM, HASHEDPASSWORD } from "utils/constants";
import { setExpirationTime, setUserLoggedIn } from "store/slices/appSlice";
import { useAppDispatch, useAppSelector } from "store/store";
import CachedService from "classes/cachedService";
import { setSessionStorageValue } from "utils/utils.storage";

export const useLogin = (currentStep: number) => {
  const dispatch = useAppDispatch();

  const { allWallets, accounts } = useAppSelector((state) => state.newWallet);
  const { loginExpiryPeriod } = useAppSelector((state) => state.app);

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    status: false,
  });

  const isMobile = useMemo(() => checkIfMobile(), []);

  const [showResetWallet, setShowResetWallet] = useState(false);

  const onEnterPress = () => {
    document.removeEventListener("keydown", onKeyDown);
    if (!isLoading) {
      hanldleLogin();
    }
  };

  const onBackSpacePress = () => setPassword((prev) => prev.slice(0, -1));

  const onValidKeyPress = (key: string) => {
    setPassword((prev) => prev + key);
    const passwordDIV = document.querySelector(".editable-div");
    passwordDIV?.scrollTo(passwordDIV.scrollWidth, 0);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    keyDownListener(
      event,
      currentStep,
      1,
      onEnterPress,
      onBackSpacePress,
      onValidKeyPress
    );
  };

  // const handleRemoveListener = () => document.removeEventListener("keydown", onKeyDown)
  // const handleAddEventListener = () => document.addEventListener("keydown", onKeyDown)

  useEffect(() => {
    if (showResetWallet) {
      document.removeEventListener("keydown", onKeyDown);
    } else if (!isMobile) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentStep, error, password, isLoading, showResetWallet]);

  useEffect(() => {
    const alertTime = setTimeout(() => {
      setError({
        message: "",
        status: false,
      });
    }, 2000);
    return () => {
      clearTimeout(alertTime);
    };
  }, [error]);

  /**
   * hash the given password and perform decryption to check
   * if the password is correct or not.
   */
  const hanldleLogin = async () => {
    try {
      if (password.length > 0) {
        setIsLoading(true);

        const hashedPassword = ethers.utils.hashMessage(password);
        const firstWallet = Object.values(allWallets)[0];
        const accountAddress = firstWallet[EVM][0];
        const accountSecret = accounts[accountAddress].secret;

        const decryptResult = await decryptMessage(
          accountSecret,
          hashedPassword
        );

        if (decryptResult !== undefined) {
          await setSessionStorageValue(HASHEDPASSWORD, hashedPassword);
          CachedService.setHashedPassword(hashedPassword);
          dispatch(setExpirationTime(new Date().getTime() + loginExpiryPeriod));
          dispatch(setUserLoggedIn(true));
          setPassword('')
        } else
          setError({
            message: "Password is incorrect",
            status: true,
          });

        setIsLoading(false);
      } else
        setError({
          message: "Please enter your password",
          status: true,
        });
    } catch (error) {
      setError({
        message: "Password is incorrect",
        status: true,
      });
      setIsLoading(false);
     
    }
  };

  return {
    password,
    error,
    hanldleLogin,
    isLoading,
    showResetWallet,
    setShowResetWallet,
    setPassword,
    isMobile,
  };
};
