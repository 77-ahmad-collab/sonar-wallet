import { validateEVMAddress } from "./../utils/validateAddresses";
import { useEffect, useMemo } from "react";

import { ethers } from "ethers";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { useGraphData } from "hooks";
import {
  setAlert,
  setEmptyTxIntervalList,
  setGraphQueryData,
  setIsHoldFinish,
  setLastReceivedTransactionTime,
  setMinSolTokenBalance,
  setNetworkFeePrefernce,
  setPendingTransactionLoaderStatus,
  setSendSnackBarStatus,
  setSlideAnimation,
  setSnackBarClose,
  setSwapSnackBarStatus,
  setTotalFilteredSum,
  setTotalSum,
  setTransactionTrigerredMessage,
  setTxInIntervalList,
  setUserLoggedIn,
} from "@slices/appSlice";
import { CalculateSums, HoldingsConvertor } from "classes";
import {
  setAccountsSum,
  setFilteredHoldings,
  setNumOfTokens,
  setSecondaryHoldings,
  setWalletsSum,
} from "@slices/newWalletSlice";
import {
  ACTIVITY_STATUS_TYPES,
  NETWORKS,
  PENDING_TRANSACTION_TIMEOUT,
  TX_TYPES,
} from "utils/constants";
import {
  DynamicBalanceEVM,
  SwapTransactionData,
  TransactionData,
} from "interfaces";
import { useAfterTransaction } from "./useAfterTransaction";
import { dynamicBalanceUpdater, getHoldings } from "utils/utils.holdings";
import {
  changeRpcFromTheList,
  checkSum,
  getSolanaConnectionForTransaction,
  getTopTokenList,
} from "utils";
import _ from "lodash";
import {
  getAllReceivedTransactions,
  getTransactions,
  onDappTransactionComplete,
  onDappTransactionFailure,
  storeTransactionActivityData,
} from "utils/utils.activity";
import { useNavigate } from "react-router";

import { LockWallet } from "utils/utils.wallets";

