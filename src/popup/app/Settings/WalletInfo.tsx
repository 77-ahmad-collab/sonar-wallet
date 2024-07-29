import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPencil } from "@fortawesome/pro-solid-svg-icons";
import { faKeySkeleton } from "@fortawesome/pro-light-svg-icons";

import { Text } from "@styled";
import {
  CommonLayout,
  CreateNewWalletOrAccountModal,
  EditSingleEntityModal,
  ImageContent,
  ListItemWithAddress,
  RenderListContent,
  RevealModal,
} from "components";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { CHAIN_CATEGORIES, EVM, NETWORKS, SOLANA } from "utils/constants";
import { setAllWallets } from "@slices/newWalletSlice";
import { APPSCREENS } from "theme/constants";
import { decryptMessage, truncateName } from "utils";
import { useAccounts } from "hooks";
import { setAlert, setDerivationPathSolana } from "@slices/appSlice";
import { checkAccountFeasibility } from "utils/utils.holdings";
import DerivationPathModal from "components/DerivationPathModal";
import CachedService from "classes/cachedService";

const WalletInfo = () => {
  /* global-state */
  const { allWallets } = useAppSelector((state) => state.newWallet);

  /* local-state */
  const [editNameModal, setEditNameModal] = useState(false);
  const [showderivationPathModal, setShowderivationPathModal] = useState(false);
  const [revealModal, setRevealModal] = useState(false);
  const [createNewAccountModalStatus, setCreateNewModalStatus] =
    useState(false);
  const [derivationPath, setDerivationPath] = useState("m/44'/501'/0'/0'");
  const [creatingSolanaAccount, setCreatingSolanaAccount] = useState(false);

  /* hooks */
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { createEVMAccount, createSolanaAccount } = useAccounts();

  /* functions */
  const openEditNameModal = () => setEditNameModal(true);
  const openDerivationPathModal = () => setShowderivationPathModal(true);

  const closeEditNameModal = () => setEditNameModal(false);
  const closeDerivationPathModal = () => setShowderivationPathModal(false);

  const handleDerivationPath = (temp: string) => {
    setDerivationPath(temp);
    closeDerivationPathModal();
    dispatch(setDerivationPathSolana(temp));
    setCreatingSolanaAccount(true);
    setCreateNewModalStatus(true);
  };

  const openRevealModal = () => setRevealModal(true);

  const closeRevealModal = () => {
    console.log("closed me");
    setRevealModal(false);
    navigator.clipboard.writeText("");
  };

  const handleWalletNameSave = (newName: string) => {
    const newWalletInfo = {
      [currentWallet.walletId]: {
        ...currentWallet,
        name: newName,
      },
    };
    dispatch(setAllWallets(newWalletInfo));
    closeEditNameModal();
  };

  const handleAccountClick = (address: string) => {
    navigate(`${location.pathname}/${APPSCREENS.accountInfo}`, {
      state: { address },
    });
  };

  const navigateImportAccount = () =>
    navigate(`${location.pathname}/${APPSCREENS.importAccount}`, {
      state: { walletId: currentWallet.walletId },
    });

  const createNewAccount = async (accountName?: string) => {
    const walletId = currentWallet.walletId;
    const { permission, hasEnoughPing } = checkAccountFeasibility(walletId);
    if (permission) {
      const encryptedSeedphrase = allWallets[walletId].seedphrase;
      const hashedPassword = CachedService.getHashedPassword();
      const seedphrase = await decryptMessage(
        encryptedSeedphrase,
        hashedPassword
      );
      let newAccount;

      if (creatingSolanaAccount) {
        newAccount = createSolanaAccount(
          seedphrase,
          hashedPassword,
          Object.keys(allWallets).length,
          walletId,
          false,
          accountName,
          derivationPath
        );
      } else {
        newAccount = createEVMAccount(
          seedphrase,
          hashedPassword,
          Object.keys(allWallets).length,
          walletId,
          false,
          accountName
        );
      }
    } else {
      dispatch(
        setAlert({
          open: true,
          heading: "Alert",
          body: hasEnoughPing
            ? "Account limit reached for this wallet"
            : "You must have minimum 500 PING to create more accounts",
        })
      );
    }
  };

  /* effects */

  /* constants */
  const currentWallet = useMemo(() => {
    const state = location.state as { walletId: string };
    return allWallets[state.walletId];
  }, [allWallets, location.state]);

  const thisWalletAccounts = useMemo(() => {
    console.log(currentWallet, "current wallet changed");
    let allAccounts: string[] = [];
    Object.keys(NETWORKS).forEach((chainFamily) => {
      allAccounts = [
        ...allAccounts,
        ...currentWallet[chainFamily as keyof typeof NETWORKS],
      ];
    });
    return allAccounts;
  }, [currentWallet]);

  const List = [
    {
      text: "Reveal Secret Phrase",
      leftSideElement: (
        <FontAwesomeIcon icon={faKeySkeleton} className="listItemIcon mgr-sm" />
      ),
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
        />
      ),
      onClick: openRevealModal,
      disabled: false,
    },
    {
      text: "Import an Account",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          id="settings-import-account"
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
        />
      ),
      onClick: navigateImportAccount,
      disabled: false,
    },
    {
      text: "Import an Account (Read Only)",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          id="settings-import-account"
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
        />
      ),
      onClick: () => {},
      disabled: true,
    },
    {
      text: "Create new EVM Account",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
        />
      ),
      onClick: () => setCreateNewModalStatus(true),
      disabled: false,
    },
    {
      text: "Create new Solana Account",
      leftSideElement: <></>,
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
        />
      ),
      onClick: openDerivationPathModal,
      disabled: false,
    },
  ];

  return (
    <CommonLayout
      onTopImageClick={() => navigate(-1)}
      title={truncateName(currentWallet.name)}
    >
      <div className="full-width">
        <Text
          id="walletInfo-walletname"
          size={25}
          weight={400}
          className="r-c-fs"
          style={{ margin: "10px 0px 0px 12px" }}
        >
          {truncateName(currentWallet.name)}
          <FontAwesomeIcon
            id="wallet-edit-pencil"
            icon={faPencil}
            className="pencilIcon"
            style={{ fontSize: "20px" }}
            onClick={openEditNameModal}
          />
        </Text>
        <RenderListContent List={List} />
        <Text size={14} weight={400} dim={true} style={{ margin: "10px 12px" }}>
          Addresses
        </Text>
        <>
          {thisWalletAccounts.map((singleAccount) => {
            const thisAccountInfo =
              StaticStore.getState().newWallet.accounts[singleAccount];

            return (
              <ListItemWithAddress
                key={thisAccountInfo.address}
                leftSideElement={
                  <>
                    <ImageContent
                      // key={key}
                      src={CHAIN_CATEGORIES[thisAccountInfo.chainFamily].LOGO}
                      Size={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "15px",
                      }}
                    />
                  </>
                }
                text={truncateName(thisAccountInfo.name)}
                rightSideElement={
                  <FontAwesomeIcon
                    id={`arrow-${thisAccountInfo.address}`}
                    icon={faChevronRight}
                    style={{ color: theme.palette.text.secondary }}
                    className="f-body-lg"
                  />
                }
                address={thisAccountInfo.address}
                onClick={() => handleAccountClick(thisAccountInfo.address)}
              />
            );
          })}
        </>
        <EditSingleEntityModal
          open={editNameModal}
          handleClose={closeEditNameModal}
          handleSave={(newName) => handleWalletNameSave(newName)}
          entityName="Wallet Name"
          defaultValue={currentWallet.name}
        />
        <RevealModal
          open={revealModal}
          handleClose={closeRevealModal}
          walletSecret={currentWallet.seedphrase}
        />
        <CreateNewWalletOrAccountModal
          open={createNewAccountModalStatus}
          handleClose={(name) => {
            setCreateNewModalStatus(false);
            createNewAccount(name.trim());
            setCreatingSolanaAccount(false);
          }}
          isForWallet={false}
          top={380}
          defaultName={
            creatingSolanaAccount
              ? `Account ${currentWallet[SOLANA].length + 1}`
              : `Account ${currentWallet[EVM].length + 1}`
          }
          creatingSolanaAccount={creatingSolanaAccount}
        />
        <DerivationPathModal
          open={showderivationPathModal}
          handleClose={closeDerivationPathModal}
          handleSubmit={handleDerivationPath}
        />
      </div>
    </CommonLayout>
  );
};

export default WalletInfo;
