import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SignTypedDataRequest } from "background-related/utils/signing";
import {
  DappSlice,
  IRequestAccountsAction,
  ISignData,
  ISignMessageAction,
  ISignTransactionAction,
  ISwitchNetworkAction,
} from "interfaces";
import { dappInfoMockState } from "mock";
import { PermissionRequest } from "provider-bridge-shared";

const initialState: DappSlice = process.env.isTesting
  ? { ...dappInfoMockState }
  : {
      defaultWallet: "false",
      dAppNetwork: "",
      method: "",
      route: "",
      dAppConnectAddress: "",
      origin: "",
      signedData: null,
      dappMethodParam: [],
      signTypedData: null,
      permission: null,
      transactionObject: {},
      permChangeNetwork: "false",
      popupClosingAfterConfirm: false,
    };

export const dappInfo = createSlice({
  name: "dappInfo",
  initialState,
  reducers: {
    setDefaultWallet: (state, action: PayloadAction<"false" | "true">) => {
      state.defaultWallet = action.payload;
    },
    setPermChangeNetwork: (state, action: PayloadAction<"false" | "true">) => {
      state.permChangeNetwork = action.payload;
    },
    setPopupClosingAfterConfirm: (state, action: PayloadAction<boolean>) => {
      state.popupClosingAfterConfirm = action.payload;
    },
    setDAppNetwork: (state, action: PayloadAction<string>) => {
      state.dAppNetwork = action.payload;
    },
    setMethod: (state, action: PayloadAction<string>) => {
      state.method = action.payload;
    },
    setRoute: (state, action: PayloadAction<string>) => {
      state.route = action.payload;
    },
    setDAppConnectAddress: (state, action: PayloadAction<string>) => {
      state.dAppConnectAddress = action.payload;
    },
    setOrigin: (state, action: PayloadAction<string>) => {
      state.origin = action.payload;
    },
    setSignedData: (state, action: PayloadAction<ISignData>) => {
      state.signedData = action.payload;
    },
    setDappMethodParam: (state, action: PayloadAction<unknown[]>) => {
      state.dappMethodParam = action.payload;
    },
    setSignTypedData: (state, action: PayloadAction<SignTypedDataRequest>) => {
      state.signTypedData = action.payload;
    },
    setPermission: (state, action: PayloadAction<PermissionRequest>) => {
      state.permission = action.payload;
    },
    setTransactionObject: (
      state,
      action: PayloadAction<Record<string, unknown>>
    ) => {
      state.transactionObject = action.payload;
    },
    setSwitchNetworkData: (
      state,
      action: PayloadAction<ISwitchNetworkAction>
    ) => {
      state.dAppNetwork = action.payload.dAppNetwork;
      state.permission = action.payload.permission;
      state.method = action.payload.method;
      state.dappMethodParam = action.payload.dappMethodParam;
    },
    setRequestAccountsData: (
      state,
      action: PayloadAction<IRequestAccountsAction>
    ) => {
      state.dAppNetwork = action.payload.dAppNetwork;
      state.permission = action.payload.permission;
      state.method = action.payload.method;
    },
    setSignMessageData: (state, action: PayloadAction<ISignMessageAction>) => {
      state.permission = action.payload.permission;
      state.method = action.payload.method;
    },
    setSignTransactionData: (
      state,
      action: PayloadAction<ISignTransactionAction>
    ) => {
      state.permission = action.payload.permission;
      state.method = action.payload.method;
      state.transactionObject = action.payload.transactionObject;
    },
  },
});

export const {
  setDefaultWallet,
  setDAppNetwork,
  setMethod,
  setRoute,
  setDAppConnectAddress,
  setOrigin,
  setSignedData,
  setDappMethodParam,
  setSignTypedData,
  setPermission,
  setTransactionObject,
  setSwitchNetworkData,
  setRequestAccountsData,
  setSignMessageData,
  setPermChangeNetwork,
  setSignTransactionData,
  setPopupClosingAfterConfirm,
} = dappInfo.actions;

export default dappInfo.reducer;
