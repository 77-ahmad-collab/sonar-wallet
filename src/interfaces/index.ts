import React, {
  CSSProperties,
  ElementType,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import { Transition } from "framer-motion";
import { Chain, CustomChain } from "@ethereumjs/common";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { Location as ReactLocation } from "react-router-dom";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { RootState as ThisRootState } from "store/reducers";

import {
  ACTIVITY_STATUS_TYPES,
  CHAIN_CATEGORIES,
  DUMMY_IMAGE_URL,
  NETWORKS,
  SWAP_EXPIRATION_TIME,
  TX_TYPES,
  Tx_METHODS,
} from "utils/constants";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PaletteMode } from "@mui/material";
import { Transaction } from "@ref-finance/ref-sdk";
import {
  ExpectedSigningData,
  SignDataMessageType,
  SignTypedDataRequest,
} from "background-related/utils/signing";
import { PermissionRequest } from "provider-bridge-shared";
import { ethers } from "ethers";

export type RootState = ThisRootState;

export interface Inet {
  value: string;
  name: string;
}
export interface Ibalance {
  actualAmount: number;
  amountInUsd: number;
}

export type OnClickType = React.MouseEvent<HTMLDivElement, MouseEvent>;
export type OnButtonClickType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type ExtraTypographyProps = {
  component: ElementType;
};

export type ExtraSelectProps = {
  IconComponent: ElementType;
};

