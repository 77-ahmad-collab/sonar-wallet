import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faKeySkeleton } from "@fortawesome/pro-light-svg-icons";

import { Input as PROPS } from "interfaces";
import { PasswordInputStyled } from "@styled";

const Input: FC<PROPS> = ({
  children,
  currentStep,
  stepNumber,
  icon,
  inputStyle,
  showCaret,
  password,
  setAlert,
  allCorrect,
  id = "",
}) => {
  return (
    <PasswordInputStyled style={{ ...inputStyle }}>
      {stepNumber !== 4 && (
        <>
          <FontAwesomeIcon
            icon={icon || faKeySkeleton}
            fontSize={20}
            className="mgr-sm"
            style={{ opacity: "0.8", color: allCorrect ? "#000000" : "#fff" }}
          />
        </>
      )}
      <div
        id={id}
        className="r-c-fs editable-div"
        tabIndex={0}
        style={{ outline: "none" }}
      >
        {children}
        {/* {password && password.length < 0 && (
          <Text style={{ color: "grey" }}>Enter your password</Text>
        )} */}
        {showCaret && (
          <div
            className="input-caret"
            style={{ display: currentStep === stepNumber ? "unset" : "none" }}
          />
        )}
      </div>
      {stepNumber === 4 && (
        <FontAwesomeIcon
          icon={faCopy}
          color="white"
          className="buttonIcon"
          onClick={() => {
            if (password && setAlert) {
              navigator.clipboard.writeText(password);
              setAlert({
                message: "Password copied to clipboard",
                status: true,
              });
            }
          }}
        />
      )}
    </PasswordInputStyled>
  );
};

export default Input;
