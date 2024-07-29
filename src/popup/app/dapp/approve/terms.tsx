import { FC } from "react";
import { Text } from "@styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/pro-regular-svg-icons";

const Terms: FC = () => {
  return (
    <div className="dapp-connect-box">
      <div className="c-fs-c dapp-connect-terms">
        <Text size={16} style={{ marginBottom: 12}}>
          This is required to enable your wallet to perform a swap on your behalf
        </Text>
        <TermRow text="You can always revoke any approval in Settings > Security > Token allowances" />
      </div>
    </div>
  );
};

interface TermRow {
  text: string;
}

const TermRow: FC<TermRow> = ({ text }) => (
  <div className="r-fs-sb" style={{ borderTop: "2px solid #FFFFFF14", paddingTop: "10px" }}>
    <FontAwesomeIcon
      icon={faCircleInfo}
      className="statsIcon"
      fontSize={16}
      style={{ color: "#FFFFFF", marginLeft:"0px", opacity:"0.7" }}
    />
    <Text size={14} style={{opacity:"0.7"}}>{text}</Text>
  </div>
);

export default Terms;
