import { FC } from "react";

import { TopLayoutProps as PROPS } from "interfaces";
import { ButtonDefault, Text } from "@styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/pro-light-svg-icons";
import { RainbowGlobal } from "assets/images";

const TopLayoutComponent: FC<PROPS> = ({
  // children,
  text,
  // TopImage,
  onTopImageClick,
}) => {
  return (
    <div
      className="r-c-fs"
      style={{
        padding: "10px 15px",
        position: "relative",
        width: "100%",
      }}
    >
      <img src={RainbowGlobal} alt="rainbow" className="top-layout-rainbow" />
      <ButtonDefault
        id="TopLayoutComponent-goBack"
        width={37}
        height={37}
        onClick={onTopImageClick}
      >
        <FontAwesomeIcon
          className="f-dim-100"
          icon={faChevronUp}
          color="white"
          style={{ fontSize: 16 }}
        />
      </ButtonDefault>
      <Text className="f-title-md mgl-md" opacity={0.7}>
        {text}
      </Text>
    </div>
  );
};

export default TopLayoutComponent;
