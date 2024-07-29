import { useEffect } from "react";

import { setIsHoldFinish } from "@slices/appSlice";
import { useAppDispatch, useAppSelector } from "store/store";
import { setDefaultTokenSelected } from "@slices/newWalletSlice";

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.app);
  const {
    filteredHoldings,
    tokenSelected: { token },
  } = useAppSelector((state) => state.newWallet);

  useEffect(() => {
    dispatch(setDefaultTokenSelected());

    dispatch(setIsHoldFinish(false));
  }, []);

  return {
    isLoading,
    filteredHoldings,
    token,
  };
};
