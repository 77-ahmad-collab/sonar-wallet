import { ChangeEvent, FC, useState } from "react";

import { Text } from "@styled";
import {
  BottomBasicModal,
  ButtonWithIcon,
  SearchBar,
  StartAdornment,
} from "components";
import { RestoreAccessModal as PROPS } from "interfaces";
import {
  faArrowRightToBracket,
  faLock,
  faX,
} from "@fortawesome/pro-light-svg-icons";

import { useAppDispatch } from "store/store";
import {
  removerUserFromAppSlice,
  setFirstWalletImportedStatus,
  setWelcomeMessage,
} from "store/slices/appSlice";
import { AUTHSCREENS } from "theme/constants";
import { clearHoldings } from "@slices/newWalletSlice";
import { useNavigate } from "react-router";
import { WELCOME_MESSAGE_ON_RESET_PASSWORD } from "utils/constants";

const ResetWalletModal: FC<PROPS> = ({ open, handleClose, handleSubmit }) => {
  /* global-state */

  /* local-state */
  const [value, setValue] = useState("");

  /* hooks */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* functions */
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (event.target.value == "reset-wallet") {
      dispatch(removerUserFromAppSlice());
      await dispatch(clearHoldings());
      await dispatch(setWelcomeMessage(WELCOME_MESSAGE_ON_RESET_PASSWORD));
      await dispatch(setFirstWalletImportedStatus(false));
      navigate(AUTHSCREENS.auth);
      handleSubmit();
    }
  };

  /* effects */

  return (
    <BottomBasicModal open={open} handleClose={handleClose} gradient>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faArrowRightToBracket}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black" }} weight={600}>
            Reset Wallet
          </Text>
        </div>

        <div>
          <div className="r-c-sb input-header">
            <Text size={16} weight={400} customColor={"#000000"}>
              Please type “reset-wallet” to confirm
            </Text>
          </div>
        </div>

        <SearchBar
          onChange={handleChange}
          name={"Enter Reset Wallet"}
          placeholder={""}
          value={value}
          customPadding={6}
          containerStyle={{ width: "100%" }}
          type={"text"}
          lightMode={true}
          StartAdornment={
            <StartAdornment Icon={faLock} iconColor={"#FF375E"} />
          }
          autoFocus
        />

        <div className="r-c-fs">
          <ButtonWithIcon
            icon={faX}
            lightMode={true}
            style={{
              marginTop: 20,
              background: "transparent",
              border: "1px solid rgba(0, 0, 0, 0.3)",
            }}
            onClick={handleClose}
            text="Cancel"
            isHover={true}
          />
        </div>
      </>
    </BottomBasicModal>
  );
};

export default ResetWalletModal;
