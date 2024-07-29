import { setAlert, setCompletedTransactionStates } from "@slices/appSlice";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import {
  ACTIVITY_STATUS_TYPES,
  // NETWORKCHAIN,
  TX_TYPES,
  TransactionCancelMessage,
  TransactionFailureMessage,
  TransactionSuccessMessage,
  Tx_METHODS,
} from "utils/constants";

import { SwapTransactionData, TransactionData } from "interfaces";
import {
  clearSameNoncetransactions,
  decodeEvm,
  decodeEvmSwapTx,
  storeTransactionActivityData,
  updateStatesAfterTxStatusFinalized,
} from "utils/utils.activity";

export const useAfterTransaction = () => {
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  /**
   * This function is responsible when the transaction is completed and successfully completed when made through inside wallet.
   * @param address string
   * @param transactionHash string
   * @param chainId number
   * @param web3  Web3
   * @param txType TX_TYPES
   * @param method Tx_METHODS
   * @param to string
   * @param nonce number
   *
   * This method will decode the transaction, according to the transaction type. After the decoding of the data, necessary states will be updated.
   */
  const onTransactionComplete = async ({
    address,
    web3,
    transaction,
  }: // transactionHash,
  // chainId,

  // txType,
  // method,
  // to,
  // nonce,
  {
    address: string;
    web3: any;
    transaction: TransactionData | SwapTransactionData;
    // transactionHash: string;
    // chainId: number;

    // txType: TX_TYPES;
    // method: Tx_METHODS;
    // to: string;
    // nonce: number;
  }) => {
    const { transactionHash, txMethod, txType, chainId, nonce, to } =
      transaction;
    storeTransactionActivityData({
      transactionData: {
        ...transaction,
        status: ACTIVITY_STATUS_TYPES.success,
      },
    });
    await StaticStore.dispatch(
      setCompletedTransactionStates({
        txType,
        message:
          txMethod === Tx_METHODS.cancel
            ? TransactionCancelMessage
            : TransactionSuccessMessage,
      })
    );

    let transactionData!: TransactionData | SwapTransactionData;

    const updatedActivity = StaticStore.getState().newWallet.activity;
    const isTestnet = StaticStore.getState().app.isTestnet;
    const transactions = StaticStore.getState().app.inProgressTransactionHashes;

    const updateTxStatusHashes = transactions[chainId][nonce];

    if (txType === TX_TYPES.Sent && txMethod !== Tx_METHODS.cancel) {
      const data = await decodeEvm(
        [
          {
            address,
            transactionHash,
          },
        ],
        chainId,

        to
      );

      if (
        data.length > 0 &&
        data[0] !== null &&
        NETWORKCHAIN[data[0]?.chainId].isTestnet === isTestnet
      ) {
        transactionData = data[0];
      }
    } else if (txType === TX_TYPES.Swap && txMethod !== Tx_METHODS.cancel) {
      transactionData = await decodeEvmSwapTx({
        transactionHash,
        address,
        chainId,
      });
    } else if (txMethod === Tx_METHODS.cancel)
      transactionData = {
        ...updatedActivity[address][chainId][transactionHash],
        status: ACTIVITY_STATUS_TYPES.cancel,
      };

    if (transactionData.txType) {
      await updateStatesAfterTxStatusFinalized({
        address,
        chainId: +chainId,
        message:
          txMethod === Tx_METHODS.cancel
            ? TransactionCancelMessage
            : TransactionSuccessMessage,
        transactionData,
        transactionHash,
        updateTxStatusHashes,
        updatedActivity,
        store: StaticStore,
      });
      clearSameNoncetransactions(chainId, nonce, StaticStore);
    }
  };
  /**
   * This function is responsible when the transaction is completed and failed when made through inside wallet.
   * @param address string
   * @param chainId number
   * @param transactionHash string
   * @param nonce number
   * @param txType TX_TYPES
   *
   * This method will update the states and failure messages, according to the transaction type. An alert will be opened in order to prompt about the transaction
   * failure.
   */

  const onTransactionFailure = async ({
    address,
    transaction,
  }: // chainId,
  // transactionHash,
  // nonce,
  // txType,
  {
    address: string;
    transaction: TransactionData | SwapTransactionData;
    // transactionHash: string;
    // chainId: number;
    // nonce: number;
    // txType: TX_TYPES;
  }) => {
    const { txType, chainId, nonce, transactionHash } = transaction;

    await StaticStore.dispatch(
      setCompletedTransactionStates({
        txType,
        message: TransactionFailureMessage,
      })
    );
    storeTransactionActivityData({
      transactionData: {
        ...transaction,
        status: ACTIVITY_STATUS_TYPES.failed,
      },
    });
    const activity = StaticStore.getState().newWallet.activity;
    const transactions = StaticStore.getState().app.inProgressTransactionHashes;
    const updateTxStatusHashes = transactions[chainId][nonce];
    const updatedActivity = { ...activity };
    const failedTransactionItem = {
      ...activity[address][chainId][transactionHash],
      status: ACTIVITY_STATUS_TYPES.failed,
    };

    await updateStatesAfterTxStatusFinalized({
      address,
      chainId: +chainId,
      message: TransactionFailureMessage,
      transactionData: failedTransactionItem,
      transactionHash,
      updateTxStatusHashes,
      updatedActivity,
      store: StaticStore,
    });

    //////////////////////---------------------dont delete
    clearSameNoncetransactions(chainId, nonce, StaticStore);
    dispatch(
      setAlert({
        open: true,
        body: `transactionHash of failed transaction ${transactionHash}`,
        heading: "Alert",
      })
    );
  };

  return {
    onTransactionComplete,
    onTransactionFailure,
  };
};
