import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/pro-regular-svg-icons";
import { faCircleInfo } from "@fortawesome/pro-solid-svg-icons";

import { SlippageSelectionBox } from "components";
import { Text } from "@styled";
import { SetStateNumberType, SlippageTypeChosen } from "interfaces";
import { useAppDispatch, useAppSelector } from "store/store";
import { setSlippageToleranceSettings } from "@slices/appSlice";

type Props = {
  setStep: SetStateNumberType;
};

const Slippages = ({ setStep }: Props) => {
  const dispatch = useAppDispatch();
  const { slippageToleranceSettings } = useAppSelector((state) => state.app);
  // const { swapSelectedTokens } = useAppSelector((state) => state.newWallet);
  const { slippageTolerance, slippageType } = slippageToleranceSettings;

  const handleSlippageOption = (index: number) => {
    if (index !== SlippageTypeChosen.Custom) {
      dispatch(
        setSlippageToleranceSettings({
          ...slippageToleranceSettings,
          slippageTolerance: {
            ...slippageTolerance,
          },
          slippageType: index,
        })
      );
    } else {
      goToCustomSlippage();
    }
  };

  const goToCustomSlippage = () => setStep(3);

  const slippageOptionList = [
    {
      title: slippageTolerance[SlippageTypeChosen.First].value.toString() + "%",
      isIcon: false,
    },
    {
      title:
        slippageTolerance[SlippageTypeChosen.Second].value.toString() + "%",
      isIcon: false,
    },
    {
      title: slippageTolerance[SlippageTypeChosen.Third].value.toString() + "%",
      isIcon: false,
    },
    {
      title:
        slippageTolerance[SlippageTypeChosen.Custom].value === 0
          ? ""
          : slippageTolerance[SlippageTypeChosen.Custom].value.toString() + "%",
      isIcon: true,
    },
  ];

  return (
    <>
      <div className="c-fs-c slippage">
        <FontAwesomeIcon
          icon={faPercent}
          className="statsIcon"
          style={{ marginRight: "0px" }}
        />

        <Text
          size={14}
          customStyle={{ marginTop: "10px", opacity: "0.8" }}
          className="r-c-fs"
        >
          Slippage{" "}
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="statsIcon"
            style={{ color: " rgba(255, 255, 255, 0.2)" }}
          />
        </Text>
      </div>

      <SlippageSelectionBox
        OptionList={slippageOptionList}
        handleOption={handleSlippageOption}
        optionIndex={Number(slippageType)}
        height={40}
      />
    </>
  );
};

export default Slippages;
