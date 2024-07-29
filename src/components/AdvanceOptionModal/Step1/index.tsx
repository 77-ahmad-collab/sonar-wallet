import { FC } from "react";
import { motion } from "framer-motion";

import {
  NetworkFeeTypeChosen,
  AdvanceOptionStepProps as PROPS,
  SlippageTypeChosen,
} from "interfaces";
import GasFees from "./GasFees";
import Slippages from "./Slippages";
import { SaveAndResetButon } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import {
  setNetworkFeeSettings,
  setSlippageToleranceSettings,
} from "@slices/appSlice";
import { NETWORKS } from "utils/constants";

const Step1: FC<PROPS> = ({
  setStep,
  handleClose,
  showSlippage,
  chainFamily,
}) => {
  const dispatch = useAppDispatch();
  const { networkFeeSettings, slippageToleranceSettings } = useAppSelector(
    (state) => state.app
  );
  const { feeType } = networkFeeSettings;
  const { slippageType } = slippageToleranceSettings;

  const handleOnSave = () => {
    handleClose();
  };

  /**
   * set to default settings for gas and slippage
   */
  const handeOnReset = () => {
    if (chainFamily === NETWORKS.EVM) {
      if (feeType !== NetworkFeeTypeChosen.Average) {
        dispatch(
          setNetworkFeeSettings({
            ...networkFeeSettings,
            feeType: NetworkFeeTypeChosen.Average,
          })
        );
      }
    }

    if (showSlippage) {
      if (slippageType !== SlippageTypeChosen.Second) {
        dispatch(
          setSlippageToleranceSettings({
            ...slippageToleranceSettings,
            slippageType: SlippageTypeChosen.Second,
          })
        );
      }
    }

    handleClose();
  };

  return (
    <motion.div>
      {chainFamily === NETWORKS.EVM && <GasFees setStep={setStep} />}
      {showSlippage && <Slippages setStep={setStep} />}
      <SaveAndResetButon onReset={handeOnReset} onSave={handleOnSave} />
    </motion.div>
  );
};

export default Step1;
