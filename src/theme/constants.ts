// import { Chain, CustomChain } from "@ethereumjs/common";
import axios from "axios";

// will not work in development
// import Browser from "webextension-polyfill";
// export const OPEN_IN_WEB = Browser.storage ? false : true;
// export const STORAGE = OPEN_IN_WEB ? undefined : Browser.storage.local;

// will work in development
export const OPEN_IN_WEB = chrome.storage ? false : true;
export const STORAGE = OPEN_IN_WEB ? undefined : chrome.storage.local;

export const CURRENTLY_IN_DEVELOPMENT = false;

export const AUTHSCREENS = {
  landing: "/landing",
  auth: "/index.html",
  seedphrase: "/seedphrase",
  ImportWallet: "/import-wallet",
  selectAction: "/select-action",
  selectDefaultWallet: "/select-Default-Wallet",
};

export const APPSCREENS = {
  dashboard: "/index.html",
  importWallet: "importWallet",
  importAccount: "importAccount",
  settings: "/settings",
  send: "/send",
  swap: "/swap",
  near: "/near",
  seedphrase: "/seedphrase",
  dapp: "/dapp",
  connect: "connect",
  changeNetwork: "change-network",
  tx: "tx",
  receive: "/receive",
  editList: "/editList",
  manage: "manage",
  wallets: "wallets",
  info: "info",
  authentication: "authentication",
  addressBook: "address-book",
  accountInfo: "account",
  tokenDetail: "/token-detail",
  signTx: "sign-tx",
  approve: "approve-tx",
  invalidNetwork: "invalid-network",
  login: "login",
  noWallet: "no-wallet",
  connectedWebsites: "connected-websites",
};

export const HEIGHT = "600px";
export const WIDTH = "380px";
export const EXTENSIONHEIGHT = 600;

export const STATIC_STRAIGHTLINE_GRAPH = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export const STATIC_TIME_GRAPH_DATA = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  // 16, 17, 18, 19, 20, 21, 22,
  // 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  // 42, 43, 44, 45, 46, 47, 48, 49, 50,
];
export default axios.create({ baseURL: "https://api.coingecko.com/api/v3" });
