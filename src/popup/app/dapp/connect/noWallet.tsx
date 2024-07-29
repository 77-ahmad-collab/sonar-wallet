import { useEffect } from "react";
import { setPermission } from "@slices/dappInfoSlice";
import { ButtonWithIcon } from "components";
import { Text } from "components/styled";
import { denyOrRevokePermission } from "store/dapp";
import { useAppDispatch, useAppSelector } from "store/store";
import { closeDappWindow } from "utils/utils.dapp";

const NoWallet = () => {
  const { permission } = useAppSelector((state) => state.dappInfo);

  const dispatch = useAppDispatch();

  const handleReject = async () => {
    if (permission) {
      permission.state = "deny";
      permission.accountAddress = "0x0000000000000000000000000000000000";
      // localStorage.setItem("permission", JSON.stringify(permission)); // migrated
      dispatch(setPermission(permission));
      dispatch(denyOrRevokePermission(permission));
    }
    closeDappWindow(false);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleReject);
    return () => window.removeEventListener("beforeunload", handleReject);
  }, []);

  return (
    <div className="c-c-c" style={{ color: "white", height: "100vh" }}>
      <Text size={22} weight={600}>
        No Wallet Found!
      </Text>
      <Text size={18} align="center">
        Please create or import a wallet <br />
        from Sonar extension
      </Text>
      <ButtonWithIcon
        text="Close"
        onClick={handleReject}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default NoWallet;
