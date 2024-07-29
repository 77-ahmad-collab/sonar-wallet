import { FC } from "react";

import { RevealModalWrapper } from "@styled";
import { BottomBasicModal, SecretView } from "components";
import { RevealModalProps as PROPS } from "interfaces";

const RevealModal: FC<PROPS> = ({
  open,
  handleClose,
  accountSecret,
  walletSecret,
}) => {
  return (
    <BottomBasicModal open={open} handleClose={handleClose} top={0}>
      <RevealModalWrapper>
        <SecretView
          mnemonic={["TEST"]}
          walletSecret={walletSecret ?? ""}
          accountSecret={accountSecret ?? ""}
        />
      </RevealModalWrapper>
    </BottomBasicModal>
  );
};

export default RevealModal;
