import { FC } from "react";
import { faCheck, faXmark } from "@fortawesome/pro-light-svg-icons";

import { SaveAndResetProps as PROPS } from "interfaces";
import { ButtonWithIcon } from "components";

const SaveAndResetButon: FC<PROPS> = ({ onReset, onSave }) => {
  return (
    <div className="r-c-fs">
      <ButtonWithIcon
        id="SaveAndResetButon-onSave"
        icon={faCheck}
        lightMode={false}
        onClick={onSave}
        text="Save"
        className="dimOpacity"
      />

      <ButtonWithIcon
        id="SaveAndResetButon-onReset"
        icon={faXmark}
        lightMode={false}
        onClick={onReset}
        text="Reset"
        className="dimOpacity"
      />
    </div>
  );
};

export default SaveAndResetButon;
