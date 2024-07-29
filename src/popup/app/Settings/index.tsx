import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import {
  faAddressBook,
  faBrush,
  faDollar,
  faFlag,
  faGlobe,
  faLock,
  faMessageQuestion,
  faWallet,
} from "@fortawesome/pro-light-svg-icons";

import { Text } from "@styled";
import {
  CommonLayout,
  DefaultWalletAlertModal,
  NetworkModal,
  RenderListContent,
  SelectAccountModal,
  Switch,
} from "components";
import { APPSCREENS, AUTHSCREENS } from "theme/constants";
import { useCommon } from "hooks";
import { setSelectedNetwork } from "store/ui";
import { useAppDispatch, useAppSelector } from "store/store";
import { filterAccounts } from "utils/utils.wallets";
import { ethLogo } from "assets/images";
import { NETWORKS } from "utils/constants";
import { reloadDapp, setNewDappSelectedAccount } from "utils/utils.dapp";
import { formatAddress } from "utils/formatters";
import { DAPP_SUPPORTED_NETWORKS_SONAR_WALLET } from "background-related/constants";
import { setDAppConnectAddress, setDAppNetwork } from "@slices/dappInfoSlice";
import { setUserLoggedIn } from "@slices/appSlice";

const Settings = () => {
  /* global-state */
  const { accounts } = useAppSelector((state) => state.newWallet);
  const { isTestnet, NETWORKCHAIN } = useAppSelector((state) => state.app);
  const {
    dAppNetwork: currentDappNetwork,
    dAppConnectAddress: currentDappAddress,
  } = useAppSelector((state) => state.dappInfo);

  /* local-state */
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isDefaultWalletModalOpen, setIsDefaultWalletModalOpen] =
    useState(false);

  /* hooks */
  const theme = useTheme();
  const { pathname } = useLocation();
  const { defaultWallet, toggleDefaultWallet, disconnectDapp } = useCommon();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const filteredAccounts = useMemo(() => {
    return filterAccounts({
      excludeAccounts: [],
      chainFamily: [NETWORKS.EVM],
    });
  }, [accounts]);

  /* functions */

  const navigateWalletsAndAccountTab = () =>
    navigate(`${pathname}/${APPSCREENS.manage}`);

  const navigateSecurityAndPrivacyTab = () =>
    navigate(`${pathname}/${APPSCREENS.authentication}`);

  const navigateToAddressBook = () =>
    navigate(`${pathname}/${APPSCREENS.addressBook}`);

  const navigateToConnectedWebsites = () =>
    navigate(`${pathname}/${APPSCREENS.connectedWebsites}`);

  const handleDappSwitchAccount = async (address: string) => {
    await setNewDappSelectedAccount(address);
    dispatch(setDAppConnectAddress(address));
    setIsAccountModalOpen(false);
    // reloadDapp();
  };

  /* constants */

  const walletsButton = [
    {
      text: "Wallets & Accounts",
      onClick: navigateWalletsAndAccountTab,
      leftSideElement: (
        <FontAwesomeIcon icon={faWallet} className="listItemIcon f-body-lg" />
      ),
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      disabled: false,
    },
    {
      text: "Security & Privacy",
      onClick: navigateSecurityAndPrivacyTab,
      leftSideElement: (
        <FontAwesomeIcon icon={faLock} className="listItemIcon f-body-lg" />
      ),
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      disabled: false,
    },
    {
      text: "Address Book",
      onClick: () => navigateToAddressBook(),
      leftSideElement: (
        <FontAwesomeIcon
          icon={faAddressBook}
          className="listItemIcon f-body-lg"
        />
      ),
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      disabled: false,
    },
    {
      text: "Connected websites",
      onClick: navigateToConnectedWebsites,
      leftSideElement: (
        <FontAwesomeIcon icon={faGlobe} className="listItemIcon f-body-lg" />
      ),
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      disabled: true,
    },
    {
      text: "Help",
      onClick: () => {},
      leftSideElement: (
        <FontAwesomeIcon
          icon={faMessageQuestion}
          className="listItemIcon f-body-lg"
        />
      ),
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
          className="f-body-lg"
        />
      ),
      disabled: true,
    },
  ];

  const preferencesList = [
    {
      text: "Base Currency",
      onClick: () => {},
      leftSideElement: (
        <FontAwesomeIcon icon={faDollar} className="listItemIcon f-body-lg" />
      ),
      rightSideElement: (
        <Text
          className="f-label"
          weight={500}
          customColor={theme.palette.text.secondary}
        >
          USD
        </Text>
      ),
      disabled: true,
    },
    {
      text: "Language",
      onClick: () => {},
      leftSideElement: (
        <FontAwesomeIcon icon={faFlag} className="listItemIcon f-body-lg" />
      ),
      rightSideElement: (
        <Text
          className="f-label"
          weight={500}
          customColor={theme.palette.text.secondary}
        >
          English
        </Text>
      ),
      disabled: true,
    },
    {
      text: "Theme",
      onClick: () => {},
      leftSideElement: (
        <FontAwesomeIcon icon={faBrush} className="listItemIcon f-body-lg" />
      ),
      rightSideElement: (
        <Text
          className="f-label"
          weight={500}
          customColor={theme.palette.text.secondary}
        >
          Default
        </Text>
      ),
      disabled: true,
    },
    {
      text: "Hide Quick Add Token in Main List",
      onClick: () => {},
      leftSideElement: <></>,
      rightSideElement: (
        <Switch checked={false} handleSwitchChange={() => {}} />
      ),
      disabled: true,
    },
    {
      text: "Use Sonar Wallet as your default wallet",
      onClick: () => {},
      leftSideElement: <></>,
      rightSideElement: (
        <Switch
          checked={defaultWallet}
          handleSwitchChange={() => setIsDefaultWalletModalOpen(true)}
        />
      ),
      disabled: false,
    },
    {
      text: "Switch Dapp Account",
      onClick: () => setIsAccountModalOpen(true),
      leftSideElement: <></>,
      rightSideElement: (
        <>
          <Text>
            {currentDappAddress ? formatAddress(currentDappAddress) : ""}
          </Text>
        </>
      ),
    },
    {
      text: "Switch Dapp Network",
      onClick: () => setIsSwitchModalOpen(true),
      leftSideElement: <></>,
      rightSideElement: (
        <>
          <Text>{NETWORKCHAIN[Number(currentDappNetwork)]?.NAME ?? ""}</Text>
        </>
      ),
    },
    {
      text: "Disconnect Wallet",
      onClick: () => disconnectDapp(currentDappAddress),
      leftSideElement: <></>,
      rightSideElement: <></>,
    },
    {
      text: "Lock",
      onClick: () => {
        dispatch(setUserLoggedIn(false));
        navigate(AUTHSCREENS.auth);
      },
      leftSideElement: <></>,
      rightSideElement: <></>,
    },
    // {
    //   text: "Reset Local Node",
    //   onClick: () => {
    //     axios
    //       .post("https://dev-wallet.sonar.studio/rpc/reset?network=bsc")
    //       .then(function (response) {
    //         console.log(response);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    //   },
    //   leftSideElement: <></>,
    //   rightSideElement: <></>,
    // },
  ];

  const handleChangeDappNetwork = async (chainId: number) => {
    await dispatch(
      setSelectedNetwork({
        network: DAPP_SUPPORTED_NETWORKS_SONAR_WALLET[chainId],
        address: currentDappAddress,
      })
    );
    dispatch(setDAppNetwork(chainId.toString()));
    setIsSwitchModalOpen(false);
    reloadDapp();
  };
  return (
    <CommonLayout
      onTopImageClick={() => navigate(APPSCREENS.dashboard)}
      title="Settings"
    >
      <div className="full-width">
        <RenderListContent List={walletsButton} />
        <Text size={14} dim weight={400} className="preferencesListTitle">
          Preferences
        </Text>
        <RenderListContent List={preferencesList} />
      </div>
      <DefaultWalletAlertModal
        open={isDefaultWalletModalOpen}
        onClose={() => setIsDefaultWalletModalOpen(false)}
        heading={"Note"}
        body={`${
          defaultWallet ? "Wallet will be disconnected from dapp, and" : ""
        } Your extension will be closed.`}
        handler={toggleDefaultWallet}
      />
      <SelectAccountModal
        open={isAccountModalOpen}
        handleClose={() => setIsAccountModalOpen(false)}
        image={ethLogo}
        accountsList={filteredAccounts}
        onAddressSelect={handleDappSwitchAccount}
        selectedAddress={`${currentDappAddress}`}
      />

      <NetworkModal
        isOpen={isSwitchModalOpen}
        handleClose={() => setIsSwitchModalOpen(false)}
        onNetworkClick={(chainId) => handleChangeDappNetwork(chainId)}
        showAllChains={true}
        isTestnet={isTestnet}
        disabledChainIds={[101, 103, 102, 338]}
        currentNetwork={currentDappNetwork}
      />
    </CommonLayout>
  );
};

export default Settings;