export interface materialBtnProps {
  typo: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface OutLineCardsProps {
  isSeedPhrase?: number;
  heading: string;
  noMargin?: number;
}

export interface dataInterface {
  data: number[];
}
export interface categoryInterface {
  daycategory: number[];
  weekcategory: number[];
  monthcategory: number[];
}
export interface CardCompProps {
  heading: string;
}

export interface CustomTokenObj {
  name: string;
  balance: string;
  balanceInUSD: string;
}

export interface LandingBoxProps {
  image: string;
  heading: string;
  para: string;
  btn: string;
}

export interface BootstrapDialogTitleProps {
  children: string;
  onClose: (...args: any[]) => any;
  id: string;
}

export interface ModalBtnProps {
  onClick: () => void;
}

export interface ToaccountModalbtnProps {
  text: string;
  onClick: () => void;
}

export type RainbowBoxProps = {
  borderwidth?: string;
  borderradius?: string;
  visible?: boolean;
  renderShadow?: boolean;
  shadow?: boolean;
  children: React.ReactNode;
};

export interface dataInterface {
  day: number[];
  week: number[];
  month: number[];
}
export interface categoryInterface {
  daycategory: number[];
  weekcategory: number[];
  monthcategory: number[];
}

export type SwitchTabProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export type isActive = {
  active: boolean;
};

export type AnimateAlternate = {
  firstText: string;
  secondText: string;
  interval?: number;
  style?: React.CSSProperties;
  transition?: Transition;
};

export type SettingsStep1Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export type AnimatePasswordStep = {
  order: number;
  currentStep: number;
  children: React.ReactNode;
};

type ContentArray = {
  content: React.ReactNode;
};

export type AnimationGroupContent = {
  content: ContentArray[];
  currentStep: number;
  height?: number;
};

export type UnstyledModalProps = {
  children: React.ReactElement;
  open: boolean;
  top?: number;
  hideBackDrop?: boolean;
  handleClose: HandleCLose;
  gradient?: boolean;
};

export type SeedPhraseAlertProps = {
  handleOnSave?: () => void;
  open: boolean;
};

export type ShuffledMnemonicProps = {
  shuffledMnemonic: string[];
  seedPhraseIndex: number[];
  confirmSeedPhrase: (value: string, index: number) => void;
  onBackPress: () => void;
};

export type GoNextProps = {
  handleSeedPhrase: () => void;
};

export type AccordianRow = {
  selected?: boolean;
  logo?: string;
  text: string;
  isLast?: boolean;
  isHeading?: boolean;
  onClick?: () => void;
  copy?: boolean;
  setCopied?: React.Dispatch<React.SetStateAction<boolean>>;
  address?: string;
  isChecked?: boolean;
  iscopied: boolean;
  setCurrentAccountIndex?: React.Dispatch<
    React.SetStateAction<{
      walletIndex: number;
      accountIndex: number;
    }>
  >;
  index: number;
  walletIndex?: number;
  setCopyIndex?: React.Dispatch<
    React.SetStateAction<{
      walletIndex: number;
      accountIndex: number;
    }>
  >;
};

export type Input = {
  children: React.ReactElement[] | React.ReactElement;
  currentStep: number;
  stepNumber: number;
  icon?: IconDefinition;
  inputStyle?: React.CSSProperties;
  showCaret?: boolean;
  password?: string;
  setAlert?: React.Dispatch<
    React.SetStateAction<{
      message: string;
      status: boolean;
    }>
  >;
  allCorrect?: boolean;
  id?: string;
};

export type Switch = {
  checked: boolean;
  handleSwitchChange?: () => void;
  isEditlist?: boolean;
  tokenIndex?: number;
  chainIndex?: number;
};
export type TopLayoutProps = {
  text: string;
  TopImage?: string;
  onTopImageClick: () => void;
  children?: ReactNode;
};

// export type TokenInfo = {
//   tokenName: string;
//   usdAmount: number;
//   tokenSymbol?: string;
//   tokenAmount: number;
//   tokenDecimal?: number;
//   tokenAddress?: string;
//   tokenNetwork?: number;
//   image: string;
//   isActive: boolean;
//   id: string;
//   chainId: number;
// };
export type SetTokenDetail = React.Dispatch<
  React.SetStateAction<{
    open: boolean;
    name: string;
    price: number;
    priceChange: number;
    time: string;
    address: string;
    chain: number;
    accountAddress: string;
  }>
>;
export type SetActiveToken = React.Dispatch<
  React.SetStateAction<{
    chainId: number;
    index: number;
  }>
>;
export type AccordionProps = {
  symbolSrc?: string;
  isSwap?: boolean;
  isShow?: boolean;
  isDashboard?: boolean;
  handleAccordionClick: () => void;
  handleClose?: HandleCLose;
  tokenInfo: TokenInfo;
  setTokenDetail?: SetTokenDetail;
  chainName: string;
  value?: number;
  onClick?: () => void;
  accordionRows: {
    [key: string]: {
      amount: number;
      amountInUsd: number;
    };
  };
  active?: boolean;
  chainId?: number;
  setCurrentStep?: SetStateNumberType;
  setToken?: SetToken["token"];
  setFromToken?: SetStateNumberType;
  setActiveToken?: SetActiveToken;
  isEditlist?: boolean;
  isAddCustomTokenModal?: boolean;
};
export type TokenValuesProps = {
  tokenName?: string;
  usdAmount: number;
  tokenAmount: number;
  tokenSymbol?: string;
};
export type AccordionRowProps = {
  value: string;
  tokenInfo: TokenInfo;
  isLast: boolean;
  isDashboard?: boolean;
  address: string;
  isSwap?: boolean;
  setCurrentStep?: SetStateNumberType;
  setToken?: SetToken["token"];
  handleClose?: HandleCLose;
  setFromToken?: SetStateNumberType;
  isShow?: boolean;
  setTokenDetail?: SetTokenDetail;
};
export interface TokensHistory {
  tokensHistory: any[] | SingleEthHistory[];
}

export type SendStep1Props = {
  setCurrentStep: SetStateNumberType;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  holdings?: SecondaryHoldings;
  tokenAddress?: string;
  handleClose?: HandleCLose;
  isShow?: boolean;
  setFromToken?: SetStateNumberType;
  searchStyle?: React.CSSProperties;
  isEditlist?: boolean;
};

export type SendStep2Props = {
  setCurrentStep: SetStateNumberType;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  holdings?: SecondaryHoldings;
  tokenAddress?: string;
  handleClose?: HandleCLose;
  isShow?: boolean;
  setFromToken?: SetStateNumberType;
  searchStyle?: React.CSSProperties;
  isEditlist?: boolean;
};

export type GenericBoxContent = {
  title: string;
  address?: string;
  isAddress: boolean;
  imageSrc: IconProp;
  customColor?: string;
  timeStamp?: number;
  walletName?: string;
};

export type SearchBarProps = {
  placeholder: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  StartAdornment?: React.ReactElement;
  EndAdornment?: React.ReactElement;
  containerStyle?: React.CSSProperties;
  customPadding?: number;
  disable?: boolean;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  lightMode?: boolean;
  autoFocus?: boolean;
};

export type ButtonBoxProps = {
  title: string;
  customColor: string;
  marginTop?: number;
  customStyle?: React.CSSProperties;
  handleClick?: () => void;
  textColor?: string;
  isPulsate?: boolean;
  isDisabled?: boolean;
};
export type AddressInsertionProps = {
  open: boolean;
  handleClose: HandleCLose;
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  walletAddress: string;
  isEdit?: boolean;
  addressInfo?: {
    name: string;
    note: string;
    chainFamily: string;
    address: string;
    ens?: string;
  };
  onAddressSelect: (address: string) => void;
  ens?: string;
};
export type selectWalletModal = {
  open: boolean;

  handleClose: HandleCLose;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  walletList?: string[];
};
export type StartAdornmentProps = {
  Icon: IconProp;
  iconColor?: CSSProperties["color"];
  iconSize?: number;
};
export type PanelBoxProps = {
  title: string;
  value: string;
  borderStyle?: React.CSSProperties;
  Icon: JSX.Element | undefined;
  customColor?: string;
  setStep?: SetStateNumberType;
};
export type TokenSelectionProps = {
  customStyle?: React.CSSProperties;
  customColor?: string;
  isStep4?: boolean;
  setStep?: SetStateNumberType;
  recieverAddress: string;
};

export type GasModalProps = {
  open: boolean;
  handleClose: HandleCLose;
  showSlippage: boolean;
  chainFamily: string;
  // gasPrice: GasPrice;
  // hideSlippage: boolean;
  // gasOptionIndex: number;
  // setGasOptionIndex: SetStateNumberType;
  // slippageOptionIndex: number;
  // setSlippageOptionIndex: SetStateNumberType;
  // setGasPrice?: SetStateNumberType;
  // handleClick?: () => Promise<void>;
};

export type ModalProps = {
  open: boolean;
  handleClose: HandleCLose;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  tokenAddress?: string;
  holdings: SecondaryHoldings;
  isShow?: boolean;
  setFromToken?: SetStateNumberType;
  TitleComponent?: TitleComponentProps;
  top?: number;
  Title: JSX.Element;
  onTokenSelect: (TokenSelected: TokenSelected) => void;
  showZeroHoldings: boolean;
};

export type OptionBoxProps = {
  children: React.ReactElement;
  active: boolean;
  handleOption: (index: number) => void;
  index?: number;
  value?: string;
};
export type SelectionBoxProps = {
  OptionList: {
    title: string;
    isIcon: boolean;
    value?: string;
    time?: number;
    valueInGwei?: number;
  }[];
  handleOption: (index: number) => void;

  optionIndex: number;

  height: number;
};
export type AdvanceOptionStepProps = {
  setStep: SetStateNumberType;
  handleClose: HandleCLose;
  showSlippage: boolean;
  chainFamily: string;
  // gasPrice: GasPrice;
  // hideSlippage?: boolean;
  // gasOptionIndex: number;
  // setGasOptionIndex: SetStateNumberType;
  // slippageOptionIndex: number;
  // setSlippageOptionIndex: SetStateNumberType;
};
export type SaveAndResetProps = {
  onSave: () => void;
  onReset: () => void;
};

export type GasPrice = {
  safeLow: number;
  average: number;
  fast: number;
  avgWait: number;
  fastWait: number;
  safeLowWait: number;
};
export type CustomAmountComponentProps = {
  title: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  // onSubmit: () => void;
  placeholder: ReactElement;
  error?: string;
  handleOnSave: () => void;
  handeOnReset: () => void;
  warning?: string;
};
export type Step3Props = {
  setStep: SetStateNumberType;
};
export type UserInfo = {
  [key: string]: {
    [key: string]: {
      name: string;
      accounts: {
        [key: string]: {
          data: string;
          address: string;
          secretKey: string;
        };
      };
    };
  };
};
export type UserWallets = {
  [key: string]: {
    seedphrase: string;
    walletName: string;
    chains: {
      [key: string]: {
        accounts: {
          [key: string]: {
            name: string;
            address: string;
            secret: string;
            createdAt: number;
          };
        };
      };
    };
  };
};
export type MnemonicReduxState = {
  isUserSavedMnemonic: boolean;
};
export interface TOKEN {
  token: {
    tokenName: string;
    tokenBalance: number;
    tokenBalanceInUsd: number;
    tokenAddress: string;
  };
}
export type SendTransactionReduxState = {
  selectedToken: {
    tokenName: string;
    tokenAddress: string;

    tokenAmount: number;
    amount: number;
    recieverAddress: string;
    tokenDecimal: number;
    tokenNetwork: number;
    address: string;
    usdAmount: number;
    nativeTokenInUsd: number;
    accountName: string;
    walletName: string;
    multiAccountExist: boolean;
  };
  clipboard: string;
  addressBook: AddressBook[];
  selectedGasValue: string;
  receipt: {
    open: boolean;
    status: boolean;
    transactionHash: string;
    blockNumber: number;

    from: string;
    to: string;
  };
  recentRecipient: {
    EVM: string;
    // NEAR_TESTNET: string;
    NEAR: string;
    SOLANA: string;
  };
  transactions: {
    [key: string]: any[];
  };
  cachedTransactions: {
    [key: string]: any[];
  };

  pendingTransaction: {
    [key: string]: {
      userToken: TOKEN["token"];
      swapToken: TOKEN["token"];
      address: string;
      fromToken: number;
    }[];
  };

  slippage: number;
  swapTransactionTime: number;
  gasSpeed: string;
  sendTransactionPrice: number;
  gasPrice: 0;
};

export type FunctionalityNavigatorsProps = {
  onSendClick: () => void;
  onReceiveClick: () => void;
  onSwapClick: () => void;
};

export type TokenDetailType = {
  open: boolean;
  name: string;
  price: number;
  priceChange: number;
  time: string;
  address: string;
  chain: number;
  accountAddress: string;
};

export type ExplorerSectionProps = {
  token?: TokenDetailType;
  setToken: SetTokenDetail;
};

export type TokenDetailSectionProps = {
  token?: TokenDetailType;
  setToken: SetTokenDetail;
};
export type MainAccordionProps = {
  tokensHistory: SecondaryHoldings;
  handleToggle?: (index: number) => void;
  handleAccordionClick: (index: number, chain: number, value: string) => void;
  activeToken?: {
    chainId: number;
    index: number;
  };
  setCurrentStep?: SetStateNumberType;
  setToken?: SetToken["token"];
  setFromToken?: SetStateNumberType;
  isSwap?: boolean;
  isShow?: boolean;
  handleClose?: HandleCLose;
  isDashboard: boolean;
  setActiveToken?: SetActiveToken;
  toggle?: boolean;
  setTokenDetail?: SetTokenDetail;
  isEditlist?: boolean;
  isActiveList?: boolean;
};

export type AddressBook = {
  ADDRESS: string;
  NAME: string;
  NOTE: string;
};
export type TransactionHistory = {
  expiry: number;
  data: string;
};
export type priceInUSD = string;
export type TransactionHistoryResult = {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
};

export type WalletReduxState = {
  network: number;
  currentWalletName: string;
  tokensHistory: TokenHistory;
  toTokens: TokenHistory;
  swapToken: { [key: string]: swapTokenArray[] };
  nativeTokenBalance: {
    [key: number]: number;
  };
  accountKeypairSolana: {
    publicKey: any;
    secretKey: any;
  };
  swap: boolean;
  nativeTokenPrice: number;
  chain: string;
  nearAccountId: string;
  nearMainnetAccountId: string;
  nearAccountNetwork: number;
  allAccountsWithBalance: {
    [key: string]: number;
  };
  walletsWithAccount: {
    [key: string]: string[];
  };
  customTokens: TokenHistory;
};
export type nativeTokenRateReduxState = {
  price: number;
};
export type SingleEthHistory = {
  tokenName: string;
  tokenSymbol: string;
  priceInUSD: number; //balanceInUsd
  tokenBalance: number;
  tokenBalanceRawInteger: string;
  tokenAddress: string;
  image: string;
  tokenDecimal: number;
  chain?: number;
  tokenPrice: string; //tokenPrice in USD
};
export type TokenHistory = {
  [key: number]: {
    [key: string]: TokenHistoryInfo;
  };
};
export type TokenHistoryInfo = {
  tokenBalance: number;
  tokenDecimal: number;
  tokenName: string;
  tokenAddress: string;
  priceInUSD: number;
  tokenSymbol: string;
  image: string;
  isActive: boolean;
  accounts: {
    [key: string]: {
      priceInUSD: number;
      tokenBalance: number;
    };
  };
};
export type swapTokenArray = {
  tokenName: string;
  tokenSymbol: string;
  tokenBalance: number;
  tokenAddress: string;
  priceInUSD: number;
  tokenDecimal: number;
};
export type FilteredHistory = {
  tokenName: string;
  tokenSymbol: string;
  tokenBalance: number;
  tokenAddress: string;
  tokenDecimal: number;
  priceInUSD: number;
  image: string;
};

export type Tokens = {
  [key: string]: number;
};
export type CoinData = {
  [key: string]: {
    data: number[];
    name: string;
  };
};
export type PasswordStepProps = {
  changeStep: (number: number) => void;
  currentStep: number;
};
export type SwapTokenBoxProps = {
  title: string;
  tokenName: string;
  tokenImageSrc?: string;
  amountInUsd: number;
  nativeAmount: number;
  handleClick?: () => void;
  value: number;
  setValue: SetStateNumberType;
  isPulsate: boolean;
};
export type AccountSelectionAccordianRowProps = {
  value: string;
  controlProps: (item: string) => {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
    inputProps: {
      "aria-label": string;
    };
    checkedIcon: JSX.Element;
    icon: JSX.Element;
  };
  showLine: boolean;
};
export interface SetToken {
  token: React.Dispatch<
    React.SetStateAction<{
      tokenName: string;
      tokenBalance: number;
      tokenBalanceInUsd: number;
      tokenAddress: string;
      tokenDecimal: number;
      image: string;
    }>
  >;
}
export type TokenAccordianProps = {
  value: string;
  setCurrentStep: SetStateNumberType;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  holdings: SecondaryHoldings;
  tokenAddress?: string;
  handleClose?: HandleCLose;
  isShow?: boolean;
  containerStyle?: React.CSSProperties;
  setFromToken?: SetStateNumberType;
  isEditlist?: boolean;
};

export type TransactionFeesProps = {
  handleClick: () => Promise<void>;
  dAppMode?: boolean;
  hexData?: string;
  // transactionLoading?: boolean;
  handleReject: () => Promise<void> | void;
  Title: JSX.Element;
  method?: string;
  showSlippage?: boolean;
  show: boolean;
  hideTransactionFeeComponent: () => void;
  ButtonTitle: JSX.Element;
  loading: boolean;
  isTokenApproved?: boolean;
  handleApproval?: () => Promise<void> | void;
  chainFamily: string;
  totalInUsd: number;
};

export type GasFeeComponentProps = {
  totalInUsd: number;
  showSlippage: boolean;
  Title: JSX.Element;
};

export type HexDataProps = {
  hexData?: string;
  txData?: string;
};
export type TxHistoryProps = {
  tokenSymbol?: string;
  chain?: number;
  height: CSSProperties["height"];
  address?: string;
};

export interface RainbowHoldButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  // children: React.ReactNode;
  width?: number;
  left?: number;
  onHoldComplete?: () => void;
  ButtonTitle: JSX.Element;
  loading: boolean;
}

