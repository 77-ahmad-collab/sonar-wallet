import { Text } from "components/styled";
import { pingLogo } from "assets/images";
import { FC } from "react";

const LoadingScreen: FC<{ text?: string }> = ({ text = "Loading" }) => {
  return (
    <div className="c-c-c" style={{ height: "100vh" }}>
      <img
        className="sonar-img rotating"
        src={pingLogo}
        alt="SonarWalletLogo"
      />
      <Text className="mgt-md" size={25}>
        {text}
      </Text>
    </div>
  );
};

export default LoadingScreen;
