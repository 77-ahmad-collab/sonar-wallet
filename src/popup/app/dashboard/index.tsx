import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/pro-regular-svg-icons";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";

import { setShowGraph, setShowModalWalletNetwork } from "@slices/appSlice";
import {
  ApexChart,
  ExplorerSection,
  FunctionalityNavigators,
  WalletsFilterModal,
} from "components";
import { ButtonDefault, ChartWrapper, NewBottomLayout } from "@styled";
import { useHover } from "hooks";
import { useAppDispatch, useAppSelector } from "store/store";
import { OnClickType } from "interfaces";
import { formatAddress, formatAmount } from "utils/formatters";
import { ChangeBox } from "components";
import { getfilterWalletInfo } from "utils/utils.wallets";
import { APPSCREENS } from "theme/constants";
import { clearAllTokenSelections } from "@slices/newWalletSlice";
import { Tooltip } from "@mui/material";

const Dashboard = () => {
  const { showGraph, totalFilteredSum, isTestnet, graphData } = useAppSelector(
    (state) => state.app
  );
  const { filteredWallets, accounts, allWallets } = useAppSelector(
    (state) => state.newWallet
  );

  const [isCopied, setIsCopied] = useState(false);
  const [hovering, onHoverProps] = useHover();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleCopyBtn = (e: OnClickType) => {
    e.stopPropagation();
    navigator.clipboard.writeText(WalletFilterInfo.address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const renderDashboard = () => {
    return (
      <>
        <div className="c-c-fs tokens-section full-width">
          <FunctionalityNavigators
            onSendClick={() => navigate("/send/selecttoken")}
            onReceiveClick={() =>
              navigate(APPSCREENS.receive, { state: { tokenDetail: false } })
            }
            onSwapClick={() => navigate(APPSCREENS.swap)}
          />
          <ExplorerSection />
        </div>
      </>
    );
  };

  const triggerWalletFilter = (e: OnClickType) => {
    e.stopPropagation();
    dispatch(setShowModalWalletNetwork(true));
  };

  const goToSetting = (e: OnClickType) => {
    e.stopPropagation();
    navigate("/settings");
  };

  const WalletFilterInfo = useMemo(
    () => getfilterWalletInfo(filteredWallets, accounts, allWallets, isTestnet),
    [filteredWallets, accounts, allWallets, isTestnet]
  );

  useEffect(() => {
    dispatch(clearAllTokenSelections());
  }, []);

  return (
    <div className="c-c-c full-height">
      <div
        id="Dashboard-toggleGraph"
        className="c-fs-fs trans-default bezier-in-out dashboard-upper-layout"
        onClick={() => dispatch(setShowGraph(!showGraph))}
      >
        <div className="hud-chart">
          <div className="r-c-fs mgt-sm">
            <ButtonDefault
              id="Dashboard-goToSetting"
              width={40}
              height={40}
              onClick={goToSetting}
            >
              <FontAwesomeIcon
                className="f-dim-100"
                icon={faBars}
                color="white"
                style={{ fontSize: 16 }}
              />
            </ButtonDefault>
            {/* this is wallet filter popup button with info */}
            <div className="r-c-fs">
              <div
                id="Dashboard-triggerWalletFilter"
                onClick={triggerWalletFilter}
                style={{ marginLeft: 15, textAlign: "left", cursor: "pointer" }}
              >
                <div className="f-body-lg f-dim-100">
                  {WalletFilterInfo.text1.length > 12 &&
                  WalletFilterInfo.text1 !== "All Wallets" &&
                  WalletFilterInfo.text1 !== "Multiple Accounts" ? (
                    <Tooltip title={WalletFilterInfo.text1}>
                      <>{WalletFilterInfo.text1.slice(0, 6)}...</>
                    </Tooltip>
                  ) : (
                    <>{WalletFilterInfo.text1} </>
                  )}

                  <FontAwesomeIcon
                    className="f-dim-100"
                    icon={faCaretDown}
                    color="white"
                    style={{ fontSize: 16 }}
                  />
                </div>
                <div className="f-label f-dim-200">
                  {WalletFilterInfo.text2}
                </div>
              </div>
              {WalletFilterInfo.address && (
                <div>
                  <ButtonDefault
                    id="Dashboard-handleCopyBtn"
                    toggled={isCopied}
                    onDarkBack
                    style={{
                      padding: "4px 2px",
                      borderRadius: 7,
                      marginLeft: 15,
                    }}
                    onClick={handleCopyBtn}
                    {...(typeof onHoverProps === "object" ? onHoverProps : {})}
                  >
                    <div
                      className="f-label f-dim-200"
                      style={isCopied ? { opacity: 1, color: "black" } : {}}
                    >
                      {/* {formatAddress(WalletFilterInfo.address)} */}
                      {isCopied
                        ? "copied"
                        : hovering
                        ? "click to copy"
                        : formatAddress(WalletFilterInfo.address)}
                    </div>
                  </ButtonDefault>
                </div>
              )}
            </div>
          </div>
          <ChartWrapper
            className="trans-default bezier-in-out"
            showGraph={showGraph}
          >
            <ApexChart graphData={graphData} />
          </ChartWrapper>
        </div>
        <div
          className="r-c-sb f-title-lg mgt-sm trans-default bezier-in-out"
          style={{
            marginTop: showGraph ? 0 : 15,
            marginBottom: 5,
            width: "100%",
          }}
        >
          <div id="dashboard-totalsum">
            {formatAmount(totalFilteredSum)}
            <span className="f-title-lg f-dim-200"> USD</span>
          </div>
          {showGraph && (
            <div className="r-c-c">
              <ChangeBox />
            </div>
          )}
        </div>
      </div>
      <NewBottomLayout style={{ flex: 1 }}>{renderDashboard()}</NewBottomLayout>
      <WalletsFilterModal />
    </div>
  );
};

export default Dashboard;
