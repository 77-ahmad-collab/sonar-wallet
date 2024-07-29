import React from "react";
import { FC } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as router from "react-router";

import { store as DevStore, StaticStore } from "store/store";
import { useConfirmSend } from "../useConfirmSend";
import { setSlideAnimationCompletionStatus } from "@slices/appSlice";
import * as appActions from "@slices/appSlice";
import * as walletActions from "@slices/newWalletSlice";

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
describe("useConfirmSend", () => {
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
  });
  it("can update the input width as per amount ", async () => {
    await act(async () => {
      const { result } = await renderHook(() => useConfirmSend(), {
        wrapper,
      });

      const amount = "10"; // Example input amount

      // Create a mock event object
      const mockEvent = {
        target: {
          value: amount,
        },
      };

      // Call handleChange function with the mock event
      act(() => {
        result.current.handleChange(mockEvent as any);
      });

      // Calculate expected input width based on the length of the amount
      const expectedWidth = `${amount.length * 4.4}ch`;

      // Add assertions to check if the input width and entered amount have been updated correctly
      expect(result.current.inputWidth).toBe(expectedWidth);
      expect(result.current.currentRatio).toBe(0);
    });
  });
  it("can  navigate to the select token screen ", async () => {
    await act(async () => {
      const { result } = await renderHook(() => useConfirmSend(), {
        wrapper,
      });

      act(() => {
        result.current.handleReject();
      });
      expect(navigate).toHaveBeenCalledWith("/send/selecttoken");
    });
  });
  it("can reset the animation button states ", async () => {
    await act(async () => {
      const setSlideAnimation = jest.spyOn(appActions, "setSlideAnimation");
      const { result } = await renderHook(() => useConfirmSend(), {
        wrapper,
      });

      StaticStore.dispatch(setSlideAnimationCompletionStatus(true));
      // Call handlePreserved function
      act(() => {
        result.current.handlePreserved();
      });

      expect(setSlideAnimation).toHaveBeenCalled();
      expect(StaticStore.getState().app.slideAnimation).toBe("expand");
    });
  });
  it("can navigate to the select token screen ", async () => {
    await act(async () => {
      const setDefaultTokenSelected = jest.spyOn(
        walletActions,
        "setDefaultTokenSelected"
      );
      const { result } = await renderHook(() => useConfirmSend(), {
        wrapper,
      });

      act(() => {
        result.current.onTopImageClick();
      });

      expect(setDefaultTokenSelected).toHaveBeenCalled();
    });
  });
});
