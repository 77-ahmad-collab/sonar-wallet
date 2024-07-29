import { FC } from "react";
import {
  faChevronDown,
  faChevronUp,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  CrossIconWrapper,
  DarkBackgroundStyled,
  RainbowStyled,
  SnackBarHeaderStyled,
  Text,
} from "@styled";
import { SnackBarHeaderProps as PROPS } from "interfaces";

import { SpeedUpCancelButton } from "components";

const SnackBarHeaderPendingState: FC<PROPS> = ({
  height,
  snackBarExpandedHeight,
  expandSnackBar,
  text,
  closeSnackBar,
  snackBarData,
}) => {
  return (
    <div className="snackbarHeaderWrapper" onClick={expandSnackBar}>
      <SnackBarHeaderStyled className="r-c-sb">
        <RainbowStyled>
          <DarkBackgroundStyled />
        </RainbowStyled>

        <div className="snackbarTextBox">
          {height === snackBarExpandedHeight && (
            <FontAwesomeIcon
              icon={faChevronDown}
              color="white"
              className="chevronDown"
            />
          )}
          <Text
            size={14}
            weight={400}
            className={
              height !== snackBarExpandedHeight
                ? "snackbarText"
                : "snackbarTextExpandedState"
            }
          >
            {text}
          </Text>
          {height !== snackBarExpandedHeight && (
            <FontAwesomeIcon
              icon={faChevronUp}
              color="white"
              className="chevronDown"
            />
          )}
        </div>

        <CrossIconWrapper onClick={closeSnackBar}>
          <FontAwesomeIcon icon={faXmark} color="white" size="lg"/>
        </CrossIconWrapper>
      </SnackBarHeaderStyled>
      {height !== snackBarExpandedHeight && (
        <div style={{ paddingLeft: "10px" }}>
          <SpeedUpCancelButton
            isSpeedUpCancelBlinking={snackBarData.isSpeedUpCancelBlinking}
            isSpeedUpEnabled={snackBarData.isSpeedUpEnabled}
            isCancelEnabled={snackBarData.isCancelEnabled}
            rawData={snackBarData.rawData}
            transactionHash={snackBarData.transactionHash}
            txType={snackBarData.txType}
            tokenAddress={snackBarData.token.address}
          />
        </div>
      )}
    </div>
  );
};

export default SnackBarHeaderPendingState;
