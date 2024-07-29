import { setAlert, setNavigationPath, setUserLoggedIn } from "@slices/appSlice";
import { setDAppConnectAddress, setPermission } from "@slices/dappInfoSlice";
import { ETHEREUM } from "background-related/constants";
import { EVMNetwork } from "background-related/networks";
import { PermissionRequest } from "provider-bridge-shared";
import { useEffect, useMemo, useState } from "react";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { setNewDefaultWalletValue, setNewSelectedAccount } from "store/ui";
import { APPSCREENS } from "theme/constants";
import { getDefaultWallet, saveDefaultWallet } from "utils/utils.dapp";

export const useCommon = () => {
  const { filteredAccounts } = useAppSelector((state) => state.newWallet);
  const { permission, dAppNetwork: network } = useAppSelector(
    (state) => state.dappInfo
  );

  const [defaultWallet, setDefaultWallet] = useState(
    Boolean(JSON.parse(`${getDefaultWallet()}`))
  );

  const dispatch = useAppDispatch();

  /**
   * toggle on and off as default sonar wallet or metamask wallet
   */
  const toggleDefaultWallet = async () => {
    const prevDefaultWalletValue = defaultWallet;
    const perm = ({ ...permission } as PermissionRequest) || null;

    if (perm) {
      perm.key = `${perm.origin}_${""}_${perm.chainID}`;

      perm.accountAddress = "";

      // localStorage.setItem("permission", JSON.stringify(permission)); // migrated
      // localStorage.setItem("dAppConnectAddress", `${""}`); // migrated

      dispatch(setPermission(perm));
      dispatch(setDAppConnectAddress(""));
    }
    setDefaultWallet(!defaultWallet);
    saveDefaultWallet(`${!defaultWallet}`);
    dispatch(setNewSelectedAccount({ address: "", network: ETHEREUM }));
    await dispatch(setNewDefaultWalletValue(!defaultWallet));
    dispatch(setUserLoggedIn(true));
    await dispatch(setNavigationPath(APPSCREENS.dashboard));
    console.log(
      StaticStore.getState().app.isLoggedIn,
      "LOGGGGGGGGEDD IN VALUE"
    );
    window.close(); //dont remove this line

    // disconnect all dapps in case of turning off default option
    if (prevDefaultWalletValue === true) {
      disconnectDapp("");
    }
  };

  /**
   * function to disconnect sonar wallet from all dapps
   */
  const disconnectDapp = (address: string) => {
    const perm = ({ ...permission } as PermissionRequest) || null;
    if (perm) {
      const accName = StaticStore.getState().newWallet.accounts[address]?.name;
      perm.key = `${perm.origin}_${""}_${perm.chainID}`;

      perm.accountAddress = "";

      // localStorage.setItem("permission", JSON.stringify(permission)); // migrated
      dispatch(setPermission(perm));
      dispatch(
        setNewSelectedAccount({
          address: "",
          // this is a type workaround tho it does not break the code
          network: network as unknown as EVMNetwork,
        })
      );
      dispatch(setDAppConnectAddress(""));
      if (accName)
        dispatch(
          setAlert({
            open: true,
            heading: "Wallet Disconnected!",
            body: `${accName ?? "Wallet"} has been disconnected from Dapps`,
          })
        );
    }
  };

  const checkIfAllAccountsDisabled = useMemo(
    () =>
      Object.keys(filteredAccounts).every(
        (v) => filteredAccounts[v].isSelected === false
      ),
    [filteredAccounts]
  );

  useEffect(() => {
    const defaultWallet = getDefaultWallet();
    if (!defaultWallet) {
      dispatch(setNewDefaultWalletValue(true));
      setDefaultWallet(true);
    }
  }, []);

  return {
    defaultWallet,
    toggleDefaultWallet,
    disconnectDapp,
    checkIfAllAccountsDisabled,
  };
};
