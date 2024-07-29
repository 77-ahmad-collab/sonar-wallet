import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faXmark } from "@fortawesome/pro-regular-svg-icons";
import { Paper } from "@mui/material";

import { BasicModal } from "components";
import { ButtonDefault, Text } from "@styled";

const parse = require("html-react-parser");

const TokenInformationModal = ({
  open,
  text = "",
  heading = "",
  onClose = () => {},
}: {
  open: boolean;
  text: string;
  heading: string;
  onClose?: () => void;
}) => {
  return (
    <BasicModal open={open} handleClose={() => {}}>
      <Paper
        className="c-c-fs"
        style={{
          borderRadius: 20,
          backgroundColor: "#121212",
          width: "90%",
          maxHeight: 400,
          padding: 15,
        }}
      >
        <div className="r-c-sb" style={{ marginBottom: 15, width: "100%" }}>
          <div className="r-c-fs">
            <ButtonDefault width={37} height={37} onClick={() => {}}>
              <FontAwesomeIcon
                className="f-dim-100"
                icon={faCircleInfo}
                color="white"
                style={{ fontSize: 16 }}
              />
            </ButtonDefault>
            <Text className="f-title-md mgl-md">{heading}</Text>
          </div>
          <ButtonDefault width={37} height={37} onClick={onClose}>
            <FontAwesomeIcon
              className="f-dim-100"
              icon={faXmark}
              color="white"
              style={{ fontSize: 16 }}
            />
          </ButtonDefault>
        </div>
        <Text
          className="f-body"
          style={{ overflowY: "scroll", flex: 1 }}
          lineHeight={"20px"}
        >
          {parse(text)}
        </Text>
      </Paper>
    </BasicModal>
  );
};

export default TokenInformationModal;
