import { Store as ProxyStore } from "webext-redux";
import { AnyAction } from "@reduxjs/toolkit";

import Main from "./main";
import { decodeJSON, encodeJSON } from "./lib/utils";
import { RootState } from "store/index";

export type { RootState };

export type BackgroundDispatch = Main["store"]["dispatch"];

/**
 * Creates and returns a new webext-redux proxy store. This is a redux store
 * that works like any redux store, except that its contents and actions are
 * proxied to and from the master background store created when the API package
 * is first imported.
 *
 * The returned Promise resolves once the proxy store is ready and hydrated
 * with the current background store data.
 */
export async function newProxyStore(): Promise<
  ProxyStore<RootState, AnyAction>
> {
  const proxyStore = new ProxyStore({
    serializer: encodeJSON,
    deserializer: decodeJSON,
  });
  await proxyStore.ready();

  return proxyStore;
}
// const copyEmptyString = () => {
//   browser.runtime.onConnect.addListener(async (port) => {
//     if (port.name === EXTERNAL_PORT_NAME && port.sender?.url) {
//       port.postMessage({
//         id: "tallyHo",
//         result: {
//           method: "copy",
//           address: [],
//         },
//       });
//     }
//   });
// };
/**
 * Starts the API subsystems, including all services.
 */
export async function startApi(): Promise<Main> {
  const mainService = await Main.create();
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   if (request.action === "copyEmptyString") {
  //     console.log(
  //       "🚀 ~ file: index.ts:54 ~ chrome.runtime.onMessage.addListener ~ action:",
  //       "copyEmptyString"
  //     );
  //     copyEmptyString();
  //   }
  // });

  mainService.startService();

  return mainService.started();
}
