import { FC } from "react";
import {
  faArrowDownRight,
  faArrowUpRight,
  faArrowsRepeat,
} from "@fortawesome/pro-light-svg-icons";

import { FunctionalityNavigatorsProps as PROPS } from "interfaces";
import { ButtonWithIcon } from "components";

const tabStyle = { borderRadius: "40px", height: "30px" };

const FunctionalityNavigators: FC<PROPS> = ({
  onReceiveClick,
  onSendClick,
  onSwapClick,
}) => {
  return (
    <div className="navigators">
      <ButtonWithIcon
        id="FunctionalityNavigators-onSendClick"
        text="Send"
        icon={faArrowUpRight}
        iconColor="white"
        onClick={onSendClick}
        style={tabStyle}
      />
      <ButtonWithIcon
        id="FunctionalityNavigators-onReceiveClick"
        text="Receive"
        icon={faArrowDownRight}
        onClick={onReceiveClick}
        iconColor="white"
        style={tabStyle}
      />
      <ButtonWithIcon
        id="FunctionalityNavigators-onSwapClick"
        text="Swap"
        icon={faArrowsRepeat}
        iconColor="white"
        onClick={onSwapClick}
        style={tabStyle}
      />
    </div>
  );
};

export default FunctionalityNavigators;
