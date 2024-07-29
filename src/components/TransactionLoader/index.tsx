import {
  setPendingTransactionLoaderStatus,
  setSendSnackBarStatus,
  setSwapSnackBarStatus,
} from "@slices/appSlice";
import { binanceRainbow } from "assets/Icons";
import { RainbowStyled } from "@styled";
import { useAppDispatch } from "store/store";
import { useTxActivity } from "hooks";
import { TX_TYPES } from "utils/constants";
import { ImageContent } from "components";

const TransactionLoader = () => {
  const dispatch = useAppDispatch();
  const { snackBarData } = useTxActivity();

  const hidePendingTransactionLoader = () => {
    if (snackBarData.txType === TX_TYPES.Sent && snackBarData.transactionHash)
      dispatch(setSendSnackBarStatus(true));
    else if (
      snackBarData.txType === TX_TYPES.Swap &&
      snackBarData.transactionHash
    )
      dispatch(setSwapSnackBarStatus(true));

    dispatch(setPendingTransactionLoaderStatus(false));
  };
  return (
    <div onClick={hidePendingTransactionLoader} className="transactionLoader">
      <div style={{ position: "relative" }}>
        <ImageContent src={binanceRainbow} className="rainbowLoaderImage" />
        <RainbowStyled width={26} height={26}></RainbowStyled>
      </div>
    </div>
  );
};

export default TransactionLoader;
