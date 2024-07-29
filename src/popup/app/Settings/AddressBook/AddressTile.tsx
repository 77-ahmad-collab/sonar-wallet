import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/pro-solid-svg-icons";

import { ButtonDefault } from "@styled";
import common from "utils/common";
import { Text } from "@styled";
import { AddressBook } from "@slices/appSlice";
import { formatAddress } from "utils/formatters";

const AddressTile: FC<{
  onEditClick: (address: string) => void;
  onRemoveClick: (address: string) => void;
  addressInfo: AddressBook["acc_address"];
}> = ({ onEditClick, onRemoveClick, addressInfo }) => {
  return (
    <ButtonDefault
      //   bright={isSelected}
      //   onClick={() => onClick(tileInfo)}
      style={{
        ...common.r_c_sb,
        padding: "10px 15px",
        marginTop: "15px",
        boxShadow: "0px 3px 13px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ maxWidth: 200, overflow: "hidden" }}>
        <Text size={17}>{addressInfo.name}</Text>
        <Text size={13} dim>
          {formatAddress(addressInfo.address)}
        </Text>
      </div>
      <div>
        <FontAwesomeIcon
          id={`edit-${addressInfo.address}`}
          icon={faPen}
          color="rgba(255, 255, 255, 0.7)"
          style={{ fontSize: 18, marginRight: 10 }}
          onClick={() => onEditClick(addressInfo.address)}
        />
        <FontAwesomeIcon
          id={`remove-${addressInfo.address}`}
          icon={faTrash}
          color="rgba(255, 55, 94, 1)"
          style={{ fontSize: 18 }}
          onClick={() => onRemoveClick(addressInfo.address)}
        />
      </div>
    </ButtonDefault>
  );
};

export default AddressTile;
