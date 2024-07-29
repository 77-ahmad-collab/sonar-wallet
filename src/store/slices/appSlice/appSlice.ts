import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { STATIC_STRAIGHTLINE_GRAPH } from "theme/constants";
import {
  NETWORKCHAIN,
  NEVER_BEEN_ON_THIS_SYSTEM_MESSAGE,
  ONE_DAY_TIME,
  SWAP_EXPIRATION_TIME,
  TX_TYPES,
  TransactionSuccessMessage,
  rpcsList,
  seedPhraseExpirationTime,
} from "../../../utils/constants";
import { encryptMessage } from "utils/index";
import { AppReduxState, SwapResponse } from "interfaces";
import { AppStoreMockState } from "mock";

export type GraphQueryData = {
  [coingeckoId: string]: number;
};

export type GraphData = number[];

export type Profit = {
  amount: number;
  symbol: string;
  status: boolean;
};

export type AddressBook = {
  [acc_address: string]: {
    name: string;
    note: string;
    chainFamily: string;
    address: string;
    ens: string;
  };
};

export type GasPrice = {
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

const initialState: AppReduxState = process.env.isTesting
  ? { ...AppStoreMockState }
  : {
      welcomeMessage: NEVER_BEEN_ON_THIS_SYSTEM_MESSAGE,
      isLoggedIn: false,
      isUserExists: false,
      colorTheme: "dark",
      graphQueryData: {},
      graphData: STATIC_STRAIGHTLINE_GRAPH,
      password: "",
      isLoading: false,
      isTestnet: false,
      isNewWallet: false,
      isUserSavedMnemonic: false,
      generatedMnemonic: "",
      isHoldFinish: false,
      expirationTime: 0,
      hashedPassword: "",
      showModalWalletNetwork: false,
      totalSum: 0,
      totalFilteredSum: 0,
      profit: {
        amount: 0,
        symbol: "",
        status: true,
      },
      pendingTransactionLoaderStatus: false,
      addressBook: {},
      networkFeeSettings: {
        feeType: NetworkFeeTypeChosen.Average,
        gasInfo: {
          0: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
          1: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
          2: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
          3: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
        },
      },
      isSlideAnimationCompleted: true,
      slideAnimation: "contract",
      isSendSnackBarOpen: false,
      isSwapSnackBarOpen: false,
      isTransactionCompleted: false,
      lastReceivedTransactionTime: new Date().getTime(),
      slippageToleranceSettings: {
        slippageType: SlippageTypeChosen.Second,
        txDeadline: SWAP_EXPIRATION_TIME,
        slippageTolerance: {
          0: {
            value: 1,
          },
          1: {
            value: 3,
          },
          2: {
            value: 5,
          },
          3: {
            value: 3,
          },
        },
      },
      snackBarMessage: TransactionSuccessMessage,
      selectedInputId: "",
      recentSearchedKeywords: [],
      showGraph: false,
      alert: {
        open: false,
        heading: "Alert",
        body: "",
      },
      failedModalAlert: {
        open: false,
        funds: 0,
        gas: 0,
        message: "",
      },
      walletCreatedAlert: false,
      navigationPath: "/index.html",
      derivationPathSolana: "",
      seedPhraseExpirationTime: seedPhraseExpirationTime,
      isFirstWalletImported: false,
      inProgressTransactionHashes: {},
      loginExpiryPeriod: 3600000,
      txIntervalList: [],
      networkFeePreference: 1,
      isDappRoutes: false,
      transactionTrigerredMessage: "",
      swapImportedTokens: [],
      minimumSolTokenBalance: 0,
      NETWORKCHAIN,
      rpcsList,
      nonNativeDefaultAndTopTokens: {
        expiry: new Date().getTime(),
        tokens: {},
      },
      TokensToBeAddedInEachAccount: [],
    };

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppSliceState: (state) => {
      // state = { ...AppStoreMockState };
      return {
        ...state,
        ...AppStoreMockState,
      };
    },
    isMnemonicSaved: (state, action) => {
      state.isUserSavedMnemonic = action.payload;
    },
    setUserLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
    setGraphQueryData: (state, action: PayloadAction<GraphQueryData>) => {
      state.graphQueryData = action.payload;
    },
    setGraphData: (state, action: PayloadAction<GraphData>) => {
      state.graphData = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },

    setIsUserExists: (state, action) => {
      state.isUserExists = action.payload;
    },

    setSelectedInputId: (state, action: PayloadAction<string>) => {
      state.selectedInputId = action.payload;
    },

    showLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setNewWallet: (state, action) => {
      state.isNewWallet = action.payload;
    },

    setIsHoldFinish: (state, action) => {
      state.isHoldFinish = action.payload;
    },
    setShowGraph: (state, action: PayloadAction<boolean>) => {
      state.showGraph = action.payload;
    },
    setAlert: (state, action: PayloadAction<Alert>) => {
      state.alert = action.payload;
    },
    setFailedModalAlert: (state, action) => {
      state.failedModalAlert = action.payload;
    },
    closeAlert: (state) => {
      state.alert = { ...state.alert, open: false };
    },
    switchNetwork: (state, action: PayloadAction<boolean>) => {
      state.isTestnet = action.payload;
    },
    setExpirationTime: (state, action) => {
      state.expirationTime = action.payload;
    },
    setHashedPassword: (state, action) => {
      state.hashedPassword = action.payload;
    },
    setShowModalWalletNetwork: (state, action) => {
      state.showModalWalletNetwork = action.payload;
    },
    setTotalSum: (state, action: PayloadAction<number>) => {
      state.totalSum = action.payload;
    },
    setLoginExpiryPeriod: (state, action: PayloadAction<number>) => {
      state.loginExpiryPeriod = action.payload;
    },
    setTotalFilteredSum: (state, action: PayloadAction<number>) => {
      state.totalFilteredSum = action.payload;
    },
    setProfit: (state, action: PayloadAction<Profit>) => {
      state.profit = action.payload;
    },
    setSendSnackBarStatus: (state, action) => {
      state.isSendSnackBarOpen = action.payload;
    },
    setSwapSnackBarStatus: (state, action) => {
      state.isSwapSnackBarOpen = action.payload;
    },
    setAddressBook: (state, action: PayloadAction<AddressBook>) => {
      state.addressBook = Object.assign({}, state.addressBook, action.payload);
    },
    removeContact: (state, action: PayloadAction<string>) => {
      const copyAddressBook = { ...state.addressBook };
      delete copyAddressBook[action.payload];
      state.addressBook = copyAddressBook;
    },
    setPendingTransactionLoaderStatus: (state, action) => {
      state.pendingTransactionLoaderStatus = action.payload;
    },
    setNetworkFeeSettings: (
      state,
      action: PayloadAction<NetworkFeeSettings>
    ) => {
      state.networkFeeSettings = {
        ...state.networkFeeSettings,
        ...action.payload,
      };
    },
    setSlideAnimation: (state, action) => {
      state.slideAnimation = action.payload;
    },
    setSlideAnimationCompletionStatus: (state, action) => {
      state.isSlideAnimationCompleted = action.payload;
    },
    setTransactionCompletedStatus: (state, action) => {
      state.isTransactionCompleted = action.payload;
    },
    setPendingTransactionStates: (state, action) => {
      const {
        isTransactionCompleted,
        isHoldFinish,
        isSlideAnimationCompleted,
        slideAnimation,
        txType,
      } = action.payload;
      const source = {
        isTransactionCompleted,
        isHoldFinish,
        isSlideAnimationCompleted,
        slideAnimation,
        snackBarMessage: TransactionSuccessMessage,
      };
      if (txType === TX_TYPES.Sent)
        Object.assign(source, { isSendSnackBarOpen: true });
      else Object.assign(source, { isSwapSnackBarOpen: true });

      Object.assign(state, source);
    },

    setCompletedTransactionStates: (state, action) => {
      const { txType, message } = action.payload;

      // state.isSpeedUpCancelBlinking = true;
      // state.isSpeedUpCancelEnabled = false;
      state.isTransactionCompleted = true;
      state.pendingTransactionLoaderStatus = false;
      state.snackBarMessage = message;
      state.isHoldFinish = false;
      state.slideAnimation = "contract";

      if (txType === TX_TYPES.Sent) state.isSendSnackBarOpen = true;
      else state.isSwapSnackBarOpen = true;
    },

    closeSnackBarOnCompletion: (state, action) => {
      const { txType, isTransactionCompleted } = action.payload;

      state.isTransactionCompleted = isTransactionCompleted;
      if (txType === TX_TYPES.Sent) state.isSendSnackBarOpen = false;
      else state.isSwapSnackBarOpen = false;
    },

    setLastReceivedTransactionTime: (state, action) => {
      state.lastReceivedTransactionTime = action.payload;
    },

    removerUserFromAppSlice: (state) => {
      state.hashedPassword = "";
      state.expirationTime = 0;
      state.isUserExists = false;
      state.generatedMnemonic = "";
      state.password = "";
    },

    // switchSpeedUpCancelStatus: (state, action) => {
    //   state.isSpeedUpCancelEnabled = action.payload;
    // },

    // setSpeedUpCancel: (state, action) => {
    //   state.isSpeedUpCancelBlinking = action.payload.speedUpCancelBlinking;
    //   state.isSpeedUpCancelEnabled = action.payload.speedUpCancelEnabled;
    // },

    setSnackBarOpen: (state, action) => {
      const { txType } = action.payload;

      state.pendingTransactionLoaderStatus = false;

      if (txType === TX_TYPES.Sent) state.isSendSnackBarOpen = true;
      else state.isSwapSnackBarOpen = true;
    },

    setSnackBarClose: (state, action) => {
      const { txType } = action.payload;
      state.pendingTransactionLoaderStatus = false;
      if (txType === TX_TYPES.Sent) state.isSendSnackBarOpen = false;
      else state.isSwapSnackBarOpen = false;
    },

    setSlippageToleranceSettings: (
      state,
      action: PayloadAction<SlippageToleranceSettings>
    ) => {
      state.slippageToleranceSettings = {
        ...state.slippageToleranceSettings,
        ...action.payload,
      };
    },
    setSnackBarMessage: (state, action) => {
      state.snackBarMessage = action.payload;
    },
    setGeneratedMnemonic: (
      state,
      action: PayloadAction<{ mnemonic: string }>
    ) => {
      state.generatedMnemonic = encryptMessage(
        action.payload.mnemonic,
        state.hashedPassword
      );
    },
    setRecentSearchedKeywords: (state, action: PayloadAction<string>) => {
      const array = state.recentSearchedKeywords;

      array.unshift(action.payload);

      state.recentSearchedKeywords = array.filter(function (item, pos) {
        return array.indexOf(item) == pos;
      });
    },
    deleteRecentSearchedKeywords: (state, action: PayloadAction<string>) => {
      const array = state.recentSearchedKeywords;

      state.recentSearchedKeywords = array.filter((e) => e !== action.payload);
    },
    setwalletCreatedAlert: (state, action) => {
      state.walletCreatedAlert = action.payload;
    },
    setNavigationPath: (state, action) => {
      state.navigationPath = action.payload;
    },
    setDerivationPathSolana: (state, action) => {
      state.derivationPathSolana = action.payload;
    },
    setSeedPhraseExpirationTime: (state, action) => {
      state.seedPhraseExpirationTime = action.payload;
    },
    setFirstWalletImportedStatus: (state, action) => {
      state.isFirstWalletImported = action.payload;
    },
    addInProgressTransactionHash: (state, action) => {
      const { chainId, nonce, transactionHash } = action.payload;
      state.inProgressTransactionHashes = {
        ...state.inProgressTransactionHashes,
        [chainId]: {
          ...(state.inProgressTransactionHashes?.[chainId]
            ? state.inProgressTransactionHashes[chainId]
            : {}),
          [nonce]: [
            ...(state.inProgressTransactionHashes?.[chainId]?.[nonce]
              ? state.inProgressTransactionHashes[chainId][nonce]
              : []),
            transactionHash,
          ],
        },
      };
    },
    setInProgressTransactionHash: (state, action) => {
      state.inProgressTransactionHashes = action.payload;
    },
    setWelcomeMessage: (state, action) => {
      state.welcomeMessage = action.payload;
    },
    resetCustomGasOption: (state) => {
      state.networkFeeSettings = {
        feeType: state.networkFeePreference,
        gasInfo: {
          ...state.networkFeeSettings.gasInfo,
          [NetworkFeeTypeChosen.Custom]: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
        },
      };
    },
    setNetworkFeePrefernce: (state, action: PayloadAction<number>) => {
      state.networkFeePreference = action.payload;
    },
    setIsDappRoutes: (state, action: PayloadAction<boolean>) => {
      state.isDappRoutes = action.payload;
    },
    setTransactionTrigerredMessage: (state, action) => {
      state.transactionTrigerredMessage = action.payload;
    },
    setSwapImportedTokens: (state, action: PayloadAction<SwapResponse>) => {
      state.swapImportedTokens = action.payload;
    },
    setTxInIntervalList: (state, action) => {
      state.txIntervalList = [...state.txIntervalList, action.payload];
    },
    setEmptyTxIntervalList: (state) => {
      state.txIntervalList = [];
    },
    setFilteredTxIntervalList: (state, action) => {
      state.txIntervalList = action.payload;
    },

    setMinSolTokenBalance: (state, action) => {
      state.minimumSolTokenBalance = action.payload;
    },
    setRpcUrl: (state, action) => {
      const { chainId, url } = action.payload;
      state.NETWORKCHAIN[chainId].NODE_URL = url;
    },
    setNonNativeDefault: (state, action) => {
      const tokensList = state.nonNativeDefaultAndTopTokens.tokens;
      Object.assign(tokensList, action.payload);
      state.nonNativeDefaultAndTopTokens = {
        expiry: new Date().getTime() + ONE_DAY_TIME,
        tokens: tokensList,
      };
    },

    setNewDefaultToken: (state, action) => {
      state.TokensToBeAddedInEachAccount.push(action.payload);
    },
  },
});

