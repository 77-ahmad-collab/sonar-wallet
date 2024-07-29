import { FC } from "react";

import { RainbowBlur } from "assets/images";
import { RainbowLoaderProps as PROPS } from "interfaces";

const RainbowLoader: FC<PROPS> = ({ size = 30, style = {} }) => (
  <div
    className="r-c-c rotating"
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      position: "relative",
      ...style,
    }}
  >
    <img
      style={{
        width: size + 20,
        height: size + 20,
        borderRadius: (size + 20) / 2,
        position: "absolute",
      }}
      src={RainbowBlur}
    />
  </div>
);

export default RainbowLoader;
