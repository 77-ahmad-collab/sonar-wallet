import { FC } from "react";
// import { useNavigate } from "react-router";

import { GoNextProps as PROPS } from "interfaces";
import { HoverableButton, Text } from "@styled";
// import { AUTHSCREENS } from "theme/constants";

const Gonext: FC<PROPS> = ({ handleSeedPhrase }) => {
  // const navigate = useNavigate();

  // const handleNext = async () => {
  //   await handleSeedPhrase();
  //   navigate(AUTHSCREENS.selectDefaultWallet);
  // };

  return (
    <div className="c-c-fs">
      <Text className="mgb-sm">You got this</Text>
      <HoverableButton
        id="Gonext-handleNext"
        className="mgt-sm"
        onClick={handleSeedPhrase}
        // isButtonDisabled={false}
      >
        Next
      </HoverableButton>
    </div>
  );
};

export default Gonext;
