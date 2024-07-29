import { FC, useState } from "react";

import { motion } from "framer-motion";
import { faKeySkeleton } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

import { CustomBox, HoverableButton, NoteTextStyled, Text } from "@styled";
import { SeedPhraseSaveAlert } from "components";
import { useAppSelector } from "store/store";

const SeedPhraseView: FC<{
  mnemonic: string[];
  handleonSave?: () => void;
  isManageWallets: boolean;
}> = ({ mnemonic, handleonSave, isManageWallets }) => {
  const { isUserExists, isLoggedIn } = useAppSelector((state) => state.app);

  const navigate = useNavigate();

  const [reveal, setReveal] = useState(true);
  const [animationState, setAnimationState] = useState<"enter" | "animate">(
    "enter"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const revealSeedphrase = () => {
    setReveal(false);
    setAnimationState("animate");
  };

  const handleClose = () => navigate(-1);

  return (
    <>
      <Text
        style={{ paddingTop: isManageWallets ? "10px" : "70px" }}
        align="center"
        className="r-c-c f-title-sm "
      >
        <FontAwesomeIcon
          icon={faKeySkeleton}
          color="white"
          size="lg"
          className="mgr-sm"
        />{" "}
        Your Secret Phrase
      </Text>
      <Text
        className="f-body-md"
        customColor="#807989"
        style={{ marginTop: "30px", width: "90%" }}
        align="center"
      >
        Here is your SeedPhrase, the unique access key to your wallet.
      </Text>
      <Text
        align="center"
        customColor="#807989"
        style={{ marginTop: "14px", width: "90%" }}
        className="f-body-md"
      >
        You will need this to restore access to it on a new device or
        application
      </Text>
      <CustomBox
        style={{
          position: "relative",
          // border: "2px solid green",
          width: "100%",
        }}
      >
        <CustomBox
          className={`${reveal ? "r-c-c" : "r-fs-fs"}`}
          margin={"20px 15px"}
          height={"130px"}
          padding="20px"
          borderRadius="12px"
          backgroundColor={"rgba(255, 255, 255, 0.1)"}
          style={{
            flexWrap: "wrap",
          }}
        >
          {!reveal &&
            mnemonic.map((value: string, index: number) => {
              return (
                <motion.span
                  data-testid="seedphrase"
                  id={`SeedPhraseView-word-${index}`}
                  key={index}
                  layout
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ y: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    color: "white",
                    fontSize: "14px",
                    padding: "5px 10px 0px 0px",
                  }}
                >
                  {value}
                </motion.span>
              );
            })}

          {reveal && (
            <CustomBox
              data-testid="Tap-to-reveal"
              id="SeedPhraseView-revealSeedphrase"
              backgroundColor={"rgba(255,255,255,0.1)"}
              padding={"8px"}
              borderRadius={"10px"}
              onClick={revealSeedphrase}
              style={{ cursor: "pointer" }}
            >
              <Text size={13}>Tap to reveal</Text>
            </CustomBox>
          )}
        </CustomBox>
        <motion.div
          className="neverDisclose bezier-out trans-default f-body-md"
          variants={{
            animate: { y: 50, opacity: 0 },
          }}
          initial={{ y: 20, opacity: 1 }}
          animate={animationState}
        >
          <span style={{ textDecoration: "underline" }}>NEVER</span> disclose
          it. Possessing this enables full control of your accounts.
        </motion.div>
      </CustomBox>
      {/* THIS TEXT FOONTS NEED TO BE UPDATED */}
      <NoteTextStyled
        className="bezier-out trans-medium f-body-md"
        variants={{
          animate: { scale: 1, opacity: 0.7 },
        }}
        animate={animationState}
        style={{ margin: "0px" }}
        initial={{ opacity: 0, scale: 1 }}
      >
        (If you save this in a digital file, please ensure to have high security
        encryption)
      </NoteTextStyled>

      {!isManageWallets && (
        <div className="r-c-c mgt-sm">
          {isUserExists && isLoggedIn && (
            <HoverableButton
              className="mgr-sm"
              isButtonDisabled={false}
              onClick={handleClose}
              style={{ background: "transparent", color: "white" }}
            >
              Cancel
            </HoverableButton>
          )}

          <HoverableButton
            id="SeedPhraseView-setIsModalOpen"
            disabled={reveal}
            onClick={() => setIsModalOpen(true)}
            isButtonDisabled={reveal}
          >
            Got it
          </HoverableButton>
        </div>
      )}
      {/* </CustomBox> */}

      <SeedPhraseSaveAlert open={isModalOpen} handleOnSave={handleonSave} />
    </>
  );
};

export default SeedPhraseView;
