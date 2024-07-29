import { FC } from "react";

import { RainbowButtonProps as PROPS } from "interfaces";
import { InternalRainbowBoxStyled, RainbowButtonStyled, Text } from "@styled";

const RainbowButton: FC<PROPS> = ({ children, width, ...rest }) => {
  return (
    <RainbowButtonStyled width={width} {...rest}>
      <InternalRainbowBoxStyled className="r-c-c">
        <Text
          size={17}
          weight={600}
          style={{
            width: "100%",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          {children}
        </Text>
      </InternalRainbowBoxStyled>
    </RainbowButtonStyled>
  );
};

export default RainbowButton;
