import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import { APPSCREENS } from "theme/constants";
import {
  Approve,
  DappChangeNetwork,
  DappConnect,
  DappSignTransaction,
  DappTransaction,
  InvalidNetwork,
  NoWallet,
} from "popup/app";
import { useAppDispatch, useAppSelector } from "store/store";
import { AuthScreen } from "popup/auth";
import { setIsDappRoutes } from "@slices/appSlice";

const DappRoutes = ({ dappRoute }: { dappRoute: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, isUserExists } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (isLoggedIn || !isUserExists) {
      navigate(dappRoute);
    } else {
      navigate("/dapp/login");
    }
    dispatch(setIsDappRoutes(true));
  }, [isLoggedIn]);

  return (
    <div style={{ width: 380 }}>
      <Routes>
        {/* DAPP */}
        <Route path={APPSCREENS.dapp}>
          <Route path={APPSCREENS.connect} element={<DappConnect />} />
          <Route path={APPSCREENS.login} element={<AuthScreen />} />
          <Route
            path={APPSCREENS.changeNetwork}
            element={<DappChangeNetwork />}
          />
          <Route path={APPSCREENS.tx} element={<DappTransaction />} />
          <Route path={APPSCREENS.signTx} element={<DappSignTransaction />} />
          <Route path={APPSCREENS.approve} element={<Approve />} />
          <Route path={APPSCREENS.noWallet} element={<NoWallet />} />
          <Route
            path={APPSCREENS.invalidNetwork}
            element={<InvalidNetwork />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default DappRoutes;
