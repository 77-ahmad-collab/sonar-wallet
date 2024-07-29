//@ts-nocheck

import { createSelector, createSlice } from "@reduxjs/toolkit";
import Emittery from "emittery";
import { AddressOnNetwork } from "../background-related/accounts";
import { ETHEREUM } from "../background-related/constants";
import { EVMNetwork } from "../background-related/networks";
import { addAddressNetwork } from "./accounts";
import { createBackgroundAsyncThunk } from "./utils";

const defaultSettings = {
  hideDust: false,
  defaultWallet: false,
};

export interface Location {
  pathname: string;
  key?: string;
  hash: string;
}

export type UIState = {
  selectedAccount: AddressOnNetwork;
  showingActivityDetailID: string | null;
  initializationLoadingTimeExpired: boolean;
  settings: { hideDust: boolean; defaultWallet: boolean };
  snackbarMessage: string;
  routeHistoryEntries?: Partial<Location>[];
  slippageTolerance: number;
};

export type Events = {
  snackbarMessage: string;
  newDefaultWalletValue: boolean;
  refreshBackgroundPage: null;
  newSelectedAccount: AddressOnNetwork;
  newSelectedNetwork: EVMNetwork;
};

export const emitter = new Emittery<Events>();

export const initialState: UIState = {
  showingActivityDetailID: null,
  selectedAccount: {
    address: "",
    network: ETHEREUM,
  },
  initializationLoadingTimeExpired: false,
  settings: defaultSettings,
  snackbarMessage: "",
  slippageTolerance: 0.01,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedAccount: (
      immerState,
      { payload: addressNetwork }: { payload: AddressOnNetwork }
    ) => {
      immerState.selectedAccount = addressNetwork;
    },
    initializationLoadingTimeHitLimit: (state) => ({
      ...state,
      initializationLoadingTimeExpired: true,
    }),
    setSnackbarMessage: (
      state,
      { payload: snackbarMessage }: { payload: string }
    ): UIState => {
      return {
        ...state,
        snackbarMessage,
      };
    },
    clearSnackbarMessage: (state): UIState => ({
      ...state,
      snackbarMessage: "",
    }),
    setDefaultWallet: (
      state,
      { payload: defaultWallet }: { payload: boolean }
    ) => ({
      ...state,
      settings: {
        ...state.settings,
        defaultWallet,
      },
    }),
    setRouteHistoryEntries: (
      state,
      { payload: routeHistoryEntries }: { payload: Partial<Location>[] }
    ) => ({
      ...state,
      routeHistoryEntries,
    }),
    setSlippageTolerance: (
      state,
      { payload: slippageTolerance }: { payload: number }
    ) => ({
      ...state,
      slippageTolerance,
    }),
  },
});

export const {
  initializationLoadingTimeHitLimit,
  setSelectedAccount,
  setSnackbarMessage,
  setDefaultWallet,
  clearSnackbarMessage,
  setRouteHistoryEntries,
  setSlippageTolerance,
} = uiSlice.actions;

export default uiSlice.reducer;

// Async thunk to bubble the setNewDefaultWalletValue action from  store to emitter.
export const setNewDefaultWalletValue = createBackgroundAsyncThunk(
  "ui/setNewDefaultWalletValue",
  async (defaultWallet: boolean, { dispatch }) => {
    await emitter.emit("newDefaultWalletValue", defaultWallet);
    // Once the default value has persisted, propagate to the store.
    dispatch(uiSlice.actions.setDefaultWallet(defaultWallet));
  }
);

// TBD @Antonio: It would be good to have a consistent naming strategy
export const setNewSelectedAccount = createBackgroundAsyncThunk(
  "ui/setNewCurrentAddressValue",
  async (addressNetwork: AddressOnNetwork, { dispatch }) => {
    await emitter.emit("newSelectedAccount", addressNetwork);
    // Once the default value has persisted, propagate to the store.
    dispatch(uiSlice.actions.setSelectedAccount(addressNetwork));
    // Do async work needed after the account is switched
    await emitter.emit("newSelectedAccountSwitched", addressNetwork);
  }
);

export const setSelectedNetwork = createBackgroundAsyncThunk(
  "ui/setSelectedNetwork",
  async (
    { network, address }: { network: EVMNetwork; address: string },
    { dispatch }
  ) => {
    emitter.emit("newSelectedNetwork", network);
    dispatch(setNewSelectedAccount({ address, network }));
    dispatch(addAddressNetwork({ address, network }));
  }
);

export const refreshBackgroundPage = createBackgroundAsyncThunk(
  "ui/refreshBackgroundPage",
  async () => {
    await emitter.emit("refreshBackgroundPage", null);
  }
);

export const selectUI = createSelector(
  (state: { ui: UIState }): UIState => state.ui,
  (uiState) => uiState
);

export const selectSettings = createSelector(selectUI, (ui) => ui.settings);

export const selectDefaultWallet = createSelector(
  selectSettings,
  (settings) => settings?.defaultWallet
);
