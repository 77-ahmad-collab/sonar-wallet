import { FC } from "react";

import { OptionBoxProps as PROPS } from "interfaces";
import { OptionBoxStyled } from "@styled";

const OptionBox: FC<PROPS> = ({ children, active, handleOption, index }) => {
  return (
    <OptionBoxStyled
      layout
      active={active}
      id={`OptionBox-${index}`}
      onClick={() => {
        if (index !== undefined) handleOption(index);
      }}
    >
      {children}
    </OptionBoxStyled>
  );
};

export default OptionBox;
