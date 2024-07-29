import { FC } from "react";

import { SimpleTile } from "components";
import { WalletsListProps as PROPS } from "interfaces";
import { useAppSelector } from "store/store";
import { DUMMY_IMAGE_URL } from "utils/constants";

const WalletsList: FC<PROPS> = ({
  onWalletClick = () => {},
  ListStyle = {},
  selectedWallet,
}) => {
  const { allWallets } = useAppSelector((state) => state.newWallet);

  const renderWallets = () =>
    Object.values(allWallets).map((wallet, i) => (
      <SimpleTile
        key={i}
        tileInfo={{
          NAME: wallet.name,
          LOGO: DUMMY_IMAGE_URL,
          ADDRESS: "",
          chain: "",
          id: wallet.walletId,
        }}
        onClick={onWalletClick}
        isSelected={selectedWallet?.id === wallet.walletId}
        enableToggle
      />
    ));

  return (
    <div style={{ padding: "0px 20px", ...ListStyle }}>{renderWallets()}</div>
  );
};

export default WalletsList;
