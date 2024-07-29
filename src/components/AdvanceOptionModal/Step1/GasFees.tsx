import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faGasPump } from "@fortawesome/pro-solid-svg-icons";

import { GasFeeSelectionBox } from "components";
import { Text } from "@styled";
import { NetworkFeeTypeChosen, SetStateNumberType } from "interfaces";
import { useAppDispatch, useAppSelector } from "store/store";
import { setNetworkFeeSettings } from "@slices/appSlice";
import { formatAmount } from "utils/formatters";
import { Custom } from "utils/constants";

type Props = {
  setStep: SetStateNumberType;
};

const GasFees = ({ setStep }: Props) => {
  const dispatch = useAppDispatch();
  const { networkFeeSettings } = useAppSelector((state) => state.app);
  const { gasInfo, feeType } = networkFeeSettings;

  const gasOptionList = [
    {
      title: "Slow",
      value: formatAmount(gasInfo[0].usd),
      isIcon: false,
      time: gasInfo[0].time,
      valueInGwei: gasInfo[0].gwei,
    },
    {
      title: "Medium",
      value: formatAmount(gasInfo[1].usd),
      isIcon: false,
      time: gasInfo[1].time,
      valueInGwei: gasInfo[1].gwei,
    },
    {
      title: "Fast",
      value: formatAmount(gasInfo[2].usd),
      isIcon: false,
      time: gasInfo[2].time,
      valueInGwei: gasInfo[2].gwei,
    },
    {
      title: Custom,
      value: formatAmount(gasInfo[3].usd),
      isIcon: true,
      time: gasInfo[3].time,
      valueInGwei: gasInfo[3].gwei,
    },
  ];

  const handleGasOption = (index: number) => {
    if (index !== NetworkFeeTypeChosen.Custom) {
      dispatch(
        setNetworkFeeSettings({
          ...networkFeeSettings,
          feeType: index,
        })
      );
    } else {
      goToCustomGas();
    }
  };

  const goToCustomGas = () => setStep(2);

  return (
    <>
      <div className="c-fs-c">
        <FontAwesomeIcon
          icon={faGasPump}
          className="dimOpacity"
          fontSize={24}
        />
        <Text
          customStyle={{ marginTop: "10px", opacity: "0.8" }}
          className="r-c-fs f-label"
        >
          Gas Fees{" "}
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="statsIcon"
            style={{ color: " rgba(255, 255, 255, 0.2)" }}
          />
        </Text>
      </div>

      <GasFeeSelectionBox
        OptionList={gasOptionList}
        handleOption={handleGasOption}
        optionIndex={Number(feeType)}
        height={80}
      />
    </>
  );
};

export default GasFees;
