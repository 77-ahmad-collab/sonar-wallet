import { ButtonDefault, Text } from "@styled";
import { useAppSelector } from "store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/pro-solid-svg-icons";

const ChangeBox = () => {
  const {
    profit: { amount, status, symbol },
  } = useAppSelector((state) => state.app);
  const { tokenHoldings } = useAppSelector((state) => state.newWallet);

  const renderContent = () => {
    if (!Object.keys(tokenHoldings).length) {
      return null;
    }

    return (
      <>
        {amount !== 0 && (
          <FontAwesomeIcon
            icon={status ? faCaretUp : faCaretDown}
            color={status ? "rgba(61, 242, 188, 1)" : "red"}
            style={{ fontSize: 16, marginRight: 5 }}
          />
        )}
        <Text size={20} weight={400}>
          {amount}
        </Text>
        <Text size={20} weight={400} opacity={0.4}>
          {symbol}
        </Text>
        <Text
          className="f-body"
          opacity={0.4}
          style={{ marginLeft: "8px", marginRight: "6px" }}
        >
          in
        </Text>
        <ButtonDefault>
          <Text className="f-body">1</Text>
          <Text
            className="f-body-sm"
            opacity={0.4}
            style={{ marginLeft: "2px" }}
          >
            month
          </Text>
        </ButtonDefault>
      </>
    );
  };

  return renderContent();
};

export default ChangeBox;
