import { ChangeEvent, FC, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";

import { CustomBox, Text } from "@styled";
import { SecretViewProps as PROPS } from "interfaces";
import { ButtonWithIcon, SearchBar, TooltipButton } from "components";
import { decryptMessage } from "utils";
import { faCheck, faWallet } from "@fortawesome/pro-regular-svg-icons";
import { faCopy } from "@fortawesome/pro-light-svg-icons";
import CachedService from "classes/cachedService";

const SecretView: FC<PROPS> = ({ walletSecret, accountSecret }) => {
  /* global-state */
  const hashedPassword = useMemo(() => CachedService.getHashedPassword(), []);

  /* local-state */
  const [reveal, setReveal] = useState(true);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [mnemonic, setMnemonic] = useState([""]);
  const [hehe, setHehe] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* hooks */

  /* functions */

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setValue(event.target.value);
  };

  const onConfirmPassword = () => {
    if (isFormValid()) {
      walletSecret ? revealSeedphrase() : revealPvtKey();
      setIsAuthenticated(true);
    }
  };

  const revealSeedphrase = () => {
    const seed = decryptMessage(walletSecret, hashedPassword) as string;
    setMnemonic(seed.split(" "));
  };

  const revealPvtKey = () => {
    const hehe = decryptMessage(accountSecret, hashedPassword) as string;
    setHehe(hehe);
  };

  const isFormValid = () => {
    if (value.length === 0) {
      setError(`invalid password`);
      return false;
    }
    const typedHash = ethers.utils.hashMessage(value);
    if (typedHash !== hashedPassword) {
      setError("invalid password");
      return false;
    }
    setError("");
    setValue("");
    if (typeof globalThis.gc === "function") {
      globalThis.gc();
    }
    return true;
  };

  const handleCopyBtn = () => {
    navigator.clipboard.writeText(
      accountSecret ? hehe : mnemonic.join().replaceAll(",", " ")
    );
    setTimeout(async () => {
      navigator.clipboard.writeText("");
    }, 7000);
  };

  /* effects */

  return (
    <>
      <CustomBox>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faWallet}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text
            className="f-title-sm "
            style={{ color: "black" }}
            align="center"
          >
            Your {accountSecret ? "Private key" : "Secret Phrase"}
          </Text>
        </div>

        {isAuthenticated ? (
          <>
            <Text
              size={13}
              customColor="#807989"
              style={{ marginTop: "30px" }}
              align="start"
            >
              This is the actual key to your{" "}
              {accountSecret ? "account" : "wallet"}.
            </Text>
            <Text
              align="start"
              size={13}
              customColor="#807989"
              style={{ marginTop: "14px" }}
            >
              You will need this to restore access to it on a new device or
              application
            </Text>
          </>
        ) : (
          <Text
            size={13}
            customColor="#807989"
            style={{ marginTop: "30px" }}
            align="start"
          >
            Enter your password to access{" "}
            {walletSecret ? "Seed phrase" : "Private key"}
          </Text>
        )}

        {isAuthenticated ? (
          <>
            <CustomBox>
              <CustomBox
                id="secretViewComponent-secretbox"
                className={`${reveal ? "r-c-c" : "r-fs-fs"}`}
                margin={"20px 15px"}
                // height={"unset"}
                padding="15px"
                backgroundColor={"rgba(0, 0, 0, 0.1)"}
                style={{ flexWrap: "wrap" }}
              >
                {!reveal &&
                  walletSecret &&
                  mnemonic.map((value: string, index: number) => {
                    return (
                      <motion.span
                        key={index}
                        layout
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ y: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          color: "black",
                          fontSize: "14px",
                          padding: "5px 10px 0px 0px",
                        }}
                      >
                        {value}
                      </motion.span>
                    );
                  })}

                {!reveal && accountSecret && (
                  <Text
                    id="secretViewComponent-secret"
                    style={{
                      wordBreak: "break-all",
                      color: "black",
                    }}
                  >
                    {hehe}
                  </Text>
                )}

                {reveal && (
                  <CustomBox
                    id="secretViewComponent-revealbtn"
                    backgroundColor={"rgba(0,0,0,0.1)"}
                    padding={"8px"}
                    borderRadius={"10px"}
                    onClick={() => setReveal(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <Text size={13} style={{ color: "black" }}>
                      Tap to reveal
                    </Text>
                  </CustomBox>
                )}
              </CustomBox>
            </CustomBox>
            <TooltipButton
              id="secretViewComponent-handleCopyBtn"
              tooltipText="copied"
              onClick={handleCopyBtn}
              text="copy"
              icon={faCopy}
              lightMode
            />
          </>
        ) : (
          <div>
            <div className="r-c-sb input-header">
              <Text
                size={13}
                weight={600}
                customColor={error ? "rgba(255, 55, 94, 1)" : "#5E5E64"}
              >
                Password
              </Text>
              {error && (
                <Text size={13} weight={600} customColor="rgba(255, 55, 94, 1)">
                  {error}
                </Text>
              )}
            </div>
            <SearchBar
              id="secretViewComponent-input"
              onChange={handleChange}
              type="password"
              name={"Enter Password"}
              placeholder={"Type here..."}
              value={value}
              customPadding={6}
              containerStyle={{ width: "100%", marginBottom: 12 }}
              lightMode={true}
              autoFocus
            />
            <div className="r-c-fs">
              <ButtonWithIcon
                id={"secretViewComponent-onConfirmPassword"}
                icon={faCheck}
                lightMode={true}
                style={{ marginTop: 10 }}
                onClick={onConfirmPassword}
                text="Confirm"
              />
            </div>
          </div>
        )}

        <Text
          size={13}
          customColor="#807989"
          style={{ marginTop: "30px" }}
          align="center"
        >
          Be sure you have complete privacy
        </Text>
      </CustomBox>
      <Text
        size={13}
        customColor="#FF7448"
        style={{ margin: "10px 20px" }}
        align="center"
      >
        Never disclose it. Possessing this enables full control of your wallet.
      </Text>
    </>
  );
};

export default SecretView;
