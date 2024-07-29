import { FC } from "react";

import AnimationGroup from ".";
import { pingLogo } from "assets/images";
import { WrapperBackground } from "components";
import { PasswordMainProps as PROPS } from "interfaces";

const Main: FC<PROPS> = ({ ContentArray, currentStep }) => {
  return (
    <WrapperBackground boxHeight="100vh" style={{ position: "relative" }}>
      {/* <Background /> */}
      {/* <div className="r-c-c landing-sonar-logo"> */}
      <img className="sonar-img" src={pingLogo} alt="SonarWalletLogo" />
      {/* </div> */}
      <div className="password-steps-wrapper">
        <AnimationGroup content={ContentArray} currentStep={currentStep} />
        {/* <div className="chartline" /> */}
        {/* <PasswordBackStyled /> */}
      </div>
    </WrapperBackground>
  );
};

export default Main;
