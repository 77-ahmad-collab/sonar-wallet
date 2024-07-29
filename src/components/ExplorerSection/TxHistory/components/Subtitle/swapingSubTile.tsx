import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBadgeCheck,
  faSealExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { useTheme } from "@mui/material";

import { SpanOpacityStyled, Text } from "@styled";
import { SwapingSubTileProps as PROPS } from "interfaces";
import { formatAmount } from "utils/formatters";
import { ACTIVITY_STATUS_TYPES } from "utils/constants";
import { truncateName } from "utils";
import ImageContent from "components/ImageContent";

const SwapingSubTile: FC<PROPS> = ({
  TokenA,
  TokenB,
  status,
  isDappTransaction,
}) => {
  const theme = useTheme();

  return (
    <div className="r-c-fs pd-sm">
      {isDappTransaction ? (
        <Text size={14}>
          {status === ACTIVITY_STATUS_TYPES.pending
            ? "Pending..."
            : status === ACTIVITY_STATUS_TYPES.cancel ||
              status === ACTIVITY_STATUS_TYPES.failed
            ? status
            : "Success"}
        </Text>
      ) : (
        <>
          <ImageContent
            src={TokenA.image}
            alt="image1"
            className="activtyBoxImage"
            Size={{ width: "20px", height: "20px" }}
          />
          <Text
            customStyle={{ marginLeft: "10px", opacity: "0.7" }}
            weight={400}
            size={16}
          >
            {formatAmount(+TokenA.amount)}

            <SpanOpacityStyled opacity={0.7}>
              {" "}
              {truncateName(TokenA.symbol)} for
            </SpanOpacityStyled>
          </Text>

          <ImageContent
            src={
              TokenB.image // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLRNKdvRshSfqksWf3S8dUy7r6qWu7d96buQ&usqp=CAU"
            }
            alt="image2"
            className="activtyBoxImage"
            Size={{
              marginLeft: "8px",
            }}
          />
          <Text
            weight={500}
            size={16}
            customStyle={{
              opacity: "0.7",
              marginLeft: "8px",
            }}
          >
            {formatAmount(+TokenB.amount)}{" "}
            <SpanOpacityStyled opacity={0.6}>{TokenB.symbol}</SpanOpacityStyled>
          </Text>
        </>
      )}
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
  );
};

export default SwapingSubTile;
