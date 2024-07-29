import { FC } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as ETHTX from "@ethereumjs/tx";

import { store as DevStore } from "store/store";
import * as walletAction from "@slices/newWalletSlice/index";
import { ACTIVITY_STATUS_TYPES, TX_TYPES } from "utils/constants";
import { useSpeedUpOrCancel } from "../useSpeedUpOrCancel";
import { txObject1, txObject2 } from "./payloads/useSpeedOrCancel";
import CachedService from "classes/cachedService";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};

// export const shouldBehaveLikeUseSpeedOrCancelHook = () =>

  describe("speedUpOrCancelTransaction", () => {
    beforeEach(() => {
      jest
        .spyOn(CachedService, "getHashedPassword")
        .mockReturnValue(
          "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
        );
    });
    it("should be able to speedup the ongoing transaction", async () => {
      jest.spyOn(ETHTX, "Transaction").mockImplementation(() => {
        return {
          sign: jest.fn().mockReturnValue({
            serialize: jest.fn().mockReturnValue({
              toString: jest
                .fn()
                .mockReturnValue(
                  "f86d4184b2d05e0083016378942d7044d07cef44580f7780c829d6a10fda34d5dd86b5e620f480008083027126a09d8925d84ed764bc73788f2466c66860656de63e21ed5d1a0ba8a295bd7b5be3a010256dfaa36fa806792bc0845cee2c2a3ad754bab272e8e8e1646fa2dcbd137b"
                ),
            }),
          }),
        } as any;
      }),
        await act(async () => {
          const setTransactionActivityData = jest.spyOn(
            walletAction,
            "setTransactionActivityData"
          );

          const { result } = await renderHook(() => useSpeedUpOrCancel(), {
            wrapper,
          });

          await result.current.speedUpOrCancelTransaction(
            "0x03ed4f6dd95087eb945ad854f93d175cfd8748ef35c8a26e8f4d38cb82f3c331",
            txObject1,
            TX_TYPES.Sent,
            `https://rpc.ankr.com/polygon_mumbai/${process.env.REACT_APP_ANKR_API_KEY}`,
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            ACTIVITY_STATUS_TYPES.speedup
          );

          expect(setTransactionActivityData).toHaveBeenCalled();
        });
    });
    it("should be able to cancel the ongoing transaction", async () => {
      jest.spyOn(ETHTX, "Transaction").mockImplementation(() => {
        return {
          sign: jest.fn().mockReturnValue({
            serialize: jest.fn().mockReturnValue({
              toString: jest
                .fn()
                .mockReturnValue(
                  "7d4184b2d05e0083016378942d7044d07cef44580f7780c829d6a10fda34d5dd86b5e620f480008083027126a09d8925d84ed764bc73788f2466c66860656de63e21ed5d1a0ba8a295bd7b5be3a010256dfaa36fa806792bc0845cee2c2a3ad754bab272e8e8e1646fa2dcbd137b"
                ),
            }),
          }),
        } as any;
      }),
        await act(async () => {
          const setTransactionActivityData = jest.spyOn(
            walletAction,
            "setTransactionActivityData"
          );

          const { result } = await renderHook(() => useSpeedUpOrCancel(), {
            wrapper,
          });

          await result.current.speedUpOrCancelTransaction(
            "0x03ed4f6dd95087eb945ad854f93d175cfd8748ef35c8a26e8f4d38cb82f3c331",
            txObject2,
            TX_TYPES.Sent,
            `https://rpc.ankr.com/polygon_mumbai/${process.env.REACT_APP_ANKR_API_KEY}`,
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            ACTIVITY_STATUS_TYPES.cancel
          );

          expect(setTransactionActivityData).toHaveBeenCalled();
        });
    });
  });
