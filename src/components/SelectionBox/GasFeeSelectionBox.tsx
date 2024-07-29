import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersSimple } from "@fortawesome/pro-regular-svg-icons";

import { SelectionBoxProps as PROPS } from "interfaces";
import { BackgroundBoxStyled, Text } from "@styled";
import { OptionBox } from "components";
import { faPencil } from "@fortawesome/pro-light-svg-icons";
import { Custom } from "utils/constants";

const GasFeeSelectionBox: FC<PROPS> = ({
  OptionList,
  handleOption,
  optionIndex,
  height,
}) => {
  return (
    <BackgroundBoxStyled height={height} marginTop={15}>
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
                  marginBottom: "5px",
                  opacity: index === optionIndex ? 1 : 0.7,
                }}
                className="f-body"
                dim
              >
                {item.title.toString()}
              </Text>
              {item.valueInGwei === 0 ? (
                <FontAwesomeIcon
                  icon={faSlidersSimple}
                  size="lg"
                  fontSize={12}
                  style={{ color: " rgba(255, 255, 255, 0.2)" }}
                />
              ) : (
                <>
                  <Text
                    className="f-body-sm "
                    color="#fff"
                    style={{ marginBottom: "5px", opacity: 0.8 }}
                  >
                    ~{item.value}$
                  </Text>
                  <Text
                    className="f-label-sm "
                    dim
                    color="#fff"
                    style={{
                      opacity: index === optionIndex ? 1 : 0.7,
                    }}
                  >
                    {item.valueInGwei} GWEI{" "}
                    {item.title === Custom && (
                      <FontAwesomeIcon
                        icon={faPencil}
                        size="lg"
                        fontSize={12}
                        style={{ color: " rgba(255, 255, 255, 0.2)" }}
                      />
                    )}
                  </Text>
                </>
              )}
            </>
          </OptionBox>
        );
      })}
    </BackgroundBoxStyled>
  );
};

export default GasFeeSelectionBox;
