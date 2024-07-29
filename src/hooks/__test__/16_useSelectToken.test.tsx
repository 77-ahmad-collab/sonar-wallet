import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as router from "react-router";

import * as appActions from "@slices/appSlice";
import * as walletActions from "@slices/newWalletSlice";
import { store as DevStore } from "store/store";
import { useSelectToken } from "../useSelectToken";

import * as utils from "../../utils/utils.swap";
import {
  mockTokenSelected,
  mock_useLocation_return_value1,
  mock_useLocation_return_value2,
  swapTokens,
} from "./payloads/useSelectToken";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};
const navigate = jest.fn();

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
jest.spyOn(utils, "getSwapTokens").mockResolvedValue(swapTokens);

// export const shouldBehaveLikeUseSelectTokenHook = () =>
  describe("useSelectToken", () => {
    let useLocation: jest.SpyInstance<router.Location, []>;
    beforeEach(() => {
      jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
      useLocation = jest.spyOn(router, "useLocation");
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    describe("fetchMoreTokens", () => {
      it("can fetch the swap tokenB list", async () => {
        await act(async () => {
          useLocation.mockReturnValue(mock_useLocation_return_value1);
          const { result, rerender } = await renderHook(() => useSelectToken(), {
            wrapper,
          });

          await result.current.onTokenSelection(mockTokenSelected);
          result.current.setValue("");
          rerender();

          jest.advanceTimersByTime(100000000);
          await setTimeout(() => console.log("ss"), 1000);

          jest.advanceTimersByTime(100000000);
          await result.current.fetchMoreTokens(1, 1);
          jest.advanceTimersByTime(100000000);

          expect(result.current.filteredHoldings).toHaveProperty("1");
        });
      }, 6000000);
    });
    describe("onTopImageClick", () => {
      it("will navigate to previous page, when on swap screen", async () => {
        await act(async () => {
          useLocation.mockReturnValue(mock_useLocation_return_value2);
          const { result } = await renderHook(() => useSelectToken(), {
            wrapper,
          });

          await result.current.onTopImageClick();
          expect(navigate).toHaveBeenCalled();
        });
      });
      it("will navigate to dashboard, when not  on swap screen", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useSelectToken(), {
            wrapper,
          });

          await result.current.onTopImageClick();
          expect(navigate).toHaveBeenCalled();
        });
      });
    });
    describe("onTokenSelection", () => {
      it("will store the selected token data, if there is no swap", async () => {
        await act(async () => {
          const setRecentSearchedKeywords = jest.spyOn(
            appActions,
            "setRecentSearchedKeywords"
          );
          const setTokenSelected = jest.spyOn(walletActions, "setTokenSelected");

          const { result } = await renderHook(() => useSelectToken(), {
            wrapper,
          });

          await result.current.onTokenSelection(mockTokenSelected);
          expect(setRecentSearchedKeywords).toHaveBeenCalled();
          expect(setTokenSelected).toHaveBeenCalled();
          expect(navigate).toHaveBeenCalled();
        });
      });
      it("will store the tokenA data", async () => {
        await act(async () => {
          useLocation.mockReturnValue(mock_useLocation_return_value2);
          const setRecentSearchedKeywords = jest.spyOn(
            appActions,
            "setRecentSearchedKeywords"
          );
          const setDefaultSwapSelectedTokens = jest.spyOn(
            walletActions,
            "setDefaultSwapSelectedTokens"
          );
          const setSwapSelectedTokens = jest.spyOn(
            walletActions,
            "setSwapSelectedTokens"
          );

          const { result } = await renderHook(() => useSelectToken(), {
            wrapper,
          });

          await result.current.onTokenSelection(mockTokenSelected);
          expect(setRecentSearchedKeywords).toHaveBeenCalled();
          expect(setDefaultSwapSelectedTokens).toHaveBeenCalled();
          expect(setSwapSelectedTokens).toHaveBeenCalled();
        });
      });
      it("will store the tokenB data", async () => {
        await act(async () => {
          useLocation.mockReturnValue(mock_useLocation_return_value1);
          const setRecentSearchedKeywords = jest.spyOn(
            appActions,
            "setRecentSearchedKeywords"
          );

          const setSwapSelectedTokens = jest.spyOn(
            walletActions,
            "setSwapSelectedTokens"
          );

          const { result } = await renderHook(() => useSelectToken(), {
            wrapper,
          });

          await result.current.onTokenSelection(mockTokenSelected);
          expect(setRecentSearchedKeywords).toHaveBeenCalled();

          expect(setSwapSelectedTokens).toHaveBeenCalled();
        });
      });
    });
  });