export interface RainbowButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode;
  width?: number;
}
export type ImportProps = {
  accountImport: boolean;
};
export type SeedPhraseS1Props = {
  setStep: SetStateNumberType;
};
export type ChainComponentProps = {
  onClick: () => void;
  isEditlist?: boolean;
  singleChainHolding: SecondaryHoldings["chainId"];
  isExpanded: boolean;
};
export type ConnectionBadgeProps = {
  pending?: boolean;
  loading?: boolean;
  connected?: boolean;
};

export type TxHistoryAmountProps = {
  TxType: string;
  token: Token;
  token1?: Token;
  status: ACTIVITY_STATUS_TYPES;
  isDappTransaction?: boolean;
};
export type TxHistoryButtonsProps = {
  txHash: string;
  network: number;
};
export type TxHistoryResultingBalanceProps = {
  symbol0: string;
  symbol2: string;
  amountInUSD0: string;
  amountInUSD2: string;
  balance0: string;
  balance2: string;
};
export type TxHistoryRouteProps = {
  from: string;
  to: string;
};
export type TxHistorySpeedupCancelBtnProps = {
  speedUpFn: () => void;
  cancelFn: () => void;
};
export type TxHistoryTitleProps = {
  TxType: string;
  toOrFrom: string;
  chainId: number;
  status?: string;
  name: string;
  isDappTransaction?: boolean;
};

