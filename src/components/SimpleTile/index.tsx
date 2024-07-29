import { FC } from "react";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { faCircle as faCircleLight } from "@fortawesome/pro-light-svg-icons";

import { ButtonDefault, Text } from "@styled";
import common from "utils/common";
import { formatAddress } from "utils/formatters";
import { SimpleTileProp as PROPS } from "interfaces";

const SimpleTile: FC<PROPS> = ({
  tileInfo,
  onClick,
  isSelected = false,
  enableToggle = false,
}) => {
  return (
    <ButtonDefault
      bright={isSelected}
      onClick={() => onClick(tileInfo)}
      style={{ ...common.r_c_fs, padding: "10px 15px", marginTop: "15px" }}
    >
      {enableToggle && (
        <FontAwesomeIcon
          icon={isSelected ? faCircle : faCircleLight}
          color={isSelected ? "#00D67D" : "rgba(255, 255, 255, 0.2)"}
          style={{ fontSize: 18, marginRight: 12 }}
        />
      )}
      <Avatar
        className="tile-avatar"
        src={tileInfo.LOGO}
        alt={tileInfo.NAME[0]}
      />
      <div>
        <Text className="f-body">{tileInfo.NAME}</Text>
        {tileInfo.ADDRESS && (
          <Text size={13} dim>
            {formatAddress(tileInfo.ADDRESS)} {`(${tileInfo.walletName})`}
          </Text>
        )}
      </div>
    </ButtonDefault>
  );
};

export default SimpleTile;
