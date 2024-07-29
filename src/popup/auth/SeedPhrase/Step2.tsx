import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faKeyboard } from "@fortawesome/pro-light-svg-icons";
import { useNavigate } from "react-router";

import { BackIcon } from "assets/Icons";
import { Circle, CustomBox, Text, TickerBackgroundStyled } from "@styled";
import { useSeedPhrase, useSeedPhraseStep2 } from "hooks";
import ShuffledMnemonic from "./components/shuffledMnemonic";
import Gonext from "./components/Gonext";

import { useAppSelector } from "store/store";
import { APPSCREENS } from "theme/constants";
import { EditSingleEntityModal, ImageContent } from "components";
import { useState } from "react";

const Step2 = () => {
  const { isLoggedIn } = useAppSelector((state) => state.app);

  const navigate = useNavigate();
  const { onBackPress } = useSeedPhrase();
  const {
    seedPhrase,
    isSeedPhraseCorrect,
    setSeedPhrase,
    shuffledMnemonic,
    setSeedPhraseIndex,
    seedPhraseIndex,
    confirmSeedPhrase,
    handleSeedPhrase,
    animationState,
  } = useSeedPhraseStep2();

  const handleBackPress = () => {
    if (isLoggedIn) {
      navigate(APPSCREENS.settings);
    } else {
      onBackPress();
    }
  };

  const handleClick = () => {
    if (animationState === "fade") {
      setSeedPhrase((value) =>
        value.filter((_, index) => index !== seedPhrase.length - 1)
      );
      setSeedPhraseIndex((value) =>
        value.filter((_, index) => index !== seedPhraseIndex.length - 1)
      );
    }
  };
  const [editNameModal, setEditNameModal] = useState(false);
  return (
    <CustomBox
      height={"100%"}
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        zIndex: 1,
      }}
    >
      <Text size={20} style={{ paddingTop: "70px" }} align="center">
        <FontAwesomeIcon
          icon={faKeyboard}
          color="white"
          size="lg"
          className="mgr-sm"
        />{" "}
        Confirm SeedPhrase
      </Text>

      <CustomBox
        margin={"20px auto"}
        height={"125px"}
        padding={"10px"}
        width={"95%"}
        backgroundColor={"rgba(255, 255, 255, 0.1)"}
        style={{
          display: "grid",
          position: "relative",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(3, 30px)",
          borderRadius: "12px",
        }}
      >
        {seedPhrase.map((value, index) => {
          return (
            <Text
              key={index}
              customStyle={{ margin: "2px", opacity: 1 }}
              customColor={
                index === seedPhrase.length - 1
                  ? isSeedPhraseCorrect
                    ? "#3DF2BC"
                    : "red"
                  : "#fff"
              }
            >
              {value}
            </Text>
          );
        })}
        <Text customStyle={{ margin: "3px 0px 0px -30px" }} align="center">
          ...
        </Text>
        {seedPhrase.length > 0 && (
          <CustomBox
            id="confirmSeedphrase-handleClick"
            onClick={handleClick}
            style={{
              position: "absolute",
              right: "8px",
              bottom: "5px",
              cursor: "pointer",
            }}
          >
            <ImageContent
              src={BackIcon}
              alt="<"
              Size={{ width: "16px", height: "16px", color: "#fff" }}
            />
          </CustomBox>
        )}
        <TickerBackgroundStyled
          variants={{
            appear: { opacity: 1 },
          }}
          initial={{ opacity: 0 }}
          animate={animationState}
        >
          <Circle>
            <FontAwesomeIcon icon={faCheck} size="xl" />
          </Circle>
        </TickerBackgroundStyled>
      </CustomBox>

      {animationState === "fade" ? (
        <ShuffledMnemonic
          confirmSeedPhrase={confirmSeedPhrase}
          onBackPress={handleBackPress}
          seedPhraseIndex={seedPhraseIndex}
          shuffledMnemonic={shuffledMnemonic}
        />
      ) : (
        <Gonext
          handleSeedPhrase={() => {
            setEditNameModal(true);
          }}
        />
      )}

      <EditSingleEntityModal
        open={editNameModal}
        handleClose={() => console.log("close")}
        handleSave={(walletName) => handleSeedPhrase(walletName)}
        entityName={"Wallet Name"}
        defaultValue={"New Wallet"}
        create
        disableCancelBtn
        bodyText="Your new multichain wallet is ready for use."
      />
    </CustomBox>
  );
};

export default Step2;
