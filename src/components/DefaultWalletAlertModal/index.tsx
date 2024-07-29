import { FC } from "react";

import { BottomModalLayout } from "components";

import { Text } from "@styled";
import { DefaultWalletAlertModalProps as PROPS } from "interfaces";

const DefaultWalletAlertModal: FC<PROPS> = ({
  handler,
  open,
  body,
  heading,
  onClose,
}) => {
  const handleConfirm = () => {
    if (handler) handler();
    onClose();
  };

  return (
    <BottomModalLayout
      heading={heading}
      open={open}
      onConfirm={handleConfirm}
      showCancelBtn={handler && true}
      onCancel={() => onClose()}
    >
      <Text customColor="#000000" className="f-body mgb-sm  mgt-sm">
        {body}
      </Text>
    </BottomModalLayout>
  );
};

export default DefaultWalletAlertModal;
