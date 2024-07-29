import { FC, useEffect, useState } from "react";
import {
  SnackBarBottomLayoutStyled,
  SnackBarWrapper,
  SnackbarTopLayoutStyled,
  StyledSnackBar,
} from "@styled";
import SnackBarHeaderPendingState from "./SnackBarHeaderPendingState";
import SnackBarHeaderCompletedState from "./SnackBarHeaderCompletedState";
import { RainbowLine, RenderSendOrReceiveTransactionContent } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import { truncateAddress } from "utils";
import {
  closeSnackBarOnCompletion,
  setFailedModalAlert,
  setPendingTransactionLoaderStatus,
  setSendSnackBarStatus,
} from "@slices/appSlice";
import { ACTIVITY_STATUS_TYPES, NETWORKS, TX_TYPES } from "utils/constants";
import { formatAmount } from "utils/formatters";
import { OnClickType, SwapTransactionData, TransactionData } from "interfaces";

const SendSnackBar: FC<{
  snackBarData: SwapTransactionData | TransactionData;
}> = ({ snackBarData }) => {
  const { isSendSnackBarOpen, isTransactionCompleted, NETWORKCHAIN } =
    useAppSelector((state) => state.app);

  const [transactionCompletedMinimizedHeight, pendingStateMinimizedHeight] = [
    65, 104,
  ];
  const [snackBarExpandedHeight, snackBarMinimizedHeight] = [
    320,
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
    dispatch(setSendSnackBarStatus(false));
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
            txType: TX_TYPES.Sent,
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
                "The current transaction is failed and hence it couldn’t be processed.",
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
      open={isSendSnackBarOpen}
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
            height === snackBarMinimizedHeight
              ? snackBarMinimizedHeight
              : transactionCompletedMinimizedHeight
          }
        >
          {isTransactionCompleted ? (
            <SnackBarHeaderCompletedState />
          ) : (
            <SnackBarHeaderPendingState
              expandSnackBar={expandSnackBar}
              height={height}
              snackBarExpandedHeight={snackBarExpandedHeight}
              text={`Sending ${formatAmount(snackBarData?.token.amount)} ${
                snackBarData.token.symbol
              } to ${truncateAddress(snackBarData?.to)}`}
              closeSnackBar={closeSnackBar}
              snackBarData={snackBarData}
            />
          )}
          <RainbowLine />
        </SnackbarTopLayoutStyled>

        <SnackBarBottomLayoutStyled>
          <RenderSendOrReceiveTransactionContent
            value={snackBarData.token.amountInUsd}
            fees={snackBarData.transactionFeeInUsd}
            sender={snackBarData.from}
            receiver={snackBarData.to}
            transactionHash={snackBarData.transactionHash}
            chainId={snackBarData.chainId}
            receiverNameInTheAddressBook={
              snackBarData.receiverNameInTheAddressBook
            }
            senderNameInTheAddressBook={snackBarData.senderNameInTheAddressBook}
          />
        </SnackBarBottomLayoutStyled>
      </SnackBarWrapper>
    </StyledSnackBar>
  );
};

export default SendSnackBar;
