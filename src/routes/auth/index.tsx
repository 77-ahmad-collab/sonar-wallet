import { Route, Routes } from "react-router-dom";

import { APPSCREENS, AUTHSCREENS } from "theme/constants";
import { withRouter } from "hoc/withRouter";
import {
  AuthScreen,
  DefaultWalletPage,
  Disclaimer,
  ImportWalletPage,
} from "popup/auth";
import Seedphrase from "popup/auth/SeedPhrase";
import { SelectAction } from "components";
import { useAppSelector } from "store/store";

const AuthFlowRoutes = () => {
  const { isUserExists } = useAppSelector((state) => state.app);

  return (
    <div style={{ width: 380 }}>
      <Routes>
        <Route
          path={AUTHSCREENS.landing}
          element={isUserExists ? <AuthScreen /> : <Disclaimer />}
        />
        <Route path={AUTHSCREENS.auth} element={<AuthScreen />} />
        <Route path={AUTHSCREENS.seedphrase} element={<Seedphrase />} />
        <Route path={APPSCREENS.near} element={<AuthScreen />} />
        <Route path={AUTHSCREENS.selectAction} element={<SelectAction />} />
        <Route
          path={AUTHSCREENS.selectDefaultWallet}
          element={<DefaultWalletPage />}
        />
        <Route path={AUTHSCREENS.ImportWallet} element={<ImportWalletPage />} />
      </Routes>
    </div>
  );
};

export default withRouter(AuthFlowRoutes);
