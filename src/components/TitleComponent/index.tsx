import { FC } from "react";

import { Text, TitleStyled } from "@styled";
import { TitleComponentProps as PROP } from "interfaces";

const TitleComponent: FC<PROP> = ({ text, containerStyle = {} }) => {
  return (
    <TitleStyled style={containerStyle}>
      <Text weight={500} className="f-body-lg ">
        {text}
      </Text>
    </TitleStyled>
  );
};

export default TitleComponent;
