import { FC } from "react";
import { faCheck, faExclamation } from "@fortawesome/pro-light-svg-icons";

import { BottomBasicModal, ButtonWithIcon } from "components";
import { Text } from "@styled";
import { BottomModalLayoutProps as PROPS } from "interfaces";

const BottomModalLayout: FC<PROPS> = ({
  open,
  heading = "",
  children,
  showCancelBtn = false,
  onCancel = () => {},
  onConfirm = () => {},
  headerIcon = faExclamation,
  submitBtnText = "Ok",
}) => {
  return (
    <BottomBasicModal open={open} handleClose={() => {}}>
      <div className="c-fs-fs">
        <div style={{ width: "100%" }} className="r-c-fs">
          <ButtonWithIcon
            icon={headerIcon}
            lightMode={true}
            onClick={() => {}}
            text=""
            style={{ width: 33, height: 33 }}
            iconColor="rgba(0,0,0,0.4)"
            iconSize={16}
            isHover={false}
          />
          <Text customColor="#000000" className="f-body-lg">
            {heading}
          </Text>
        </div>
        {children}
        <div className="r-c-fs">
          {showCancelBtn && (
            <ButtonWithIcon
              icon={faCheck}
              lightMode={true}
              onClick={onCancel}
              text="Cancel"
              contained
              iconColor="rgba(0,0,0,0.4)"
            />
          )}
          <ButtonWithIcon
            icon={faCheck}
            lightMode={true}
            onClick={onConfirm}
            text={submitBtnText}
            iconColor="rgba(0,0,0,0.4)"
          />
        </div>
      </div>
    </BottomBasicModal>
  );
};

export default BottomModalLayout;
