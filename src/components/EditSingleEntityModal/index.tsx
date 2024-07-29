import { ChangeEvent, FC, useEffect, useState } from "react";

import { Text } from "@styled";
import { BottomBasicModal, ButtonWithIcon, SearchBar } from "components";
import { EditSingleEntityModal as PROPS } from "interfaces";
import { faCheck, faWallet, faXmark } from "@fortawesome/pro-regular-svg-icons";

const EditSingleEntityModal: FC<PROPS> = ({
  open,
  handleClose,
  handleSave,
  entityName,
  defaultValue,
  create,
  disableCancelBtn,
  bodyText,
  checkIcon,
}) => {
  /* global-state */

  /* local-state */
  const [isTouched, setIsTouched] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");

  /* hooks */

  /* functions */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    !isTouched && setIsTouched(true);
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    if (isFormValid(value.trim())) handleSave(value.trim());
  };

  const isFormValid = (input: string) => {
    if (!isTouched) {
      return true;
    }
    if (input.length === 0) {
      setError(`invalid ${entityName}`);
      return false;
    }
    if (input.length > 15) {
      setError(`${entityName} too long`);
      return false;
    }
    setError("");
    return true;
  };

  /* effects */
  useEffect(() => {
    setValue(defaultValue);
    setError("");
    setIsTouched(false);
  }, [open]);

  useEffect(() => {
    isFormValid(value.trim());
  }, [value]);

  return (
    <BottomBasicModal open={open} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={checkIcon ? faCheck : faWallet}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black" }}>
            {create ? `Create ${entityName}` : `Update ${entityName}`}
          </Text>
        </div>

        <div>
          <div className="r-c-sb input-header">
            <Text
              size={13}
              weight={600}
              customColor={error ? "rgba(255, 55, 94, 1)" : "#5E5E64"}
            >
              Enter new {entityName}
            </Text>
            {error && (
              <Text size={13} weight={600} customColor="rgba(255, 55, 94, 1)">
                {error}
              </Text>
            )}
          </div>
          <SearchBar
            id="EditSingleEntityModal-input"
            onChange={handleChange}
            name={"Enter Updated NAME"}
            placeholder={"Type here..."}
            value={value}
            customPadding={6}
            containerStyle={{ width: "100%" }}
            lightMode={true}
            autoFocus
          />

          {bodyText && (
            <div className="r-c-sb input-header">
              <Text size={13} weight={600} customColor={"#5E5E64"}>
                {bodyText}
              </Text>
            </div>
          )}
        </div>
        <div className="r-c-fs">
          {!disableCancelBtn && (
            <ButtonWithIcon
              id="SelectAccountModal-onCancel"
              icon={faXmark}
              lightMode={true}
              contained
              onClick={handleClose}
              text="Cancel"
              iconColor="rgba(0,0,0,0.4)"
              style={{ marginTop: 10 }}
            />
          )}
          <ButtonWithIcon
            icon={faCheck}
            lightMode={true}
            style={{ marginTop: 10 }}
            onClick={handleSubmit}
            text="OK"
          />
        </div>
      </>
    </BottomBasicModal>
  );
};

export default EditSingleEntityModal;
