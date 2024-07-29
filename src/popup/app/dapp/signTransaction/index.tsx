import { useEffect, useState } from "react";
import { DappLayout, LoadingScreen } from "components";
import { rejectDataSignature, signData } from "store/signing";
import { useAppDispatch, useAppSelector } from "store/store";
import { closeDappWindow, isClosingAfterConfirm } from "utils/utils.dapp";
import { Text } from "components/styled";
import { DAPPEVENTS } from "utils/constants";

const SignTransaction = () => {
  const { accounts } = useAppSelector((state) => state.newWallet);
  const { permission, dAppConnectAddress } = useAppSelector(
    (state) => state.dappInfo
  );

  const [rejecting, setRejecting] = useState(false);

  const { signDataRequest } = useAppSelector((state) => state.signing);
  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (dAppConnectAddress && signDataRequest) {
      await dispatch(
        signData({
          transaction: signDataRequest,
          method: { type: "keyring" } as any,
        })
      );
    }
    // closeDappWindow(true);
  };

  const handleReject = async () => {
    setRejecting(true);
    setTimeout(async () => {
      if (!isClosingAfterConfirm()) {
        await dispatch(rejectDataSignature());
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

  const replaceWithBr = () => {
    return signDataRequest?.rawSigningData.replace(/\n/g, "<br />") ?? "";
  };

  return rejecting ? (
    <LoadingScreen text={"Rejecting ..."} />
  ) : (
    <DappLayout
      topic="Wants to sign message"
      dappName={permission?.title ?? ""}
      dappImage={permission?.faviconUrl ?? ""}
      dappLink={permission?.origin ?? ""}
      onHandlerClick={() => {}}
      handleConfirm={handleConfirm}
      handleReject={handleReject}
      onEntityName={dAppConnectAddress ? accounts[dAppConnectAddress].name : ""}
      toEntityName={permission?.origin}
      toEntityImage={permission?.faviconUrl}
      method={DAPPEVENTS.signMessage}
    >
      <div>
        <div className="dapp-connect-box" style={{ marginTop: 20 }}>
          <div className="c-fs-c dapp-connect-terms">
            <Text
              size={14}
              style={{
                marginBottom: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                wordWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: replaceWithBr() }}
            ></Text>
          </div>
        </div>
      </div>
    </DappLayout>
  );
};

export default SignTransaction;
