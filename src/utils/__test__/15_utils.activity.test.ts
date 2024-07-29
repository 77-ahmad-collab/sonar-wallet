import { ACTIVITY_STATUS_TYPES, TX_TYPES, TransactionSuccessMessage } from "utils/constants";
import {
  clearSameNoncetransactions,
  decodeEvm,
  decodeEvmSwapTx,
  decodeNear,
  deleteActivityItem,
  getAllReceivedTransactions,
  getPopulatedSwapTxDetail,
  getPopulatedTxDetail,
  getReceivedTransactionEVM,
  getReceivedTransactionsNear,
  getReceivedTransactionsSolana,
  getTransactions,
  onDappTransactionComplete,
  onDappTransactionFailure,
  storeTransactionActivityData,
  updateStatesAfterTxStatusFinalized,
} from "utils/utils.activity";
/**
 * NOT COVERED
 * clearSameNoncetransactions
 * updateStatesAfterTxStatusFinalized
 * getTransactions
 * getAllReceivedTransactions
 */
import {
  decodeEvmSwapTx_payload,
  decodeNear_payload,
  deleteActivityItem_payload,
  getReceivedTransactionEVM_payload,
  getReceivedTransactionsNear_payload,
  getReceivedTransactionsSolana_payload,
  mockTokenSelected,
  payload1,
  payload2,
  txItem1,
  txItem2,
  txItem3,
} from "./payload/utils.activity";
import * as walletActions from "@slices/newWalletSlice";
import { StaticStore } from "store/store";

import * as appActions from "@slices/appSlice";
import { updateStatesAfterTxStatusFinalizedData } from "./payload";
import { waitFor } from "@testing-library/react";

