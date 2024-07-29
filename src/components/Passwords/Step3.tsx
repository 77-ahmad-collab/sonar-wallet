import { FC } from "react";

import { ColoredBack } from "assets/images";
import { Text } from "@styled";

import { PasswordStepProps as PROPS } from "interfaces";
import Input from "./input";
import { useStep3 } from "hooks";
import {
  faCircleCheck,
  faKeySkeleton,
} from "@fortawesome/pro-regular-svg-icons";
import { ButtonWithIcon, SearchBar, StartAdornment } from "components";

const Step3: FC<PROPS> = ({ changeStep, currentStep }) => {
  const {
    allCorrect,
    confirmPassword,
    password,
    isSomethingWrong,
    handleGoBack,
    setConfirmPassword,
    onEnterPress,
    isMobile,
  } = useStep3(changeStep, currentStep);

  return (
    <div className="c-c-c" data-testid="password-step3">
      <img
        id="passwords-step3-handleGoBack"
        data-testid="passwords-step3-handleGoBack"
        src={ColoredBack}
        alt="coloredBack"
        className="colored-back-button"
        onClick={handleGoBack}
      />

      <Text size={18} weight={400}>
        Nice. Please type it again.
      </Text>
      {isMobile ? (
        <>
          <SearchBar
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            StartAdornment={<StartAdornment Icon={faKeySkeleton} />}
            placeholder="Enter your password"
            type="password"
            containerStyle={{ width: "70%", marginTop: 10, zIndex: 100000 }}
          />
          <ButtonWithIcon
            text="Next"
            onClick={onEnterPress}
            style={{ marginTop: 10, zIndex: 100000 }}
          />
        </>
      ) : (
        <Input
          id="passwords-step3-input"
          data-testid="passwords-step3-input"
          currentStep={currentStep}
          inputStyle={{
            backgroundColor: allCorrect ? "#5bd67e" : "rgba(0,0,0,0.2)",
          }}
          stepNumber={3}
          icon={allCorrect ? faCircleCheck : faKeySkeleton}
          showCaret={confirmPassword.length !== 0}
          allCorrect={allCorrect}
        >
          <>
            {confirmPassword.length === 0 && (
              <>
                <div
                  className="input-caret"
                  style={{
                    display: currentStep === 3 ? "unset" : "none",
                  }}
                />
                <Text style={{ color: "grey" }}>Confirm your password</Text>
              </>
            )}
            {[...confirmPassword].map((char, index) => (
              <Text
                key={index}
                data-testid="encrypted-confirm-password"
                size={23}
                style={{ height: "50%" }}
                customColor={
                  allCorrect
                    ? "black"
                    : char === password[index]
                    ? "#5bd67e"
                    : "#f76684"
                }
              >
                *
              </Text>
            ))}
          </>
        </Input>
      )}

      <Text
        size={14}
        weight={400}
        customColor="#f76684"
        style={{ marginTop: 10, opacity: isSomethingWrong ? 1 : 0 }}
      >
        Something looks wrong
      </Text>
    </div>
  );
};

export default Step3;
