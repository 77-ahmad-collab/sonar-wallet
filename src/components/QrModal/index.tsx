import { FC, useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faXmark } from "@fortawesome/pro-light-svg-icons";
import QRCode from "qrcode";

import { ButtonDefault, ModalParentBoxStyled, Text } from "@styled";
import { BasicModal } from "components";
import { QrModalProps as PROPS } from "interfaces";
import { truncateName } from "utils";

const QrModal: FC<PROPS> = ({
  onClose = () => {},
  token,
  account,
  isModalOpen = false,
  network,
}) => {
  /* global-state */

  /* local-state */
  const [src, setSrc] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  /* hooks */

  /* functions */

  const handleCopyBtn = () => {
    navigator.clipboard.writeText(`${account?.ADDRESS}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  /* effects */
  useEffect(() => {
    if (account) {
      QRCode.toDataURL(`Address: ${account?.ADDRESS}`).then((data) =>
        setSrc(data)
      );
    }
    // `Token: ${token.NAME}\nAmount: ${amount}\nNetwork: ${network?.NAME}\nAddress: ${account?.ADDRESS}`
  }, [token, account]);

  return (
    <BasicModal open={isModalOpen} handleClose={onClose}>
      <ModalParentBoxStyled width="90%" style={{ padding: "15px" }}>
        <div className="r-c-sb" style={{ width: "100%" }}>
          <Avatar src={network?.LOGO} style={{ width: 35, height: 35 }} />
          <ButtonDefault onDarkBack width={35} height={35} onClick={onClose}>
            <FontAwesomeIcon
              icon={faXmark}
              color="white"
              style={{ fontSize: 14 }}
            />
          </ButtonDefault>
        </div>
        <Text size={23} style={{ marginTop: 24 }}>
          Receive funds
        </Text>
        <div className="r-c-fs" style={{ marginTop: 12 }}>
          <Text size={16} opacity={0.7}>
            on
          </Text>
          {/* <Avatar
            src={token?.LOGO}
            style={{ width: 24, height: 24, margin: "0px 12px 0px 12px" }}
          /> */}
          <Text size={23} style={{ margin: "0px 12px 0px 12px" }}>
            {account?.NAME && truncateName(account.NAME)}
          </Text>
        </div>
        <ButtonDefault
          style={{ fontSize: 14, marginTop: 25 }}
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
        <img src={src} className="QRcode" alt="ahmad" />
        <Text
          opacity={0.7}
          size={13}
          align="center"
          style={{ overflowWrap: "break-word" }}
        >
          {account?.ADDRESS}
        </Text>
      </ModalParentBoxStyled>
    </BasicModal>
  );
};

export default QrModal;
