import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons";

import { DefaultButton, PlainColorBoxStyled, Text } from "@styled";
import { useNavigate } from "react-router";
import { APPSCREENS } from "theme/constants";
import { useAppDispatch } from "store/store";
import { setSeedPhraseExpirationTime } from "@slices/appSlice";
import { seedPhraseExpirationTime } from "utils/constants";
const ActionAlert = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const moveToSeedphrase = () => {
    navigate(APPSCREENS.seedphrase);
    dispatch(setSeedPhraseExpirationTime(seedPhraseExpirationTime));
  };
  return (
    <PlainColorBoxStyled
      className="mgt-lg"
      style={{ marginTop: "auto" }}
      lightMode={true}
    >
      <FontAwesomeIcon icon={faCheck} color="#000" size="xl" />
      <Text
        className="mgt-xs f-body-lg r-c-sb"
        style={{ color: "#000", width: "100%" }}
      >
        Wallet Created{" "}
        <DefaultButton
          id="ActionAlert-moveToSeedphrase"
          onClick={moveToSeedphrase}
          className="f-body-md mgr-sm"
          lightMode={true}
          contained={false}
          style={{ marginRight: "0px" }}
        >
          <Text style={{ color: "#000" }} className="f-body-lg">
            Go!
          </Text>
        </DefaultButton>
      </Text>
    </PlainColorBoxStyled>
  );
};

export default ActionAlert;