export const {
  setUserLoggedIn,
  setColorTheme,
  setGraphQueryData,
  setGraphData,
  setPassword,
  setIsUserExists,
  setNewWallet,
  showLoading,
  isMnemonicSaved,
  setIsHoldFinish,
  switchNetwork,
  setExpirationTime,
  setHashedPassword,
  setShowModalWalletNetwork,
  setTotalSum,
  setTotalFilteredSum,
  setProfit,
  setSendSnackBarStatus,
  setSwapSnackBarStatus,
  setPendingTransactionLoaderStatus,
  setAddressBook,
  removeContact,
  setNetworkFeeSettings,
  setSlideAnimation,
  setSlideAnimationCompletionStatus,
  setTransactionCompletedStatus,
  setPendingTransactionStates,
  setCompletedTransactionStates,
  closeSnackBarOnCompletion,
  setLastReceivedTransactionTime,
  removerUserFromAppSlice,
  setSnackBarOpen,
  setSnackBarClose,
  setGeneratedMnemonic,
  setSlippageToleranceSettings,
  setSnackBarMessage,
  setSelectedInputId,
  setRecentSearchedKeywords,
  deleteRecentSearchedKeywords,
  setShowGraph,
  setAlert,
  closeAlert,
  setwalletCreatedAlert,
  setNavigationPath,
  setDerivationPathSolana,
  setSeedPhraseExpirationTime,
  setFirstWalletImportedStatus,
  addInProgressTransactionHash,
  setInProgressTransactionHash,
  setWelcomeMessage,
  setLoginExpiryPeriod,
  resetCustomGasOption,
  setNetworkFeePrefernce,
  setIsDappRoutes,
  setTransactionTrigerredMessage,
  setSwapImportedTokens,
  setFailedModalAlert,
  setTxInIntervalList,
  setEmptyTxIntervalList,
  setFilteredTxIntervalList,
  setAppSliceState,
  setMinSolTokenBalance,
  setRpcUrl,
  setNonNativeDefault,
  setNewDefaultToken,
} = appSlice.actions;

export default appSlice.reducer;
