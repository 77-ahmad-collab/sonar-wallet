import { useEffect, useState } from "react";
import * as Bip39 from "bip39";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/pro-regular-svg-icons";

import { WrapperBackground } from "components";
import { HoverableButton, Text, TextArea } from "@styled";
import { useAllWallets } from "hooks";
import { useAppDispatch, useAppSelector } from "store/store";
import { useNavigate } from "react-router";
import { AUTHSCREENS } from "theme/constants";
import { RainbowPlane } from "assets/images";
import { getDataFromClipboard } from "utils";
import {
  setFirstWalletImportedStatus,
  setIsUserExists,
  setSelectedInputId,
} from "@slices/appSlice";
import CachedService from "classes/cachedService";

const ImportWallet = () => {
  const { selectedInputId } = useAppSelector((state) => state.app);

  const [isValidMnemonic, setIsValidMnemonic] = useState(false);
  const [isLoading, setIsLoading] = useState({
    state: false,
    message: "Import Wallet",
  });
  const [input, setInput] = useState("...");

  const { addWallet } = useAllWallets();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const checkMnemonic = (value: string) => {
    const isValidMnemonic = Bip39.validateMnemonic(value);
    if (isValidMnemonic) setIsValidMnemonic(true);
    else setIsValidMnemonic(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("here");
    setInput(event.target.value);
  };

  const onImport = async () => {
    if (!isLoading.state) {
      setIsLoading({
        state: true,
        message: "Importing Wallet",
      });
      setTimeout(async () => {
        const hashedPassword = CachedService.getHashedPassword();
        await addWallet(input, hashedPassword, true, true);
        dispatch(setFirstWalletImportedStatus(true));
        await dispatch(setIsUserExists(true));
        navigate(AUTHSCREENS.selectDefaultWallet);
      }, 2000);
    }
  };
  const onPasteHandler = () => setInput(getDataFromClipboard(selectedInputId));

  const onPaste = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    onPasteHandler();
  };

  useEffect(() => {
    dispatch(setSelectedInputId("textarea"));
  }, []);

  useEffect(() => {
    checkMnemonic(input);
  }, [input]);

  return (
    <WrapperBackground boxHeight="100vh" style={{ position: "relative" }}>
      <Text className="f-title-md mgt-xl mgb-sm">Insert Secret Phrase</Text>
      <Text className="f-body-md mgt-lg mgb-lg" style={{ opacity: 0.6 }}>
        Tap to paste or type the recovery phrase
      </Text>
      <div
        className="textAreaWrapper"
        onClick={() => {
          if (input === "...") setInput("");
        }}
      >
        <TextArea
          id="ImportWallet-textarea"
          rows={3}
          wrap="hard"
          maxLength={300}
          onChange={onChange}
          value={input}
          className="f-body-md"
        />
        <FontAwesomeIcon
          icon={faClipboard}
          color="white"
          size="xl"
          className="mgr-sm clipboard"
          style={{ cursor: "pointer" }}
          onClick={onPaste}
        />
      </div>
      <div className="r-c-c">
        <FontAwesomeIcon
          id="ImportWallet-navigate-back"
          icon={faChevronLeft}
          color="white"
          size="xl"
          className="mgr-sm"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(AUTHSCREENS.selectAction)}
        />
        <HoverableButton
          id="ImportWallet-onImport"
          className="f-body-lg"
          isButtonDisabled={!isValidMnemonic}
          disabled={!isValidMnemonic}
          onClick={onImport}
          style={{
            ...(isLoading.state && {
              background: "none",
              color: "#fff",
            }),
          }}
        >
          {isLoading.message}{" "}
          {isLoading.state && (
            <img
              src={RainbowPlane}
              alt="rainbow image"
              height={25}
              width={25}
              className="mgl-sm"
            />
          )}
        </HoverableButton>
      </div>
    </WrapperBackground>
  );
};

export default ImportWallet;
