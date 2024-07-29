import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/pro-light-svg-icons";

import { SelectionBoxProps as PROPS } from "interfaces";
import { BackgroundBoxStyled, Text } from "@styled";
import { OptionBox } from "components";

const SlippageSelectionBox: FC<PROPS> = ({
  OptionList,
  handleOption,
  optionIndex,
  height,
}) => {
  return (
    <BackgroundBoxStyled height={height} marginTop={10}>
      {OptionList.map((item, index) => {
        return (
          <OptionBox
            key={index}
            active={index === optionIndex ? true : false}
            handleOption={handleOption}
            index={index}
          >
            <>
              <Text
                customColor="#fff"
                style={{
                  opacity: index === optionIndex ? 1 : 0.7,
                }}
                size={14}
                dim
              >
                {item.title.toString()}
                {item.isIcon && (
                  <FontAwesomeIcon
                    icon={faPencil}
                    fontSize={16}
                    style={{
                      color: " rgba(255, 255, 255, 0.2)",
                      marginLeft: "5px",
                    }}
                  />
                )}
              </Text>
            </>
          </OptionBox>
        );
      })}
    </BackgroundBoxStyled>
  );
};

export default SlippageSelectionBox;
