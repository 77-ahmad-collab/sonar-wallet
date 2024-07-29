import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBolt } from "@fortawesome/pro-solid-svg-icons";

import { StyledButton } from "@styled";
import { useAppSelector } from "store/store";
import { useSpeedUpOrCancel } from "hooks";
import { ACTIVITY_STATUS_TYPES, TX_TYPES } from "utils/constants";
import { FC } from "react";

const SpeedUpCancelButton: FC<{
  isSpeedUpCancelBlinking?: boolean;
  isSpeedUpEnabled?: boolean;
  isCancelEnabled?: boolean;
  transactionHash: string;
  txType: TX_TYPES;
  tokenAddress: string;
  rawData: any;
}> = ({
  isSpeedUpCancelBlinking,
  isCancelEnabled,
  isSpeedUpEnabled,
  rawData,
  transactionHash,
  tokenAddress,
  txType,
}) => {
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);

  const { speedUpOrCancelTransaction } = useSpeedUpOrCancel();

  const speedUpCancel = (activityStatus: ACTIVITY_STATUS_TYPES) => {
    const NODE_URL = NETWORKCHAIN[rawData.chainId].NODE_URL;

    speedUpOrCancelTransaction(
      transactionHash,
      rawData,
      txType,
      NODE_URL,
      tokenAddress,
      activityStatus
    );
  };
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="r-c-fs"
      >
        <StyledButton
          onClick={(e) => {
            e.stopPropagation();

            speedUpCancel(ACTIVITY_STATUS_TYPES.speedup);
          }}
          disabled={!isSpeedUpEnabled}
          variant="outlined"
          startIcon={
            <FontAwesomeIcon
              icon={faBolt}
              color="white"
              className="buttonIcon"
            />
          }
          className={isSpeedUpCancelBlinking ? "animated" : ""}
        >
          Speed Up
        </StyledButton>
        <StyledButton
          onClick={async (e) => {
            e.stopPropagation();

            speedUpCancel(ACTIVITY_STATUS_TYPES.cancel);
          }}
          disabled={!isCancelEnabled}
          variant="outlined"
          startIcon={
            <FontAwesomeIcon
              icon={faBan}
              color="white"
              className="buttonIcon"
            />
          }
          className={isSpeedUpCancelBlinking ? "animated" : ""}
        >
          Cancel
        </StyledButton>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpeedUpCancelButton;
