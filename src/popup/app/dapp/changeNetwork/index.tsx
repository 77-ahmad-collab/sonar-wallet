import { setPermChangeNetwork } from "@slices/dappInfoSlice";
import { DappLayout, LoadingScreen } from "components";
import { useEffect, useMemo, useState } from "react";
import {
  grantChangeNetworkPermission,
  rejectChangeNetworkPermission,
} from "store/dapp";
import { useAppDispatch, useAppSelector } from "store/store";

import { closeDappWindow, isClosingAfterConfirm } from "utils/utils.dapp";

const DappChangeNetwork = () => {
  const { permission, dappMethodParam } = useAppSelector(
    (state) => state.dappInfo
  );
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);

  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const chainInfo = useMemo(
    () =>
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
      ],
    [dappMethodParam]
  );

  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (permission) {
      setLoading(true);
      setTimeout(() => {
        dispatch(setPermChangeNetwork("true"));
        dispatch(grantChangeNetworkPermission(permission));
      }, 1000);
      setTimeout(() => {
        setLoading(true);
        closeDappWindow(true);
      }, 2000);
    }
  };

  const handleReject = () => {
    setRejecting(true);
    setTimeout(() => {
      if (!isClosingAfterConfirm() && permission) {
        // dispatch(grantChangeNetworkPermission(permission));
        dispatch(setPermChangeNetwork("false"));
        dispatch(
          rejectChangeNetworkPermission({
            ...permission,
            state: "deny",
          })
        );
      }
    }, 1000);
    setTimeout(() => {
      closeDappWindow(false);
      setRejecting(false);
    }, 2000);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleReject);
    return () => window.removeEventListener("beforeunload", handleReject);
  }, []);

  return loading || rejecting ? (
    <LoadingScreen text={`${loading ? "Switching" : "Rejecting"}...`} />
  ) : (
    <div style={{ color: "white" }}>
      <DappLayout
        topic="Change Network"
        dappName={permission?.title ?? ""}
        dappImage={permission?.faviconUrl ?? ""}
        dappLink={permission?.origin ?? ""}
        handleConfirm={handleConfirm}
        handleReject={handleReject}
        toEntityName={chainInfo.NAME}
        toEntityImage={chainInfo.LOGO}
        loadingConfirm={loading}
      >
        <div></div>
      </DappLayout>
    </div>
  );
};

export default DappChangeNetwork;
