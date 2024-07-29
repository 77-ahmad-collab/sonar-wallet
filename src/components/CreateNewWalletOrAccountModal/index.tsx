import { FC, useEffect, useState } from "react";
import { faCheck } from "@fortawesome/pro-light-svg-icons";

import { BottomBasicModal, ButtonWithIcon } from "components";
import { ContentEditableBox, Text } from "@styled";
import { EditNameModalProps as PROPS } from "interfaces";

const CreateNewWalletOrAccountModal: FC<PROPS> = ({
  open,
  handleClose,
  top,
  isForWallet,
  defaultName,
  creatingSolanaAccount,
}) => {
  const [isCorrect, setIsCorrect] = useState(true);

  const [accountName, setAccountName] = useState(defaultName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNameLength = e.target.value.length;
    console.log(accountNameLength, e.target.value);
    if (accountNameLength <= 16) {
      setAccountName(e.target.value);
    }
    if (accountNameLength > 15 || accountNameLength === 0) setIsCorrect(false);
    else setIsCorrect(true);
  };

  useEffect(() => {
    setAccountName(defaultName);
  }, [defaultName]);

  return (
    <BottomBasicModal open={open} handleClose={() => {}} top={top}>
      <div className="c-fs-fs">
        <div style={{ width: "100%" }} className="r-c-fs">
          <ButtonWithIcon
            icon={faCheck}
            lightMode={true}
            onClick={() => {}}
            text=""
            isHover={false}
          />
          <Text customColor="#000000" className="f-body-lg">
            {isForWallet ? "Wallet" : "Account"} Created
          </Text>
        </div>

        <ContentEditableBox
          id="CreateNewWalletOrAccountModal-input"
          autoFocus
          className="f-body-lg"
          style={{
            border: `2px solid ${isCorrect ? "green" : "red"}`,
            cursor: "pointer",
          }}
          value={accountName}
          onChange={handleChange}
        />

        <Text customColor="#000000" className="f-body mgb-sm  mgt-sm">
          Your new {creatingSolanaAccount ? "" : "multichain"}{" "}
          {isForWallet ? "wallet" : "account"} is ready for use.
        </Text>
        <ButtonWithIcon
          id="CreateNewWalletOrAccountModal-submit"
          icon={faCheck}
          lightMode={true}
          onClick={() => {
            if (isCorrect) {
              handleClose(accountName);
              setAccountName(defaultName);
            }
          }}
          text="OK"
        />
      </div>
    </BottomBasicModal>
  );
};

export default CreateNewWalletOrAccountModal;
