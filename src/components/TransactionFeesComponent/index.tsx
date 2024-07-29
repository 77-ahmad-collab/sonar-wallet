import { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersSimple } from "@fortawesome/pro-light-svg-icons";

import {
  ButtonSection,
  EditButton,
  RejectButtonStyled,
  Text,
  TransactionFeeStyled,
} from "@styled";
import { TransactionFeesProps as PROPS } from "interfaces";
import {
  AdvanceOptionModal,
  ApproveButton,
  GasFeeComponent,
  RainbowHoldButton,
} from "components";
import HexData from "./Components/hexData";
import { useAppDispatch, useAppSelector } from "store/store";
import { NETWORKS } from "utils/constants";
import { resetCustomGasOption } from "@slices/appSlice";

const TransactionFee: FC<PROPS> = ({
  handleClick,
  dAppMode,
  hexData,
  Title,
  showSlippage = false,
  show,
  ButtonTitle,
  loading,
  handleReject,
  isTokenApproved = true,
  handleApproval = () => {},
  chainFamily,
  totalInUsd,
}) => {
  const {
    networkFeeSettings: { gasInfo, feeType },
    isHoldFinish,
  } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  const [showAdvanceOptionModal, setShowAdvanceOptionModal] = useState(false);
  const [showHexData] = useState(false);

  const closeAdvanceOptionModal = () => setShowAdvanceOptionModal(false);
  const handleOpen = () => setShowAdvanceOptionModal(true);

  const onHandleReject = () => {
    if (!isHoldFinish) {
      handleReject();
    }
  };

  useEffect(() => {
    dispatch(resetCustomGasOption());
  }, []);

  return (
    <TransactionFeeStyled
      className={`trans-slow ${
        show ? "showTransactionFeeComponent " : "hideTransactionFeeComponent "
      }`}
      style={{
        marginLeft: dAppMode ? "0px" : "-15px",
        boxShadow: "0px -16px 40px 0px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* {chainFamily === NETWORKS.EVM && (
        <CodeButton onClick={toggleHexAndGasFeeComponent}>
          <FontAwesomeIcon icon={faCode} className="editCodeIcon" />
        </CodeButton>
      )} */}

      {((chainFamily === NETWORKS.NEAR && showSlippage) ||
        (chainFamily === NETWORKS.SOLANA && showSlippage) ||
        chainFamily === NETWORKS.EVM) && (
        <EditButton onClick={handleOpen}>
          <FontAwesomeIcon icon={faSlidersSimple} className="editGasIcon" />
          <Text size={14} weight={400} customColor={"#000000"}>
            Edit
          </Text>
        </EditButton>
      )}

      {showHexData ? (
        <HexData hexData={hexData} />
      ) : (
        <GasFeeComponent
          Title={Title}
          showSlippage={showSlippage}
          totalInUsd={totalInUsd}
        />
      )}

      <ButtonSection>
        <RejectButtonStyled
          id="TransactionFee-handlecustom"
          onClick={onHandleReject}
          width={100}
          isDim={isHoldFinish}
          // left={20}
        >
          <Text className="f-body-sm" weight={400} style={{ fontSize: "14" }}>
            Reject
          </Text>
        </RejectButtonStyled>

        {isTokenApproved ? (
          <RainbowHoldButton
            width={270}
            left={20}
            onHoldComplete={() => {
              if (gasInfo[feeType].gwei > 0) {
                handleClick && handleClick();
              }
            }}
            ButtonTitle={ButtonTitle}
            loading={loading}
          />
        ) : (
          <ApproveButton
            width={270}
            left={20}
            loading={loading}
            handleApproval={handleApproval}
          />
        )}
      </ButtonSection>

      <AdvanceOptionModal
        open={showAdvanceOptionModal}
        handleClose={closeAdvanceOptionModal}
        showSlippage={showSlippage}
        chainFamily={chainFamily}
      />
    </TransactionFeeStyled>
  );
};

export default TransactionFee;
