import { FC } from "react";

import { BoxRow, Text } from "@styled";
import { ListItemProps as PROPS } from "interfaces";

const ListItem: FC<PROPS> = ({
  leftSideElement,
  text,
  rightSideElement,
  onClick,
  disabled = false,
}) => {
  return (
    <BoxRow id={`ListItem-${text}`} onClick={onClick} disabled={disabled}>
      <div className="r-c-fs">
        {leftSideElement}
        <Text className="f-body" weight={400} style={{ opacity: 0.9 }}>
          {text}
        </Text>
      </div>
      {rightSideElement}
    </BoxRow>
  );
};

export default ListItem;