// export const utilActivity = () =>
describe("utils.activity", () => {
  describe("getAllReceivedTransactions", () => {
    it("can get all received transactions", async () => {
      const data = await getAllReceivedTransactions();
      // Activity
      const updatedActivity = StaticStore.getState().newWallet.activity;
      expect(data).not.toBeNull();
      expect(updatedActivity).toHaveProperty(
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
      );
      expect(updatedActivity).toHaveProperty(
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
      );
    }, 60_000);
  });

  describe("clearSameNoncetransactions", () => {
    it("should return as it is array because of different nonces", async () => {
      const storeBefore =
        StaticStore.getState().app.inProgressTransactionHashes;
      const data = await clearSameNoncetransactions(1, 32, StaticStore);
      const storeAfter = StaticStore.getState().app.inProgressTransactionHashes;
      expect(storeBefore).toStrictEqual(storeAfter);
    });

    //clearSameNoncetransactions
    it("should set the same object as earlier because of unique nonces", async () => {
      const storeBefore =
        StaticStore.getState().app.inProgressTransactionHashes;
      await clearSameNoncetransactions(1, 31, StaticStore);
      const storeAfter = StaticStore.getState().app.inProgressTransactionHashes;

      expect(storeBefore).toStrictEqual({
        ...storeAfter,
        "1": {
          "31": [
            "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad54",
          ],
        },
      });
      //remove the given nonce.
      expect(storeAfter).toStrictEqual({
        ...storeAfter,
        "1": {},
      });
    });
  });

  describe("updateStatesAfterTxStatusFinalized", () => {
    it("should update the state after the transaction status is finalized", async () => {
      const payload = updateStatesAfterTxStatusFinalizedData;

      const data = await updateStatesAfterTxStatusFinalized(payload);
      const AppStoreAfter = StaticStore.getState().app;

      const newWalletStoreAfter = StaticStore.getState().newWallet.activity;
      expect(newWalletStoreAfter).toHaveProperty(
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
      );
      expect(newWalletStoreAfter).toHaveProperty(
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
      );

      expect(AppStoreAfter.txIntervalList).toStrictEqual([]);
      expect(AppStoreAfter.snackBarMessage).toStrictEqual(TransactionSuccessMessage);
    });
  });

  describe("getTransactions", () => {
    it("should return the transactions in an array for all accounts", async () => {
      const data = getTransactions(StaticStore);
      // console.log(data)
      expect(data).toHaveLength(12); //compared to mock redu state
    });
  });

  describe("getAllReceivedTransactions", () => {
    it("should return the transactions in an array for all accounts", async () => {
      await waitFor(
        async () => {
          const data = await getAllReceivedTransactions();
          const storeAfter = StaticStore.getState().newWallet.activity;
          expect(storeAfter).toBeDefined();
          expect(walletActions.setTransactionActivityData).toHaveBeenCalled();
        },
        { timeout: 60_000 }
      );
    }, 60_000);
  });

  describe("getPopulatedSwapTxDetail", () => {
    it("can populate and return the swap transaction type data", async () => {
      const data = getPopulatedSwapTxDetail(txItem1);
      expect(data).toHaveProperty("makerBalance");
      expect(data.txType).toBe(TX_TYPES.Swap);
    });
  });

  describe("storeTransactionActivityData", () => {
    it("can store the transaction data to the activity object in redux", async () => {
      const setTransactionActivityData = jest.spyOn(
        walletActions,
        "setTransactionActivityData"
      );

      await storeTransactionActivityData({
        transactionData: getPopulatedTxDetail(txItem3),
      });
      expect(setTransactionActivityData).toHaveBeenCalled();
      expect(
        StaticStore.getState().newWallet.activity[
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
        ][5]
      ).toHaveProperty(
        "0xb87998d295bfac16bf7891762662476e9c62056e08f29bc6a142a05fb6c2e04f"
      );
    });
  });

  describe("deleteActivityItem", () => {
    it("can delete the transaction data, that is stored in the redux", async () => {
      const previousTransactionActivityData =
        StaticStore.getState().newWallet.activity;
      const updatedActivity = deleteActivityItem(deleteActivityItem_payload);

      expect(previousTransactionActivityData).not.toEqual(updatedActivity);
    });
  });

  describe("getPopulatedTxDetail", () => {
    it("can populate and return the send or receive transaction type data", async () => {
      const data = getPopulatedTxDetail(txItem2);

      expect(data).not.toHaveProperty("makerBalance");
    });
  });

  describe("decodeEvm", () => {
    it("can decode the transaction on EVM NETWORK", async () => {
      await StaticStore.dispatch(
        walletActions.setTokenSelected(mockTokenSelected)
      );

      const data = await decodeEvm(
        [
          {
            address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
            transactionHash:
              "0xb87998d295bfac16bf7891762662476e9c62056e08f29bc6a142a05fb6c2e04f",
          },
        ],
        5,
        "0x2d7044d07cef44580f7780c829d6a10fda34d5dd"
      );
      expect(data.length).toBeGreaterThan(0);
    }, 600000);
  });

  describe("decodeEvmSwapTx", () => {
    it("can decode the swap transaction ", async () => {
      const data = await decodeEvmSwapTx(decodeEvmSwapTx_payload);

      expect(data.status).toEqual(ACTIVITY_STATUS_TYPES.success);
    }, 60000);
  });

  describe("decodeNear", () => {
    it("can decode the transaction hash on the near netwrok", async () => {
      const data = await decodeNear(decodeNear_payload);
      expect(data.length).toBeGreaterThan(0);
    }, 60000);
  });

  describe("getReceivedTransactionsNear", () => {
    it("can give the hashes of the near address", async () => {
      const data = await getReceivedTransactionsNear(
        getReceivedTransactionsNear_payload
      );
      expect(data.length).toBeGreaterThanOrEqual(0);
    }, 60000);
  });

  describe("getReceivedTransactionsSolana", () => {
    it("can decode the transactions on Solana Network", async () => {
      const data = await getReceivedTransactionsSolana(
        getReceivedTransactionsSolana_payload
      );
      expect(data.length).toBeGreaterThan(0);
    }, 60000);
  });

  describe("getReceivedTransactionEVM", () => {
    it("can get the received transactions", async () => {
      const data = await getReceivedTransactionEVM(
        getReceivedTransactionEVM_payload
      );

      expect(data?.length).toBeGreaterThan(0);
    }, 7500000);
  });

  describe("onDappTransactionComplete", () => {
    it("should update  transaction status on confirmation, placed through any dapp", async () => {
      StaticStore.dispatch(appActions.switchNetwork(true));
      const setCompletedTransactionStates = jest.spyOn(
        appActions,
        "setCompletedTransactionStates"
      );
      const setInProgressTransactionHash = jest.spyOn(
        appActions,
        "setInProgressTransactionHash"
      );
      const setTransactionActivityData = jest.spyOn(
        walletActions,
        "setTransactionActivityData"
      );
      await onDappTransactionComplete({
        store: StaticStore,
        transaction: payload1.transaction,
      });
      expect(setCompletedTransactionStates).toHaveBeenCalled();
      expect(setTransactionActivityData).toHaveBeenCalled();
      expect(setInProgressTransactionHash).toHaveBeenCalled();
      expect(
        StaticStore.getState().newWallet.activity[
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
        ][5][
          "0x11317877b8e78595a1228aac252c5293b25a08052c42a47b3f6ba78ec15d48ac"
        ].status
      ).toEqual(ACTIVITY_STATUS_TYPES.success);
    }, 60000);
  });

  describe("onDappTransactionFailure", () => {
    it("should update  transaction status on failure, placed through any dapp", async () => {
      StaticStore.dispatch(appActions.switchNetwork(true));
      const setCompletedTransactionStates = jest.spyOn(
        appActions,
        "setCompletedTransactionStates"
      );
      const setInProgressTransactionHash = jest.spyOn(
        appActions,
        "setInProgressTransactionHash"
      );
      const setTransactionActivityData = jest.spyOn(
        walletActions,
        "setTransactionActivityData"
      );
      await onDappTransactionFailure({
        store: StaticStore,
        transaction: payload2.transaction,
      });
      expect(setCompletedTransactionStates).toHaveBeenCalled();
      expect(setTransactionActivityData).toHaveBeenCalled();
      expect(setInProgressTransactionHash).toHaveBeenCalled();
    }, 60000);
  });
});
