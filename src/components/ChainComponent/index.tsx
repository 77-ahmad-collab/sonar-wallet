import { FC } from "react";
import { ImageContent, ListItemValueBox } from "components";
import { faSortDown, faSortUp } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChainComponentProps as PROPS } from "interfaces";

import {
  ChainHeading,
  HeadingBox,
  ListItemStyled,
  NameBoxStyled,
  Text,
} from "@styled";

const ChainComponent: FC<PROPS> = ({
  onClick,
  // isEditlist = false,
  singleChainHolding,
  isExpanded,
}) => {
  return isExpanded ? (
    <ChainHeading onClick={() => {}}>
      <Text
        className="chainName f-body-sm"
        dim={true}
        customStyle={{ margin: "0px" }}
      >
        {singleChainHolding.name}
      </Text>
      <FontAwesomeIcon
        icon={faSortUp}
        style={{
          fontSize: "15px",
          color: "rgba(255, 255, 255, 0.3)",
          marginTop: "10px",
        }}
      />
    </ChainHeading>
  ) : (
    <ListItemStyled onClick={onClick}>
      <ImageContent
        Logo={false}
        Opacity={false}
        top={false}
        src={singleChainHolding.image}
        Size={{
          width: "30px",
          height: "30px",
          marginLeft: "10px",
          borderRadius: "50%",
        }}
      />
      <NameBoxStyled>
        <HeadingBox>
          <Text
            size={14}
            customStyle={{ marginLeft: "10px", marginRight: "2px" }}
          >
            {singleChainHolding.name}
          </Text>
          <FontAwesomeIcon icon={faSortDown} className="sortDownIcon" />
        </HeadingBox>
      </NameBoxStyled>
      <ListItemValueBox
        isChain={true}
        usdAmount={singleChainHolding.balanceInUsd}
      />
    </ListItemStyled>
  );
};

export default ChainComponent;
