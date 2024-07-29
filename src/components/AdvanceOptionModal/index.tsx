import { FC, useState } from "react";
import { GasModalProps as PROPS } from "interfaces";
import { AdvanceOptionStyled, Backdrop, UnStyledModal } from "@styled";
import Step1 from "./Step1//index";
import CustomGweiSettings from "./CustomGweiSettings";
import SlippageToleranceSettings from "./SlippageToleranceSettings";

const AdvanceOptionModal: FC<PROPS> = ({
  open,
  handleClose,
  showSlippage,
  chainFamily,
}) => {
  const [step, setStep] = useState(1);

  const renderSwitch = (step: number) => {
    switch (true) {
      case step === 1:
        return (
          <Step1
            setStep={setStep}
            handleClose={handleClose}
            showSlippage={showSlippage}
            chainFamily={chainFamily}
          />
        );
      case step === 2:
        return <CustomGweiSettings setStep={setStep} step={step} />;
      case step === 3:
        return <SlippageToleranceSettings setStep={setStep} />;
      default:
        return null;
    }
  };

  return (
    <UnStyledModal
      open={open}
      onClose={() => {}}
      top={"unset"}
      slots={{
        backdrop: Backdrop,
      }}
    >
      <AdvanceOptionStyled height={"unset"}>
        {renderSwitch(step)}
      </AdvanceOptionStyled>
    </UnStyledModal>
  );
};

export default AdvanceOptionModal;
