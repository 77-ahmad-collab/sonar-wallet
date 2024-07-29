import Common from "@ethereumjs/common";
import { ethers } from "ethers";
import { useMemo } from "react";

import { addInProgressTransactionHash, setAlert } from "@slices/appSlice";
import { setTransactionActivityData } from "@slices/newWalletSlice";
import CachedService from "classes/cachedService";

import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { matchAddresses, mergeNewAndOldActivityData } from "utils";
import {
  ACTIVITY_STATUS_TYPES,
  CHAIN_TX,
  COINGECKO_ID,
  NATIVE_TOKEN_ADDRESS,
  TX_TYPES,
  Tx_METHODS,
  ZERO_ADDRESS,
} from "utils/constants";
import { getSpeedUpCancelGasPriceInWei } from "utils/utils.gas";
import { getSendTransactionRawData } from "utils/utils.send";
const { abi } = require("abis/erc20abi.json");

export const useSpeedUpOrCancel = () => {
  const dispatch = useAppDispatch();

  // const { activity } = useAppSelector((state) => state.newWallet);
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);

  const hashedPassword = useMemo(() => CachedService.getHashedPassword(), []);

  /**
   * This function is for speed-up or cancel the ongoing transaction, and will update the state according to the event type.
   * In case of cancellation, self transaction is made, in which to and from address are same and value is set to 0 of native token
   */
  const speedUpOrCancelTransaction = async (
    hash: string,
    rough: any,
    txType: TX_TYPES,
    NODE_URL: string,
    tokenAddress: string,
    method: ACTIVITY_STATUS_TYPES
  ) => {
    try {
      const [
        chainTx,
        coingeckoID,
        web3,
        previousGasPriceInWei,
        SPEEDUP_PERC,
        SPEEDUP_LIMIT,
      ] = [
        NETWORKCHAIN[rough.chainId][CHAIN_TX],
        NETWORKCHAIN[rough.chainId][COINGECKO_ID],
        new ethers.providers.JsonRpcProvider(NODE_URL),
        rough.transactionObject.gasPrice,
        txType === TX_TYPES.Swap ? 3 : 1.5,
        txType === TX_TYPES.Swap ? 1135000 : 91000, //1135000 : 91000,
      ];
      let transactionObject = rough.transactionObject;
      let common: any;
      if (coingeckoID === "ethereum") {
        common = new Common({ chain: chainTx });
      } else {
        //@ts-ignore
        common = Common.custom(chainTx);
      }

      transactionObject = {
        ...transactionObject,
        gasLimit: ethers.utils.hexlify(SPEEDUP_LIMIT),
        gasPrice: ethers.utils.hexlify(
          Number(getSpeedUpCancelGasPriceInWei(previousGasPriceInWei))
        ),
      };

      if (method === ACTIVITY_STATUS_TYPES.cancel) {
        transactionObject.to = transactionObject.from;
        const contract = new ethers.Contract(
          "0x514910771AF9Ca656af840dff83E8264EcF986CA",
          abi,
          web3
        );

        if (
          tokenAddress &&
          !matchAddresses(tokenAddress, NATIVE_TOKEN_ADDRESS) &&
          !matchAddresses(tokenAddress, ZERO_ADDRESS)
        ) {
          transactionObject.data = contract.interface.encodeFunctionData(
            "transfer",
            [transactionObject.from, 0]
          );
        } else transactionObject.value = 0;
      }
      const raw = await getSendTransactionRawData(
        transactionObject,
        common,
        ethers.utils.getAddress(transactionObject.from),
        hashedPassword
      );

      console.log({ previousGasPriceInWei, common, transactionObject });
      console.log({ raw });

      // ethers.js way
      const { hash: txHash } = await web3.sendTransaction(raw);
      console.log("sppedd up hash==========", txHash);
      await populateSpeedUpData(rough, hash, txHash, method);
      console.log("YAHAN GET KAR", StaticStore.getState().newWallet.activity);
    } catch (error: any) {
      console.log("speedup error===", error);
      dispatch(
        setAlert({
          open: true,
          body: error.message,
          heading:
            "Previous transaction is out of mempool.  You won't be able to cancel or speedup",
        })
      );
    }
  };

  /**
   * This function is used to update the transaction data in redux, when the speed-up or cancellation will be performed.
   */
  const populateSpeedUpData = async (
    rawData: any,
    previousHash: string,
    updatedHash: string,
    method: string
  ) => {
    const transactionObject = rawData.transactionObject;
    const activity = StaticStore.getState().newWallet.activity;
    console.log(
      "🚀 ~ file: useSpeedUpOrCancel.ts:134 ~ useSpeedUpOrCancel ~ activity:",
      activity
    );
    let updatedActivity = { ...activity };
    //------incase of cancellation this item with new hash will be stored
    const newTransactionItemPending = {
      ...activity[ethers.utils.getAddress(transactionObject.from)][
        rawData.chainId
      ][previousHash],
      transactionHash: updatedHash,
      // isSpeedUpEnabled: false,

      isSpeedUpCancelBlinking: false,
      ...(method === ACTIVITY_STATUS_TYPES.cancel
        ? {
            // status: ACTIVITY_STATUS_TYPES.cancel,
            isCancelEnabled: false,
            txMethod: Tx_METHODS.cancel,
          }
        : {
            isSpeedUpEnabled: false,
          }),
    };

    console.log(
      "🚀 ~ file: useSpeedUpOrCancel.ts:138 ~ useSpeedUpOrCancel ~ newTransactionItemPending:",
      newTransactionItemPending
    );
    const previousTransactionItemPending = {
      ...activity[ethers.utils.getAddress(transactionObject.from)][
        rawData.chainId
      ][previousHash],
      status: ACTIVITY_STATUS_TYPES.inProgress,
    };

    console.log(
      "🚀 ~ file: useSpeedUpOrCancel.ts:158 ~ useSpeedUpOrCancel ~ previousTransactionItemPending:",
      previousTransactionItemPending
    );
    // Object.assign(updatedActivity, {
    //   ...mergeNewAndOldActivityData({
    //     previousTransactionActivityData: updatedActivity,
    //     transactionData: previousTransactionItemPending,
    //   }),
    // });
    updatedActivity = mergeNewAndOldActivityData({
      previousTransactionActivityData: updatedActivity,
      transactionData: newTransactionItemPending,
    });
    console.log(
      "🚀 ~ file: useSpeedUpOrCancel.ts:177 ~ useSpeedUpOrCancel ~ updatedActivity: after new item",
      updatedActivity
    );

    // Object.assign(updatedActivity, {
    //   ...mergeNewAndOldActivityData({
    //     previousTransactionActivityData: updatedActivity,
    //     transactionData: newTransactionItemPending,
    //   }),
    // });
    updatedActivity = mergeNewAndOldActivityData({
      previousTransactionActivityData: updatedActivity,
      transactionData: previousTransactionItemPending,
    });
    console.log(
      "🚀 ~ file: useSpeedUpOrCancel.ts:189 ~ useSpeedUpOrCancel ~ updatedActivity: previousTransactionItemPending",
      updatedActivity
    );

    await dispatch(setTransactionActivityData(updatedActivity));
    await dispatch(
      addInProgressTransactionHash({
        chainId: newTransactionItemPending.chainId,
        nonce: newTransactionItemPending?.nonce | 0,
        transactionHash: updatedHash,
      })
    );
    console.log(StaticStore.getState().newWallet.activity, "THE NEW STATAE");
  };

  return {
    speedUpOrCancelTransaction,
  };
};