export type TxHistoryTokenPricesProps = {
  symbol0: string;
  symbol2: string;
  tokenPrice0: string;
  tokenPrice2: string;
};
export type TxHistoryTransactionProps = {
  amountInUSD: string;
  gasFeeInUSD: string;
};
export type TxHistoryReceivedProps = {
  item: TransactionData;
};
export type TxHistorySentProps = {
  item: TransactionData;
};
export type TxHistorySendingProps = {
  item: TransactionData;
};
export type TxHistorySwapProps = {
  item: SwapTransactionData;
};
export type TxHistorySwappingProps = {
  item: SwapTransactionData;
};
export type ListItemContainerProps = {
  tokenName: string;
  tokenSymbol: string;
  priceInUSD: string;
  tokenBalance: number;
  swap: boolean;
};
export type ListItemValueBoxProps = {
  isChain: boolean;
  usdAmount: number;
};
export type PasswordMainProps = {
  ContentArray: {
    content: JSX.Element;
  }[];
  currentStep: number;
};
export type TitleComponentProps = {
  text: string;
  containerStyle?: React.CSSProperties;
};
export type HandleCLose = () => void;
export type SetStateNumberType = React.Dispatch<React.SetStateAction<number>>;
export type SetStateStringType = React.Dispatch<React.SetStateAction<string>>;

export type DappLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
  topic: string;
  dappName: string;
  dappLink: string;
  dappImage: string;
  method?: string;
  onHandlerClick?: () => void;
  handleConfirm?: () => void;
  handleReject?: () => void;

  toEntityName?: string;
  toEntityImage?: string;

  onEntityName?: string;
  onEntityImage?: string;

  heading?: string;
  loadingConfirm?: boolean;
  disableReject?: boolean;

  containerStyle?: CSSProperties;
};
export type DappTermsProps = {
  dappName: string;
};
export type SimpleTileinfoProps = {
  LOGO: string;
  NAME: string;
  ADDRESS?: string;
  chain?: string | SimpleTileinfoProps;
  id?: string;
  walletName?: string;
};
export type SimpleTileProp = {
  tileInfo: SimpleTileinfoProps;
  onClick: (info: SimpleTileinfoProps) => void;
  isSelected?: boolean;
  enableToggle?: boolean;
};
export type openOceanInfo = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  chain: string | SimpleTileinfoProps;
};
export type AnyTokensSearch = {
  onTokenClick?: (token: SimpleTileinfoProps) => void;
  onDefaultTokenClick?: (
    token: SimpleTileinfoProps,
    network?: SimpleTileinfoProps
  ) => void;
  listcontainerStyle?: React.CSSProperties;
  network: string | SimpleTileinfoProps;
};
export type ReceiveAccountProps = {
  onAccountClick?: (account: SimpleTileinfoProps) => void;
  network?: SimpleTileinfoProps | string;
  ListStyle?: CSSProperties;
  selectedAccount?: SimpleTileinfoProps;
  setIsChainFamilyModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
export type WalletsListProps = {
  ListStyle?: CSSProperties;
  onWalletClick: (account: SimpleTileinfoProps) => void;
  selectedWallet?: SimpleTileinfoProps;
};
export type QrModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  token?: SimpleTileinfoProps;
  account?: SimpleTileinfoProps;
  network?: SimpleTileinfoProps;
  amount: string;
};
export type SimpleAccountsList = {
  name: string;
  address: string;
  chain: string;
  walletId: string;
}[];
export type RainbowLoaderProps = { size?: number; style?: React.CSSProperties };
export type NetworkModalProps = {
  handleClose: () => void;
  isOpen: boolean;
  currentNetwork?: string | SimpleTileinfoProps;
  onNetworkClick: (chainId: number) => void;
  showAllChains: boolean;
  isTestnet?: boolean;
  disabledChainIds: number[];
};
export type ChainFamilyModalProps = {
  handleClose: () => void;
  isOpen: boolean;
  onChainFamilyClick: (chainFamily: typeof CHAIN_CATEGORIES["x"]) => void;
  network: SimpleTileinfoProps | string;
};
export type AddCustomTokenModalProps = {
  handleClose: () => void;
  isOpen: boolean;
  network: SimpleTileinfoProps;
};
export type WalletAddresses = {
  [key: string]: {
    chain: string;
    address: string;
    name: string;
    walletName: string;
    accountKey: string;
  }[];
};
export type SetAccountScreen = React.Dispatch<React.SetStateAction<boolean>>;
export type SetSelectedAccount = React.Dispatch<
  React.SetStateAction<{
    chainLogo: string;
    address: string;
    name: string;
    chain: string;
    walletName: string;
    accountKey: string;
  }>
>;

export type AddressProps = {
  walletAddresses: WalletAddresses;
  setAccountScreen: SetAccountScreen;
  setSelectedAccount: SetSelectedAccount;
};
export type SelectedAccount = {
  chainLogo: string;
  address: string;
  name: string;
  chain: string;
  walletName: string;
  accountKey: string;
};
export type RenderWalletProps = {
  walletNumber: number;
  walletNames: string[];
  walletInfo: UserWallets;
  seedPhraseScreen: boolean;
  accountScreen: boolean;
  privateKeyScreen: boolean;
  setSeedPhraseScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setPrivateKeyScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletInfo: React.Dispatch<React.SetStateAction<UserWallets>>;
  setSelectedAccount: SetSelectedAccount;
  selectedAccount: SelectedAccount;
  singleWalletName: string;
  setSingleWalletName: React.Dispatch<React.SetStateAction<string>>;
};
export type RenderAccountScreenProps = {
  selectedAccount: SelectedAccount;
  setPrivateKeyScreen: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalOpen: () => void;
  walletInfo: UserWallets;
};
export type EditSingleEntityModal = {
  open: boolean;
  handleClose: () => void;
  handleSave: (value: string) => void;
  entityName: string;
  defaultValue: string;
  create?: boolean;
  disableCancelBtn?: boolean;
  bodyText?: string;
  checkIcon?: boolean;
};

