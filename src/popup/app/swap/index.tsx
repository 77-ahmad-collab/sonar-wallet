import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import Alert from "@mui/material/Alert";
import { faRepeat } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CommonLayout, RainbowLoader, TransactionFee } from "components";
import { SwapTokenFlipper, Text } from "@styled";
import { useSwap } from "hooks";
import TokenA from "./TokenA";
import TokenB from "./TokenB";
import Account from "./Account";
import { formatAmount } from "utils/formatters";
import { useAppSelector } from "store/store";
import { truncateName } from "utils";
import { NETWORKS } from "utils/constants";

const Swap = () => {
  const {
    swapSelectedTokens: {
      account,
      tokenA,
      tokenB,
      error,
      loading,
      hexData,
      warning,
    },
  } = useAppSelector((state) => state.newWallet);
  const { isHoldFinish, NETWORKCHAIN } = useAppSelector((state) => state.app);

  const {
    onTopImageClick,
    handleSwap,
    showTransactionFeeComponent,
    setShowTransactionFeeComponent,
    flipToken,
    handleFlipTokens,
    isTokenApproved,
    handleApproval,
    totalInUsd,
    amountTokenA,
    setAmountTokenA,
    amountTokenB,
    setAmountTokenB,
    currentRatio,
    setCurrentRatio,
    setIsMaxAmountDeducted,
    setRefreshKey,
    progress,
    setProgress,
  } = useSwap();

  const Title = () => (
    <div className="c-fs-sa transactionFeeBoxTitle">
      <Text size={14} weight={500} opacity={0.4}>
        Swapping
      </Text>
      <Tooltip title={amountTokenA.amount}>
        <Text size={16} weight={500} opacity={0.7}>
          {` ${formatAmount(+amountTokenA.amount).toString()} ${truncateName(
            tokenA.symbol
          )}`}
        </Text>
      </Tooltip>

      <Text size={14} weight={500} opacity={0.4}>
        for
      </Text>
      <Tooltip title={amountTokenB.amount}>
        <Text size={16} weight={500} opacity={0.7}>
          {` ${formatAmount(+amountTokenB.amount).toString()} ${truncateName(
            tokenB.symbol
          )}`}
        </Text>
      </Tooltip>
    </div>
  );

  const Error = () => {
    if (warning.length > 0) {
      return (
        <Alert
          id="swap-error-text"
          sx={{ fontSize: "12px", marginTop: "10px" }}
          severity="warning"
        >
          {warning}!
        </Alert>
      );
    }

    if (error.open) {
      return (
        <Alert
          id="swap-error-text"
          sx={{ fontSize: "12px", marginTop: "10px" }}
          severity="error"
        >
          {error.message}!
        </Alert>
      );
    }
    return null;
  };

  const ButtonTitle = () => {
    if (
      isHoldFinish &&
      NETWORKCHAIN[+tokenA.chainId]?.chain !== NETWORKS.NEAR
    ) {
      return <span>Confirmed</span>;
    } else if (isHoldFinish) return <span>Confirming...</span>;

    if (loading) {
      return (
        <RainbowLoader
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
          size={25}
        />
      );
    } else {
      return (
        <>
          <span style={{ opacity: 0.7 }}>Hold to</span> Confirm
        </>
      );
    }
  };

  const springOpacity = [1, 0.3, 1, 1, 1, 1, 1];

  const animationTokenA = {
    opacity: springOpacity,
    y: [0, 80, -5, 2, 0],
  };

  const animationTokenB = {
    opacity: springOpacity,
    y: [0, -80, 5, -2, 0],
  };

  const transitions = {
    duration: 0.5,
    ease: "easeInOut",
    times: [0, 0.3, 0.5, 0.6, 0.8, 0.9, 1],
    repeatDelay: 0,
  };

  return (
    <CommonLayout
      onTopImageClick={onTopImageClick}
      title="Swap Tokens"
      bottomLayoutStyle={{
        overflowY: "hidden",
      }}
    >
      <div
        className="full-width"
        style={{
          maxHeight: showTransactionFeeComponent ? "60%" : "100%",
          overflowY: "scroll",
        }}
      >
        <motion.div
          animate={flipToken}
          transition={transitions}
          variants={{
            flip1: animationTokenA,
            flip2: animationTokenA,
          }}
        >
          <TokenA
            amountTokenA={amountTokenA}
            setAmountTokenA={setAmountTokenA}
            currentRatio={currentRatio}
            setCurrentRatio={setCurrentRatio}
            setIsMaxAmountDeducted={setIsMaxAmountDeducted}
            setRefreshKey={setRefreshKey}
            progress={progress}
            setProgress={setProgress}
          />
        </motion.div>

        <div className="r-c-c">
          <div className="swap-seperator-line" style={{ margin: "10px 0px" }} />{" "}
          <SwapTokenFlipper onClick={handleFlipTokens} disabled={isHoldFinish}>
            <motion.div
              animate={flipToken}
              variants={{
                flip1: { rotate: 180 },
              }}
            >
              <FontAwesomeIcon
                icon={faRepeat}
                style={{ transform: "rotate(90deg)", fontSize: 16 }}
              />
            </motion.div>
          </SwapTokenFlipper>
          <div className="swap-seperator-line" />
        </div>

        <motion.div
          animate={flipToken}
          transition={transitions}
          variants={{
            flip1: animationTokenB,
            flip2: animationTokenB,
          }}
        >
          <TokenB
            amountTokenB={amountTokenB}
            setAmountTokenB={setAmountTokenB}
            setCurrentRatio={setCurrentRatio}
          />
        </motion.div>

        <Account />

        <Error />

        <br />

        <TransactionFee
          show={showTransactionFeeComponent}
          hideTransactionFeeComponent={() =>
            setShowTransactionFeeComponent(false)
          }
          handleClick={handleSwap}
          Title={<Title />}
          handleReject={onTopImageClick}
          showSlippage={true}
          ButtonTitle={<ButtonTitle />}
          loading={loading}
          isTokenApproved={isTokenApproved}
          handleApproval={handleApproval}
          chainFamily={account.chainFamily}
          totalInUsd={totalInUsd}
          hexData={hexData}
        />
      </div>
    </CommonLayout>
  );
};

export default Swap;
