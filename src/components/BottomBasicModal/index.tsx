import { FC } from "react";
import { Slide } from "@mui/material";

import { Backdrop, BottomBasicStyledModal, UnStyledModal } from "@styled";
import { UnstyledModalProps as Props } from "interfaces";

const BottomBasicModal: FC<Props> = ({
  children,
  open,
  handleClose,
  hideBackDrop,
  gradient=false
}) => {
  return (
    <UnStyledModal
      open={open}
      onClose={handleClose}
      top={"unset"}
      slots={{
        ...(!hideBackDrop && {
          backdrop: Backdrop,
        }),
      }}
    >
      <Slide in={open} direction={"up"} {...(open ? { timeout: 300 } : {})}>
        <BottomBasicStyledModal gradient={gradient}>{children}</BottomBasicStyledModal>
      </Slide>
    </UnStyledModal>
  );
};

export default BottomBasicModal;
