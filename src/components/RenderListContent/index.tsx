import { FC, memo } from "react";

import { ListItem } from "components";
import { RenderListContentProps as PROPS } from "interfaces";

const RenderListContent: FC<PROPS> = ({ List }) => {
  return (
    <>
      {List.map((item, index) => {
        const {
          text,
          rightSideElement,
          leftSideElement,
          onClick,
          disabled = false,
        } = item;
        return (
          <ListItem
            key={index}
            leftSideElement={leftSideElement}
            text={text}
            rightSideElement={rightSideElement}
            onClick={onClick}
            disabled={disabled}
          />
        );
      })}
    </>
  );
};

export default memo(RenderListContent);
