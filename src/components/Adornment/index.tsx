import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { StartAdornmentProps as PROPS } from "interfaces";
import { StartAdornmentStyled } from "@styled";

const StartAdornment: FC<PROPS> = ({
  Icon,
  iconSize = 20,
  iconColor = "#ffffff66",
}) => {
  return (
    <StartAdornmentStyled>
      <FontAwesomeIcon icon={Icon} fontSize={iconSize} color={iconColor} />
    </StartAdornmentStyled>
  );
};

export default StartAdornment;
