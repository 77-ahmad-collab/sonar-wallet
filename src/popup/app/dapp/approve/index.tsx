import { useEffect, useMemo, useState } from "react";
import { EthereumLogo } from "assets/Icons";
import { DappLayout, LoadingScreen } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import { closeDappWindow, isClosingAfterConfirm } from "utils/utils.dapp";
import {
  rejectTransactionSignature,
  signTransaction,
} from "store/transaction-construction";
import { DAPPEVENTS } from "utils/constants";
import { addGas } from "utils/utils.gas";
import { setNetworkFeeSettings } from "@slices/appSlice";
import { signTypedData } from "store/signing";
import Terms from "./terms";

const Approve = () => {
  const { accounts } = useAppSelector((state) => state.newWallet);
  const { networkFeeSettings } = useAppSelector((state) => state.app);
  const {
    signTypedData: typedDataRequest,
    permission,
    dAppNetwork: dappChainId,
    transactionObject,
    dAppConnectAddress: dappAddress,
    method,
  } = useAppSelector((state) => state.dappInfo);

  const isSignTxEvent = useMemo(() => method === DAPPEVENTS.approval, [method]);

  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (dappAddress) {
      if (isSignTxEvent && typedDataRequest) {
        await dispatch(
          signTypedData({
            transaction: typedDataRequest,
            method: method as any,
          })
        );
      } else if (method === DAPPEVENTS.sendTransaction) {
        transactionObject.chainID = dappChainId;
        transactionObject.gasLimit = transactionObject.gas;
        await dispatch(
          signTransaction({
            transaction: transactionObject,
            method: {
              type: "keyring",
            } as any,
          })
        );
        closeDappWindow(true);
      }
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    setTimeout(async () => {
      if (!isClosingAfterConfirm()) {
        await dispatch(rejectTransactionSignature());
      }
    }, 1000);
    setTimeout(() => {
      closeDappWindow(false);
      setRejecting(false);
    }, 2000);
  };

  // const replaceWithBr = () => {
  //   return signingData.replace(/\n/g, "<br />");
  // };

  useEffect(() => {
    window.addEventListener("beforeunload", handleReject);
    return () => window.removeEventListener("beforeunload", handleReject);
  }, []);

  //Dapp Transafer
  useEffect(() => {
    (async () => {
      setLoading(true);
      const gasInfoResponse = await addGas(
        Number(dappChainId),
        Number(transactionObject.gas)
      );
      dispatch(
        setNetworkFeeSettings({
          ...networkFeeSettings,
          gasInfo: { ...gasInfoResponse },
        })
      );
      setLoading(false);
    })();
  }, []);

  return rejecting ? (
    <LoadingScreen text={"Rejecting ..."} />
  ) : (
    <DappLayout
      topic={isSignTxEvent ? "Sign Transaction" : "Approve token"}
      dappName={permission?.title ?? ""}
      dappImage={permission?.faviconUrl ?? ""}
      dappLink={permission?.origin ?? ""}
      onHandlerClick={() => {}}
      handleConfirm={handleConfirm}
      handleReject={handleReject}
      onEntityName={dappAddress ? accounts[dappAddress].name : ""}
      onEntityImage={EthereumLogo}
      toEntityName={permission?.origin}
      toEntityImage={permission?.faviconUrl}
      loadingConfirm={loading}
      method={method}
    >
      <div className="c-c-fe" style={{ height: "100%" }}>
        <Terms />
      </div>
    </DappLayout>
  );
};

export default Approve;
