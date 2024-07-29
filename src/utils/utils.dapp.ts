import { StaticStore } from "store/store";
import { setNewSelectedAccount } from "store/ui";
import { validateAddress } from "./validateAddresses";
import { TX_DATA_METHOD_IDs } from "utils/constants";
import {
  setDAppConnectAddress,
  setPermission,
  // setPopupClosingAfterConfirm,
} from "@slices/dappInfoSlice";
import { IDefaultWallet } from "interfaces";
import { PermissionRequest } from "provider-bridge-shared";

export const setNewDappSelectedAccount = async (address: string) => {
  const store = StaticStore.getState();
  const selectedAccount = store.ui.selectedAccount;
  const perm = ({ ...store.dappInfo.permission } as PermissionRequest) || null;

  if (perm) {
    if (validateAddress(address, "EVM")) {
      perm.key = `${perm.origin}_${address}_${perm.chainID}`;

      perm.accountAddress = address;

      // localStorage.setItem("permission", JSON.stringify(perm)); // migrated
      // localStorage.setItem("dAppConnectAddress", `${address}`); // migrated
      StaticStore.dispatch(setPermission(perm));
      StaticStore.dispatch(setDAppConnectAddress(address));

      await StaticStore.dispatch(
        setNewSelectedAccount({ address, network: selectedAccount?.network })
      );
    }
  }
};

export const ifTxMethodExists = (
  methodId: TX_DATA_METHOD_IDs,
  data: string
) => {
  return data.toLowerCase().startsWith(methodId.toLowerCase());
};

export const isClosingAfterConfirm = () => {
  return Boolean(
    JSON.parse(`${localStorage.getItem("popupClosingAfterConfirm")}`)
  );
};

export const setClosingAfterConfirm = (bool: boolean) => {
  localStorage.setItem("popupClosingAfterConfirm", `${bool}`); // migrated
  // StaticStore.dispatch(setPopupClosingAfterConfirm(bool));
};

export const closeDappWindow = (isClosingAfterConfirm: boolean) => {
  setClosingAfterConfirm(isClosingAfterConfirm);
  window.onbeforeunload = null;
  window.close();
};

/**
 * will reload the current selected tab on browser
 */
export const reloadDapp = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0 && tabs[0].id) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
};

export const getDefaultWallet = () => {
  return localStorage.getItem("defaultWallet") as IDefaultWallet;
};

export const saveDefaultWallet = (bool: "true" | "false") => {
  return localStorage.setItem("defaultWallet", bool);
};
