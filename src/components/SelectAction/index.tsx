import { pingLogo } from "assets/images";
import { WrapperBackground } from "components";
import { Text } from "@styled";
import { Web3 } from "assets/Icons";
import ActionList from "./components/actionList";
import ActionAlert from "./components/actionAlert";
import { useAppDispatch, useAppSelector } from "store/store";
import { useEffect } from "react";
import { setNavigationPath, setwalletCreatedAlert } from "@slices/appSlice";
import { AUTHSCREENS } from "theme/constants";

const SelectAction = () => {
  const { walletCreatedAlert } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  const onLoad = () => {
    dispatch(setNavigationPath(AUTHSCREENS.selectAction));
    dispatch(setwalletCreatedAlert(false));
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <WrapperBackground style={{ position: "relative" }} boxHeight="100vh">
      <img className="sonar-img mgb-lg" src={pingLogo} alt="SonarWalletLogo" />
      <Text className="mgt-lg f-title-md">Welcome to</Text>
      <img src={Web3} alt="Web3Logo" />
      {walletCreatedAlert ? <ActionAlert /> : <ActionList />}
    </WrapperBackground>
  );
};

export default SelectAction;
