import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import appReducer from "@slices/appSlice";
import newWallet from "@slices/newWalletSlice";
import dappInfoSlice from "@slices/dappInfoSlice";

import accountsReducer from "./accounts";

import networksReducer from "./networks";

import uiReducer from "./ui";

import transactionConstructionReducer from "./transaction-construction";

import dappReducer from "./dapp";

import signingReducer from "./signing";

const storage = require("redux-persist/lib/storage").default;

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // transforms: [transformCircular],
  whitelist: [
    "app",
    "signing",
    "account",
    "networks",
    "transactionConstruction",
    "dapp",
    "newWallet",
    "ui",
    "dappInfo",
  ],
};

const mainReducer2 = combineReducers({
  app: appReducer,
  signing: signingReducer,
  account: accountsReducer,
  networks: networksReducer,
  transactionConstruction: transactionConstructionReducer,
  dapp: dappReducer,
  newWallet,
  ui: uiReducer,
  dappInfo: dappInfoSlice,
});

export type RootState = ReturnType<typeof mainReducer2>;

const mainReducer = persistReducer(persistConfig, mainReducer2);

export default mainReducer;
