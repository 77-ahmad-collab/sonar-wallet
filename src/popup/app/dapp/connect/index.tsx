import { denyOrRevokePermission, grantPermission } from "store/dapp";

import { useEffect, useMemo, useState } from "react";

import Terms from "./terms";
import { DappLayout, LoadingScreen } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import { filterAccounts } from "utils/utils.wallets";
import { NETWORKS } from "utils/constants";
import { closeDappWindow, isClosingAfterConfirm } from "utils/utils.dapp";
import { setDAppConnectAddress, setPermission } from "@slices/dappInfoSlice";

const DappConnect = () => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.newWallet);
  const {
    dAppConnectAddress,
    dAppNetwork: dappChainId,
    permission,
  } = useAppSelector((state) => state.dappInfo);

  const filteredAccounts = useMemo(() => {
    return filterAccounts({
      excludeAccounts: [],
      chainFamily: [NETWORKS.EVM],
    });
  }, [accounts]);

  /* local-state */
  const [selectedAccount, setSelectedAccount] = useState(
    filteredAccounts[0].address
  );
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  /* hooks */

  /* functions */
  const handleReject = () => {
    setRejecting(true);
    setTimeout(() => {
      if (!isClosingAfterConfirm() && permission) {
        permission.state = "deny";
        permission.accountAddress =
          selectedAccount || "0x0000000000000000000000000000000000";
        // localStorage.setItem("permission", JSON.stringify(permission)); // migrated
        dispatch(setPermission(permission));
        dispatch(denyOrRevokePermission(permission));
      }
    }, 1000);
    setTimeout(() => {
      closeDappWindow(false);
      setRejecting(false);
    }, 2000);
  };

  const handleRejectCross = async () => {
    if (!isClosingAfterConfirm() && permission) {
      permission.state = "deny";
      permission.accountAddress =
        selectedAccount || "0x0000000000000000000000000000000000";
      // localStorage.setItem("permission", JSON.stringify(permission)); // migrated
      dispatch(setPermission(permission));
      await dispatch(denyOrRevokePermission(permission));
    }
  };

  const handleConfirm = async () => {
    if (permission) {
      setLoading(true);
      setTimeout(() => {
        permission.state = "allow";
        permission.chainID = dappChainId;
        const dAppConnectAddress = selectedAccount;
        permission.key = `${permission.origin}_${dAppConnectAddress}_${dappChainId}`;
        permission.accountAddress = dAppConnectAddress;
        dispatch(setPermission(permission));
        dispatch(setDAppConnectAddress(dAppConnectAddress));
        dispatch(grantPermission(permission));
      }, 1000);
      setTimeout(() => {
        closeDappWindow(true);
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (dAppConnectAddress) {
      setSelectedAccount(dAppConnectAddress);
    }
    window.addEventListener("beforeunload", handleRejectCross);
    return () => window.removeEventListener("beforeunload", handleRejectCross);
  }, []);

  return loading || rejecting ? (
    <LoadingScreen text={`${loading ? "Connecting" : "Rejecting"} ...`} />
  ) : (
    <DappLayout
      topic="Approve Connection"
      dappName={permission?.title ?? ""}
      dappImage={permission?.faviconUrl ?? ""}
      dappLink={permission?.origin ?? ""}
      onHandlerClick={() => {}}
      handleConfirm={handleConfirm}
      handleReject={handleReject}
      onEntityName={accounts[selectedAccount].name}
      toEntityName={permission?.origin}
      toEntityImage={permission?.faviconUrl}
      loadingConfirm={loading}
    >
      <div className="c-c-fe" style={{ height: "100%" }}>
        <Terms dappName={permission?.title ?? ""} />
      </div>
    </DappLayout>
  );
};

export default DappConnect;
