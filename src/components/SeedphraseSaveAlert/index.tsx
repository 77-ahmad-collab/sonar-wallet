import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faExclamation } from "@fortawesome/pro-light-svg-icons";

import { BottomBasicModal, ButtonWithIcon } from "components";
import { DefaultButton, Text } from "@styled";
import { SeedPhraseAlertProps as PROPS } from "interfaces";

const SeedPhraseSaveAlert: FC<PROPS> = ({ handleOnSave, open }) => {
  return (
    <BottomBasicModal handleClose={() => {}} open={open} hideBackDrop={true}>
      <div className="c-fs-fs">
        <div style={{ width: "100%" }} className="r-c-fs">
          <DefaultButton
            lightMode={true}
            contained={false}
            className="mgr-sm"
            style={{ width: "35px" }}
            isHover={false}
          >
            <FontAwesomeIcon icon={faExclamation} />
          </DefaultButton>
          <Text customColor="#000000" className="f-body-lg">
            Please store this safely
          </Text>
        </div>
        <Text
          customColor="#000000"
          className="f-body"
          style={{ margin: "20px 0px" }}
        >
          If you need to save this in a digital file, please ensure to have high
          security encryption.
        </Text>
        <div
          className="r-c-fs"
          style={{ marginBottom: "20px" }}
          onClick={() =>
            window.open(
              "https://sonar.studio/academy/seed-phrase-storage",
              "sonar studio",
              "noopener"
            )
          }
        >
          <Text
            customColor="#000000"
            className="f-body"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            Learn the best ways to keep it safe{" "}
          </Text>
          <span>{">"}</span>
        </div>
        <ButtonWithIcon
          id="SeedPhraseSaveAlert-handleOnSave"
          icon={faCheck}
          text="Let's Go"
          lightMode={true}
          onClick={() => handleOnSave && handleOnSave()}
        />
      </div>
    </BottomBasicModal>
  );
};

export default SeedPhraseSaveAlert;
