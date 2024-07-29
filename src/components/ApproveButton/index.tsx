import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/pro-regular-svg-icons";

import { ApproveButtonStyled, Text } from "components/styled";
import RainbowLoader from "components/RainbowLoader";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  width?: number;
  left?: number;
  loading: boolean;
  handleApproval: () => Promise<void> | void;
}

const ApproveButton = ({ width, left, loading, handleApproval }: Props) => {
  return (
    <ApproveButtonStyled width={width} left={left} onClick={handleApproval} loading={loading}>
      <Text
        className="f-body-lg"
        weight={500}
        style={{
          textAlign: "center",
        }}
      >
        {loading ? (
          <RainbowLoader
            style={{ marginLeft: "auto", marginRight: "auto" }}
            size={25}
          />
        ) : (
          "Approve"
        )}
      </Text>
      <FontAwesomeIcon
        icon={faCircleInfo}
        className="statsIcon"
        fontSize={16}
        style={{ color: " rgba(255, 255, 255, 0.2)" }}
      />
    </ApproveButtonStyled>
  );
};

export default ApproveButton;
