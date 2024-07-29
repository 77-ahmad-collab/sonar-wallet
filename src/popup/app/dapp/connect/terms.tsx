import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons";
import { DappTermsProps as PROPS } from "interfaces";

import { Text } from "@styled";

const Terms: FC<PROPS> = () => {
  return (
    <div className="dapp-connect-box">
      <div className="c-fs-c dapp-connect-terms">
        <Text size={14} style={{ marginBottom: 12, opacity: "0.7" }}>
          Allow this app to:
        </Text>
        <TermRow text="See address, account balance, activity and suggest tx to approve" />
      </div>
    </div>
  );
};

interface TermRow {
  text: string;
}

const TermRow: FC<TermRow> = ({ text }) => (
  <div className="r-fs-sb">
    <FontAwesomeIcon
      icon={faCheck}
      color="white"
      style={{ fontSize: 18, marginRight: 12 }}
    />
    <Text size={16}>{text}</Text>
  </div>
);

export default Terms;
