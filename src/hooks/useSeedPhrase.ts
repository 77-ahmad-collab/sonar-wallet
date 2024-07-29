import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  removerUserFromAppSlice,
  setIsUserExists,
  setNavigationPath,
  setwalletCreatedAlert,
} from "store/slices/appSlice";
import { useAppDispatch, useAppSelector } from "store/store";
import { convertMnemonicToArray } from "utils/utils.seedPhrase";
import { isMnemonicSaved, setNewWallet } from "@slices/appSlice";
import { arraysAreIdentical, decryptMessage, shuffle } from "utils";
import { clearHoldings } from "@slices/newWalletSlice";
import { useAllWallets } from "./useAllWallets";
import { AUTHSCREENS } from "theme/constants";
import CachedService from "classes/cachedService";

export const useSeedPhrase = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isUserSavedMnemonic, generatedMnemonic } = useAppSelector(
    (state) => state.app
  );
  const [step, setStep] = useState(1);

  const onBackPress = async () => {
    dispatch(setwalletCreatedAlert(false));
    dispatch(setNavigationPath(AUTHSCREENS.landing));
    if (step === 2) {
      setStep(1);
    } else if (step === 1 && !isUserSavedMnemonic) {
      console.log("here???");
      dispatch(removerUserFromAppSlice());
      await dispatch(clearHoldings());
      navigate(AUTHSCREENS.landing);
    } else {
      navigate(-1);
    }
  };

  const onLoad = () => {
    dispatch(setNavigationPath(AUTHSCREENS.seedphrase));
  };

  /* effects */
  useEffect(() => {
    let mounted = true;

    const userExists = async () => {
      if (mounted) {
        if (!generatedMnemonic) {
          navigate("/index.html");
        }
      }
    };
    onLoad();
    userExists();

    return () => {
      mounted = false;
    };
  }, []);

  return { onBackPress, step, setStep };
};

export const useSeedPhraseStep1 = (setStep: (number: number) => void) => {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // const { addWallet } = useAllWallets();

  const { generatedMnemonic } = useAppSelector((state) => state.app);

  const hashedPassword = useMemo(() => CachedService.getHashedPassword(), []);

  const [mnemonic, setMnemonic] = useState<string[]>([]);

  const handleOnSave = async () => {
    setStep(2);
    // if (process.env.SKIP_SEEDPHRASE === "true") {
    //   const mnemonic = decryptMessage(generatedMnemonic, hashedPassword);
    //   await addWallet(mnemonic, hashedPassword, false);
    //   await dispatch(setUserLoggedIn(true));
    //   dispatch(isMnemonicSaved(true));
    //   dispatch(setNewWallet(false));
    //   navigate("/index.html");
    // } else {
    //   setStep(2);
    // }
  };

  useEffect(() => {
    try {
      if (generatedMnemonic && hashedPassword) {
        const decryptedMnemonic = decryptMessage(
          generatedMnemonic,
          hashedPassword
        );
        setMnemonic(convertMnemonicToArray(decryptedMnemonic));
      }
    } catch (e) {
      console.log("useSeedPhraseStep1 error", e);
    }
  }, [hashedPassword, generatedMnemonic]);

  return { mnemonic, handleOnSave };
};

export const useSeedPhraseStep2 = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const hashedPassword = useMemo(() => CachedService.getHashedPassword(), []);

  const {
    // isLoggedIn,
    generatedMnemonic,
  } = useAppSelector((state) => state.app);
  const { addWallet } = useAllWallets();

  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [seedPhraseIndex, setSeedPhraseIndex] = useState<number[]>([]);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [shuffledMnemonic, setShuffledMnemonic] = useState<string[]>([]);
  const [isSeedPhraseCorrect, setIsSeedPhraseCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animationState, setAnimationState] = useState<"fade" | "appear">(
    "fade"
  );

  const confirmSeedPhrase = (value: string, index: number) => {
    const itemCountInSeedPhrase = mnemonic.filter(
      (item: string) => item === value
    ).length;
    const userItemCountInSeedPhrase = seedPhrase.filter(
      (item: string) => item === value
    ).length;

    if (userItemCountInSeedPhrase < itemCountInSeedPhrase) {
      setSeedPhrase([...seedPhrase, value]);
      setSeedPhraseIndex([...seedPhraseIndex, index]);
    }
  };

  const handleSeedPhrase = async (walletName: string) => {
    console.log(isSeedPhraseCorrect, seedPhrase.length);
    // if (isSeedPhraseCorrect && seedPhrase.length === 12) {
    setLoading(true);
    setTimeout(async () => {
      const mnemonic = decryptMessage(generatedMnemonic, hashedPassword);
      await addWallet(mnemonic, hashedPassword, false, false, walletName);
      // else await addWallet(mnemonic, hashedPassword, false);

      dispatch(isMnemonicSaved(true));
      dispatch(setNewWallet(false));
      await dispatch(setIsUserExists(true));
      navigate(AUTHSCREENS.selectDefaultWallet);

      // if (isLoggedIn && !isNewWallet) {
      //   navigate("/near");
      // }
      // navigate("/index.html");
    }, 700);
    // } else {
    //   setSeedPhrase([]);
    //   setSeedPhraseIndex([]);
    // }
  };

  useEffect(() => {
    if (generatedMnemonic && hashedPassword) {
      const decryptedMnemonic = decryptMessage(
        generatedMnemonic,
        hashedPassword
      );
      setMnemonic(convertMnemonicToArray(decryptedMnemonic));
    }
  }, [hashedPassword, generatedMnemonic]);

  useEffect(() => {
    const arr = [...mnemonic];
    const shuffledArray = shuffle(arr);
    setShuffledMnemonic(shuffledArray);
  }, [mnemonic]);

  useEffect(() => {
    if (seedPhrase.length >= 1) {
      if (arraysAreIdentical(seedPhrase, mnemonic)) {
        setIsSeedPhraseCorrect(true);
      } else {
        setIsSeedPhraseCorrect(false);
      }
    }
  }, [seedPhrase, mnemonic]);

  useEffect(() => {
    if (isSeedPhraseCorrect && seedPhrase.length === 12)
      setTimeout(() => {
        setAnimationState("appear");
        dispatch(setNavigationPath(AUTHSCREENS.selectDefaultWallet));
        // handleSeedPhrase();
      }, 1000);
  }, [seedPhrase.length]);

  return {
    seedPhrase,
    isSeedPhraseCorrect,
    setSeedPhrase,
    shuffledMnemonic,
    setSeedPhraseIndex,
    seedPhraseIndex,
    confirmSeedPhrase,
    handleSeedPhrase,
    loading,
    setLoading,
    animationState,
    setAnimationState,
  };
};
