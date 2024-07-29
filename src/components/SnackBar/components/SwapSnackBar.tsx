import { FC, useEffect, useState } from "react";

import {
  SnackBarBottomLayoutStyled,
  SnackBarWrapper,
  SnackbarTopLayoutStyled,
  StyledSnackBar,
} from "@styled";
import SnackBarHeaderPendingState from "./SnackBarHeaderPendingState";
import SnackBarHeaderCompletedState from "./SnackBarHeaderCompletedState";
import { RainbowLine, RenderSwapTransactionContent } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import {
  closeSnackBarOnCompletion,
  setFailedModalAlert,
  setPendingTransactionLoaderStatus,
  setSwapSnackBarStatus,
} from "@slices/appSlice";
import { ACTIVITY_STATUS_TYPES, NETWORKS, TX_TYPES } from "utils/constants";
import { formatAmount } from "utils/formatters";
import { OnClickType, SwapTransactionData, TransactionData } from "interfaces";

const SwapSnackBar: FC<{
  snackBarData: TransactionData | SwapTransactionData;
}> = ({ snackBarData }) => {
  const { isSwapSnackBarOpen, isTransactionCompleted, NETWORKCHAIN } =
    useAppSelector((state) => state.app);

  const [transactionCompletedMinimizedHeight, pendingStateMinimizedHeight] = [
    65, 104,
  ];
  const [snackBarExpandedHeight, snackBarMinimizedHeight] = [
    "isDappTransaction" in snackBarData && snackBarData.isDappTransaction
      ? 325
      : 415,
    isTransactionCompleted
      ? transactionCompletedMinimizedHeight
      : pendingStateMinimizedHeight,
  ];

  //---actual height of snackbar
  const [height, setHeight] = useState(snackBarMinimizedHeight);

  const dispatch = useAppDispatch();

  const expandSnackBar = () =>
    setHeight(
      height === snackBarExpandedHeight
        ? snackBarMinimizedHeight
        : snackBarExpandedHeight
    );

  const closeSnackBar = (e: OnClickType) => {
    e.stopPropagation();

    dispatch(setSwapSnackBarStatus(false));
    dispatch(setPendingTransactionLoaderStatus(true));
    setHeight(snackBarMinimizedHeight);
  };

  useEffect(() => {
    let time: string | number | NodeJS.Timeout | undefined;

    if (isTransactionCompleted) {
      setHeight(transactionCompletedMinimizedHeight);
      time = setTimeout(async () => {
        dispatch(
          closeSnackBarOnCompletion({
            txType: TX_TYPES.Swap,
            isTransactionCompleted: false,
          })
        );
        if (
          snackBarData.status === ACTIVITY_STATUS_TYPES.failed &&
          NETWORKCHAIN[snackBarData.chainId].chain === NETWORKS.EVM
        ) {
          dispatch(
            setFailedModalAlert({
              open: true,
              message:
                "The current transaction couldn’t go thru for lack of liquidity in your wallet.",
              funds: 0,
              gas: snackBarData.transactionFeeInUsd,
            })
          );
        }
      }, 2000);
    } else setHeight(pendingStateMinimizedHeight);

    return () => clearTimeout(time);
  }, [isTransactionCompleted]);

  return (
    <StyledSnackBar
      open={isSwapSnackBarOpen}
      autoHideDuration={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transitionDuration={{ enter: 100, exit: 500 }}
      sx={{
        height: height,
      }}
    >
      <SnackBarWrapper>
        <SnackbarTopLayoutStyled
          height={
            height === snackBarMinimizedHeight ? snackBarMinimizedHeight : 70
          }
        >
          {isTransactionCompleted ? (
            <SnackBarHeaderCompletedState />
          ) : (
            <SnackBarHeaderPendingState
              expandSnackBar={expandSnackBar}
              height={height}
              snackBarExpandedHeight={snackBarExpandedHeight}
              text={
                "isDappTransaction" in snackBarData &&
                snackBarData.isDappTransaction
                  ? "Transaction is in progress"
                  : `Swapping ${formatAmount(+snackBarData.token.amount)} ${
                      snackBarData.token.symbol
                    } for  ${
                      "tokenB" in snackBarData
                        ? `${formatAmount(+snackBarData.tokenB.amount)} ${
                            snackBarData.tokenB.symbol
                          } `
                        : 1
                    }`
              }
              closeSnackBar={closeSnackBar}
              snackBarData={snackBarData}
            />
          )}
          <RainbowLine />
        </SnackbarTopLayoutStyled>

        <SnackBarBottomLayoutStyled>
          <RenderSwapTransactionContent
            snackbar={true}
            value={snackBarData.token.amountInUsd}
            fees={snackBarData.transactionFeeInUsd}
            sender={snackBarData.from}
            receiver={snackBarData.to}
            chainId={snackBarData.chainId}
            transactionHash={snackBarData.transactionHash}
            makerBalance={
              "makerBalance" in snackBarData ? snackBarData.makerBalance : 0
            }
            makerBalanceInUsd={
              "makerBalanceInUsd" in snackBarData
                ? snackBarData.makerBalanceInUsd
                : 0
            }
            takerBalance={1222}
            takerBalanceInUsd={12333}
            tokenAname={snackBarData.token.symbol}
            tokenBname={
              "tokenB" in snackBarData ? snackBarData.tokenB.symbol : ""
            }
            tokenAprice={
              "tokenAprice" in snackBarData ? snackBarData.tokenAprice : 0
            }
            tokenBprice={
              "tokenBprice" in snackBarData ? snackBarData.tokenBprice : 0
            }
            isDappTransaction={
              "isDappTransaction" in snackBarData
                ? snackBarData.isDappTransaction
                : false
            }
          />
        </SnackBarBottomLayoutStyled>
      </SnackBarWrapper>
    </StyledSnackBar>
  );
};

export default SwapSnackBar;
