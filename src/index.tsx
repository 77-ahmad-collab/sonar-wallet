import { createRoot } from "react-dom/client";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import Theme from "./theme/index";

import { store as DevStore } from "store/store";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { FC } from "react";

//------- For production -------
// import { prodStore } from "store/store";
// import(/* webpackPreload: true */ "assets/fonts/PPMori-Variable.woff2");
// import(/* webpackPreload: true */ "./index.css");
// if (process.env.NODE_ENV !== "development") {
//   console.log = function () {};
// console.log = console.warn = console.error = () => {};
// }

//------- For development  -------
import "./index.css";

const container = document.getElementById("root") as Element;
const devPersistor = persistStore(DevStore);

const isDevelopment = process.env.NODE_ENV === "development";
const isWebProduction = process.env.web === "true";

const renderAppOnWeb = () =>
  createRoot(container).render(
    <Provider store={DevStore}>
      <PersistGate loading={null} persistor={devPersistor}>
        <App />
      </PersistGate>
    </Provider>
  );

try {
  if (isDevelopment) {
    renderAppOnWeb();
  } else if (isWebProduction) {
    const checkPassword = prompt("Enter password");
    if (checkPassword === "$underDEVELOPMENT#56**") {
      renderAppOnWeb();
    } else {
      alert("wrong password!");
    }
  } else {
    // prodStore.ready().then(() => {
    //   createRoot(container).render(
    //     <Provider store={prodStore}>
    //       <App />
    //     </Provider>
    //   );
    // });
  }
} catch (e) {
  console.log("eeeeeeeeee=", e);
}

export const MockApp: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <Provider store={DevStore}>
      <PersistGate loading={null} persistor={devPersistor}>
        <Theme>
          <BrowserRouter>{children}</BrowserRouter>
        </Theme>
      </PersistGate>
    </Provider>
  );
};
