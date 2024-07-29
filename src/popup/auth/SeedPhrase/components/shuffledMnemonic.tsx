import { FC } from "react";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CustomBox, GenericBox, Text } from "@styled";
import { ShuffledMnemonicProps as PROPS } from "interfaces";

const ShuffledMnemonic: FC<PROPS> = ({
  shuffledMnemonic,
  seedPhraseIndex,
  confirmSeedPhrase,
  onBackPress,
}) => {
  return (
    <>
      <CustomBox
        className="r-c-c"
        margin={"30px auto 20px"}
        width={"95%"}
        style={{
          flexWrap: "wrap",
        }}
      >
        {shuffledMnemonic.map((value: string, index: number) => {
          return (
            <GenericBox
              id="ShuffledMnemonic-confirmSeedPhrase"
              key={index}
              style={{
                backgroundColor: seedPhraseIndex.includes(index)
                  ? "#E7E8EA"
                  : "rgba(255, 255, 255, 0.08)",
                color: seedPhraseIndex.includes(index) ? "black" : "white",
                margin: "5px 6px",
                padding: "9px 12px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!seedPhraseIndex.includes(index)) {
                  confirmSeedPhrase(value, index);
                }
              }}
            >
              {value}
            </GenericBox>
          );
        })}
      </CustomBox>
      <Text
        className="f-body-md"
        style={{ margin: "10px 0px 50px" }}
        align="center"
      >
        Tap the words in the correct order
      </Text>

      <FontAwesomeIcon
        id="ShuffledMnemonic-onBackPress"
        icon={faChevronLeft}
        color="#fff"
        size="xl"
        style={{ cursor: "pointer" }}
        onClick={onBackPress}
      />
    </>
  );
};

export default ShuffledMnemonic;
