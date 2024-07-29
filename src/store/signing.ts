import { createSelector, createSlice } from "@reduxjs/toolkit";
import Emittery from "emittery";
import {
  ExpectedSigningData,
  SignDataMessageType,
  SignDataRequest,
  SignTypedDataRequest,
} from "../background-related/utils/signing";
import { createBackgroundAsyncThunk } from "./utils";
import { EnrichedSignTypedDataRequest } from "../background-related/services/enrichment";
import { EIP712TypedData } from "../background-related/types";
import { AddressOnNetwork } from "../background-related/accounts";
import { AccountSigner } from "../background-related/services/signing";
import { EIP1559TransactionRequest } from "../background-related/networks";

/**
 * The different types of SignOperations that can be executed. These types
 * correspond to the signature requests that they carry.
 */
export type SignOperationType =
  | SignDataRequest
  | SignTypedDataRequest
  | EIP1559TransactionRequest;

/**
 * A request for a signing operation carrying the AccountSigner whose signature
 * is requested and the request itself.
 */
export type SignOperation<T extends SignOperationType> = {
  transaction: T;
  method: AccountSigner;
};

type Events = {
  requestSignTypedData: {
    typedData: EIP712TypedData;
    account: AddressOnNetwork;
    accountSigner: AccountSigner;
  };
  requestSignData: {
    signingData: ExpectedSigningData;
    messageType: SignDataMessageType;
    rawSigningData: string;
    account: AddressOnNetwork;
    accountSigner: AccountSigner;
  };
  signatureRejected: never;
};

export const signingSliceEmitter = new Emittery<Events>();

type SigningState = {
  signedTypedData: string | undefined;
  typedDataRequest: EnrichedSignTypedDataRequest | undefined;

  signedData: string | undefined;
  signDataRequest: SignDataRequest | undefined;
};

export const initialState: SigningState = {
  typedDataRequest: undefined,
  signedTypedData: undefined,

  signedData: undefined,
  signDataRequest: undefined,
};

export const signTypedData = createBackgroundAsyncThunk(
  "signing/signTypedData",
  async (data: SignOperation<SignTypedDataRequest>) => {
    const {
      transaction: { account, typedData },
      method: accountSigner,
    } = data;

    await signingSliceEmitter.emit("requestSignTypedData", {
      typedData,
      account,
      accountSigner,
    });
  }
);

export const signData = createBackgroundAsyncThunk(
  "signing/signData",
  async (data: SignOperation<SignDataRequest>) => {
    const {
      transaction: { rawSigningData, account, signingData, messageType },
      method: accountSigner,
    } = data;
    await signingSliceEmitter.emit("requestSignData", {
      rawSigningData,
      signingData,
      account,
      messageType,
      accountSigner,
    });
  }
);

const signingSlice = createSlice({
  name: "signing",
  initialState,
  reducers: {
    signedTypedData: (state, { payload }: { payload: string }) => ({
      ...state,
      signedTypedData: payload,
      typedDataRequest: undefined,
    }),
    typedDataRequest: (
      state,
      { payload }: { payload: EnrichedSignTypedDataRequest }
    ) => ({
      ...state,
      typedDataRequest: payload,
    }),
    signDataRequest: (state, { payload }: { payload: SignDataRequest }) => {
      return {
        ...state,
        signDataRequest: payload,
      };
    },
    signedData: (state, { payload }: { payload: string }) => ({
      ...state,
      signedData: payload,
      signDataRequest: undefined,
    }),
    clearSigningState: (state) => ({
      ...state,
      typedDataRequest: undefined,
      signDataRequest: undefined,
    }),
  },
});

export const {
  signedTypedData,
  typedDataRequest,
  signedData,
  signDataRequest,
  clearSigningState,
} = signingSlice.actions;

export default signingSlice.reducer;

export const selectTypedData = createSelector(
  (state: { signing: SigningState }) => state.signing.typedDataRequest,
  (signTypes) => signTypes
);

export const selectSigningData = createSelector(
  (state: { signing: SigningState }) => state.signing.signDataRequest,
  (signTypes) => signTypes
);

export const rejectDataSignature = createBackgroundAsyncThunk(
  "signing/reject",
  async (_, { dispatch }) => {
    await signingSliceEmitter.emit("signatureRejected");
    // Provide a clean slate for future transactions.
    dispatch(signingSlice.actions.clearSigningState());
  }
);
