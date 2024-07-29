import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { store as DevStore, StaticStore } from "store/store";
import { ACTIVITY_STATUS_TYPES } from "utils/constants";
import { useAfterTransaction } from "../useAfterTransaction";
import * as appActions from "@slices/appSlice";
import * as walletActions from "@slices/newWalletSlice";
import { switchNetwork } from "@slices/appSlice";
import {
  payload1,
  payload2,
  payload3,
  payload4,
} from "./payloads/useAfterTransactionPayload";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};

// export const shouldBehaveLikeUseAfterTransactionHook = () =>
  describe("useAfterTransaction", () => {
    const setCompletedTransactionStates = jest.spyOn(
      appActions,
      "setCompletedTransactionStates"
    );
    const setTransactionActivityData = jest.spyOn(
      walletActions,
      "setTransactionActivityData"
    );
    const setInProgressTransactionHash = jest.spyOn(
      appActions,
      "setInProgressTransactionHash"
    );
    const setAlert = jest.spyOn(appActions, "setAlert");
    describe("onTransactionComplete", () => {
      it("should update the transfer transaction status on confirmation", async () => {
        await act(async () => {
          StaticStore.dispatch(switchNetwork(true));
          const { result } = await renderHook(() => useAfterTransaction(), {
            wrapper,
          });

          await result.current.onTransactionComplete(payload1);
          expect(setCompletedTransactionStates).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
          expect(setInProgressTransactionHash).toHaveBeenCalled();
        });
      }, 60000);
      it("should update the swap transaction status on confirmation", async () => {
        await act(async () => {
          StaticStore.dispatch(switchNetwork(true));
          const { result } = await renderHook(() => useAfterTransaction(), {
            wrapper,
          });

          await result.current.onTransactionComplete(payload2);
          expect(setCompletedTransactionStates).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
          expect(setInProgressTransactionHash).toHaveBeenCalled();
          expect(
            StaticStore.getState().newWallet.activity[
              "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
            ][5][
              "0x9e19d34034ca13a60cfab26e3bee9735e640c15a5d1df9b39ddf97509255ad53"
            ].status
          ).toEqual(ACTIVITY_STATUS_TYPES.success);
        });
      }, 60000);
      it("should update the cancel transaction status on confirmation", async () => {
        await act(async () => {
          StaticStore.dispatch(switchNetwork(true));
          const { result } = await renderHook(() => useAfterTransaction(), {
            wrapper,
          });

          await result.current.onTransactionComplete(payload3);
          expect(setCompletedTransactionStates).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
          expect(setInProgressTransactionHash).toHaveBeenCalled();
        });
      }, 60000);
    });
    describe("onTransactionFailure", () => {
      it("should update failed transaction status", async () => {
        await act(async () => {
          StaticStore.dispatch(switchNetwork(true));
          const { result } = await renderHook(() => useAfterTransaction(), {
            wrapper,
          });

          await result.current.onTransactionFailure(payload4);
          expect(setCompletedTransactionStates).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
          expect(setInProgressTransactionHash).toHaveBeenCalled();
          expect(setAlert).toHaveBeenCalled();
        });
      }, 60000);
    });
		console.log("==========AFTER TRANSACTION DONE")

  });
