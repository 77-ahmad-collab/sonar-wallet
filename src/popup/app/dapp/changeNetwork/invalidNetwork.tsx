import { ButtonWithIcon } from "components";
import { Text } from "components/styled";
import { useAppDispatch, useAppSelector } from "store/store";
import { grantChangeNetworkPermission } from "store/dapp";

const InvalidNetwork = () => {
  const { permission } = useAppSelector((state) => state.dappInfo);
  const dispatch = useAppDispatch();
  const handleReject = async () => {
    if (permission) {
      dispatch(grantChangeNetworkPermission(permission));
    }
    window.onbeforeunload = null;
    window.close();
  };
  return (
    <div className="c-c-c" style={{ color: "white", height: "100vh" }}>
      <Text size={22} weight={600}>
        Invalid Network
      </Text>
      <Text size={18}>Sonar Wallet does not support this network</Text>
      <ButtonWithIcon
        text="Keep existing Network"
        onClick={handleReject}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default InvalidNetwork;
