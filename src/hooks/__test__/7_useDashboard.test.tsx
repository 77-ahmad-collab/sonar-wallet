import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { FC } from "react";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-hooks";

import { store as DevStore } from "store/store";
import { useDashboard } from "../useDashboard";
import * as walletActions from "../../store/slices/newWalletSlice/index";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseDashboardHook = () =>

  describe("useDashboard", () => {
    it("will test wallet filter", async () => {
      await act(async () => {
        const setDefaultTokenSelectedDispatch = jest.spyOn(
          walletActions,
          "setDefaultTokenSelected"
        );
        const { result } = await renderHook(() => useDashboard(), { wrapper });
        const { isLoading, filteredHoldings, token } = result.current;

        expect(setDefaultTokenSelectedDispatch).toHaveBeenCalled();
        expect(isLoading).toBe(false);

        expect(filteredHoldings).toBeDefined();

        expect(token).toBeDefined();
      });
    });
		console.log("==========DASHBOARD DONE")
  
  });
