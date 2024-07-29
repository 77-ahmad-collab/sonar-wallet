import { AddressBalanceMap } from "eth-balance-checker/lib/common";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  Accounts,
  AllWallets,
  DefaultSwapSelectedTokens,
  DefaultTokenSelected,
  FilteredAccounts,
  NewWalletState,
  NumOfTokens,
  SecondaryHoldings,
  SetAccountsSelected,
  SetAccountsSum,
  SetWalletsSum,
  TokenHoldings,
  TokenInfo,
} from "interfaces";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "utils/constants";
import { matchAddresses } from "utils";
import { NewWalletMockState } from "mock";
import _ from "lodash";

const initialState: NewWalletState = process.env.isTesting
  ? { ...NewWalletMockState }
  : {
      allWallets: {},
      accounts: {},
      tokenHoldings: {},
      tokenInfo: {},
      filteredAccounts: {},
      accountsSum: {},
      walletsSum: {},
      filteredHoldings: {},
      secondaryHoldings: {},
      tokenSelected: DefaultTokenSelected,
      activity: {},
      swapSelectedTokens: DefaultSwapSelectedTokens,
      numOfTokens: {
        active: 0,
        inActive: 0,
        total: 0,
      },
      filteredWallets: {},
    };

const newWalletSlice = createSlice({
  name: "newWallet",
  initialState,
  reducers: {
    setNewWalletState: (state) => {
      // state = NewWalletMockState;
      return {
        ...state,
        ...NewWalletMockState,
      };
    },
    setAllWallets: (state, action: PayloadAction<AllWallets>) => {
      state.allWallets = Object.assign({}, state.allWallets, action.payload);
    },
    setAccounts: (state, action) => {
      state.accounts = Object.assign({}, state.accounts, action.payload);
    },
    setTokenInfo: (state, action: PayloadAction<TokenInfo>) => {
      state.tokenInfo = Object.assign({}, state.tokenInfo, action.payload);
    },
    setTokenHoldings: (state, action: PayloadAction<TokenHoldings>) => {
      state.tokenHoldings = Object.assign(
        {},
        state.tokenHoldings,
        action.payload
      );
    },
    updateTokenHoldings: (
      state,
      action: PayloadAction<{
        chainId: string;
        response: AddressBalanceMap;
      }>
    ) => {
      const { chainId, response } = action.payload;
      Object.keys(response).forEach((address) => {
        Object.keys(response[address]).forEach((tokenAddress) => {
          const rawAmount = response[address][tokenAddress] || "0";

          if (matchAddresses(tokenAddress, ZERO_ADDRESS)) {
            tokenAddress = NATIVE_TOKEN_ADDRESS;
          }
          if (
            state.tokenHoldings[address] !== undefined &&
            state.tokenHoldings[address][chainId] !== undefined &&
            state.tokenHoldings[address][chainId][tokenAddress] !== undefined
          ) {
            state.tokenHoldings[address][chainId][tokenAddress].rawAmount =
              rawAmount;
          }
        });
      });
    },
    setAccountsFilter: (
      state,
      {
        payload: { accounts, walletId },
      }: PayloadAction<{ accounts: FilteredAccounts; walletId: string }>
    ) => {
      // for accounts filter
      state.filteredAccounts = Object.assign(
        {},
        state.filteredAccounts,
        accounts
      );
      // for wallet filter
      const copyWalletFilter = state.filteredWallets;
      copyWalletFilter[walletId] ?? (copyWalletFilter[walletId] = {});
      state.filteredWallets = Object.assign({}, state.filteredWallets, {
        [walletId]: {
          ...copyWalletFilter[walletId],
          ...accounts,
        },
      });
    },
    setAccountsSelected: (
      state,
      action: PayloadAction<SetAccountsSelected[]>
    ) => {
      const copyWalletFilter = { ...state.filteredWallets };
      action.payload.forEach((account) => {
        state.filteredAccounts[account.address].isSelected = account.value;
        const walletId = state.accounts[account.address].walletId;
        copyWalletFilter[walletId][account.address].isSelected = account.value;
      });
      state.filteredWallets = copyWalletFilter;
    },
    setAccountsSum: (state, action: PayloadAction<SetAccountsSum>) => {
      state.accountsSum = action.payload;
    },
    setWalletsSum: (state, action: PayloadAction<SetWalletsSum>) => {
      state.walletsSum = action.payload;
    },
    setFilteredHoldings: (state, action: PayloadAction<SecondaryHoldings>) => {
      state.filteredHoldings = action.payload;
    },
    setSecondaryHoldings: (state, action: PayloadAction<SecondaryHoldings>) => {
      state.secondaryHoldings = action.payload;
    },
    setTokenSelected: (state, action) => {
      state.tokenSelected = { ...state.tokenSelected, ...action.payload };
    },
    setDefaultTokenSelected: (state) => {
      state.tokenSelected = DefaultTokenSelected;
    },
    setTokenActiveness: (
      state,
      action: PayloadAction<{
        tokenAddress: string;
        tokenSymbol: string;
        state: boolean;
      }>
    ) => {
      const tokenIdentity = `${action.payload.tokenAddress}_${action.payload.tokenSymbol}`;
      const copyTokenInfo = state.tokenInfo[tokenIdentity];

      copyTokenInfo.isActive = action.payload.state;
      state.tokenInfo = Object.assign({}, state.tokenInfo, {
        [tokenIdentity]: copyTokenInfo,
      });
    },
    setTokenImageAndPrice: (
      state,
      action: PayloadAction<{
        tokenAddress: string;
        tokenSymbol: string;

        image: string;
        price: number;
      }>
    ) => {
      const tokenIdentity = `${action.payload.tokenAddress}_${action.payload.tokenSymbol}`;
      const copyTokenInfo = state.tokenInfo[tokenIdentity];
      copyTokenInfo.image = action.payload.image;

      state.tokenInfo = Object.assign({}, state.tokenInfo, {
        [tokenIdentity]: copyTokenInfo,
      });
    },
    setTransactionActivityData: (state, action) => {
      state.activity = action.payload;
    },
    setSwapSelectedTokens: (state, action) => {
      state.swapSelectedTokens = {
        ...state.swapSelectedTokens,
        ...action.payload,
      };
    },
    setDefaultSwapSelectedTokens: (state) => {
      state.swapSelectedTokens = DefaultSwapSelectedTokens;
    },
    clearAllTokenSelections: (state) => {
      state.swapSelectedTokens = DefaultSwapSelectedTokens;
      state.tokenSelected = DefaultTokenSelected;
    },
    setDefaultTokens: (
      state,
      action: PayloadAction<{
        tokenHoldings: TokenHoldings;
        tokenInfo: TokenInfo;
      }>
    ) => {
      state.tokenInfo = action.payload.tokenInfo;
      state.tokenHoldings = action.payload.tokenHoldings;
    },
    clearHoldings: () => initialState,
    setNumOfTokens: (state, action: PayloadAction<NumOfTokens>) => {
      state.numOfTokens = action.payload;
    },
    setFilteredWallet: (state) => {
      state.filteredWallets = {
        "2a6280e4-e1b0-4750-837f-28e0660470dd": {
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
            isSelected: true,
          },
          EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
            isSelected: true,
          },
          "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
            isSelected: true,
          },
        },
      };
    },
    setNewWallet: (state) => {
      state.filteredWallets = {
        "2a6280e4-e1b0-4750-837f-28e0660470dd": {
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847": {
            isSelected: true,
          },
          EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q: {
            isSelected: true,
          },
          "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d": {
            isSelected: true,
          },
        },
        "c5121ff6-8d02-43d1-a026-e10a42ba3471": {
          "0xa22920874156B8F80b8E22280828cB12185bD1A4": {
            isSelected: true,
          },
          D67ho5rMbEPsut3WaW7h8wfeVVBx5ugwtJLYjbZ32Dg3: {
            isSelected: true,
          },
          "2df1798232bf1dc55f7e78ddc8872609a5fbfe4eb0477f228343982824231559": {
            isSelected: true,
          },
        },
      };
    },
    addFromTokenChainFamily: (state, action) => {
      state.tokenSelected.from.chainFamily = action.payload;
    },
    setNewTokenIntroduction: (
      state,
      action: PayloadAction<{
        tokenInfo: TokenInfo;
        tokenHolding: TokenHoldings;
      }>
    ) => {
      state.tokenInfo = Object.assign(
        {},
        state.tokenInfo,
        action.payload.tokenInfo
      );
      state.tokenHoldings = Object.assign(
        {},
        state.tokenHoldings,
        action.payload.tokenHolding
      );
    },
    introduceAccountActions: (
      state,
      action: PayloadAction<{
        updatedAllWallets: AllWallets;
        tokenHoldings: TokenHoldings;
        tokenInfo: TokenInfo;
        newAccount: Accounts;
        filteredAccounts: { accounts: FilteredAccounts; walletId: string };
      }>
    ) => {
      if (!_.isEmpty(action.payload.updatedAllWallets)) {
        state.allWallets = Object.assign(
          {},
          state.allWallets,
          action.payload.updatedAllWallets
        );
      }

      if (!_.isEmpty(action.payload.tokenInfo)) {
        state.tokenInfo = action.payload.tokenInfo;
      }

      if (!_.isEmpty(action.payload.tokenHoldings)) {
        state.tokenHoldings = action.payload.tokenHoldings;
      }

      state.accounts = Object.assign(
        {},
        state.accounts,
        action.payload.newAccount
      );

      const { accounts, walletId } = action.payload.filteredAccounts;
      // for accounts filter
      state.filteredAccounts = Object.assign(
        {},
        state.filteredAccounts,
        accounts
      );
      // for wallet filter
      const copyWalletFilter = state.filteredWallets;
      copyWalletFilter[walletId] ?? (copyWalletFilter[walletId] = {});
      state.filteredWallets = Object.assign({}, state.filteredWallets, {
        [walletId]: {
          ...copyWalletFilter[walletId],
          ...accounts,
        },
      });
    },
    setWalletSliceState: (state) => {
      // state = { ...NewWalletMockState };
      return {
        ...state,
        ...NewWalletMockState,
      };
    },
  },
});

export const {
  setAllWallets,
  setAccounts,
  setTokenInfo,
  setTokenHoldings,
  updateTokenHoldings,
  setAccountsFilter,
  setAccountsSelected,
  setAccountsSum,
  setWalletsSum,
  setFilteredHoldings,
  setSecondaryHoldings,
  setTokenSelected,
  setTokenActiveness,
  setTransactionActivityData,
  setDefaultTokenSelected,
  setSwapSelectedTokens,
  setDefaultSwapSelectedTokens,
  setDefaultTokens,
  clearHoldings,
  setNumOfTokens,
  clearAllTokenSelections,
  setTokenImageAndPrice,
  setNewWalletState,
  addFromTokenChainFamily,
  setNewWallet,
  setFilteredWallet,
  setNewTokenIntroduction,
  setWalletSliceState,
  introduceAccountActions,
} = newWalletSlice.actions;

export default newWalletSlice.reducer;
