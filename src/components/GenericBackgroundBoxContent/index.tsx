import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

import { Text } from "@styled";
import { GenericBoxContent as PROPS } from "interfaces";

const GenericBackgroundBoxContent: FC<PROPS> = ({
  title,
  imageSrc,
  address,
  isAddress,
  timeStamp,
  walletName,
}) => {
  return (
    <div
      className="r-c-fs content"
      style={{
        cursor: "pointer",
        width: "100%",
      }}
    >
      <FontAwesomeIcon
        icon={imageSrc}
        color="white"
        className="f-body-lg"
        style={{ marginLeft: "14px", opacity: 0.5 }}
      />

      <Text className="marginLeft f-body">
        {title}
        <br />
        {walletName && (
          <Text className="f-body-sm" style={{ marginTop: "5px" }}>
            {walletName}
          </Text>
        )}
      </Text>
      {isAddress && (
        <Text className="marginLeft f-body-sm" customColor="#7B7A7F">
          ({address})
        </Text>
      )}

      {timeStamp && (
        <Text
          size={13}
          className="marginLeft f-label-sm "
          customColor="#7B7A7F"
          style={{ marginLeft: "auto", marginRight: "14px" }}
        >
          {moment(timeStamp).format("ll")}
        </Text>
      )}
    </div>
  );
};

export default GenericBackgroundBoxContent;
