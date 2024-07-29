import { FC, useCallback } from "react";
import { faLink, faXmark } from "@fortawesome/pro-light-svg-icons";

import { BottomBasicModal, ButtonWithIcon, ImageContent } from "components";
import { DefaultButton, Text } from "@styled";
import { CHAIN_CATEGORIES } from "utils/constants";
import { ChainFamilyModalProps as PROPS } from "interfaces";

const ChainFamilyModal: FC<PROPS> = ({
  handleClose,
  isOpen,
  onChainFamilyClick,
}) => {
  const renderChainFamilies = useCallback(() => {
    return Object.values(CHAIN_CATEGORIES).map((chainFamily, index) => {
      return (
        <ChainFamilyListItem
          key={index}
          chainFamily={chainFamily}
          onChainFamilySelect={onChainFamilyClick}
        />
      );
    });
  }, []);
  return (
    <BottomBasicModal open={isOpen} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faLink}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm" style={{ color: "black" }} weight={500}>
            Select Chain type
          </Text>
        </div>
        <div style={{ maxHeight: 300, overflowY: "scroll" }}>
          {renderChainFamilies()}
        </div>
        <ButtonWithIcon
          id="SelectNetworkModal-onCancel"
          icon={faXmark}
          lightMode={true}
          contained
          onClick={handleClose}
          text="Cancel"
          iconColor="rgba(0,0,0,0.4)"
          style={{ marginTop: 10 }}
        />
      </>
    </BottomBasicModal>
  );
};

const ChainFamilyListItem = ({
  chainFamily,
  onChainFamilySelect,
}: {
  chainFamily: (typeof CHAIN_CATEGORIES)["x"];
  onChainFamilySelect: (chainFamily: (typeof CHAIN_CATEGORIES)["x"]) => void;
}) => {
  return (
    <DefaultButton
      style={{
        height: "unset",
        width: "100%",
        padding: "10px 10px",
        marginBottom: 10,
      }}
      lightMode
      contained={false}
      onClick={() => onChainFamilySelect(chainFamily)}
    >
      <div className="r-c-fs" style={{ flex: 1 }}>
        <ImageContent
          src={chainFamily?.LOGO}
          Size={{
            width: "30px",
            height: "30px",
            marginRight: "10px",
            borderRadius: "50%",
          }}
        />
        <Text className="f-body-lg mgr-sm" style={{ color: "black" }}>
          {chainFamily?.NAME ?? "EVM"}
        </Text>
      </div>
    </DefaultButton>
  );
};

export default ChainFamilyModal;
