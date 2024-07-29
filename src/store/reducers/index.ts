import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import appReducer from "store/slices/appSlice";
import newAppReducer from "store/slices/appSlice/appSlice";
import newWalletReducer from "store/slices/newWalletSlice/newWalletSliceTemp";
import walletReducer from "store/slices/newWalletSlice";
import dappInfo from "store/slices/dappInfoSlice";
import uiReducer from "store/ui";

const storage = require("redux-persist/lib/storage").default;

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["app", "newWallet", "ui", "dappInfo"],
};
const reducers = combineReducers({
  app: process.env.isTesting ? newAppReducer : appReducer,
  newWallet: process.env.isTesting ? newWalletReducer : walletReducer,
  ui: uiReducer,
  dappInfo,
});

export const persistedReducer = persistReducer(persistConfig, reducers);

export type RootState = ReturnType<typeof reducers>;