export type RestoreAccessModal = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
};

export type DerivationPathModal = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (derivationPath: string) => void;
};

export type DappAccountSelectionProps = {
  onAccountSelect: (acc: SimpleTileinfoProps) => void;
  isModalOpen: boolean;
  handleClose: () => void;
  selectedAccount?: SimpleTileinfoProps;
};
export type WalletSelectionModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  onWalletClick?: (wallet: SimpleTileinfoProps) => void;
  heading?: string;
  confirmBtnText?: string;
  onConfirmClick?: (wallet: SimpleTileinfoProps) => void;
};
export type ObjectOfStringsArray = {
  [key: string]: string[];
};
export type AnkrAccountBalanceResponse = {
  id: number;
  jsonrpc: string;
  result: {
    assets: AnkrResponseAsset[];
    totalBalanceUsd: string;
  };
  error: {
    code: number;
    message: string;
  };
};

export type AnkrTransferByAddressResponse = {
  id: number;
  jsonrpc: string;
  result: {
    transactions: {
      transactionHash: string;
    }[];
  };
};

export type AnkrResponseAsset = {
  balance: string;
  balanceRawInteger: string;
  balanceUsd: string;
  blockchain: string;
  contractAddress: string;
  holderAddress: string;
  thumbnail: string;
  tokenDecimals: number;
  tokenName: string;
  tokenPrice: string;
  tokenSymbol: string;
  tokenType: string;
};

export type SetWalletsSum = {
  [key: string]: {
    balanceInUsd: number;
  };
};

export type SetAccountsSum = {
  [key: string]: {
    balanceInUsd: number;
  };
};
type Element = React.ReactElement;

export type ListItemProps = {
  leftSideElement: Element;
  text: string;
  rightSideElement: Element;
  onClick?: () => void;
  disabled?: boolean;
};
export interface ListItemWithAddressProps extends ListItemProps {
  address: string;
}
export type RevealModalProps = {
  open: boolean;
  handleClose: HandleCLose;
  walletSecret?: string;
  accountSecret?: string;
};

export type RenderListContentProps = {
  List: {
    text: string;
    rightSideElement: Element;
    leftSideElement: Element;
    onClick: () => void;
    disabled?: boolean;
  }[];
};
export type SecretViewProps = {
  mnemonic: string[];
  walletSecret: string;
  accountSecret: string;
};
export type SwapResponse = Array<{
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}>;

export type RenderChainsListProps = {
  singleChainHolding: SecondaryHoldings["chainId"];
  // onTokenSelect: (TokenSelectionArgs: TokenSelectionArgs) => void;
  onTokenSelect: (TokenSelected: TokenSelected) => void;
  defaultExpanded: boolean;
  chainId: number;
  showAllHoldings: boolean;
  showActiveOnly?: boolean;
  showInactiveOnly?: boolean;
  index: number;
  fetchMoreTokens: (chainId: number, pageNumber: number) => void;
};

export type RenderTokensListProps = {
  singleToken: SecondaryHoldings["chainId"]["tokens"]["tkName_tkAddress_tkSymbol"];
  onTokenSelect: (TokenSelected: TokenSelected) => void;
  chainId: number;
  myRef?: any;
  index?: number;
  chainIndex?: number;
};

export type TokenHoldingTileProps = {
  isEditlist: boolean;
  singleTokenHolding: SecondaryHoldings["chainId"]["tokens"]["tkName_tkAddress_tkSymbol"];
  showAccounts: boolean;
  isExpanded: boolean;
  onTokenSelect: (
    singleHolding: SecondaryHoldings["chainId"]["tokens"]["tkName_tkAddress_tkSymbol"]
  ) => void;
  index?: number;
  chainIndex?: number;
};
export type AccountHoldingTileProps = {
  singleAccount: SecondaryHoldings["chainId"]["tokens"]["tkName_tkAddress_tkSymbol"]["accounts"]["accAddress"];
  tokenInfo: {
    name: string;
    symbol: string;
    image: string;
  };
  onAccountSelect: () => void;
  index?: number;
  chainIndex?: number;
  tokenIndex?: number;
};
export type RenderAccountsListProps = {
  singleAccount: SecondaryHoldings["chainId"]["tokens"]["tkName_tkAddress_tkSymbol"]["accounts"]["accAddress"];
  tokenInfo: {
    name: string;
    symbol: string;
    image: string;
  };
  onAccountSelect: () => void;
  index?: number;
  chainIndex?: number;
  tokenIndex?: number;
};
export type AccountsProps = {
  singleTokenHolding: SecondaryHoldings["chainId"]["tokens"]["tkName_tkAddress_tkSymbol"];
  onAccountSelect: (address: string) => void;
  chainIndex?: number;
  tokenIndex?: number;
};

export interface TokenSelectionArgs {
  tokenName: string;
  tokenAmount: number;
  tokenAddress: string;
  tokenDecimal: number;
  address: string;
  usdAmount: number;
  multiAccountExist: boolean;
  tokenSymbol: string;
  tokenImage: string;
}

export interface TokenSelectionArgsWithChain extends TokenSelectionArgs {
  chainId: number;
}

export type TokensProps = {
  tokens: SecondaryHoldings["chainId"]["tokens"];
  onTokenSelect: (TokenSelected: TokenSelected) => void;
  chainId: number;
  showAllHoldings: boolean;
  showActiveOnly?: boolean;
  showInactiveOnly?: boolean;
  chainIndex?: number;
  fetchMoreTokens: (chainId: number, pageNumber: number) => void;
};

export type ChainsProps = {
  filteredHoldings: SecondaryHoldings;
  // onTokenSelect: (
  //   TokenSelectionArgsWithChain: TokenSelectionArgsWithChain
  // ) => void;
  onTokenSelect: (TokenSelected: TokenSelected) => void;
  defaultExpanded: boolean;
  showAllHoldings: boolean;
  showActiveOnly?: boolean;
  showInactiveOnly?: boolean;
  fetchMoreTokens: (chainId: number, pageNumber: number) => void;
};
export type TokenBoxTitleProps = {
  heading: string;
  subHeading: string;
  rightSideElement: Element;
};
export type TokenBoxContentProps = {
  title: string;
  leftElement: Element;
  rightElement: Element;
};

export type SnackBarHeaderProps = {
  snackBarExpandedHeight: number;
  height: number;
  expandSnackBar: () => void;
  text: string;
  closeSnackBar: (e: OnClickType) => void;
  snackBarData: TransactionData | SwapTransactionData;
};

