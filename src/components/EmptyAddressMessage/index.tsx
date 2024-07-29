import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EmptyAddressStyled, Text } from "@styled";
import { AddressBookProps as PROPS } from "interfaces";

const EmptyAddress: FC<PROPS> = ({ icon, text }) => {
  return (
    <EmptyAddressStyled>
      <FontAwesomeIcon
        icon={icon}
        style={{ color: " rgba(255, 255, 255, 0.2)", fontSize: "64px" }}
      />
      <Text size={20} className="mgt-sm">
        {text}
      </Text>
    </EmptyAddressStyled>
  );
};

export default EmptyAddress;
