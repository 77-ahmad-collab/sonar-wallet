import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ColoredBack } from "assets/images";
import { Text } from "@styled";
import { PasswordStepProps as PROPS } from "interfaces";
import Input from "./input";
import { RainbowBox } from "components";
import { useStep4 } from "hooks";
import { AUTHSCREENS } from "theme/constants";
import { ethers } from "ethers";
import CachedService from "classes/cachedService";
import { setHashedPassword } from "utils/utils.wallets";

const Step4: FC<PROPS> = ({ changeStep, currentStep }) => {
  // const [password, setPassword] = useState("");

  const { setError, error, isLoading } = useStep4();

  const navigate = useNavigate();

  const savePassword = async () => {
    const hashedPassword = ethers.utils.hashMessage(
      CachedService.getPassword()
    );
    CachedService.setHashedPassword(hashedPassword);
    CachedService.setPassword("");
    await setHashedPassword(hashedPassword);
    navigate(AUTHSCREENS.selectAction);
  };

  useEffect(() => {
    // const password = ;
    // setPassword(password);
  }, [currentStep]);

  return (
    <div className="c-c-c">
      <img
        id="passwords-step4-changeStep"
        src={ColoredBack}
        alt="coloredBack"
        className="colored-back-button"
        onClick={() => currentStep === 4 && changeStep(currentStep - 1)}
      />
      <Input
        inputStyle={{
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "2px solid #5bd67e",
          marginTop: 0,
        }}
        currentStep={currentStep}
        showCaret={false}
        stepNumber={4}
        password={CachedService.getPassword()}
        setAlert={setError}
      >
        {[...CachedService.getPassword()].map((char, index) => (
          <Text key={index} size={23} style={{ height: "50%" }}>
            *
          </Text>
        ))}
      </Input>
      <Text
        size={17}
        weight={400}
        customColor="#3DF2BC"
        style={{ marginTop: 10, opacity: error.status ? 1 : 0 }}
      >
        {error.message}
      </Text>
      <Text size={18} weight={500} style={{ marginTop: 30 }}>
        That’s a nice password...
      </Text>
      <Text
        size={14}
        weight={400}
        style={{ marginTop: 10 }}
        primary={false}
        dim
      >
        Please store it safely.
      </Text>
      <Text size={14} weight={400} style={{ marginTop: 5 }} primary={false} dim>
        You will need this to access the app.
      </Text>
      <Text
        id="step4-savePassword"
        className="step4-btn r-c-c"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          padding: "9px 16px",
          marginTop: 22,
          cursor: "pointer",
        }}
        size={14}
        customColor="rgba(255,255,255,0.7)"
        onClick={savePassword}
      >
        {isLoading ? "Creating..." : " Ok let’s go"}
        <div style={{ marginLeft: "5px" }}>
          {isLoading ? (
            <RainbowBox>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                }}
              ></div>
            </RainbowBox>
          ) : (
            ""
          )}
        </div>
      </Text>
    </div>
  );
};

export default Step4;
