import { useEffect, useMemo, useState } from "react";

import { checkIfMobile, keyDownListener } from "utils";

import validator from "validator";
import CachedService from "classes/cachedService";

export const useStep2 = (
  changeStep: (number: number) => void,
  currentStep: number
) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    message: "",
    status: false,
  });

  const isMobile = useMemo(() => checkIfMobile(), []);

  const onEnterPress = async () => {
    const validated =
      process.env.NODE_ENV === "development"
        ? true
        : validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
          });

    // const validated = process.env.NODE_ENV === "development" ? true : true;

    if (validated) {
      // no longer storing in redux
      // dispatch(SETPASSWORD(password));
      CachedService.setPassword(password);

      changeStep(3);
      setTimeout(() => {
        setPassword("");
      }, 1000);
    } else {
      setError({
        message:
          "Password must be at least 8 characters long, should contain upper & lower case letters, at least 1 number & 1 special character",
        status: true,
      });
    }
  };

  const onBackSpacePress = () => setPassword((prev) => prev.slice(0, -1));

  const onValidKeyPress = (key: string) => {
    setPassword((prev) => prev + key);

    const passwordDIV = document.querySelector(".editable-div");
    passwordDIV?.scrollTo(passwordDIV.scrollWidth, 0);
  };

  /* effects */
  useEffect(() => {
    setError({
      message: "",
      status: false,
    });

    // listen to every key pressed
    const onKeyDown = (e: KeyboardEvent) => {
      keyDownListener(
        e,
        currentStep,
        2,
        onEnterPress,
        onBackSpacePress,
        onValidKeyPress
      );
    };
    if (!isMobile) document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentStep, password]);

  return { password, error, setPassword, onEnterPress, isMobile };
};
