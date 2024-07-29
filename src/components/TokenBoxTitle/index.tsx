import { FC } from "react";

import { SpanOpacityStyled, Text, TokenChipBoxWrapper } from "@styled";
import { TokenBoxTitleProps as PROPS } from "interfaces";

const TokenBoxTitle: FC<PROPS> = ({
  heading,
  subHeading,
  rightSideElement,
}) => {
  return (
    <TokenChipBoxWrapper>
      <Text className="f-body" weight={400} opacity={0.8}>
        {heading}
        <SpanOpacityStyled opacity={0.5}> {subHeading}</SpanOpacityStyled>
      </Text>
      {rightSideElement}
    </TokenChipBoxWrapper>
  );
};

export default TokenBoxTitle;
