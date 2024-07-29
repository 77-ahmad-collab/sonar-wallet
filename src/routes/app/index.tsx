import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router";

import {
  AccountInfo,
  AddressBook,
  Authentication,
  ConfirmSend,
  Dashboard,
  EditList,
  Import,
  ManageWallets,
  ReceiveToken,
  SelectAddress,
  SelectToken,
  Settings,
  Swap,
  TokenDetail,
  WalletInfo,
  WalletList,
} from "popup/app";
import { withRouter } from "hoc/withRouter";
import { APPSCREENS } from "theme/constants";
import { Seedphrase } from "popup/auth";
import {
  AlertModal,
  SnackBar,
  TransactionFailModal,
  TransactionLoader,
} from "components";
import { RainbowGlobal } from "assets/images";
import { useAppSelector } from "store/store";
import { useMemo } from "react";
import ConnectedWebsites from "popup/app/Settings/ConnectedWebsites";

const AppFlowRoutes = () => {
  const { pathname } = useLocation();

  const { pendingTransactionLoaderStatus, showGraph } = useAppSelector(
    (state) => state.app
  );

  const rainbowBackTopPosition = useMemo(
    () => (showGraph ? 0 : -120),
    [showGraph]
  );

  return (
    <div style={{ width: 380 }}>
      <div
        className="trans-default bezier-in-out"
        style={{
          position: "absolute",
          top: rainbowBackTopPosition,
          zIndex: -5,
          opacity: pathname.includes(APPSCREENS.dapp) ? 0 : 1,
        }}
      >
        <img
          src={RainbowGlobal}
          style={{
            width: 380,
          }}
        />
      </div>
      {pendingTransactionLoaderStatus && <TransactionLoader />}
      <Routes>
        {/* DASHBOARD */}
        <Route path={APPSCREENS.dashboard} element={<Dashboard />} />
        {/* SETTINGS */}
        <Route path={APPSCREENS.settings}>
          <Route path="" element={<Settings />} />
          <Route path={APPSCREENS.addressBook} element={<AddressBook />} />
          <Route path={APPSCREENS.manage}>
            <Route path="" element={<ManageWallets />} />
            <Route
              path={APPSCREENS.importWallet}
              element={<Import accountImport={false} />}
            />
            <Route path={APPSCREENS.wallets}>
              <Route path="" element={<WalletList />} />
              <Route path={APPSCREENS.info}>
                <Route path="" element={<WalletInfo />} />
                <Route
                  path={APPSCREENS.importAccount}
                  element={<Import accountImport={true} />}
                />
                <Route
                  path={APPSCREENS.accountInfo}
                  element={<AccountInfo />}
                />
              </Route>
            </Route>
          </Route>
          <Route
            path={APPSCREENS.authentication}
            element={<Authentication />}
          />
          <Route
            path={APPSCREENS.connectedWebsites}
            element={<ConnectedWebsites />}
          />
        </Route>
        {/* RECEIVE */}
        <Route path={APPSCREENS.receive} element={<ReceiveToken />} />
        {/* SEND */}
        <Route path={APPSCREENS.send}>
          <Route path="" element={<Navigate to="selecttoken" />} />
          <Route path="selecttoken" element={<SelectToken />} />
          <Route path="selectaddress" element={<SelectAddress />} />
          <Route path="confirm" element={<ConfirmSend />} />
        </Route>
        {/* SWAP */}
        <Route path={APPSCREENS.swap} element={<Swap />} />
        {/* SEEDPHRASE */}
        <Route path={APPSCREENS.seedphrase} element={<Seedphrase />} />
        {/* EDIT LIST */}
        <Route path={APPSCREENS.editList} element={<EditList />} />
        {/* TOKEN DETAIL */}
        <Route path={APPSCREENS.tokenDetail} element={<TokenDetail />} />
        <Route
          path="*"
          element={<Navigate to={APPSCREENS.dashboard} replace />}
        />

        {/* <Route path="*" element={<Dashboard />} /> */}
      </Routes>
      <TransactionFailModal />
      <AlertModal />
      <SnackBar />
    </div>
  );
};

export default withRouter(AppFlowRoutes);
