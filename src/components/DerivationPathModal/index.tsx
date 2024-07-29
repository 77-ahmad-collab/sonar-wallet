import { FC, useMemo, useState } from "react";

import { DerivationPathOption, Text } from "@styled";
import { BottomBasicModal, ButtonWithIcon } from "components";
import { DerivationPathModal as PROPS } from "interfaces";
import { faLink } from "@fortawesome/pro-light-svg-icons";

import { useAppSelector } from "store/store";
import _ from "lodash";
// import {
//   removerUserFromAppSlice,
// } from "store/slices/appSlice";
// import { AUTHSCREENS } from "theme/constants";
// import { clearHoldings } from "@slices/newWalletSlice";
// import { useNavigate } from "react-router";

const DerivationPathModal: FC<PROPS> = ({
  open,
  handleClose,
  handleSubmit,
}) => {
  /* global-state */

  const { accounts } = useAppSelector((state) => state.newWallet);

  /* local-state */

  /* hooks */
  const [firstDerivationCount, setFirstDerivationCount] = useState(0);
  const [secondDerivationCount, setSecondDerivationCount] = useState(0);

  const derivationPathList = [
    `m/44'/501'/0'/${firstDerivationCount}'`,
    `m/44'/501'/${secondDerivationCount}'`,
  ];

  /* functions */
  const getAllDerivationPaths = () => {
    let firstPath = 0;
    // 4 slashes
    let secondPath = 0;
    // 3 slashes
    const char = "/";
    const allSolanaAccounts = Object.keys(accounts)
      .map((accId) => accounts[accId])
      .filter((account) => account.chainFamily === "SOLANA");
    console.log(allSolanaAccounts, "allsolana accounts");
    // accounts.filter((acc) => acc.)
    allSolanaAccounts.forEach((acc) => {
      const count = _.countBy(acc.derivationpath)[char];
      if (count === 4) {
        firstPath++;
      } else if (count === 3) {
        secondPath++;
      }
    });
    setFirstDerivationCount(firstPath);
    setSecondDerivationCount(secondPath);
  };

  /* effects */

  useMemo(() => {
    getAllDerivationPaths();
  }, [accounts]);

  return (
    <BottomBasicModal open={open} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faLink}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black" }} weight={600}>
            Select Derivation Path
          </Text>
        </div>

        {derivationPathList.map((str, key) => {
          return (
            <DerivationPathOption
              id={`derivationpath-${key}`}
              key={str}
              lightMode={true}
              style={{
                width: "100%",
                background: "rgba(0, 0, 0, 0.08)",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={() => handleSubmit(str)}
            >
              <Text
                style={{ fontSize: "14px", color: "black" }}
                weight={500}
                size={16}
              >
                {str}
              </Text>
            </DerivationPathOption>
          );
        })}

        <div className="r-c-fs">
          <Text
            style={{
              color: "black",
              textDecoration: "underline",
              marginTop: "10px",
            }}
            weight={400}
            size={14}
          >
            what is this
          </Text>
        </div>
      </>
    </BottomBasicModal>
  );
};

export default DerivationPathModal;
