import { FC } from "react";

import { Text } from "@styled";
import { BottomBasicModal, ButtonWithIcon } from "components";
import { RestoreAccessModal as PROPS } from "interfaces";
import { faArrowRightToBracket, faRotateExclamation, faX } from "@fortawesome/pro-light-svg-icons";
import { faKeySkeleton } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const RestoreAccessModal: FC<PROPS> = ({
  open,
  handleClose,
  handleSubmit
}) => {
  /* global-state */

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */
  

  return (
    <BottomBasicModal open={open} handleClose={handleClose} gradient>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faArrowRightToBracket}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black"}} weight={600}>
            Restore Access
          </Text>
        </div>

        <div>
          <div className="r-c-sb input-header">
            <Text
              size={16}
              weight={400}
              customColor={"#000000"}
            >
              Sonar does not store a copy of your password for security reasons.
            </Text>
            
          </div>
        </div>

        <div>
          <div className="r-c-sb input-header">
            <Text
              size={16}
              weight={400}
              customColor={"#000000"}
            >
              If you forgot your password, you must restore Sonar Wallet and re-import your accounts
            </Text>
            
          </div>
        </div>


        <div
          style={{
            padding: "10px 10px",
            width: "100%",
            border: "1px solid #00000080",
            borderRadius: "8px",
            marginTop:"20px"
          }}>


            <div className="r-fs-c" style={{ marginBottom: "15px", marginTop:"5px"}}>
            <FontAwesomeIcon
              icon={faKeySkeleton}
              className="infoIconTxFail"
              style={{ color: "black" }}
            />

            <Text size={14} weight={400} customColor={"#000000"} style={{ marginRight:"8px"}}>
              You will need to enter your secret phrase to restore access to your accounts.
            </Text>

          </div>
          
          
        </div>


        <div className="r-c-fs">
          
          <ButtonWithIcon
            icon={faRotateExclamation}
            iconColor={"#FFFFFF"}
            lightMode={true}
            style={{ marginTop: 20, background: "#FF375E" , color:"#FFFFFF"}}
            onClick={handleSubmit}
            text="Reset"
            isHover={true}
          />

          <ButtonWithIcon
            icon={faX}
            lightMode={true}
            style={{ marginTop: 20 , background:"transparent", border:"1px solid rgba(0, 0, 0, 0.3)"}}
            onClick={handleClose}
            text="Don't reset"
            isHover={true}
          />
        </div>
      </>
    </BottomBasicModal>
  );
};

export default RestoreAccessModal;
