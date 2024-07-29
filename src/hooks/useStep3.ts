import { useEffect, useMemo, useState } from "react";

import { checkIfMobile, keyDownListener } from "utils";
import CachedService from "classes/cachedService";

export const useStep3 = (
  changeStep: (number: number) => void,
  currentStep: number
) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isSomethingWrong, setIsSomethingWrong] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const onEnterPress = async () => {
    changeStep(4);
    setTimeout(() => {
      setPassword("");
      setConfirmPassword("");
      setAllCorrect(false);
    }, 700);
  };

  const isMobile = useMemo(() => checkIfMobile(), []);

  const onBackSpacePress = () =>
    setConfirmPassword((prev) => prev.slice(0, -1));

  const onValidKeyPress = (key: string) => {
    setConfirmPassword((prev) => prev + key);
    const passwordDIV = document.querySelector(".editable-div");
    passwordDIV?.scrollTo(passwordDIV.scrollWidth, 0);
  };

  /* effects */
  useEffect(() => {
    if (confirmPassword.length > 0) {
      let flag = false;
      for (let i = 0; i < confirmPassword.length; i++) {
        if (confirmPassword[i] !== password[i]) {
          flag = true;
          break;
        }
      }
      if (confirmPassword === password) {
        setAllCorrect(true);
        setIsSomethingWrong(false);
      } else {
        setAllCorrect(false);
        setIsSomethingWrong(flag);
      }
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Enter" || e.key === "NumpadEnter") &&
        currentStep === 3 &&
        password !== confirmPassword
      ) {
        setIsSomethingWrong(true);
      }

      // will trigger on every key press
      keyDownListener(
        e,
        currentStep,
        3,
        onEnterPress,
        onBackSpacePress,
        onValidKeyPress,
        password,
        confirmPassword
      );
    };

    // do not listen when accessing from mobile
    if (!isMobile) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentStep, confirmPassword, password]);

  useEffect(() => {
    const password = CachedService.getPassword();
    if (currentStep !== 4) setPassword(password);
  }, [currentStep]);

  const handleGoBack = () => {
    if (currentStep === 3) {
      changeStep(currentStep - 1);
      setIsSomethingWrong(false);
      setConfirmPassword("");
      setAllCorrect(false);
    }
  };

  return {
    allCorrect,
    confirmPassword,
    password,
    isSomethingWrong,
    handleGoBack,
    setConfirmPassword,
    onEnterPress,
    isMobile,
  };
};
