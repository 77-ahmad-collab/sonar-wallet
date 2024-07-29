import { FC, memo, useCallback, useMemo } from "react";
import { faLink } from "@fortawesome/pro-light-svg-icons";
import { useLocation } from "react-router";

import { BottomBasicModal, ButtonWithIcon, ImageContent } from "components";
import { DefaultButton, Text } from "@styled";
import {
  CHAIN_CATEGORIES,
  DUMMY_IMAGE_URL,
  MAINNET_CHAINS,
  TESTNET_CHAINS,
} from "utils/constants";
import { NetworkModalProps as PROPS, networkInfoType } from "interfaces";
import { useAppSelector } from "store/store";
import { formatAmount } from "utils/formatters";
import { APPSCREENS } from "theme/constants";

const NetworkModal: FC<PROPS> = ({
  handleClose,
  isOpen,
  onNetworkClick,
  currentNetwork,
  showAllChains = false,
  isTestnet = false,
  disabledChainIds = [],
}) => {
  /* global-state */

  const { pathname } = useLocation();
  // console.log("renderNetworks changing", chainsType, currentNetwork);

  const isDappRoute = useMemo(
    () => pathname.includes(APPSCREENS.dapp),
    [pathname]
  );

  const filterOnlyEnable = (thisChains: {
    [chaind: number]: networkInfoType;
  }) => {
    disabledChainIds.forEach((disabledId) => {
      if (thisChains[disabledId]) {
        delete thisChains[disabledId];
      }
    });
    return thisChains;
  };

  const chainsType = useMemo(() => {
    return showAllChains
      ? isTestnet
        ? filterOnlyEnable({ ...TESTNET_CHAINS })
        : filterOnlyEnable({ ...MAINNET_CHAINS })
      : CHAIN_CATEGORIES;
  }, [showAllChains, isTestnet]);

  /* functions */
  const handleNetworkSelection = (chainId: number) => {
    onNetworkClick(chainId);
  };

  const renderNetworks = useCallback(() => {
    return Object.values(chainsType).map((network, index) => {
      // network.chain !== NETWORKS.NEAR && (
      // network.chain !== NETWORKS.NEAR_TESTNET &&
      return (
        <NetworkListItem
          key={index}
          chainId={network.CHAIN_ID}
          onChainSelect={handleNetworkSelection}
          selectedNetwork={`${currentNetwork}`}
        />
      );
    });
  }, [chainsType, currentNetwork]);

  /* effects */

  /* constants */

  return (
    <BottomBasicModal open={isOpen} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs">
          <ButtonWithIcon
            icon={faLink}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm" style={{ color: "black" }} weight={500}>
            {isDappRoute ? "Connect to Network" : "Select Network"}
          </Text>
        </div>
        {isDappRoute && (
          <Text className="f-body-md mgt-md" style={{ color: "black" }}>
            Select the chain you want to connect to
          </Text>
        )}
        <div style={{ maxHeight: 300, overflowY: "scroll", marginTop: "20px" }}>
          {renderNetworks()}
        </div>
      </>
    </BottomBasicModal>
  );
};

const NetworkListItem = ({
  chainId,
  onChainSelect,
  selectedNetwork,
}: {
  chainId: number;
  onChainSelect: (chainId: number) => void;
  selectedNetwork: string;
}) => {
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);
  const { secondaryHoldings } = useAppSelector((state) => state.newWallet);
  return (
    <DefaultButton
      id={`NetworkList-${chainId}`}
      style={{
        height: "unset",
        width: "100%",
        padding: "10px 10px",
        marginBottom: 10,
        border:
          Number(selectedNetwork) === chainId ? "2px solid black" : "none",
      }}
      lightMode
      contained={false}
      onClick={() => onChainSelect(chainId)}
    >
      <div className="r-c-fs" style={{ flex: 1 }}>
        <ImageContent
          src={NETWORKCHAIN[chainId]?.LOGO ?? DUMMY_IMAGE_URL}
          Size={{
            width: "30px",
            height: "30px",
            marginRight: "10px",
            borderRadius: "50%",
          }}
        />
        <Text className="f-body-lg mgr-sm" style={{ color: "black" }}>
          {NETWORKCHAIN[chainId]?.NAME ?? "Ethereum"}
        </Text>
      </div>
      <Text style={{ color: "black" }}>
        {formatAmount(secondaryHoldings[chainId].balanceInUsd)} USD
      </Text>
    </DefaultButton>
  );
};

export default memo(NetworkModal);
