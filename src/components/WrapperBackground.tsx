import { ReactNode } from "react";

import { HEIGHT } from "theme/constants";
import { WrapperBackgroundStyled } from "@styled";
import { RainbowGlobal } from "assets/images";

const WrapperBackground = ({
  children,
  style,
  boxHeight,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  boxHeight?: React.CSSProperties["height"];
}) => {
  return (
    <WrapperBackgroundStyled
      style={{
        height: boxHeight || HEIGHT,
        ...style,
      }}
      className="pd"
    >
      {children}
      {/* <div className="rainbowGlobalDiv"> */}
      <img
        src={RainbowGlobal}
        style={
          {
            // height: "100%",
            // width: "100%",
          }
        }
        className="rainbowGlobalDiv"
      />
      {/* </div> */}
    </WrapperBackgroundStyled>
  );
};

export default WrapperBackground;
