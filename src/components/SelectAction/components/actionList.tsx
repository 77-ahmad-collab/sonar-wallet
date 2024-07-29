import { useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSparkles } from "@fortawesome/pro-regular-svg-icons";
import { faArrowDownToSquare } from "@fortawesome/pro-light-svg-icons";

import { PlainColorBoxStyled, Text } from "@styled";
import { RainbowPlane } from "assets/images";
import { useStep4 } from "hooks";

const ActionList = () => {
  const { isLoading, handleLogin, actionOptions, onImportWallet } = useStep4();
  const theme = useTheme();

  return (
    <>
      {!actionOptions.createWalletDisabled && (
        <PlainColorBoxStyled
          id="ActionList-handleLogin"
          style={{ marginTop: "auto" }}
          lightMode={isLoading}
          onClick={() => {
            if (!actionOptions.createWalletDisabled) handleLogin();
          }}
        >
          {isLoading ? (
            <img
              src={RainbowPlane}
              alt="rainbow image"
              height={25}
              width={25}
            />
          ) : (
            <FontAwesomeIcon
              icon={faSparkles}
              color={
                isLoading ? theme.palette.text.black : theme.palette.text.white
              }
              size="xl"
            />
          )}

          <Text
            className="mgt-sm f-body-lg r-c-fs "
            style={{
              userSelect: "none",
              color: isLoading
                ? theme.palette.text.black
                : theme.palette.text.white,
            }}
          >
            {isLoading ? "Creating New Wallet" : "Start with a New Wallet"}
          </Text>
        </PlainColorBoxStyled>
      )}
      {!actionOptions.importWalletDisabled && (
        <PlainColorBoxStyled
          id="ActionList-onImportWallet"
          className="mgt-lg"
          lightMode={isLoading}
          style={{ ...(isLoading && { marginTop: "auto" }) }}
          onClick={onImportWallet}
        >
          <FontAwesomeIcon
            icon={faArrowDownToSquare}
            color={
              isLoading ? theme.palette.text.black : theme.palette.text.white
            }
            size="xl"
          />
          <Text
            className="mgt-sm f-body-lg"
            style={{
              userSelect: "none",
              color: isLoading
                ? theme.palette.text.black
                : theme.palette.text.white,
            }}
          >
            Import your Wallet
          </Text>
        </PlainColorBoxStyled>
      )}
    </>
  );
};

export default ActionList;
