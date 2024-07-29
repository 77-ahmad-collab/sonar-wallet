import { useState } from "react";
import { useNavigate } from "react-router";
import { faSlidersSimple } from "@fortawesome/pro-regular-svg-icons";

import { ButtonWithIcon, TokenslistWithMessage } from "components";
import SwitchTabs from "./SwitchTabs";
import TabPanel from "./TabPanel";
import TxHistory from "./TxHistory";
import Nfts from "./Nfts";
import { useAppDispatch, useAppSelector } from "store/store";
import { APPSCREENS } from "theme/constants";
import {  setTokenSelected } from "@slices/newWalletSlice";
import { dispatchSwapTokenA } from "utils/utils.swap";
import { TabsWrapper } from "@styled";
import { TokenSelected } from "interfaces";

const transactionsContainerTabList = ["Tokens", "NFTs", "Activity"];

const ExplorerSection = () => {
  const dispatch = useAppDispatch();

  const {
    filteredHoldings,
    numOfTokens: { inActive, total },
  } = useAppSelector((state) => state.newWallet);

  const [transactionsContainerActiveTab, setTransactionsContainerActiveTab] =
    useState("Tokens");

  const navigate = useNavigate();

  const onTokenSelection = async (tokenSelected: TokenSelected) => {
    await dispatch(setTokenSelected(tokenSelected));
    await dispatchSwapTokenA(tokenSelected);
    navigate(APPSCREENS.tokenDetail);
  };

  return (
    <>
      <TabsWrapper>
        <TabPanel
          value={transactionsContainerTabList.indexOf(
            transactionsContainerActiveTab
          )}
          index={0}
        >
          <TokenslistWithMessage
            onTokenSelect={onTokenSelection}
            customHolding={filteredHoldings}
            showAllHoldings
            style={{ height: "unset" }}
          />
        </TabPanel>
        <TabPanel
          value={transactionsContainerTabList.indexOf(
            transactionsContainerActiveTab
          )}
          index={1}
        >
          <Nfts style={{ height: "unset", padding: "10px 20px" }} />
        </TabPanel>
        <TabPanel
          value={transactionsContainerTabList.indexOf(
            transactionsContainerActiveTab
          )}
          index={2}
        >
          <TxHistory height={"unset"} address={""} />
        </TabPanel>
      </TabsWrapper>
      <div className="r-c-sb switch-tabs-wrapper bezier-in-out ">
        <SwitchTabs
          tabs={transactionsContainerTabList}
          activeTab={transactionsContainerActiveTab}
          setActiveTab={setTransactionsContainerActiveTab}
        />
        <ButtonWithIcon
          id="ExplorerSection-navigateEditlist"
          icon={faSlidersSimple}
          text=""
          onClick={() => {
            navigate(APPSCREENS.editList);
          }}
          lightMode
          iconColor="rgba(0,0,0,0.4)"
          style={{ padding: "0px 8px", height: 35 }}
        />
      </div>
    </>
  );
};

export default ExplorerSection;
