import { ChangeEvent, useEffect, useState } from "react";
import _ from "lodash";

import { CustomAmountComponent } from "components";
import { Text } from "@styled";
import { SetStateNumberType, SlippageTypeChosen } from "interfaces";
import { useAppDispatch, useAppSelector } from "store/store";
import { setSlippageToleranceSettings } from "@slices/appSlice";
import { NETWORKS } from "utils/constants";

type Props = {
  setStep: SetStateNumberType;
};

const SlippageToleranceSettings = ({ setStep }: Props) => {
  const dispatch = useAppDispatch();
  const { slippageToleranceSettings } = useAppSelector((state) => state.app);
  const {
    swapSelectedTokens: { initialSlippage, account },
  } = useAppSelector((state) => state.newWallet);
  const { slippageTolerance, slippageType } = slippageToleranceSettings;

  const [slippageValue, setSlippageValue] = useState(
    slippageTolerance[SlippageTypeChosen.Custom].value.toString()
  );
  const [customSlippageError, setCustomSlippageError] = useState("");
  const [customSlippageWarning, setCustomSlippageWarning] = useState("");

  /**
   *
   * @param event value for slippage event
   */
  const handleSlippageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value.trim();

    if (
      _.isNumber(parseFloat(amount)) &&
      !isNaN(+amount) &&
      !amount.includes("-")
    ) {
      setSlippageValue(amount);
    }
  };

  /**
   * Checks and sets the value of the slippage property
   */
  useEffect(() => {
    (async () => {
      setSlippageValue(slippageTolerance[slippageType].value.toString());
    })();
  }, [slippageType]);

  /**
   * show warning messages when user type invalid values
   */
  useEffect(() => {
    setCustomSlippageWarning("");

    if (account.chainFamily === NETWORKS.EVM) {
      if (
        parseInt(slippageValue) < 3 + initialSlippage &&
        parseInt(slippageValue) >= 1 + initialSlippage
      ) {
        setCustomSlippageWarning(`Your transaction may fail`);
      } else if (parseInt(slippageValue) >= 15 + initialSlippage) {
        setCustomSlippageWarning(`Your transaction may be frontrun`);
      } else if (
        parseInt(slippageValue) < 15 + initialSlippage &&
        parseInt(slippageValue) >= 3 + initialSlippage
      ) {
        setCustomSlippageWarning("");
      }
    } else if (account.chainFamily === NETWORKS.NEAR) {
      // if (
      //   parseInt(slippageValue) < 3 + initialSlippage &&
      //   parseInt(slippageValue) >= 1 + initialSlippage
      // ) {
      //   setCustomSlippageWarning(`Your transaction may fail`);
      // } else
      if (parseInt(slippageValue) >= 15 + initialSlippage) {
        setCustomSlippageWarning(`Your transaction may be frontrun`);
      } else if (
        parseInt(slippageValue) < 15 + initialSlippage &&
        parseInt(slippageValue) >= 3 + initialSlippage
      ) {
        setCustomSlippageWarning("");
      }
    }
  }, [slippageValue]);

  const handleCustomSlippageClose = () => {
    setCustomSlippageError("");
    setStep(1);
  };

  /**
   * check slippage validation
   * @returns boolean
   */
  const isValidSlippage = () => {
    const LIMIT = account.chainFamily === NETWORKS.NEAR ? 0.5 : 1;
    if (
      !slippageValue ||
      slippageValue.length === 0 ||
      slippageValue === undefined ||
      slippageValue === null ||
      slippageValue === ""
    ) {
      setCustomSlippageError(`Enter slippage value`);
      return false;
    } else if (parseFloat(slippageValue) < LIMIT + initialSlippage) {
      setCustomSlippageError(`Slippage value too low`);
      return false;
    } else if (parseFloat(slippageValue) > 50 + initialSlippage) {
      setCustomSlippageError(`Enter a valid Slippage percentage`);
      return false;
    }
    return true;
  };

  /**
   * set custom slippage value if seleccted
   */
  const handleCustomSlippageSubmit = async () => {
    if (isValidSlippage()) {
      await dispatch(
        setSlippageToleranceSettings({
          ...slippageToleranceSettings,
          slippageType: SlippageTypeChosen.Custom,
          slippageTolerance: {
            ...slippageTolerance,
            [SlippageTypeChosen.Custom]: {
              value: Number(parseFloat(slippageValue).toFixed(1)),
            },
          },
        })
      );
      handleCustomSlippageClose();
    }
  };

  const handleOnSave = () => {
    handleCustomSlippageSubmit();
  };

  const handeOnReset = () => {
    handleCustomSlippageClose();
  };

  return (
    <>
      <CustomAmountComponent
        handleChange={handleSlippageChange}
        value={slippageValue}
        title={"Set custom slippage"}
        onCancel={handleCustomSlippageClose}
        error={customSlippageError}
        warning={customSlippageWarning}
        handleOnSave={handleOnSave}
        handeOnReset={handeOnReset}
        placeholder={
          <>
            <Text>%</Text>
          </>
        }
      />
    </>
  );
};
export default SlippageToleranceSettings;
