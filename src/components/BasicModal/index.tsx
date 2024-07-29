import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Backdrop, UnStyledModal } from "@styled";
import { UnstyledModalProps as Props } from "interfaces";

const BasicModal: FC<Props> = ({ children, open, handleClose, top }) => {
  const [localOpenState, setLocalOpenState] = useState(open);

  const [animationState, setAnimationState] = useState<"enter" | "exit">(
    "enter"
  );

  useEffect(() => {
    if (open) {
      setLocalOpenState(open);
    } else {
      setAnimationState("exit");
      setTimeout(() => {
        setLocalOpenState(false);
        setAnimationState("enter");
      }, 200);
    }
  }, [open]);

  return (
    <ModalUnstyled open={localOpenState} handleClose={handleClose} top={top}>
      <motion.div
        className="bezier-out trans-medium c-c-c"
        variants={{
          enter: { y: 0, opacity: 1 },
          exit: { y: 40, opacity: 0 },
        }}
        initial={{ y: 40, opacity: 0 }}
        animate={animationState}
        style={{ width: "100%", outline: "none" }}
      >
        {children}
      </motion.div>
    </ModalUnstyled>
  );
};

const ModalUnstyled: FC<Props> = ({ children, open, handleClose, top }) => {
  return (
    <UnStyledModal
      open={open}
      onClose={handleClose}
      top={top}
      slots={{ backdrop: Backdrop }}
      closeAfterTransition
    >
      {children}
    </UnStyledModal>
  );
};

export default BasicModal;
