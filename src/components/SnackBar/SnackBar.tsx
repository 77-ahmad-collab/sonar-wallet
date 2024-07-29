import { SendSnackBar, SwapSnackBar } from "components";
import { useTxActivity } from "hooks";

import { useAppSelector } from "store/store";
import { TX_TYPES } from "utils/constants";

const SnackBar = () => {
  const { isSendSnackBarOpen } = useAppSelector((state) => state.app);

  const { snackBarData } = useTxActivity();

  return (
    <>
      {snackBarData.txType === TX_TYPES.Sent && isSendSnackBarOpen ? (
        <SendSnackBar snackBarData={snackBarData} />
      ) : (
        <SwapSnackBar snackBarData={snackBarData} />
      )}
    </>
  );
};

export default SnackBar;
