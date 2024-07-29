import { FC, useCallback, useState } from "react";
import { Input } from "@mui/material";
import * as Bip39 from "bip39";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeySkeleton } from "@fortawesome/pro-solid-svg-icons";

import { ImportProps as PROPS } from "interfaces";
import { CustomBox, PasswordInputStyled, Text } from "@styled";
import { checkSum, decryptMessage, matchAddresses } from "utils";
import { ButtonBox, CommonLayout, EditSingleEntityModal } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import { useAllWallets } from "hooks";
import { useAccounts } from "hooks";
import { setAlert as setGlobalAlert } from "@slices/appSlice";
import { Keypair } from "@solana/web3.js";
import {
  checkAccountFeasibility,
  checkWalletFeasibility,
} from "utils/utils.holdings";
import CachedService from "classes/cachedService";
import { ethers } from "ethers";

const b58 = require("b58");
const Import: FC<PROPS> = ({ accountImport }) => {
  /* global-state */
  const { allWallets } = useAppSelector((state) => state.newWallet);

  const location = useLocation();
  const dispatch = useAppDispatch();

  /* local-state */
  const [input, setInput] = useState("");
  const [isMemonicTrue, setIsMemonicTrue] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    message: "",
  });
  const [walletId] = useState(location.state?.walletId ?? "0");

  // 0: Evm 1: Solana 2: Near(not supported yet)
  const [importOption, setImportOption] = useState(0);

  /* hooks */
  const navigate = useNavigate();
  const { addWallet } = useAllWallets();
  const { importEVMAccount, importSolanaAccount, checkAccountExist } =
    useAccounts();

  /* functions */
  const onRecover = () => {
    try {
      const isValidMnemonic = Bip39.validateMnemonic(input);
      setButtonClicked(true);
      if (isValidMnemonic) {
        setIsMemonicTrue(true);
        setAlert({
          status: true,
          message: "Ready to import",
        });
      } else {
        setAlert({
          status: true,
          message: "This does not seem to be a valid seedphrase",
        });
        setIsMemonicTrue(false);
      }
    } catch (e) {
      console.log(e);
      setIsMemonicTrue(false);
    }
  };

  const validateEVMKey = (key: string) => {
    const wallet = new ethers.Wallet(key);
    const accountAddress = checkSum(wallet.address);
    const accountExist = checkAccountExist(accountAddress);
    if (accountExist) {
      setAlert({ status: true, message: "account already exits" });
    } else {
      setEditNameModal(true);
    }
  };

  const validateSolanaKey = (key: string) => {
    const b58SecretKey = b58.decode(key);
    const { publicKey } = Keypair.fromSecretKey(b58SecretKey);
    console.log(
      "🚀 ~ file: index.tsx:94 ~ validateSolanaKey ~ publicKey:",
      publicKey.toString()
    );
    const accountExist = checkAccountExist(publicKey.toString());
    console.log(
      "🚀 ~ file: index.tsx:99 ~ validateSolanaKey ~ accountExist:",
      accountExist
    );
    if (accountExist) {
      setAlert({ status: true, message: "account already exits" });
    } else {
      setEditNameModal(true);
    }
  };

  const RecoverAccount = async (key: string) => {
    try {
      if (!key) {
        setAlert({ status: true, message: "Please enter a key" });
        alertChange();
      } else {
        const { permission, hasEnoughPing } = checkFeasibility();
        if (permission) {
          // if (
          //   // network === SupportedChainId.NEAR_TESTNET ||
          //   network === SupportedChainId.NEAR
          // ) {
          //   console.log("near");
          // } else
          if (key.length === 88) {
            /// SOLANA PVT KEY
            // result = await importSolanaAccount(key, `${walletId}`);
            setImportOption(1);
            validateSolanaKey(key);
            // setEditNameModal(true);
          } else {
            // EVM PVT KEY
            // result = await importEVMAccount(key, `${walletId}`);
            setImportOption(0);
            validateEVMKey(key);
          }
        } else {
          dispatch(
            setGlobalAlert({
              open: true,
              heading: "Alert",
              body: hasEnoughPing
                ? "Accounts Limit Reached"
                : "You must have minimum 500 PING to import more accounts",
            })
          );
        }
      }
    } catch (error) {
      setAlert({ status: true, message: "Please enter a valid key" });
      alertChange();
    }
  };

  const alertChange = useCallback(() => {
    const alertTime = setTimeout(() => {
      setAlert({ status: false, message: "" });
    }, 3000);
    return () => clearTimeout(alertTime);
  }, [alert.status]);

  const handleConfirmClick = async () => {
    if (accountImport) {
      RecoverAccount(input);
    } else {
      const hashedPassword = CachedService.getHashedPassword();
      const isMemonicExists = await Promise.all(
        Object.keys(allWallets).filter((walletId) => {
          return matchAddresses(
            decryptMessage(allWallets[walletId].seedphrase, hashedPassword),
            input
          );
        })
      );
      if (isMemonicExists.length > 0) {
        setAlert({ status: true, message: "Wallet already exists" });
      } else if (isMemonicTrue) {
        const { permission, hasEnoughPing } = checkFeasibility();
        if (permission) {
          setEditNameModal(true);
          // await addWallet(input, hashedPassword, true);
          // navigate("/index.html");
        } else {
          dispatch(
            setGlobalAlert({
              open: true,
              heading: "Alert",
              body: hasEnoughPing
                ? "Wallets Limit Reached"
                : "You must have minimum 500 PING to import more wallets",
            })
          );
        }
      } else onRecover();
    }
  };

  const checkFeasibility = () =>
    accountImport
      ? checkAccountFeasibility(`${walletId}`)
      : checkWalletFeasibility();

  const [editNameModal, setEditNameModal] = useState(false);

  const handleSuccess = () => {
    navigate("/index.html");
    const alertText = accountImport ? "Account" : "Wallet";
    dispatch(
      setGlobalAlert({
        open: true,
        heading: "Success",
        body: `${alertText} Imported Successfully`,
      })
    );
  };

  const handleNewAccountSubmission = async (name: string) => {
    let result;
    try {
      if (importOption == 0) {
        result = await importEVMAccount(input, `${walletId}`, name);
      } else {
        result = await importSolanaAccount(input, `${walletId}`, name);
      }
      result.message === "Account imported successfully"
        ? handleSuccess()
        : setAlert(result);
    } catch (e) {
      setAlert({ status: true, message: "Please enter a valid key" });
      alertChange();
    }
  };

  const handleNewWalletSubmission = async (name: string) => {
    try {
      const hashedPassword = CachedService.getHashedPassword();
      await addWallet(input, hashedPassword, true, false, name);
      handleSuccess();
    } catch (e) {
      setAlert({ status: true, message: "Something went wrong." });
    }
  };

  /* effects */

  return (
    <CommonLayout onTopImageClick={() => navigate(-1)} title="Settings">
      <div className="full-width">
        <CustomBox padding="50px 0px" className="c-c-c">
          <Text size={18}>
            {accountImport ? "Import Account" : "Import Wallet"}
          </Text>
          <Text size={13} customColor="#807989" style={{ marginTop: "30px" }}>
            {accountImport
              ? "Enter your private key"
              : "Insert your Seed Phrase to import"}
          </Text>
          <PasswordInputStyled
            style={{
              width: "100%",
              backgroundColor: accountImport
                ? alert.status
                  ? alert.message !== "Account imported successfully"
                    ? "#FF375E"
                    : "#33D285"
                  : ""
                : isMemonicTrue && buttonClicked
                ? "#33D285"
                : buttonClicked
                ? "#FF375E"
                : "rgba(0,0,0,0.2)",
            }}
          >
            <FontAwesomeIcon
              icon={faKeySkeleton}
              className="mgr-sm"
              fontSize={20}
              style={{ opacity: 0.8, color: "white" }}
            />
            <Input
              autoComplete="off"
              id={`import-${accountImport ? "account" : "wallet"}-input`}
              inputProps={{
                maxLength: 300,
              }}
              onChange={(e) => {
                setInput(e.target.value);

                setButtonClicked(false);
                setIsMemonicTrue(false);
                setAlert({
                  status: false,
                  message: "",
                });
                if (e.target.value.length === 0) {
                  setAlert({ status: false, message: "" });
                }
              }}
              style={{ fontSize: "14px", width: "100%" }}
              disableUnderline
              placeholder={
                accountImport ? "Private Key" : "Secret Recovery Phrase"
              }
              // disabled={
              //   alert.status === true && alert.message === "Ready to import"
              // }
            />
          </PasswordInputStyled>
          <Text
            size={14}
            weight={400}
            customColor={
              accountImport
                ? alert.message === "Account imported successfully"
                  ? "#33D285"
                  : "#f76684"
                : isMemonicTrue
                ? "#33D285"
                : "#f76684"
            }
            style={{ margin: "30px 0px" }}
          >
            {alert.status ? alert.message : ""}
          </Text>
          <ButtonBox
            title={
              accountImport
                ? "Import"
                : isMemonicTrue && buttonClicked
                ? "Import"
                : !isMemonicTrue && buttonClicked
                ? "Try again"
                : "Find my wallet"
            }
            customColor="rgba(255, 255, 255, 0.04)"
            handleClick={handleConfirmClick}
            isDisabled={input.length === 0}
            customStyle={{ width: "fitContent", padding: "10px 14px" }}
          />
        </CustomBox>
      </div>
      <EditSingleEntityModal
        open={editNameModal}
        handleClose={() => setEditNameModal(false)}
        handleSave={(newName) => {
          accountImport
            ? handleNewAccountSubmission(newName)
            : handleNewWalletSubmission(newName);
        }}
        entityName={accountImport ? "Account Name" : "Wallet Name"}
        defaultValue={accountImport ? "New Account" : "New Wallet"}
        create
      />
    </CommonLayout>
  );
};

export default Import;
