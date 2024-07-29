import { FC } from "react";

import { InternalRainbowBoxStyled, RainbowButtonStyled, Text } from "@styled";
import { EthereumLogo } from "assets/Icons";
import { DappLayoutProps as PROPS } from "interfaces";
import { DAPPEVENTS } from "utils/constants";
import ButtonWithIcon from "components/ButtonWithIcon";
import RainbowLoader from "components/RainbowLoader";
import { VerifyIcon } from "assets/images";

const DappLayout: FC<PROPS> = ({
  children,
  hideFooter = false,
  method,
  onHandlerClick = () => {},
  handleConfirm,
  handleReject,
  toEntityImage = EthereumLogo,
  toEntityName = "account",
  onEntityImage = EthereumLogo,
  onEntityName,
  topic,
  loadingConfirm = false,
  disableReject = false,
  containerStyle = {},
}) => {
  return (
    <div className="dapp-layout-parent c-c-fs" style={{ ...containerStyle }}>
      <div className="c-fs-c" style={{ width: "100%", padding: "0px 15px" }}>
        <Text size={40} style={{ width: "70%" }}>
          {topic}
        </Text>

        <div className="r-c-c" style={{ marginTop: 20 }}>
          {topic === "Confirm Transaction" ? (
            <Text size={15} opacity={0.7}>
              by
            </Text>
          ) : (
            <Text size={15} opacity={0.7}>
              to
            </Text>
          )}

          <div
            className="r-c-c"
            style={{
              marginLeft: 10,
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={onHandlerClick}
          >
            <img src={toEntityImage} className="network-logo" />
            <Text size={14} weight={500}>
              {toEntityName}
            </Text>
            <img src={VerifyIcon} className="network-verify-logo" />
          </div>
        </div>
        {onEntityName && (
          <div className="r-c-c" style={{ marginTop: 20 }}>
            <Text size={15} opacity={0.7}>
              on
            </Text>
            <div
              className="r-c-c"
              style={{
                marginLeft: 10,
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.06)",
                padding: "10px",
                borderRadius: "12px",
              }}
              onClick={onHandlerClick}
            >
              <img src={onEntityImage} className="network-logo" />
              <Text size={20} weight={500}>
                {onEntityName}
              </Text>
            </div>
          </div>
        )}
      </div>
      <div className="c-c-fs" style={{ flex: 1, width: "100%" }}>
        <div
          style={{
            flex: 1,
            width: "100%",

            position: "relative",
          }}
        >
          {children}
        </div>
        {!hideFooter && (
          <div
            className="r-c-sb"
            style={{ width: "100%", padding: "0px 15px" }}
          >
            <ButtonWithIcon
              text="Reject"
              iconColor="white"
              onClick={() => handleReject && !disableReject && handleReject()}
              style={{ width: "30%" }}
            />
            <RainbowButtonStyled style={{ flex: 1 }}>
              <InternalRainbowBoxStyled
                isHoldFinish={false}
                className="r-c-c"
                onClick={handleConfirm}
              >
                {loadingConfirm ? (
                  <RainbowLoader
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    size={25}
                  />
                ) : (
                  <Text className="f-body-md" weight={600}>
                    {method === DAPPEVENTS.signMessage ||
                    method === DAPPEVENTS.approval
                      ? "Sign"
                      : "Confirm"}
                  </Text>
                )}
              </InternalRainbowBoxStyled>
            </RainbowButtonStyled>
          </div>
        )}
      </div>
    </div>
  );
};

export default DappLayout;