export type RenderContentProps = {
  content: {
    heading: string;
    subHeading: string;
    rightSideElement: JSX.Element;
    box0: {
      title: string;
      leftELement: JSX.Element;
      rightElement: JSX.Element;
    };
    box1: {
      title: string;
      leftELement: JSX.Element;
      rightElement: JSX.Element;
    };
  }[];
};
export type ITokensProps = {
  customHolding: SecondaryHoldings;
  style?: CSSProperties;
  // onTokenSelect: (
  //   TokenSelectionArgsWithChain: TokenSelectionArgsWithChain
  // ) => void;
  onTokenSelect: (TokenSelected: TokenSelected) => void;
  defaultExpanded?: boolean;
  showAllHoldings?: boolean;
  showActiveOnly?: boolean;
  showInactiveOnly?: boolean;
  fetchMoreTokens?: (chainId: number, pageNumber: number) => void;
};
export type TokenslistWithMessageProps = {
  customHolding: SecondaryHoldings;
  onTokenSelect: (TokenSelected: TokenSelected) => void;
};
export type SlideLayoutWrapperProps = {
  children: ReactNode;
};
export type AddressBookFormType = {
  title: string;
  placeholder: string;
  icon: IconProp;
}[];
export type Token = {
  name: string;
  symbol: string;
  address: string;
  image: string;
  amount: number;
  amountInUsd: number;
  decimal: number;
};
export type AddressAndName = {
  address: string;
  name: string;
};
export type TransactionData = {
  txType: TX_TYPES;
  from: string;
  to: string;
  token: Token;

  transactionFeeInUsd: number;
  timeStamp: number;
  nonce: number;
  rawData?: any;
  chainId: number;
  transactionHash: string;
  status: ACTIVITY_STATUS_TYPES;

  address: string;
  isSpeedUpEnabled?: boolean;
  isCancelEnabled?: boolean;
  isSpeedUpCancelBlinking?: boolean;
  walletName: string;
  senderNameInTheAddressBook: string;
  receiverNameInTheAddressBook: string;
  txMethod: Tx_METHODS;
  isDappTransaction: boolean;
};
export interface SwapTransactionData extends TransactionData {
  tokenB: Token;
  makerBalance: number;
  makerBalanceInUsd: number;
  takerBalance: number;
  takerBalanceInUsd: number;
  tokenAprice: number;
  tokenBprice: number;
}

export type Activity = {
  [address: string]: {
    [chainId: number]: {
      [hash: string]: TransactionData | SwapTransactionData;
    };
  };
};

export type StoreTransactionActivityData = {
  transactionData: TransactionData | SwapTransactionData;
};
export type SubtitleProps = {
  from: string;
  token: Token;
  txType: TX_TYPES;
  status: ACTIVITY_STATUS_TYPES;
  name: string;
};
export type RenderOrReceiveTransactionContentProps = {
  value: number;
  fees: number;
  sender: string;
  receiver: string;
  chainId: number;
  transactionHash: string;
  senderNameInTheAddressBook: string;
  receiverNameInTheAddressBook: string;
};
export type RenderSwapTransactionContentProps = {
  snackbar: boolean;
  value: number;
  fees: number;
  sender: string;
  receiver: string;
  chainId: number;
  transactionHash: string;
  makerBalance: number;
  makerBalanceInUsd: number;
  takerBalance: number;
  takerBalanceInUsd: number;
  tokenAname: string;
  tokenBname: string;
  tokenAprice: number;
  tokenBprice: number;
  isDappTransaction: boolean;
};

export type CopyAndExplorerButtonProps = {
  transactionHash: string;
  chainId: number;
};
export type SwapingSubTileProps = {
  TokenA: Token;
  TokenB: Token;
  status: ACTIVITY_STATUS_TYPES;
  isDappTransaction: boolean;
};

export type INON_NATIVE_DEFAULT = {
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  address: string;
  isActive: boolean;
  chainFamily: keyof typeof NETWORKS;
  chainId: number;
  coingeckoId: string;
}[];

export type SolanaTokenResponse = {
  [tokenAddress: string]: {
    address: string;
    chain: number;
    decimals: number;
    id: string;
    image: string;
    name: string;
    symbol: string;
  };
};
export type ButtonProps = {
  onClick: (e: OnButtonClickType) => void;
  lightMode?: boolean;
  icon?: IconDefinition;
  className?: string;
  text: string;
  contained?: boolean;
  style?: CSSProperties;
  iconSize?: number;
  iconColor?: string;
  id?: string;
  isHover?: boolean;
};
export interface TooltipButtonProps extends ButtonProps {
  tooltipText: string;
}
export type EditNameModalProps = {
  open: boolean;
  handleClose: (name: string) => void;
  isForWallet: boolean;
  top: number;
  defaultName: string;
  creatingSolanaAccount: boolean;
};
export type BottomModalLayoutProps = {
  open: boolean;
  heading?: string;
  children: React.ReactElement;
  showCancelBtn?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  headerIcon?: IconDefinition;
  submitBtnText?: string;
};

export type DynamicBalanceEVM = {
  [chainId: number]: {
    web3Instance: EthersRPCProvider;
    addresses: string[];
    tokens: string[];
    contractAddress: string;
  };
};

export type AmountTokenA = {
  amount: string;
  amountInUsd: string;
};

export type SetAmountTokenA = React.Dispatch<
  React.SetStateAction<{
    amount: string;
    amountInUsd: string;
  }>
>;

export type AmountTokenB = {
  amount: string;
  amountInUsd: string;
};

export type SetAmountTokenB = React.Dispatch<
  React.SetStateAction<{
    amount: string;
    amountInUsd: string;
  }>
>;

export type ITokenA = SwapSelectedTokens["tokenA"];
export type ITokenB = SwapSelectedTokens["tokenB"];
export type IAccount = SwapSelectedTokens["account"];

export type AddressBookProps = {
  icon: IconDefinition;
  text: string;
};

export type GraphQueryData = {
  [coingeckoId: string]: number;
};

export type GraphData = number[];

export type Profit = {
  amount: number;
  symbol: string;
  status: boolean;
};

export type GasPriceAppSlice = {
  safeLow: number; //in dollar
  average: number;
  fast: number;
  custom: number;

  safeLowGwei: number; //Gwei
  averageGwei: number;
  fastGwei: number;
  customGwei: number;

  avgWait: number; //time
  fastWait: number;
  safeLowWait: number;
  customWait: number;
};

export enum NetworkFeeTypeChosen {
  Slow = 0, //"safeLow",
  Average = 1, //"average",
  Fast = 2, //"fast",
  Custom = 3, // "custom",
}

export type NetworkFeeSettings = {
  feeType: NetworkFeeTypeChosen;
  gasInfo: GasInfo;
};

export type GasInfo = {
  [type in NetworkFeeTypeChosen]: {
    usd: number;
    gwei: number;
    time: number;
  };
};

export enum SlippageTypeChosen {
  First = 0,
  Second = 1,
  Third = 2,
  Custom = 3,
}

