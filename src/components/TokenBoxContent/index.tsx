import { FC } from "react";

import { Text } from "@styled";
import { TokenBoxContentProps as PROPS } from "interfaces";

const TokenBoxContent: FC<PROPS> = ({ title, rightElement, leftElement }) => {
  return (
    <div className="tokenBoxContentWrapper">
      <Text weight={500} className="boxContent marginBottom f-body" dim>
        {title}
      </Text>
      <div className="r-c-fs">
        {leftElement}
        {rightElement}
      </div>
    </div>
  );
};

export default TokenBoxContent;
