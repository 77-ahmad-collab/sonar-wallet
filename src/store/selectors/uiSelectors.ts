import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

// FIXME Make this configurable.
const hardcodedMainCurrencySymbol = "USD";

export const selectCurrentNetwork = createSelector(
  (state: RootState) => state.ui.selectedAccount.network,
  selectedNetwork => selectedNetwork
);

export const selectCurrentAccount = createSelector(
  (state: RootState) => state.ui.selectedAccount,
  ({ address, network }) => ({
    address,
    network,
    truncatedAddress: address.slice(0, 7),
  })
);

export const selectMainCurrencySymbol = createSelector(
  () => null,
  () => hardcodedMainCurrencySymbol
);
