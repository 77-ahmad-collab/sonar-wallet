import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import SecondaryRoute from "./index2";
import { ifTxMethodExists } from "utils/utils.dapp";
import { TX_DATA_METHOD_IDs } from "utils/constants";
import { AllowedQueryParamPage } from "provider-bridge-shared";
import DappRoutes from "./dappRoutes";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { APPSCREENS, AUTHSCREENS } from "theme/constants";
import { setRoute } from "@slices/dappInfoSlice";
import { LoadingScreen } from "components";
import CachedService from "classes/cachedService";
import { LockWallet, getHashedPassword } from "utils/utils.wallets";

import navigationService from "classes/navigation";
// import { useEffect } from "react";

const Routes = () => {
  const navigateHook = useNavigate();

  useEffect(() => {
    navigationService.navigate = navigateHook;
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isDappRoute, setIsDappRoute] = useState("");
  const [isSeedPhraseRoute, setIsSeedPhraseRoute] = useState("");

  const { NETWORKCHAIN } = useAppSelector((state) => state.app);
  const { dappMethodParam, transactionObject } = useAppSelector(
    (state) => state.dappInfo
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const isUserExist = await checkUserExpiry();
      CachedService.navigation = navigate;
      checkIfDappRoutes(isUserExist);
      checkIfSeedphraseRoutes();
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    })();
  }, []);

  const checkUserExpiry = async () => {
    const { expirationTime, isUserExists } = StaticStore.getState().app;
    const memoryPassword = await getHashedPassword();
    CachedService.setHashedPassword(memoryPassword);
    if (isUserExists) {
      const currentTimestamp = new Date().getTime();
      if (currentTimestamp > expirationTime || !memoryPassword) {
        // await dispatch(setUserLoggedIn(false));
        LockWallet();
      }
    }
    return isUserExists;
  };

  const checkIfSeedphraseRoutes = () => {
    const staticState = StaticStore.getState();
    const { isLoggedIn, navigationPath, seedPhraseExpirationTime } =
      staticState.app;
    const { allWallets } = staticState.newWallet;
    if (!isLoggedIn) {
      if (
        navigationPath !== APPSCREENS.dashboard &&
        Object.keys(allWallets).length === 0
      ) {
        if (navigationPath === AUTHSCREENS.seedphrase) {
          if (new Date().getTime() >= seedPhraseExpirationTime) {
            setIsSeedPhraseRoute(AUTHSCREENS.selectAction);
          } else setIsSeedPhraseRoute(navigationPath);
        } else setIsSeedPhraseRoute(navigationPath);
      } else if (navigationPath === AUTHSCREENS.selectDefaultWallet) {
        setIsSeedPhraseRoute(navigationPath);
      }
    }
  };

  const checkIfDappRoutes = (isUserExist: boolean) => {
    if (window.location.search.includes("/dapp/connect")) {
      if (isUserExist) {
        // localStorage.setItem("route", "/dapp/connect"); // migrated
        setTheDappRoute("/dapp/connect");
      } else {
        // localStorage.setItem("route", "/dapp/no-wallet"); // migrated
        setTheDappRoute("/dapp/no-wallet");
      }
    } else if (window.location.search.includes("/dapp/send")) {
      const txObject = transactionObject as { data: string };
      const isApproveMethod = ifTxMethodExists(
        TX_DATA_METHOD_IDs.approve,
        txObject.data
      );
      if (isApproveMethod) {
        // localStorage.setItem("route", "/dapp/approve-tx"); // migrated
        setTheDappRoute("/dapp/approve-tx");
      } else {
        // localStorage.setItem("route", "/dapp/tx"); // migrated
        setTheDappRoute("/dapp/tx");
      }
    } else if (
      window.location.search.includes(AllowedQueryParamPage.changeNetwork)
    ) {
      if (
        NETWORKCHAIN[
          Number(
            (
              dappMethodParam as [
                {
                  chainId: string;
                }
              ]
            )[0].chainId
          )
        ]
      ) {
        // localStorage.setItem("route", "/dapp/change-network"); // migrated
        setTheDappRoute("/dapp/change-network");
      } else {
        // localStorage.setItem("route", "/dapp/invalid-network"); // migrated
        setTheDappRoute("/dapp/invalid-network");
      }
    } else if (
      window.location.search.includes(AllowedQueryParamPage.personalSignData)
    ) {
      // localStorage.setItem("route", "/dapp/sign-tx"); // migrated
      setTheDappRoute("/dapp/sign-tx");
    } else if (window.location.search.includes(AllowedQueryParamPage.approve)) {
      // localStorage.setItem("route", "/dapp/approve-tx"); // migrated
      setTheDappRoute("/dapp/approve-tx");
    }
  };

  const setTheDappRoute = (route: string) => {
    dispatch(setRoute(route));
    setIsDappRoute(route);
  };

  return isLoading ? (
    <LoadingScreen />
  ) : isDappRoute ? (
    <DappRoutes dappRoute={isDappRoute} />
  ) : (
    <SecondaryRoute seedPhraseRoute={isSeedPhraseRoute} />
  );
};

export default Routes;
