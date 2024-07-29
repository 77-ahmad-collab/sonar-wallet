/* eslint-disable @typescript-eslint/no-restricted-imports */
import { configureStore, isPlain } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useBackgroundDispatch, useBackgroundSelector } from "redux-hook";
import { PERSIST } from "redux-persist";
import { persistedReducer } from "./reducers";
import { RootState } from "store/index";

// FOR PRODUCTION
// import patchDeepDiff from "webext-redux/lib/strategies/deepDiff/patch";
// import { AnyAction } from "redux";
// import { Store as ProxyStore } from "webext-redux";
// import { RootState as BackgroundRootState } from "background-related";
// import { decodeJSON, encodeJSON } from "background-related/lib/utils";
// import * as notification from "@extend-chrome/notify";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        isSerializable: (value: unknown) =>
          isPlain(value) || typeof value === "bigint",
        ignoredActions: [PERSIST],
      },
      immutableCheck: false,
    }),
});

// FOR PRODUCTION
// export const prodStore: ProxyStore<BackgroundRootState, AnyAction> =
//   new ProxyStore({
//     serializer: encodeJSON,
//     deserializer: decodeJSON,
//     patchStrategy: patchDeepDiff,
//   });
// export const notify = notification;

// FOR DEVELOPMENT
export const prodStore = store;

type AppDispatch = typeof store.dispatch;

const developmentDispatch: () => AppDispatch = useDispatch;

export const useAppDispatch =
  process.env.NODE_ENV === "development" || process.env.web === "true"
    ? developmentDispatch
    : useBackgroundDispatch;

export const developmentSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppSelector =
  process.env.NODE_ENV === "development" || process.env.web === "true"
    ? developmentSelector
    : useBackgroundSelector;

export const StaticStore =
  process.env.NODE_ENV === "production" ? prodStore : store;
