import { useEffect, useMemo, useState } from "react";

import { SwapTransactionData, TransactionData } from "interfaces";
import { StaticStore, useAppSelector } from "store/store";
import { useNetwork } from "./useNetwork";
import { ACTIVITY_STATUS_TYPES, TX_TYPES, Tx_METHODS } from "utils/constants";
import { matchAddresses } from "utils";

export const useTxActivity = () => {
  const { activity, filteredAccounts, tokenInfo, tokenSelected } =
    useAppSelector((state) => state.newWallet);

  const { isTestnet, NETWORKCHAIN } = useAppSelector((state) => state.app);

  const [filteredActivity, setFilteredActivity] = useState<
    (TransactionData | SwapTransactionData)[]
  >([]);

  const [allPendingTransactions, setAllPendingTransactions] = useState<
    (TransactionData | SwapTransactionData)[]
  >([]);

  const [snackBarData, setSnackBarData] = useState<
    TransactionData | SwapTransactionData
  >({
    txType: TX_TYPES.Sent,
    from: "",
    to: "",
    token: {
      name: "",
      symbol: "",
      address: "",
      image: "",
      amount: 0,
      amountInUsd: 0,
      decimal: 0,
    },

    transactionFeeInUsd: 0,
    timeStamp: new Date().getTime(),
    nonce: 0,
    rawData: "",
    chainId: 0,
    transactionHash: "",
    status: ACTIVITY_STATUS_TYPES.success,

    address: "",
    walletName: "",
    isSpeedUpCancelBlinking: false,
    isSpeedUpEnabled: false,
    isCancelEnabled: false,
    receiverNameInTheAddressBook: "",
    senderNameInTheAddressBook: "",
    txMethod: Tx_METHODS.normal,
    isDappTransaction: false,
  });

  const { currentChainIDs } = useNetwork();

  //-------------------------------------------------------SUPPORTED FILTER PARMETERS AND FUNCTIONS
  const temp = {
    [TX_TYPES.Sent]: { isSelected: true },
    [TX_TYPES.Swap]: { isSelected: true },
    [TX_TYPES.Received]: { isSelected: true },
  };

  /**
   * filterActivityItemBytxType
   * This function is responsible to filter out transaction based on the transaction type.
   * @param  activityItem: TransactionData | SwapTransactionData
   * If user has selected only Swap transaction type, then only transactions related to swap will be shown.
   * Same case for the Send and receive transaction. Any of the transaction type can be selected or dis-selected.
   *
   * @returns {Boolean} either true or false
   */
  const filterActivityItemBytxType = (
    activityItem: TransactionData | SwapTransactionData
  ) => {
    if (temp[activityItem.txType]?.isSelected) return true;
    else return false;
  };

  /**
   * Filtering the item, if the token is active then show its transaction only.
   * @param activityItem  TransactionData | SwapTransactionData
   * if user has selected only particular token detail, then only that token transactions will be shown.
   * if not selected any particular token detail, then only if token is active , it will return true.
   *
   * @returns {Boolean} either true or false
   */
  const filterInternalActivityItemBytxToken = (
    activityItem: TransactionData | SwapTransactionData
  ) => {
    const tokenKey = `${activityItem.token.address}_${activityItem.token.symbol}`;
    const { address, symbol } = tokenSelected.token;

    if (
      tokenInfo[tokenKey]?.isActive &&
      activityItem.status !== ACTIVITY_STATUS_TYPES.inProgress &&
      activityItem.status !== ACTIVITY_STATUS_TYPES.invalid
      // &&
      // activityItem.status !== ACTIVITY_STATUS_TYPES.cancel &&
      // activityItem.status !== ACTIVITY_STATUS_TYPES.failed
    ) {
      // THis is the token address that is destructured as address
      if (address.length > 0) {
        if (activityItem.txType !== TX_TYPES.Swap)
          return (
            matchAddresses(activityItem?.token?.address, address) &&
            matchAddresses(activityItem?.token?.symbol, symbol)
          );
        else if ("tokenB" in activityItem) {
          return (
            (matchAddresses(activityItem?.token?.address, address) ||
              matchAddresses(activityItem?.tokenB?.address, address)) &&
            (matchAddresses(activityItem?.token?.symbol, symbol) ||
              matchAddresses(activityItem?.tokenB?.symbol, symbol))
          );
        }
      } else return true;
    } else return false;
  };

  /**
   * Filtering the transaction item, that is placed through dapp
   * In dapp, in case of native token, we have the address we can filter out native token transactions.
   * On the other hand, for non-native transactions, we don't have the token address, we cannot filter out on these conditions.
   * @param activityItem  TransactionData | SwapTransactionData
   * if user has selected any of the native token detail, then only that token transactions will be shown. while in non native we will simply hide that transaction
   *
   * @returns {Boolean} either true or false
   */

  const filterDappActivityItemBytxToken = (
    activityItem: TransactionData | SwapTransactionData
  ) => {
    const { address, symbol } = tokenSelected.token;

    const tokenInfo = StaticStore.getState().newWallet.tokenInfo;

    if (activityItem.token.address) {
      const tokenKey = `${activityItem.token.address}_${activityItem.token.symbol}`;

      if (
        tokenInfo[tokenKey]?.isActive &&
        activityItem.status !== ACTIVITY_STATUS_TYPES.inProgress &&
        activityItem.status !== ACTIVITY_STATUS_TYPES.invalid
      ) {
        if (address) {
          return (
            matchAddresses(activityItem?.token?.address, address) &&
            matchAddresses(activityItem?.token?.symbol, symbol)
          );
        } else return true;
      } else return false;
    } else if (!address) return true;
    else return false;
  };

  /**
   * filterActivityItemBytxToken
   * @param activityItem  TransactionData | SwapTransactionData
   * There are 2 different cases here.
   * 1 : if that transaction is made through any dapp.
   * 2:  if that transaction is placed internally through the wallet.
   *
   *
   * @returns {Boolean} either true or false
   */
  const filterActivityItemBytxToken = (
    activityItem: TransactionData | SwapTransactionData
  ) => {
    if (activityItem.isDappTransaction)
      return filterDappActivityItemBytxToken(activityItem);
    else return filterInternalActivityItemBytxToken(activityItem);
  };

  /**
   *filterActivityItemByAccountAddress
   * @param activityItem  TransactionData | SwapTransactionData
   * Filter the item, if user has selected only any of the token detail of any account.
   * Then only particular account, that selected token transaction will be shown.
   *
   * @returns {Boolean} either true or false
   */
  const filterActivityItemByAccountAddress = (
    activityItem: TransactionData | SwapTransactionData
  ) => {
    const {
      from: { address },
    } = tokenSelected;
    if (address) {
      if (matchAddresses(activityItem.address, address)) return true;
      else return false;
    } else return true;
  };
  //-----------------------------------FILTER FUNCTION WHICH WILL CHECK AROUND DIFFERENT FILTERS AND RETURN THE STATUS OF EACH ITEM TO SHOW OR NOT

  /**
   * This function is responsible to filter out activity item base on different scenarios.
   * @param activityItem  TransactionData | SwapTransactionData
   *
   * Filtration is broken in to 3 different categories.
   *
   * if any of the filter doesn't return true, that means we don't have to show that particular transaction item.
   *
   * @returns {Boolean} either true or false -> show transaction item or not
   */
  const filterActivityItem = (
    activityItem: TransactionData | SwapTransactionData
  ) => {
    if (
      filterActivityItemBytxType(activityItem) &&
      filterActivityItemBytxToken(activityItem) &&
      filterActivityItemByAccountAddress(activityItem)
    ) {
      return true;
    } else return false;
  };

  //-----------------------------------FILTERED TRANSACTION ACTIVITY WILL BE POPULATED ON THE BASIS OF FILTERS
  /**
   * This function is to get the filtered transactions based on different filtration option.
   *
   * @returns activityData (TransactionData | SwapTransactionData)[]
   */
  const activityList = useMemo(() => {
    let activityData: (TransactionData | SwapTransactionData)[] = [];
    const allTransactions: (TransactionData | SwapTransactionData)[] = [];

    Object.keys(activity).forEach((accountAddress) => {
      if (filteredAccounts[accountAddress]?.isSelected) {
        // ------------------------------only process with those accounts that are selected in wallet filter
        Object.keys(activity[accountAddress]).forEach((chainId) => {
          const currentChainActivities = activity[accountAddress][+chainId];
          Object.values(currentChainActivities).forEach((item) => {
            const data = filterActivityItem(item);
            allTransactions.push(item);
            if (data) {
              if (item.status === ACTIVITY_STATUS_TYPES.pending)
                activityData.unshift(item);
              else activityData.push(item);
            }
          });
          // }
        });
      }
    });
    activityData = activityData.sort((a, b) =>
      b.status === ACTIVITY_STATUS_TYPES.pending ? 1 : b.timeStamp - a.timeStamp
    );

    return { allTransactions, activityData };
  }, [activity, isTestnet, filteredAccounts, tokenSelected.token, tokenInfo]);

  /**
   * In this useEffect, filtering out the transaction data according to the mainnet or testnet chainIds. Further, setting the last pending transaction data
   * in the snackbar.
   */
  useEffect(() => {
    const { allTransactions, activityData } = activityList;
    setFilteredActivity(
      activityData.filter((item) => {
        return currentChainIDs.includes(+item.chainId);
      })
    );

    const testnetAndMainnetPendingTransactions = allTransactions.filter(
      (item) => item.status === ACTIVITY_STATUS_TYPES.pending
    );

    const pendingTransactionsOfCurrentNetwork =
      testnetAndMainnetPendingTransactions
        .filter((item) => NETWORKCHAIN[+item.chainId].isTestnet === isTestnet)
        .sort((a, b) => b.timeStamp - a.timeStamp);

    if (pendingTransactionsOfCurrentNetwork.length > 0) {
      setSnackBarData(pendingTransactionsOfCurrentNetwork[0]);
    }

    setAllPendingTransactions(testnetAndMainnetPendingTransactions);
  }, [activity, isTestnet, filteredAccounts, tokenSelected.token]);

  return {
    filteredActivity,
    allPendingTransactions,
    snackBarData,
    activityData: activityList.activityData,
  };
};
