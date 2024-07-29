import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump } from "@fortawesome/pro-solid-svg-icons";

import { IconAvatar, Text } from "@styled";

const DappTxError = () => {
  return (
    <div className="dapp-err-box">
      <IconAvatar>
        <FontAwesomeIcon
          icon={faGasPump}
          color="rgba(255, 55, 94, 1)"
          style={{ fontSize: 18 }}
        />
      </IconAvatar>
      <Text weight={500} size={20} style={{ fontFamily: "sans-serif" }}>
        No Balance for Gas
      </Text>
      <Text opacity={0.4} weight={400} size={14} style={{ marginTop: "8px" }}>
        Try with a smaller transaction or deposit ETH
      </Text>
    </div>
  );
};

export default DappTxError;
