import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store as DevStore, StaticStore } from "store/store";
import * as appActions from "@slices/appSlice";
import { useApp } from "../useApp";
import { setTokenInfo } from "@slices/newWalletSlice";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>{" "}
    </BrowserRouter>
  );
};

jest.mock("../useAfterTransaction", () => {
  const originalModule = jest.requireActual("../useAfterTransaction");
  return {
    __esModule: true,
    ...originalModule,
    useAfterTransaction: jest.fn().mockReturnValue({
      onTransactionComplete: jest.fn(),
      onTransactionFailure: jest.fn(),
      onDappTransactionComplete: jest.fn(),
      onDappTransactionFailure: jest.fn(),
    }),
  };
});

// export const shouldBehaveLikeUseAppHook = () => 
  describe("useApp", () => {
    beforeAll(() => {
      StaticStore.dispatch(
        setTokenInfo({
          "usdt.tether-token.near_USDt": {
            name: "Tether USD",
            symbol: "USDt",
            image:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
            decimals: 6,
            address: "usdt.tether-token.near",
            isActive: false,
            coingeckoId: "",
            price: 0,
          },
        })
      );
    });
    it("should successfully update the pending transaction hashes status", async () => {
      StaticStore.dispatch(
        appActions.setTransactionTrigerredMessage("TRANSACTION  NOT MINED")
      );
      await act(async () => {
        const { result } = await renderHook(() => useApp(), {
          wrapper,
        });
        expect(await result.current.checkForPendingTransactions()).resolves;
      });
    }, 600000000);
    it("user should be logged in ", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useApp(), {
          wrapper,
        });
        expect(await result.current.isLoggedIn).toEqual(expect.any(Boolean));
      });
    }, 6000);
    it("should update the last received transaction time", async () => {
      const setLastReceivedTransactionTime = jest.spyOn(
        appActions,
        "setLastReceivedTransactionTime"
      );
      await act(async () => {
        const { result } = await renderHook(() => useApp(), {
          wrapper,
        });
        await result.current.storeLastReceivedTransactionTime();

        expect(setLastReceivedTransactionTime).toHaveBeenCalled();
      });
    }, 600000000);

    it("should return the dynamic balance checker data", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useApp(), {
          wrapper,
        });
        const data = await result.current.dynamicBalanceChecker;
        expect(data).not.toBeUndefined();
      });
    });
		console.log("==========USE APP DONE")
  
  });

