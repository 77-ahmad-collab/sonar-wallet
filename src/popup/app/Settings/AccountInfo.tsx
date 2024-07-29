import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faKeySkeleton } from "@fortawesome/pro-light-svg-icons";
import { faChevronRight, faPencil } from "@fortawesome/pro-solid-svg-icons";
import { Avatar, useTheme } from "@mui/material";
import QRCode from "qrcode";

import {
  CommonLayout,
  EditSingleEntityModal,
  ListItem,
  RevealModal,
} from "components";
import { ButtonDefault, Text } from "@styled";
import { CHAIN_CATEGORIES } from "utils/constants";
import { useAppDispatch, useAppSelector } from "store/store";
import { setAccounts } from "@slices/newWalletSlice";
import { truncateName } from "utils";

const AccountInfo = () => {
  /* global-state */
  const theme = useTheme();
  const { accounts } = useAppSelector((state) => state.newWallet);

  /* local-state */
  const [src, setSrc] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [editNameModal, setEditNameModal] = useState(false);
  const [revealModal, setRevealModal] = useState(false);

  /* hooks */
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  /* functions */
  const handleAccountNameSave = (newName: string) => {
    const newAccountInfo = {
      [currentAccount.address]: {
        ...currentAccount,
        name: newName,
      },
    };
    dispatch(setAccounts(newAccountInfo));
    setEditNameModal(false);
  };

  const handleCopyBtn = () => {
    navigator.clipboard.writeText(currentAccount.address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const closeRevealModal = () => {
    setRevealModal(false);
    navigator.clipboard.writeText("");
  };

  /* effects */
  useEffect(() => {
    QRCode.toDataURL(`${currentAccount.address}`).then((data) => setSrc(data));
  }, []);

  const currentAccount = useMemo(() => {
    const state = location.state as { address: string };
    return accounts[state.address];
  }, [accounts, location.state]);

  return (
    <CommonLayout
      onTopImageClick={() => navigate(-1)}
      title={truncateName(currentAccount.name)}
    >
      <div className="full-width">
        <Avatar
          src={CHAIN_CATEGORIES[currentAccount.chainFamily].LOGO}
          style={{ width: 35, height: 35, marginTop: 12 }}
        />
        <Text
          size={25}
          weight={400}
          className="r-c-fs"
          style={{ marginTop: "12px" }}
        >
          {truncateName(currentAccount.name)}
          <FontAwesomeIcon
            id="account-edit-pencil"
            icon={faPencil}
            className="pencilIcon"
            style={{ fontSize: "20px" }}
            onClick={() => setEditNameModal(true)}
          />
        </Text>
        <ButtonDefault
          id="AccountInfo-handleCopyBtn"
          style={{ marginTop: 25 }}
          className="f-body"
          onDarkBack
          toggled={isCopied}
          width={140}
          onClick={handleCopyBtn}
        >
          <FontAwesomeIcon
            icon={faCopy}
            color={isCopied ? "black" : "rgba(255,255,255,0.4)"}
            style={{ fontSize: 16, marginRight: 8 }}
          />
          {isCopied ? "Copied" : "Copy Address"}
        </ButtonDefault>
        <img src={src} className="account-qrcode" />
        <Text
          opacity={0.7}
          size={13}
          align="center"
          style={{ overflowWrap: "break-word" }}
        >
          {currentAccount.address}
        </Text>
        <ListItem
          leftSideElement={
            <FontAwesomeIcon
              icon={faKeySkeleton}
              className="listItemIcon mgr-sm"
            />
          }
          text="Reveal Private Key"
          rightSideElement={
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ color: theme.palette.text.secondary }}
            />
          }
          onClick={() => setRevealModal(true)}
        />
        <EditSingleEntityModal
          open={editNameModal}
          handleClose={() => setEditNameModal(false)}
          handleSave={(newName) => handleAccountNameSave(newName)}
          entityName="Account Name"
          defaultValue={currentAccount.name}
        />
        <RevealModal
          open={revealModal}
          handleClose={closeRevealModal}
          accountSecret={currentAccount.secret}
        />
      </div>
    </CommonLayout>
  );
};

export default AccountInfo;
