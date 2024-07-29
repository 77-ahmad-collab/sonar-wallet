import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import * as router from "react-router";
import { Provider } from "react-redux";

import { store as DevStore } from "store/store";
import { useStep4 } from "../useStep4";
import * as appActions from "@slices/appSlice";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};
jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

const navigate = jest.fn();

// export const shouldBehaveLikeUseStep4Hook = () =>
  describe("useStep4", () => {
    beforeEach(() => {
      jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    });
    it("will test handle login is working fine", async () => {
      await act(async () => {
        const setwalletCreatedAlert = jest.spyOn(
          appActions,
          "setwalletCreatedAlert"
        );
        const { result } = await renderHook(() => useStep4(), {
          wrapper,
        });

        await result.current.handleLogin();
        expect(result.current.isLoading).toBe(true);

        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        jest.advanceTimersByTime(1000);
        expect(setwalletCreatedAlert).toHaveBeenCalled();
      });
    });
    it("onImportWallet", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useStep4(), {
          wrapper,
        });

        await result.current.onImportWallet();
        expect(result.current.isLoading).toBe(true);
        expect(result.current.actionOptions.createWalletDisabled).toBe(true);
        jest.advanceTimersByTime(1000);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        expect(navigate).toHaveBeenCalled();
      });
    });
  });
