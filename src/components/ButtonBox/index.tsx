import { FC } from "react";

import { ButtonBoxProps as PROPS } from "interfaces";
import { ButtonStyled, Text } from "@styled";

const ButtonBox: FC<PROPS> = ({
  title,
  customColor,
  marginTop,
  customStyle,
  handleClick,
  textColor,
  isPulsate,
  isDisabled,
}) => {
  return (
    <ButtonStyled
      id="Button-box-handleClick"
      customColor={customColor}
      marginTop={marginTop}
      customStyle={customStyle}
      onClick={() => !isDisabled && handleClick && handleClick()}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      <Text
        customColor={textColor}
        className={`${isPulsate ? "animated" : ""}`}
      >
        {title}
      </Text>
    </ButtonStyled>
  );
};

export default ButtonBox;
