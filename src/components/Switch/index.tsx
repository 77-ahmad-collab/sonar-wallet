import { FC } from "react";

import { CheckCircle, RemoveCircle } from "@mui/icons-material";
import { SwitchStyled } from "@styled";
import { Switch as Props } from "interfaces";

const Switch: FC<Props> = ({
  checked,
  handleSwitchChange,
  isEditlist,
  tokenIndex = "",
  chainIndex = "",
}) => {
  return (
    <SwitchStyled
      id={
        "Switch-handleSwitchChange" +
        (chainIndex !== "" ? `${chainIndex}-${tokenIndex}` : "")
      }
      edge="start"
      checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        handleSwitchChange && handleSwitchChange();
      }}
      checkedIcon={
        <CheckCircle
          style={{
            color: "#00D67D",
            fontSize: isEditlist ? "20px" : "1.5rem",
          }}
        />
      }
      icon={
        <RemoveCircle
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: isEditlist ? "20px" : "1.5rem",
          }}
        />
      }
      isEditlist={isEditlist}
    />
  );
};

export default Switch;
