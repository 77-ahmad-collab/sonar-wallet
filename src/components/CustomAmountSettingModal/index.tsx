import { FC } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons";

import { CustomAmountComponentProps as PROPS } from "interfaces";
import { SaveAndResetButon } from "components";
import {
  ButtonDefault,
  FooterStyled,
  SearchLayout,
  StyledAmountInput,
  Text,
} from "@styled";

const CustomAmountComponent: FC<PROPS> = ({
  title,
  value,
  handleChange,
  onCancel,
  placeholder,
  error,
  handleOnSave,
  handeOnReset,
  warning = "",
}) => {
  return (
    <motion.div
      layout
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Text customColor="#FCF6FF" weight={400} className="r-c-fs f-body-lg ">
        <ButtonDefault
          id="CustomAmountComponent-onCancel"
          width={40}
          height={40}
          onClick={onCancel}
        >
          <FontAwesomeIcon
            className="f-dim-100"
            icon={faChevronLeft}
            color="white"
            style={{ fontSize: 16 }}
          />
        </ButtonDefault>{" "}
        <span className="mgl-sm"> {title}</span>
      </Text>
      <SearchLayout
        style={{
          flexDirection: "row",
          maxWidth: "unset",
          justifyContent: "flex-start",
          paddingTop: "0px",
        }}
      >
        <StyledAmountInput
          id="CustomAmountComponent-handleChange"
          placeholder="0"
          onChange={handleChange}
          value={value}
          style={{
            maxWidth: "5ch",
            color: error ? "rgba(255, 55, 94, 1)" : "white",
            fontSize: "62px",
          }}
        />
        <div style={{ marginLeft: 12 }}>{placeholder}</div>
      </SearchLayout>
      <Text
        align="center"
        style={{
          margin: "10px 0px 10px 0px",
          color: "rgba(255, 55, 94, 1)",

          height: "20px",
        }}
      >
        {error}
      </Text>
      <Text
        align="center"
        style={{
          margin: "10px 0px 10px 0px",
          color: "#FFA500",
          height: "20px",
        }}
      >
        {warning}
      </Text>
      <FooterStyled>
        <SaveAndResetButon onSave={handleOnSave} onReset={handeOnReset} />
      </FooterStyled>
    </motion.div>
  );
};

export default CustomAmountComponent;
