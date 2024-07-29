import { FC } from "react";

import { Text } from "@styled";
import Input from "./input";

import { PasswordStepProps as PROPS } from "interfaces";
import { useStep2 } from "hooks";
import { faKeySkeleton } from "@fortawesome/pro-regular-svg-icons";
import { ButtonWithIcon, SearchBar, StartAdornment } from "components";

const Step2: FC<PROPS> = ({ changeStep, currentStep }) => {
  const { password, error, setPassword, onEnterPress, isMobile } = useStep2(
    changeStep,
    currentStep
  );

  return (
    <div className="c-c-c" data-testid="password-step2">
      <Text size={18} weight={400}>
        Let&apos;s create a password to
      </Text>
      <Text size={18} weight={400}>
        keep things safe...
      </Text>
      {isMobile ? (
        <>
          <SearchBar
            // id="passwords-step2-input"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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
          id="passwords-step2-input"
          currentStep={currentStep}
          stepNumber={2}
          icon={faKeySkeleton}
          showCaret={password.length !== 0}
        >
          <>
            {password.length === 0 && (
              <>
                <div
                  // data-testid="password-input"
                  className="input-caret"
                  style={{
                    display: currentStep === 2 ? "unset" : "none",
                  }}
                />
                <Text data-testid="password-input" style={{ color: "grey" }}>
                  Enter your password
                </Text>
              </>
            )}
            {[...password].map((char, index) => (
              <Text
                data-testid="encrypted-password"
                key={index}
                size={23}
                style={{ height: "50%" }}
              >
                *
              </Text>
            ))}
          </>
        </Input>
      )}

      <Text
        id="Step2-error-password"
        size={14}
        weight={400}
        customColor="#f76684"
        style={{ marginTop: 10, opacity: error.status ? 1 : 0, width: "70%" }}
      >
        {error.message}
      </Text>
    </div>
  );
};

export default Step2;