export type SlippageToleranceSettings = {
  slippageType: SlippageTypeChosen;
  txDeadline: string;
  slippageTolerance: {
    [type in SlippageTypeChosen]: {
      value: number;
    };
  };
};

export type Alert = {
  open: boolean;
  heading: string;
  body: string;
};

export type InProgressTransactionHashes = {
  [chainId: number]: {
    [nonce: number]: string[];
  };
};

// export type RecentSearchedKeywords = {
//   key: number;
//   label: string;
// };

export type AddressBookAppSlice = {
  [acc_address: string]: {
    name: string;
    note: string;
    chainFamily: string;
    address: string;
    ens: string;
  };
};

export type DefaulTokens = {
  [address: string]: {
    name: string;
    symbol: string;
    image: string;
    decimals: number;
    address: string;
    isActive: boolean;
    chainFamily: keyof typeof NETWORKS;
    chainId: number;
    coingeckoId: string;
    usdPrice: number;
  };
};
export interface AppReduxState {
  welcomeMessage: string;
  isLoggedIn: boolean;
  isUserExists: boolean;
  colorTheme: PaletteMode;
  graphQueryData: GraphQueryData;
  graphData: GraphData;
  password: string;
  isLoading: boolean; //for dashboard skeleton
  isTestnet: boolean;
  isNewWallet: boolean;
  isUserSavedMnemonic: boolean;
  generatedMnemonic: string;
  isHoldFinish: boolean;
  expirationTime: number;
  hashedPassword: string;
  showModalWalletNetwork: boolean;
  totalSum: number;
  totalFilteredSum: number;
  profit: Profit;
  pendingTransactionLoaderStatus: boolean;
  addressBook: AddressBookAppSlice;
  networkFeeSettings: NetworkFeeSettings;
  isSlideAnimationCompleted: boolean;
  slideAnimation: string | undefined;
  isSendSnackBarOpen: boolean;
  isSwapSnackBarOpen: boolean;
  isTransactionCompleted: boolean;
  lastReceivedTransactionTime: number;
  slippageToleranceSettings: SlippageToleranceSettings;
  snackBarMessage: string;
  selectedInputId: string;
  recentSearchedKeywords: string[];
  showGraph: boolean;
  alert: Alert;
  failedModalAlert: {
    open: boolean;
    funds: number;
    gas: number;
    message: string;
  };
  walletCreatedAlert: boolean;
  navigationPath: string;
  derivationPathSolana: string;
  seedPhraseExpirationTime: number;
  isFirstWalletImported: boolean;
  inProgressTransactionHashes: InProgressTransactionHashes;
  loginExpiryPeriod: number;
  networkFeePreference: number;
  isDappRoutes: boolean;
  transactionTrigerredMessage: string;
  swapImportedTokens: SwapResponse;
  txIntervalList: string[];
  minimumSolTokenBalance: number;
  NETWORKCHAIN: { [key: number]: networkInfoType };
  rpcsList: RpcsList;
  nonNativeDefaultAndTopTokens: {
    expiry: number;
    tokens: DefaulTokens;
  };
  TokensToBeAddedInEachAccount: INON_NATIVE_DEFAULT;
}

export type AllWallets = {
  [walletName: string]: {
    name: string;
    walletId: string;
    EVM: string[];
    NEAR: string[];
    SOLANA: string[];
    // NEAR_TESTNET: string[];
    seedphrase: string;
    balanceInUsd: number;
  };
};

export type Accounts = {
  [accAddress: string]: {
    name: string;
    address: string;
    chainFamily: string;
    secret: string;
    walletId: string;
    isImported: boolean;
    createdAt: number;
    balanceInUsd: number;
    derivationpath?: string;
  };
};

export type TokenHoldings = {
  [address: string]: {
    [chainId: string]: {
      [tokenAddress: string]: {
        rawAmount: string;
        symbol: string;
      };
    };
  };
};

export type TokenInfo = {
  [tokenAddress_symbol: string]: {
    name: string;
    symbol: string;
    image: string;
    decimals: number;
    address: string;
    isActive: boolean;
    coingeckoId: string;
    price: number;
  };
};

export type FilteredAccounts = {
  [address: string]: {
    isSelected: boolean;
  };
};

export type SetAccountsSelected = {
  address: string;
  value: boolean;
};

export type AccountsSum = {
  [key: string]: {
    balanceInUsd: number;
  };
};

export type WalletsSum = {
  [key: string]: {
    balanceInUsd: number;
  };
};

export type WalletsFilter = {
  [walletId: string]: FilteredAccounts;
};

export type SecondaryHoldings = {
  [chainId: string]: {
    name: string;
    image: string;
    balanceInUsd: number;
    tokens: {
      [tkName_tkAddress_tkSymbol: string]: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        image: string;
        balance: number;
        rawBalance: string;
        balanceInUsd: number;
        isActive: boolean;
        accounts: {
          [accAddress: string]: {
            name: string;
            walletName: string;
            balance: number;
            rawBalance: string;
            balanceInUsd: number;
          };
        };
      };
    };
  };
};

export type ITokens = SecondaryHoldings["chainId"]["tokens"];

export type TokenSelected = {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    chainId: number;
    multiAccountExist: boolean;
    coingeckoId: string;
    price: number;
  };
  from: {
    address: string;
    name: string;
    balance: number; //user balance
    rawBalance: string; //user balance in raw
    balanceInUsd: number;
    chainFamily: string;
    walletName: string;
    nativeTokenBalance: number;
    nativeTokenBalanceInRaw: string;
  };
  to: {
    address: string;
    amount: number; //entered amount
    amountInUsd: number;
    ens: string;
  };
  error: {
    message: string;
    open: boolean;
  };
  transactionObject: TransactionRequest;
  hexData: string;
  makeTransaction: boolean;
  loading: boolean;
};

export type IToken = TokenSelected["token"];
export type IFrom = TokenSelected["from"];
export type ITo = TokenSelected["to"];

export type NumOfTokens = {
  active: number;
  inActive: number;
  total: number;
};

export type SwapSelectedTokens = {
  account: {
    address: string;
    name: string;
    walletName: string;
    chainFamily: string;
    nativeTokenBalance: number;
    nativeTokenBalanceInRaw: string;
    nativeTokenSymbol: string;
    image: string;
  };
  tokenA: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    balance: number;
    rawBalance: string;
    balanceInUsd: number;
    chainId: number;
    reflectionExists: boolean;
    isNative: boolean;
    coingeckoId: string;
    price: number;
  };
  tokenB: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    balance: number;
    rawBalance: string;
    balanceInUsd: number;
    chainId: number;
    reflectionExists: boolean;
    isNative: boolean;
    coingeckoId: string;
    price: number;
  };
  error: {
    message: string;
    open: boolean;
  };
  txDeadline: string;
  transactionObject: TransactionRequest;
  hexData: string;
  makeTransaction: boolean;
  allowance: number;
  loading: boolean;
  initialSlippage: number;
  transactionsRef: Transaction[];
  warning: string;
};

