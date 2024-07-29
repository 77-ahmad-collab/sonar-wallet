import { Button, useTheme } from "@mui/material";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faGlobe } from "@fortawesome/pro-light-svg-icons";
import { faCircleXmark } from "@fortawesome/pro-solid-svg-icons";

import { useAppDispatch, useAppSelector } from "store/store";
import {
  ModalParentBoxStyled,
  SpanOpacityStyled,
  TestnetSwitchButton,
  Text,
} from "@styled";
import { BasicModal } from "components";
import WalletAccordian from "./WalletAccordian";
import {
  setShowModalWalletNetwork,
  setSnackBarClose,
  setSnackBarOpen,
  switchNetwork,
} from "@slices/appSlice";
import { setAccountsSelected } from "@slices/newWalletSlice";
import { useTxActivity } from "hooks";
import { TX_TYPES } from "utils/constants";
import { FilteredAccounts } from "interfaces";

const WalletsFilterModal = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { isTestnet, showModalWalletNetwork, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );
  const { accounts, filteredAccounts } = useAppSelector(
    (state) => state.newWallet
  );

  const { allPendingTransactions } = useTxActivity();

  const updateSnackBarStates = () => {
    const testnetPendingTransactions = allPendingTransactions.filter(
      (item) => NETWORKCHAIN[item.chainId].isTestnet
    );
    const mainnetPendingTransactions = allPendingTransactions.filter(
      (item) => !NETWORKCHAIN[item.chainId].isTestnet
    );

    if (allPendingTransactions.length > 0) {
      if (isTestnet && mainnetPendingTransactions.length > 0) {
        //switching from testnet to mainet
        //open snackbar
        dispatch(
          setSnackBarOpen({ txType: mainnetPendingTransactions[0].txType })
        );
      } else if (!isTestnet && testnetPendingTransactions.length > 0) {
        dispatch(
          setSnackBarOpen({ txType: testnetPendingTransactions[0].txType })
        );
        //switch from mainnet to testnet
        //open snackbar
      } else {
        dispatch(setSnackBarClose({ txType: TX_TYPES.Sent }));
        dispatch(setSnackBarClose({ txType: TX_TYPES.Swap }));
      }
    }
  };

  const handleSwitchNetwork = () => {
    updateSnackBarStates();
    dispatch(switchNetwork(!isTestnet));
    handleClose();
  };

  const handleClose = () => {
    dispatch(setShowModalWalletNetwork(false));
  };

  const handleResetWallets = () => {
    const rawAccounts = Object.keys(accounts);
    const newAccounts = rawAccounts.map((account) => {
      return {
        address: account,
        value: true,
      };
    });

    dispatch(setAccountsSelected(newAccounts));
  };

  const checker = (obj: FilteredAccounts) =>
    Object.keys(obj).every((v) => filteredAccounts[v].isSelected === true);

  return (
    <BasicModal open={showModalWalletNetwork} handleClose={handleClose}>
      <ModalParentBoxStyled width="90%" height="94%">
        <div className="network-selector-close-btn">
          <FontAwesomeIcon
            id="WalletsFilterModal-handleClose"
            icon={faCircleXmark}
            onClick={handleClose}
            className="network-selector-close-svg"
            style={{ color: theme.palette.background.paper, opacity: 0.4 }}
            fontSize={18}
          />

          <Text size={17} weight={400}>
            <SpanOpacityStyled opacity={0.3}> Showing </SpanOpacityStyled> All
            Wallets
          </Text>
          <Button
            id="WalletsFilterModal-handleResetWallets"
            style={{
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "10px",
              marginLeft: "auto",
              height: "30px",
              padding: "7px 10px",
              fontSize: "14px",
              fontFamily: "PPMori",
              fontWeight: 400,
              opacity: checker(filteredAccounts) ? "0.5" : "1",
            }}
            className="f-body"
            variant="contained"
            startIcon={
              <DoNotDisturbIcon style={{ color: "#FF375E" }} fontSize="small" />
            }
            onClick={handleResetWallets}
            disabled={checker(filteredAccounts)}
          >
            Reset
          </Button>
        </div>
        <div className="network-selectorBody">
          <WalletAccordian />
        </div>
        <TestnetSwitchButton
          id="WalletsFilterModal-handleSwitchNetwork"
          onClick={handleSwitchNetwork}
          isTestnet={isTestnet}
          className="f-body"
        >
          <FontAwesomeIcon
            icon={isTestnet ? faGlobe : faBug}
            fontSize={18}
            opacity={isTestnet ? 1 : 0.6}
            className="mgr-xs"
          />
          {isTestnet ? "Back to MainNet" : "Switch to TestNets"}
        </TestnetSwitchButton>
      </ModalParentBoxStyled>
    </BasicModal>
  );
};

export default WalletsFilterModal;
