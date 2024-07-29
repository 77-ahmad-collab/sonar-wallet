import { LeftUnit } from "assets/images";
import { FlexBox, Text } from "@styled";
import { useAppSelector } from "store/store";
import { formatAmount } from "utils/formatters";
import ImageContent from "components/ImageContent";

const ChartBalance = () => {
  const { totalFilteredSum } = useAppSelector((state) => state.app);

  return (
    <FlexBox
      paddingTrue={false}
      onlyFlex={false}
      FlexStart={true}
      style={{ border: "2px solid red" }}
    >
      <ImageContent Size={{ width: "13px", height: "39px" }} src={LeftUnit} />
      <Text size={32} style={{ marginRight: "1px", marginLeft: "3px" }}>
        {formatAmount(totalFilteredSum)}SSSS
      </Text>
    </FlexBox>
  );
};

export default ChartBalance;
