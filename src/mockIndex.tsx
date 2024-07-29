import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import Theme from "./theme/index";

import { store as DevStore } from "store/store";

import { BrowserRouter } from "react-router-dom";
import { FC } from "react";

const devPersistor = persistStore(DevStore);

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