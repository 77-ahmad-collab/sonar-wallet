import { FC, useState } from "react";

import { AddressBox, BoxRow, Text } from "@styled";
import { ListItemWithAddressProps as PROPS } from "interfaces";
import { formatAddress } from "utils/formatters";
import { useHover } from "hooks";

const ListItemWithAddress: FC<PROPS> = ({
  leftSideElement,
  text,
  rightSideElement,
  address,
  onClick,
}) => {
  const [hovering, onHoverProps] = useHover();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <BoxRow id={`ListItemWithAddress-${address}`} onClick={onClick}>
      <div className="r-c-fs">
        {leftSideElement}
        <Text
          className="f-body"
          weight={400}
          style={{ opacity: 0.9, marginRight: "10px" }}
        >
          {text}
        </Text>
        {address && (
          <AddressBox
            iscopied={isCopied}
            onClick={(e) => {
              e.stopPropagation();
              handleCopyToClipboard(address);
            }}
            style={{
              marginLeft: "5px",
            }}
            {...(typeof onHoverProps === "object" ? onHoverProps : {})}
          >
            {isCopied
              ? "copied"
              : hovering
              ? "click to copy"
              : formatAddress(address)}
          </AddressBox>
        )}
      </div>
      {rightSideElement}
    </BoxRow>
  );
};

export default ListItemWithAddress;
