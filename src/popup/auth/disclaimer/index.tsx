import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import { faTriangleExclamation } from "@fortawesome/pro-solid-svg-icons";

import { DisclaimerWrapper, Text } from "@styled";
import { AUTHSCREENS } from "theme/constants";

const Disclaimer = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const navigateToPasswordScreen = () => navigate(AUTHSCREENS.auth);

  return (
    <DisclaimerWrapper>
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        color={theme.palette.text.darkPink}
        fontSize={48}
      />
      <Text
        className="f-display mgt-lg"
        customColor={theme.palette.text.darkPink}
      >
        Security Disclaimer
      </Text>
      <Text
        className="f-body-md mgt-md"
        customColor={theme.palette.text.darkPink}
        lineHeight={1.3}
      >
        1. The Alpha 0.1 Sonar Wallet is still under security auditing
        processes. Kindly DO NOT import wallets with significant funds. The aim
        of this stage of development is simply for testing new wallets, and
        importing wallets with test funds. Sonar is NOT RESPONSIBLE for any
        exploits that may happen at this stage.
      </Text>

      <Text
        className="f-body-md mgt-md"
        customColor={theme.palette.text.darkPink}
        lineHeight={1.3}
      >
        2. DO NOT SHARE the build with anyone. We want to limit any access to
        our code from third parties and sharing the build with everyone poses a
        risk to your investment.
      </Text>
      <Text
        className="f-body-md mgt-md"
        customColor={theme.palette.text.darkPink}
        lineHeight={1.3}
      >
        3. Until the Sonar Wallet is uploaded on appstores in the near future,
        any updates will be presented to you in the form of Builds like the one
        below. Every time there is a new updated build, you will have to
        delete/remove the previous build and replace with the new version.
      </Text>
      <Text
        className="f-body-md mgt-md"
        customColor={theme.palette.text.darkPink}
        lineHeight={1.3}
      >
        4. For a step by step guide on how to download and install the build,
        kindly click HERE.
      </Text>
      <Text
        className="f-body-md mgt-md"
        customColor={theme.palette.text.darkPink}
        lineHeight={1.3}
      >
        5. At this stage, your suggestions, bug reports, comments and
        recommendations are highly valued and we encourage you to provide such
        feedback through the feedback portal within the wallet as shown in image
        below.
      </Text>
      <Text
        className="f-body mgt-md"
        customColor={theme.palette.text.darkPink}
        lineHeight={1.3}
        opacity={0.7}
      >
        By clicking the button below you agree that Sonar (Resonance Labs LTD)
        will not be responsible for any exploits, bugs, or technical errors
        which may result in any form of financial loss.
      </Text>

      <Text
        style={{ background: theme.palette.text.darkPink }}
        className="riskButton r-c-c f-title-sm mgt-lg"
        customColor="#000"
        onClick={navigateToPasswordScreen}
      >
        I’ve read and understand the risks
      </Text>
    </DisclaimerWrapper>
  );
};

export default Disclaimer;