export type NewWalletState = {
  allWallets: AllWallets;
  accounts: Accounts;
  tokenHoldings: TokenHoldings;
  tokenInfo: TokenInfo;
  filteredAccounts: FilteredAccounts;
  accountsSum: AccountsSum;
  walletsSum: WalletsSum;
  filteredHoldings: SecondaryHoldings;
  secondaryHoldings: SecondaryHoldings;
  tokenSelected: TokenSelected;
  activity: Activity;
  swapSelectedTokens: SwapSelectedTokens;
  numOfTokens: NumOfTokens;
  filteredWallets: WalletsFilter;
};

export const DefaultTokenSelected: TokenSelected = {
  token: {
    address: "",
    name: "",
    symbol: "",
    decimals: 18,
    image: "",
    chainId: 0,
    multiAccountExist: false,
    coingeckoId: "",
    price: 0,
  },
  from: {
    address: "",
    name: "",
    balance: 0,
    balanceInUsd: 0,
    chainFamily: "",
    walletName: "",
    rawBalance: "",
    nativeTokenBalance: 0,
    nativeTokenBalanceInRaw: "",
  },
  to: {
    address: "",
    amount: 0,
    amountInUsd: 0,
    ens: "",
  },
  error: {
    message: "",
    open: false,
  },
  transactionObject: {},
  hexData: "",
  makeTransaction: false,
  loading: false,
};

export const DefaultSwapSelectedTokens: SwapSelectedTokens = {
  account: {
    address: "",
    name: "",
    walletName: "",
    chainFamily: "",
    nativeTokenSymbol: "",
    image: DUMMY_IMAGE_URL,
    nativeTokenBalance: 0,
    nativeTokenBalanceInRaw: "",
  },
  tokenA: {
    address: "",
    name: "",
    symbol: "",
    decimals: 1,
    image: DUMMY_IMAGE_URL,
    balance: 0,
    balanceInUsd: 0,
    chainId: 0,
    reflectionExists: false,
    isNative: false,
    coingeckoId: "",
    rawBalance: "",
    price: 0,
  },
  tokenB: {
    address: "",
    name: "",
    symbol: "",
    decimals: 1,
    image: DUMMY_IMAGE_URL,
    balance: 0,
    balanceInUsd: 0,
    chainId: 0,
    reflectionExists: false,
    isNative: false,
    rawBalance: "",
    coingeckoId: "",
    price: 0,
  },
  error: {
    message: "",
    open: false,
  },
  txDeadline: SWAP_EXPIRATION_TIME,
  transactionObject: {},
  hexData: "",
  makeTransaction: false,
  allowance: 0,
  loading: false,
  initialSlippage: 0,
  transactionsRef: [],
  warning: "",
};

export type SlippageTolerance = SlippageToleranceSettings["slippageTolerance"];
export type SlippageType = SlippageToleranceSettings["slippageType"];

export interface Location<State> extends Omit<ReactLocation, "state"> {
  state: State;
}

export type SelectTokenLocationState = {
  isSwap: { forTokenA: boolean; forTokenB: boolean };
};

export type SwapLocationState = {
  tokenDetail: boolean;
  selectToken: boolean;
};

export type ReceiveLocationState = {
  tokenDetail: boolean;
};

export type ISignData = {
  signingData: ExpectedSigningData;
  messageType: SignDataMessageType;
  rawSigningData: string;
};

export type DappSlice = {
  defaultWallet: "false" | "true";
  permChangeNetwork: "false" | "true";
  dAppNetwork: string;
  method: string;
  route: string;
  dAppConnectAddress: string;
  origin: string;
  signedData: ISignData | null;
  dappMethodParam: unknown[];
  signTypedData: SignTypedDataRequest | null;
  permission: PermissionRequest | null;
  transactionObject: Record<string, unknown>;
  popupClosingAfterConfirm: boolean;
};

export type ISwitchNetworkAction = {
  dAppNetwork: string;
  permission: PermissionRequest;
  method: string;
  dappMethodParam: unknown[];
};

export type IRequestAccountsAction = {
  dAppNetwork: string;
  permission: PermissionRequest;
  method: string;
};

export type ISignMessageAction = {
  permission: PermissionRequest;
  method: string;
};

export type ISignTransactionAction = {
  permission: PermissionRequest;
  method: string;
  transactionObject: Record<string, unknown>;
};

export type IDefaultWallet = "true" | "false" | null;

export type EthersRPCProvider = ethers.providers.JsonRpcProvider;

// export type IAccount = SwapSelectedTokens["account"];
// export type ITokenA = SwapSelectedTokens["tokenA"];
// export type ITokenB = SwapSelectedTokens["tokenB"];

export type EstimateSwapHookProps = {
  setAmountTokenA: React.Dispatch<React.SetStateAction<AmountTokenA>>;
  setAmountTokenB: React.Dispatch<React.SetStateAction<AmountTokenB>>;
  setIsMaxAmountDeducted: React.Dispatch<React.SetStateAction<boolean>>;
  amountTokenA: AmountTokenA;
  amountTokenB: AmountTokenB;
  transactionFee: number;
  totalInUsd: number;
  mountedRef: React.MutableRefObject<boolean>;
};

export type AddressWithChainId = { chainId: number; address: string };

export type DefaultWalletAlertModalProps = {
  handler?: () => void;
  open: boolean;
  body: string;
  heading: string;
  onClose: () => void;
};

export type networkInfoType = {
  NAME: string;
  API: string;
  NODE_URL: string;
  SOCKET_URL: string;
  CHAIN_TX:
    | Chain
    | CustomChain
    | {
        name: string;
        networkId: number;
        chainId: number;
      };
  SUPPORTED_NETWORKS: { value: string; name: string }[];
  BITQUERY_NETWORK: string;
  WRAPPED_ADDRESS: string;
  COINGECKO_ID: string;
  API_KEY: string;
  NATIVE_TOKEN_NAME: string;
  NATIVE_TOKEN_SYMBOL: string;
  NATIVE_TOKEN_COINGECKO_ID: string;
  GET_SWAP_TOKEN_API: string;
  OX_API: string;
  ROUTER: string;
  SCAN_LINK: string;
  GET_GAS_PRICE: string;
  LOGO: string;
  isTestnet: boolean;
  isSwap: boolean;
  chain: string;
  HEX_CHAIN_ADDRESS: string;
  ADDRESS?: string;
  CHAIN_ID: number;
  NATIVE_TOKEN_ADDRESS: string;
  DECIMALS: number;
  EXCHANGE_PROXY_ADDRESS_0X: string;
  BALANCE_CHECKER: string;
  SECONDARY_RPC: string;
};

export type RpcsList = {
  [chainId: number]: {
    rpcUrl: string[];
    socketRpcUrl: string[];
  };
};
