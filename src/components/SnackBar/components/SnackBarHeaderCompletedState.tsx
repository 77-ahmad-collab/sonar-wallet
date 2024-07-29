import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  DarkBackgroundStyled,
  RainbowStyled,
  SnackBarHeaderCompletedStateWrapper,
  Text,
} from "@styled";
import { useAppSelector } from "store/store";

const SnackBarHeaderCompletedState = () => {
  const { snackBarMessage } = useAppSelector((state) => state.app);
  return (
    <SnackBarHeaderCompletedStateWrapper>
      <RainbowStyled>
        <DarkBackgroundStyled style={{ width: "35px", height: "35px" }} />
      </RainbowStyled>
      <FontAwesomeIcon
        icon={faCheck}
        color="white"
        size="xl"
        className="faCheck"
      />
      <Text
        size={16}
        weight={400}
        customColor="#000000"
        className="alignCenter"
      >
        {snackBarMessage}
      </Text>
    </SnackBarHeaderCompletedStateWrapper>
  );
};

export default SnackBarHeaderCompletedState;
