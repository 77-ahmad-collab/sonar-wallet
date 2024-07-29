import { FC } from "react";
import { Avatar } from "@mui/material";

import { Text } from "@styled";
import { formatAmount } from "utils/formatters";
import { AccountHoldingTileProps as PROPS } from "interfaces";

const AccountHoldingTile: FC<PROPS> = ({
  singleAccount,
  tokenInfo,
  onAccountSelect,
  index,
  chainIndex,
  tokenIndex,
}) => {
  return (
    <div
      id={`AccountHoldingTile-${chainIndex}-${tokenIndex}-${index}`}
      className="r-c-sb account-tile-wrapper"
      onClick={onAccountSelect}
    >
      <div className="r-c-c">
        <Avatar src={tokenInfo.image} style={{ width: 20, height: 20 }} />
        <div style={{ marginLeft: 8 }}>
          <Text className="f-body">{singleAccount.name}</Text>
          <Text className="f-label" opacity={0.4} style={{ marginTop: 3 }}>
            {singleAccount.walletName}
          </Text>
        </div>
      </div>
      <div>
        <div className="r-c-fe">
          <Text className="f-body" style={{ marginLeft: 8 }}>
            {formatAmount(singleAccount.balance)}
          </Text>
        </div>
        <div className="r-c-fe" style={{ marginTop: 3 }}>
          <Text className="f-label" opacity={0.7}>
            {formatAmount(singleAccount.balanceInUsd)}
          </Text>
          <Text
            className="f-label"
            style={{ marginLeft: 4, fontWeight: 400 }}
            opacity={0.4}
          >
            USD
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AccountHoldingTile;
