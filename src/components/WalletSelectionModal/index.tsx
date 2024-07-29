import { FC, useState } from "react";

import { CustomBox, GenericBox, Text } from "@styled";

import { BasicModal, WalletsList } from "components";
import {
  WalletSelectionModalProps as PROPS,
  SimpleTileinfoProps,
} from "interfaces";
import { useAppSelector } from "store/store";
import { DUMMY_IMAGE_URL } from "utils/constants";

const WalletSelectionModal: FC<PROPS> = ({
  isModalOpen,
  onClose,
  onWalletClick = () => {},
  heading,
  confirmBtnText,
  onConfirmClick = () => {},
}) => {
  /* global-state */
  const { allWallets } = useAppSelector((state) => state.newWallet);

  const setDefaultWallet = () => {
    const defaultWallet = Object.values(allWallets)[0];
    return {
      NAME: defaultWallet.name,
      LOGO: DUMMY_IMAGE_URL,
      id: defaultWallet.walletId,
    };
  };

  /* local-state */
  const [selectedWallet, setSelectedWallet] = useState<SimpleTileinfoProps>(
    setDefaultWallet()
  );

  /* hooks */

  /* functions */
  const handleWalletClick = (wallet: SimpleTileinfoProps) => {
    setSelectedWallet(wallet);
    onWalletClick(wallet);
  };

  /* effects */

  return (
    <BasicModal open={isModalOpen} handleClose={onClose}>
      <CustomBox
        backgroundColor="#191a22"
        width="90%"
        borderRadius="12px"
        padding="20px"
        style={{ outline: "none", maxHeight: "400px" }}
      >
        <Text size={16} weight={600} customStyle={{ marginBottom: "10px" }}>
          {heading ?? "Select Wallet"}
        </Text>
        <WalletsList
          onWalletClick={handleWalletClick}
          selectedWallet={selectedWallet}
          ListStyle={{ padding: "0px", maxHeight: 250, overflowY: "scroll" }}
        />
        <div className="r-c-c">
          <GenericBox className="generic" onClick={onClose}>
            Cancel
          </GenericBox>
          <GenericBox
            className="generic"
            onClick={() => onConfirmClick(selectedWallet)}
          >
            {confirmBtnText ?? "Create"}
          </GenericBox>
        </div>
      </CustomBox>
    </BasicModal>
  );
};

export default WalletSelectionModal;