export const useApp = () => {
  const dispatch = useAppDispatch();

  const { calculateGraphData } = useGraphData();
  const {
    onTransactionComplete,
    onTransactionFailure,
    // onDappTransactionComplete,
    // onDappTransactionFailure,
  } = useAfterTransaction();
  const navigate = useNavigate();

  const {
    isTestnet,
    isLoggedIn,
    isUserExists,
    isTransactionCompleted,
    graphQueryData,
    transactionTrigerredMessage,
    inProgressTransactionHashes,
    NETWORKCHAIN,
    expirationTime,
  } = useAppSelector((state) => state.app);

  const {
    tokenHoldings,
    accounts,
    accountsSum,
    allWallets,
    filteredAccounts,
    tokenInfo,
    secondaryHoldings,
  } = useAppSelector((state) => state.newWallet);

  useEffect(() => {
    selectNetworkPerefernce();
    dispatch(setEmptyTxIntervalList([]));
    changeRpcFromTheList();
    // Check every minute (60000 milliseconds)
  }, []);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (isLoggedIn) {
      const time = expirationTime - new Date().getTime() + 1000;

      intervalId = setTimeout(() => {
        if (new Date().getTime() > expirationTime) {
          LockWallet();
        }
      }, time);
    }
    // Clear the interval when the component is unmounted
    return () => clearTimeout(intervalId);
  }, [isLoggedIn, expirationTime]);

  const selectNetworkPerefernce = () => {
    const utcHours = new Date().getUTCHours();
    if (utcHours < 4 || utcHours > 14) {
      dispatch(setNetworkFeePrefernce(2));
    }
  };

  useEffect(() => {
    calculateGraphData(graphQueryData);
  }, [graphQueryData]);

  useEffect(() => {
    if (isLoggedIn) {
      getHoldings(["SOLANA", "NEAR", "EVM"]);
    }
  }, [accounts, isTestnet, isUserExists, isLoggedIn]);

  /**
   * This function is responsible to update the last received transaction time, so we only fetch new received transaction from that time.
   * First, it will filter out the all the received transaction and will save the timestamp of last received transaction.
   */
  const storeLastReceivedTransactionTime = () => {
    const transactions = getTransactions(StaticStore)
      .filter((item) => item.txType === TX_TYPES.Received)
      .sort((a, b) => b.timeStamp - a.timeStamp);

    if (transactions.length > 0)
      dispatch(
        setLastReceivedTransactionTime(transactions[0]?.timeStamp + 10000)
      );
  };

  //accounts sum listener
  useEffect(() => {
    const sums = new CalculateSums(isTestnet);
    sums.calculateAccountsSum(accounts, secondaryHoldings);
    dispatch(setAccountsSum(sums.allAccountsSum));
    dispatch(setTotalSum(sums.totalSum));
  }, [accounts, isTestnet, secondaryHoldings]);

  // wallets sum listener
  useEffect(() => {
    const sums = new CalculateSums(isTestnet);
    sums.calculateWalletSum(accountsSum, accounts);
    dispatch(setWalletsSum(sums.allWalletsSum));
  }, [accountsSum]);

  // filtered sum listener
  useEffect(() => {
    const sums = new CalculateSums(isTestnet);
    sums.calculateFilteredSums(accountsSum, filteredAccounts);
    dispatch(setTotalFilteredSum(sums.filteredSum));
  }, [accountsSum, filteredAccounts]);

  // filtered wallet listener
  useEffect(() => {
    if (!_.isEmpty(allWallets)) {
      const convertor = new HoldingsConvertor(isTestnet);
      convertor.toSecondaryHoldings(
        tokenHoldings,
        tokenInfo,
        filteredAccounts,
        accounts,
        allWallets
      );

      dispatch(setFilteredHoldings(convertor.filteredHoldings));
      dispatch(setSecondaryHoldings(convertor.secondaryHoldings));
      dispatch(setNumOfTokens(convertor.numOfTokens));
      dispatch(setGraphQueryData(convertor.graphQueryData));
    }
  }, [tokenHoldings, filteredAccounts, isTestnet, tokenInfo, allWallets]);

  useEffect(() => {
    dispatch(setSlideAnimation("contract"));
    dispatch(setIsHoldFinish(false));
    if (transactionTrigerredMessage) {
      dispatch(
        setAlert({
          open: true,
          body: transactionTrigerredMessage,
          heading: "Transaction status",
        })
      );
      dispatch(setTransactionTrigerredMessage(""));
    }
  }, []);

  /**
   * This useEffect is responsible,  to close or to open the snackbar, when the user dis-selects the account or re-selects the account.
   */
  useEffect(() => {
    // const pendingTransactions = allPendingTransactions.filter(
    //   (item) =>
    //     // item.status === ACTIVITY_STATUS_TYPES.pending &&
    //     NETWORKCHAIN[+item.chainId].isTestnet === isTestnet
    // );
    const tx = getTransactions(StaticStore);

    const isTestNetwork = StaticStore.getState().app.isTestnet;

    const pendingTransactions = tx.filter((item) => {
      return (
        item.status == ACTIVITY_STATUS_TYPES.pending &&
        NETWORKCHAIN[item.chainId].isTestnet == isTestNetwork
      );
    });
    console.log(
      "🚀 ~ file: useApp.ts:203 ~ pendingTransactions ~ pendingTransactions:",
      pendingTransactions
    );

    if (pendingTransactions.length > 0) {
      if (pendingTransactions[0].txType === TX_TYPES.Sent)
        dispatch(setSendSnackBarStatus(true));
      else dispatch(setSwapSnackBarStatus(true));

      dispatch(setPendingTransactionLoaderStatus(false));
    } else {
      // dispatch(setSendSnackBarStatus(false));
      // dispatch(setSwapSnackBarStatus(false));
      // dispatch(setPendingTransactionLoaderStatus(false));
    }
  }, [isTransactionCompleted, tokenInfo]);

  const dynamicBalanceChecker: DynamicBalanceEVM = useMemo(() => {
    const addresses = Object.keys(tokenHoldings).reduce((prev, current) => {
      if (validateEVMAddress(current)) {
        prev.push(current);
      }
      return prev;
    }, [] as string[]);

    return Object.keys(NETWORKCHAIN).reduce((previous, chainId) => {
      if (NETWORKCHAIN[+chainId].chain === NETWORKS.EVM) {
        const web3 = new ethers.providers.JsonRpcProvider(
          NETWORKCHAIN[+chainId].NODE_URL
        );

        const tokens = addresses.reduce((prev, address) => {
          if (tokenHoldings[address][+chainId] !== undefined) {
            return [
              ...new Set(
                prev.concat(Object.keys(tokenHoldings[address][+chainId]))
              ),
            ];
          } else {
            return [...new Set(prev)];
          }
        }, [] as string[]);

        return {
          ...previous,
          [chainId]: {
            web3Instance: web3,
            addresses: addresses,
            tokens: tokens,
            contractAddress: NETWORKCHAIN[+chainId].BALANCE_CHECKER,
          },
        };
      }
      return { ...previous };
    }, {});
  }, []);

  /**
   * This function is responsible for tracking the pending transaction, either the transaction is failed or executed successfully.
   * @param   pendingTransactions: (TransactionData | SwapTransactionData)[];
   *
   * if the transaction remains in pending for more than 30 minutes, then that particular transaction will be hided from the ui, but it will continue to
   * be listened until its failed or success.
   */
  // let txx: any = [];
  const checkPendingTransactions = async ({
    pendingTransactions,
  }: {
    pendingTransactions: (TransactionData | SwapTransactionData)[];
  }) => {
    let web3: any;
    const result = await Promise.allSettled(
      pendingTransactions.map(async (transaction) => {
        StaticStore.dispatch(setTxInIntervalList(transaction.transactionHash));

        const interval = setInterval(async () => {
          const updatedInprogressTransactionHashes =
            StaticStore.getState().app.inProgressTransactionHashes;
          const { chainId, transactionHash, address, to, timeStamp } =
            transaction;
          web3 = new ethers.providers.JsonRpcProvider(
            NETWORKCHAIN[chainId].NODE_URL
          );

          const tokenReceipt = await web3.getTransactionReceipt(
            transaction.transactionHash
          );
          console.log(
            "🚀 ~ file: useApp.ts:293 ~ interval ~ tokenReceipt:",
            tokenReceipt,
            transaction.transactionHash
          );

          if (
            tokenReceipt &&
            tokenReceipt.status &&
            !transaction.isDappTransaction
          ) {
            onTransactionComplete({
              address: checkSum(transaction.address),
              web3,
              transaction,
              // transactionHash,
              // chainId,
              // txType: transaction.txType,
              // method: transaction.txMethod,
              // to,
              // nonce: transaction.nonce,
            });

            clearInterval(interval);
          } else if (
            tokenReceipt &&
            !tokenReceipt.status &&
            !transaction.isDappTransaction
          ) {
            onTransactionFailure({
              address: address,
              transaction,
              // transactionHash,
              // chainId,
              // nonce: transaction.nonce,
              // txType: transaction.txType,
            });

            clearInterval(interval);
          } else if (
            "isDappTransaction" in transaction &&
            transaction.isDappTransaction &&
            tokenReceipt.status
          ) {
            onDappTransactionComplete({ transaction, store: StaticStore });

            clearInterval(interval);
          } else if (
            "isDappTransaction" in transaction &&
            transaction.isDappTransaction &&
            !tokenReceipt.status
          ) {
            onDappTransactionFailure({ transaction, store: StaticStore });

            clearInterval(interval);
          } else if (
            !updatedInprogressTransactionHashes[transaction.chainId][
              transaction.nonce
            ]
          ) {
            clearInterval(interval);
          } else if (
            new Date().getTime() - timeStamp > PENDING_TRANSACTION_TIMEOUT &&
            transaction.status === ACTIVITY_STATUS_TYPES.pending
          ) {
            const item = {
              ...transaction,
              status: ACTIVITY_STATUS_TYPES.inProgress,
            };

            dispatch(
              setAlert({
                open: true,
                body: "Transaction was not mined within 750 seconds, Please make sure your transaction was properly sent. Be aware it might still be mined",
                heading: "Transaction status",
              })
            );
            await storeTransactionActivityData({
              transactionData: item,
            });

            dispatch(setSnackBarClose({ txType: item.txType }));
            // clearInterval(interval);
          } else return null;
        }, 3000);
      })
    );
    return result;
  };
  const setSolanaMinimumBalance = async () => {
    const connection = getSolanaConnectionForTransaction(true);
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0
    );
    dispatch(setMinSolTokenBalance(minimumBalance));
  };
  /**
   * This useEffect is responsible to filter out the pending transactions and pass it to checkPendingTransactions to know their status. Completed or not.
   */
  const checkForPendingTransactions = async () => {
    const tx = getTransactions(StaticStore);

    const isTestNetwork = StaticStore.getState().app.isTestnet;

    const pendingTransactions = await tx.filter((item) => {
      return (
        (item.status == ACTIVITY_STATUS_TYPES.pending ||
          item.status == ACTIVITY_STATUS_TYPES.inProgress) &&
        NETWORKCHAIN[item.chainId].isTestnet == isTestNetwork &&
        !StaticStore.getState().app.txIntervalList.includes(
          item.transactionHash
        )
      );
    });

    if (pendingTransactions.length > 0) {
      await checkPendingTransactions({
        pendingTransactions,
      });
    }
  };

  /**
   * This useEffect is responsible, to check for the pending transactions each after 5 seconds by setting up the interval.
   */
  useEffect(() => {
    checkForPendingTransactions();
  }, [inProgressTransactionHashes]);

  /**
   * This useEffect is responsible, to fetch the receive transactions of the accounts and update the last received transaction time.
   */
  useEffect(() => {
    getAllReceivedTransactions();
    storeLastReceivedTransactionTime();
    setSolanaMinimumBalance();
    getTopTokenList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dynamicBalanceUpdater(dynamicBalanceChecker);
    }, 15000);
    console.log(
      "🚀 ~ file: useApp.ts:436 ~ interval ~ dynamicBalanceChecker:",
      dynamicBalanceChecker
    );
    return () => clearInterval(interval);
  }, [dynamicBalanceChecker]);

  useEffect(() => {
    // chrome.runtime.sendMessage({ action: "copyEmptyString" });
  }, []);

  return {
    isLoggedIn,
    checkForPendingTransactions,
    storeLastReceivedTransactionTime,
    dynamicBalanceChecker,
  };
};
