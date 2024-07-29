
import { saveDefaultWallet } from "utils/utils.dapp";

// import Browser from "webextension-polyfill";
import browser from "webextension-polyfill";
import {
  EXTERNAL_PORT_NAME,
  PROVIDER_BRIDGE_TARGET,
  WINDOW_PROVIDER_TARGET,
} from "./provider-bridge-shared";

const extension = require("extensionizer");

const windowOriginAtLoadTime = window.location.origin;



function copyToTheClipboard(textToCopy) {
  
  const el = document.createElement("textarea");
  el.value = textToCopy;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  
}
// const port = browser.runtime.connect({ name: EXTERNAL_PORT_NAME });
// port.onMessage.addListener((data) => {

//   if (data?.result.method === "copy") {

//     setTimeout(()=>{
//       copyToTheClipboard(
//         "MY =======================================================================copied inside"
//       );
//     },7000)
//   }
// }); 

// console.log(StaticStore.getState().app,"staic stoe ==================================",);



const copyEmptyStringOnLoad = ()=>{
  chrome.storage.local.get('state',data => {
    console.log(JSON.parse(data.state),"LOCAL STORAGE REDUX--------------------------------");
    if(JSON.parse(data.state).app.isUserExists) copyToTheClipboard("");
  });
}


copyEmptyStringOnLoad()

// const INJECTED_WINDOW_PROVIDER_SOURCE = "SONAR";
 
// const port = browser.runtime.connect({ name: EXTERNAL_PORT_NAME });


export function connectProviderBridge() {
  // console.log("connect-----------------------");
  const port = browser.runtime.connect({ name: EXTERNAL_PORT_NAME });
  window.addEventListener("message", (event) => {
    if (
      event.origin === windowOriginAtLoadTime && // we want to recieve msgs only from the in-page script
      event.source === window && // we want to recieve msgs only from the in-page script
      event.data.target === PROVIDER_BRIDGE_TARGET
    ) {
      // TODO: replace with better logging before v1. Now it's invaluable in debugging.
      // eslint-disable-next-line no-console
      // console.log(
      //   `%c content: inpage > background: ${JSON.stringify(event.data)}`,
      //   "background: #bada55; color: #222"
      // );

      port.postMessage(event.data);
    }
  });

  port.onMessage.addListener((data) => {
    // TODO: replace with better logging before v1. Now it's invaluable in debugging.
    // eslint-disable-next-line no-console
    // console.log(
    //   `%c content: background > inpage: ${JSON.stringify(data)}`,
    //   "background: #222; color: #bada55"
    // );

    if (data.result?.defaultWallet == true) {
      // console.log(
      //   "WALLLLLLLLLLLLLLLETTTTTTTTTTTTTT",
      //   data.result.defaultWallet
      // );
      saveDefaultWallet("true");
      injectTallyWindowProvider();
    } else if (data.result?.defaultWallet == false) {
      // console.log(
      //   "WALLLLLLLLLLLLLLLETTTTTTTTTTTTTT FALSEEEEEEEE",
      //   data.result.defaultWallet
      // );
      saveDefaultWallet("false");
      injectTallyWindowProvider();
    }
    // port.onMessage.addListener((data) => {
      // console.log(data, "THE DATAA OF MY CHAIN");
      // if (data?.result.method === "copy") {
      //   console.log("999999999999999999999999999999999999");
      //   copyToTheClipboard("MY TEXT IS COPIED");
      // }
     
    // });
   

    window.postMessage(
      {
        ...data,
        target: WINDOW_PROVIDER_TARGET,
      },
      windowOriginAtLoadTime
    );
  });



  // Browser.runtime.onInstalled(() => {
  //   saveDefaultWallet("false");
  // });

  // let's grab the internal config that also has chainId info
  port.postMessage({
    request: { method: "tally_getConfig", origin: windowOriginAtLoadTime },
  });
}

export function injectTallyWindowProvider() {
  // console.log("INJECT-----------------------");
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");

    scriptTag.setAttribute("async", "false");
    scriptTag.setAttribute("src", extension.runtime.getURL("page.js"));

    container.insertBefore(scriptTag, container.children[0]);
  } catch (e) {
    throw new Error(
      `Tally: oh nos the content-script failed to initilaize the Tally window provider.
        ${e}
        It's time for a seppuku...🗡`
    );
  }
}



connectProviderBridge();
injectTallyWindowProvider();
