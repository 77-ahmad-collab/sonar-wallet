import { useLocation, useNavigate } from "react-router";
import { useTheme } from "@mui/material";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Bip39 from "bip39";

import { CommonLayout, RenderListContent } from "components";
import { APPSCREENS } from "theme/constants";
import { useAppDispatch } from "store/store";
import { setAlert, setGeneratedMnemonic } from "@slices/appSlice";
import { checkWalletFeasibility } from "utils/utils.holdings";
import { encryptMessage } from "utils";
import CachedService from "classes/cachedService";

const ManageWallets = () => {
  /* global-state */

  /* local-state */

  /* hooks */
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* functions */
  const navigateManageWallets = () =>
    navigate(`${pathname}/${APPSCREENS.wallets}`);

  const navigateImportWallet = () =>
    navigate(`${pathname}/${APPSCREENS.importWallet}`);

  const createWallet = async () => {
    const { permission, hasEnoughPing } = checkWalletFeasibility();
    if (permission) {
      const generatedMnemonic = Bip39.generateMnemonic();
      const encryptedMnemonic = encryptMessage(
        generatedMnemonic,
        CachedService.getHashedPassword()
      );
      await dispatch(
        setGeneratedMnemonic({
          mnemonic: encryptedMnemonic,
        })
      );
      navigate(APPSCREENS.seedphrase);
    } else {
      dispatch(
        setAlert({
          open: true,
          heading: "Alert",
          body: hasEnoughPing
            ? "Wallet Creation limit reached"
            : "You must have minimum 500 PING to create more wallets",
        })
      );
    }
  };

  const List = [
    {
      text: "Manage Wallets",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      onClick: navigateManageWallets,
    },
    {
      text: "Import a Wallet",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          id="settings-import-wallet"
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      onClick: navigateImportWallet,
    },
    {
      text: "Create new Wallet",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      onClick: () => createWallet(),
    },
  ];

  return (
    <CommonLayout onTopImageClick={() => navigate(-1)} title="Manage Wallets">
      <div className="full-width">
        <RenderListContent List={List} />
      </div>
    </CommonLayout>
  );
};

export default ManageWallets;
