import { faCheck, faKeySkeleton } from "@fortawesome/pro-light-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  DefaultWalletAlertModal,
  SlideLayoutWrapper,
  Switch,
  WrapperBackground,
} from "components";
import { useCommon } from "hooks";
import { DefaultWalletBoxWrapper, HoverableButton, Text } from "@styled";
import { useNavigate } from "react-router";
import { APPSCREENS, AUTHSCREENS } from "theme/constants";
import { useAppDispatch, useAppSelector } from "store/store";
import { setNavigationPath, setUserLoggedIn } from "@slices/appSlice";
import { useEffect, useState } from "react";

const DefaultWallet = () => {
  const { isFirstWalletImported } = useAppSelector((state) => state.app);

  const [isDefaultWalletModalOpen, setIsDefaultWalletModalOpen] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { defaultWallet, toggleDefaultWallet } = useCommon();

  const onLoad = () => {
    dispatch(setNavigationPath(AUTHSCREENS.selectDefaultWallet));
  };

  const openWallet = async () => {
    dispatch(setUserLoggedIn(true));
    await dispatch(setNavigationPath(APPSCREENS.dashboard));
    navigate(APPSCREENS.dashboard);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <WrapperBackground boxHeight="100vh" style={{ position: "relative" }}>
      <SlideLayoutWrapper>
        <div className="c-c-fs">
          <div
            className={`${isFirstWalletImported ? "r-c-c" : "c-c-fs"}`}
            style={{ marginTop: isFirstWalletImported ? "30px" : "0px" }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              color="white"
              size="2x"
              style={{
                ...(isFirstWalletImported
                  ? {
                      marginRight: "10px",
                    }
                  : { marginTop: "30px" }),
              }}
            />
            <Text
              className="f-title-md"
              style={{ margin: "20px 0px" }}
              align="center"
            >
              {isFirstWalletImported
                ? "Wallet Imported"
                : "Your Wallet is Ready"}
            </Text>
          </div>
          <DefaultWalletBoxWrapper className="mgt-sm mgb-sm">
            <div className="r-c-sb">
              <Text className="f-body-md">Set as Default Wallet</Text>
              <Switch
                checked={defaultWallet}
                handleSwitchChange={() => setIsDefaultWalletModalOpen(true)}
              />
            </div>
            <Text className="f-body-md" dim>
              Enable to make Dapp connection
            </Text>
          </DefaultWalletBoxWrapper>
          <HoverableButton
            id="DefaultWallet-openWallet"
            className="mgt-sm f-body-lg"
            isButtonDisabled={false}
            onClick={openWallet}
          >
            <FontAwesomeIcon
              icon={faKeySkeleton}
              size="lg"
              className="mgr-sm"
            />{" "}
            Open Wallet
          </HoverableButton>
        </div>
        <DefaultWalletAlertModal
          open={isDefaultWalletModalOpen}
          onClose={() => setIsDefaultWalletModalOpen(false)}
          heading={"Note"}
          body={"Your extension will be closed"}
          handler={toggleDefaultWallet}
        />
      </SlideLayoutWrapper>
    </WrapperBackground>
  );
};

export default DefaultWallet;
