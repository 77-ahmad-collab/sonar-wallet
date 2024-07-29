import { FC } from "react";
import millify from "millify";
import { Tooltip } from "@mui/material";
import { faMinus, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@mui/material";
import {
  faBadgeCheck,
  faSealExclamation,
} from "@fortawesome/pro-solid-svg-icons";

import { AmountBoxStyled, Text } from "@styled";
import { TxHistoryAmountProps as PROPS } from "interfaces";
import { ACTIVITY_STATUS_TYPES, TX_TYPES } from "utils/constants";
import ImageContent from "components/ImageContent";

const Amount: FC<PROPS> = ({
  TxType,
  token: { image, symbol, amount },
  token1,
  status,
  isDappTransaction,
}) => {
  const theme = useTheme();

  const renderItem = (
    TxType: string,
    image: string | undefined,
    amount: number | undefined,
    symbol: string | undefined
  ) => {
    return (
      <AmountBoxStyled>
        <FontAwesomeIcon
          icon={TxType === TX_TYPES.Received ? faPlus : faMinus}
          color={
            TxType === TX_TYPES.Received
              ? theme.palette.background.green
              : theme.palette.background.pink
          }
          fontSize={14}
          className="mgr-xs"
        />
        <ImageContent src={image} alt="icon" className="amountBoxTokenImage" />
        <Tooltip title={amount}>
          <Text weight={400} size={20}>
            {Number(amount) > 1
              ? millify(Number(amount))
              : millify(Number(amount), {
                  precision: 6,
                })}
          </Text>
        </Tooltip>
        <Text dim weight={400} size={14} customStyle={{ marginLeft: "6px" }}>
          {symbol}
        </Text>
      </AmountBoxStyled>
    );
  };

  return (
    <div className="r-c-sb pdb-md">
      <div style={{ maxWidth: "250px" }}>
        {!isDappTransaction ? (
          renderItem(TxType, image, amount, symbol)
        ) : (
          <Text
            dim
            customStyle={{
              textAlign: "left",
              marginLeft: "10px",
            }}
            weight={400}
            size={16}
          >
            Multi call
          </Text>
        )}

        {TxType === TX_TYPES.Swap && !isDappTransaction && (
          <>
            <Text
              dim
              customStyle={{
                textAlign: "left",
                marginLeft: "10px",
              }}
              weight={400}
              size={14}
            >
              for
            </Text>

            {renderItem(
              TX_TYPES.Received,
              token1?.image,
              token1?.amount,
              token1?.symbol
            )}
          </>
        )}
      </div>
      <Text
        className="f-body-md"
        style={{
          color:
            status === ACTIVITY_STATUS_TYPES.cancel ||
            status === ACTIVITY_STATUS_TYPES.failed
              ? theme.palette.text.danger
              : theme.palette.text.success,
        }}
      >
        {status}
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
      </Text>
    </div>
  );
};

export default Amount;
