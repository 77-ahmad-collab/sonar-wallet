import { FC, useState } from "react";

import { Text } from "@styled";
import Input from "./input";

import { RainbowBox, SearchBar, StartAdornment } from "components";
import { useLogin } from "hooks";
import { faKeySkeleton } from "@fortawesome/pro-regular-svg-icons";
import RestoreAccessModal from "components/RestoreAccessModal";
import ResetWalletModal from "components/ResetWalletModal";

const Login: FC<{ currentStep: number }> = ({ currentStep }) => {
  const {
    password,
    error,
    hanldleLogin,
    isLoading,
    showResetWallet,
    setShowResetWallet,
    setPassword,
    isMobile,
  } = useLogin(currentStep);

  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const handleSubmitForResetPassword = () => {
    setShowResetPasswordModal(false);
    setShowResetWallet(true);
  };

  const handleSubmitForResetWallet = () => {
    setShowResetWallet(false);
  };

  return (
    <div className="c-c-c" style={{ pointerEvents: "all" }}>
      <Text size={18} weight={400}>
        Enter password to login
      </Text>
      {isMobile ? (
        <SearchBar
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          StartAdornment={<StartAdornment Icon={faKeySkeleton} />}
          placeholder="Enter your password"
          type="password"
          containerStyle={{ width: "70%", marginTop: 10, zIndex: 100000 }}
        />
      ) : (
        <Input
          currentStep={1}
          stepNumber={1}
          icon={faKeySkeleton}
          showCaret={password.length !== 0}
        >
          <>
            {password.length === 0 && (
              <>
                <div
                  className="input-caret"
                  style={{
                    display: currentStep === 1 ? "unset" : "none",
                  }}
                />
                <Text style={{ color: "grey" }}>Enter your password</Text>
              </>
            )}
            {[...password].map((char, index) => (
              <Text
                key={index}
                size={23}
                style={{ height: "50%", outline: "none" }}
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
        customColor="#F76684"
        style={{ marginTop: 10, opacity: error.status ? 1 : 0 }}
        onClick={() => console.log("on Click")}
      >
        {error.message}
      </Text>
      <Text
        className="r-c-c"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          padding: "9px 16px",
          marginTop: 22,
          cursor: "pointer",
          pointerEvents: isLoading ? "none" : "all",
          zIndex: 100,
        }}
        size={14}
        customColor="rgba(255,255,255,0.7)"
        onClick={hanldleLogin}
      >
        Ok let’s go
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
      <Text
        size={16}
        weight={400}
        style={{
          marginTop: 15,
          textDecoration: "underline",
          cursor: "pointer",
          zIndex: "1000",
        }}
        primary={false}
        onClick={() => setShowResetPasswordModal(true)}
      >
        Forgot Password?
      </Text>

      <RestoreAccessModal
        open={showResetPasswordModal}
        handleClose={() => setShowResetPasswordModal(false)}
        handleSubmit={handleSubmitForResetPassword}
      />

      <ResetWalletModal
        open={showResetWallet}
        handleClose={() => setShowResetWallet(false)}
        handleSubmit={handleSubmitForResetWallet}
      />
    </div>
  );
};
export default Login;
