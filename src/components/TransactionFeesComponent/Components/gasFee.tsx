import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@mui/material";
import {
  faClock,
  faDollar,
  faGasPump,
  faPercent,
} from "@fortawesome/pro-light-svg-icons";
import { faCircleInfo } from "@fortawesome/pro-solid-svg-icons";

import {
  SingleBoxStyled,
  SpanOpacityStyled,
  StatsSection,
  Text,
  TransactionFeeBodyLayout,
} from "@styled";
import { formatAmount } from "utils/formatters";
import { useAppSelector } from "store/store";
import { SLIPPAGE } from "utils/constants";
import { GasFeeComponentProps as PROPS } from "interfaces";

const GasFeeComponent: FC<PROPS> = ({
  totalInUsd,
  Title,
  showSlippage,
}) => {
  const {
    isSlideAnimationCompleted,
    slippageToleranceSettings: { slippageType, slippageTolerance },
    networkFeeSettings: { gasInfo, feeType },
  } = useAppSelector((state) => state.app);

  const boxList = [
    {
      Icon: (
        <div className="statsIconWrapper">
          <FontAwesomeIcon
            icon={faGasPump}
            className="statsIcon"
            fontSize={16}
            style={{ color: "rgba(160, 164, 255, 1)" }}
          />
        </div>
      ),
      title: "Fees",
      value: `~ ${formatAmount(gasInfo[feeType].usd)}`,
      valueSymbol: " $",
    },
    {
      Icon: (
        <div className="statsIconWrapper">
          <FontAwesomeIcon
            icon={faDollar}
            className="statsIcon"
            fontSize={16}
            style={{ color: "rgba(61, 242, 188, 1)" }}
          />
        </div>
      ),
      title: "Value",
      value: `~ ${formatAmount(totalInUsd)}`,
      valueSymbol: " $",
    },
    {
      Icon: (
        <div className="statsIconWrapper">
          <FontAwesomeIcon
            icon={faPercent}
            className="statsIcon"
            fontSize={16}
            style={{ color: " rgba(254, 169, 188, 1)" }}
          />
        </div>
      ),
      title: SLIPPAGE,
      value: slippageTolerance[slippageType].value,
      valueSymbol: " %",
    },
    {
      Icon: (
        <div className="statsIconWrapper">
          <FontAwesomeIcon
            icon={faClock}
            className="statsIcon"
            fontSize={16}
            style={{ color: "rgba(254, 180, 49, 1)" }}
          />
        </div>
      ),
      title: "Speed",
      value: `< ${gasInfo[feeType].time.toFixed(2)} `,
      valueSymbol: " m",
    },
  ].filter((item) => (showSlippage ? true : item.title !== SLIPPAGE));

  return (
    <>
      <TransactionFeeBodyLayout>
        {Title}
        <Divider orientation="vertical" variant="middle" flexItem />
        <StatsSection>
          {boxList.map((value, index) => {
            return (
              <SingleBoxStyled key={index}>
                <div className="r-c-c">
                  {value.Icon}
                  <Text
                    customStyle={{ display: "flex", alignItems: "center" }}
                    className="f-body-sm"
                    weight={400}
                  >
                    {value.title}
                  </Text>
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="statsIcon"
                    fontSize={16}
                    style={{ color: " rgba(255, 255, 255, 0.2)" }}
                  />
                </div>
                <Text
                  className={`f-body ${
                    isSlideAnimationCompleted ? "animated" : ""
                  }`}
                  customStyle={{ marginLeft: "10px" }}
                  weight={400}
                >
                  {value.value}
                  <SpanOpacityStyled opacity={0.4}>
                    {value.valueSymbol}
                  </SpanOpacityStyled>
                </Text>
              </SingleBoxStyled>
            );
          })}
        </StatsSection>
      </TransactionFeeBodyLayout>
    </>
  );
};

export default GasFeeComponent;
