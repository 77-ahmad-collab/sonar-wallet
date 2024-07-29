import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBadgeCheck,
  faSealExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { useTheme } from "@mui/material";

import { truncateAddress, truncateName } from "utils";
import { SubtitleProps as PROPS } from "interfaces";
import { Text } from "../../../../styled";
import { formatAmount } from "utils/formatters";
import { ACTIVITY_STATUS_TYPES, TX_TYPES } from "utils/constants";
import ImageContent from "components/ImageContent";

const Subtitle: FC<PROPS> = ({
  from,
  token: { image, amount, symbol },
  txType,
  status,
  name,
}) => {
  const theme = useTheme();
  return (
    <div className="r-c-sb pd-md">
      <div className="r-c-c">
        <ImageContent
          src={image}
          alt="icon"
          className="mgr-xs"
          Size={{ width: "20px", height: "20px", borderRadius: "50%" }}
        />
        <Text
          customStyle={{
            opacity: "0.7",
            marginTop: "2px",
          }}
          className="mgl-xs f-body-md"
          weight={400}
        >
          {formatAmount(+amount)}
        </Text>

        <Text
          weight={400}
          dim
          className="f-body-md"
          customStyle={{
            opacity: "0.3",
            margin: "0px 5px",
            marginTop: "2px",
          }}
        >
          {symbol}
        </Text>
        {status !== ACTIVITY_STATUS_TYPES.pending && (
          <FontAwesomeIcon
            icon={
              status === ACTIVITY_STATUS_TYPES.cancel ||
              status === ACTIVITY_STATUS_TYPES.failed
                ? faSealExclamation
                : faBadgeCheck
            }
            color={
              status === ACTIVITY_STATUS_TYPES.cancel ||
              status === ACTIVITY_STATUS_TYPES.failed
                ? theme.palette.text.danger
                : theme.palette.text.success
            }
            fontSize={20}
            className="mgl-xs"
          />
        )}
      </div>
      <div className="r-c-c">
        <Text
          weight={400}
          dim
          className="f-body-md"
          customStyle={{
            opacity: "0.3",
          }}
        >
          from
        </Text>
        <Text
          weight={500}
          size={16}
          className="f-body-md"
          customStyle={{
            opacity: "0.7",
            marginLeft: "6px",
          }}
        >
          {txType === TX_TYPES.Sent
            ? truncateName(from)
            : name
            ? truncateName(name)
            : truncateAddress(from)}
        </Text>
      </div>
    </div>
  );
};

export default Subtitle;
