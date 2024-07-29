import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@mui/material";

import { truncateAddress, truncateName } from "utils";
import {
  ACTIVITY_STATUS_TYPES,
  TX_TYPES,
  TxHistoryTitle,
} from "utils/constants";
import { Text } from "@styled";
import { TxHistoryTitleProps as PROPS } from "interfaces";
import ImageContent from "components/ImageContent";
import { useAppSelector } from "store/store";

const Title: FC<PROPS> = ({
  TxType,
  toOrFrom,
  chainId,
  status,
  name,
  isDappTransaction,
}) => {
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);
  const theme = useTheme();
  return (
    <div className="r-c-sb pd-md">
      <div className="r-c-c">
        <FontAwesomeIcon
          icon={TxHistoryTitle[TxType as keyof typeof TxHistoryTitle].icon}
          color={
            TxType === TX_TYPES.Received
              ? theme.palette.background.green
              : TxType === TX_TYPES.Sent
              ? "#3A89FF"
              : "rgba(184, 94, 255, 1)"
          }
          fontSize={22}
          className="mgr-xs"
        />
        <Text
          customStyle={{
            margin: "0px 8px ",
          }}
          weight={400}
          className="f-body-lg f-body-md "
        >
          {status === ACTIVITY_STATUS_TYPES.pending
            ? TxType === TX_TYPES.Swap
              ? "Swapping"
              : "Sending"
            : isDappTransaction
            ? "External Transaction"
            : TxHistoryTitle[TxType as keyof typeof TxHistoryTitle].title}
        </Text>
      </div>
      <div className="r-c-c">
        <Text weight={400} dim className="f-body-md">
          {TxHistoryTitle[TxType as keyof typeof TxHistoryTitle].subtitle}
        </Text>

        <Text
          customStyle={{
            marginLeft: "6px",
          }}
          weight={400}
          className="f-body-md"
        >
          {TxType !== TX_TYPES.Sent
            ? truncateName(toOrFrom)
            : name
            ? truncateName(name)
            : truncateAddress(toOrFrom)}
        </Text>
        <ImageContent
          src={NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN].LOGO}
          alt="logo"
          Size={{ width: "20px", height: "20px", marginLeft: "6px" }}
        />
      </div>
    </div>
  );
};

export default Title;
