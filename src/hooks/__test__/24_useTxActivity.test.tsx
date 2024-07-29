import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { store as DevStore } from "store/store";
import { useTxActivity } from "../useTxActivity";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};

// export const shouldBehaveLikeUseTxActivityHook = () =>

  describe("useTxActivity", () => {
    it("should return the filtered activity data", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useTxActivity(), { wrapper });
        expect(result.current.filteredActivity).not.toBeUndefined();
        expect(result.current.filteredActivity).not.toBeNull;
        expect(result.current.filteredActivity.length).toBeGreaterThan(0);
      });
    });
    it("should return the data of the pending transaction", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useTxActivity(), { wrapper });
        expect(result.current.allPendingTransactions).toBeDefined();
        expect(result.current.allPendingTransactions).not.toBeUndefined();
        expect(result.current.allPendingTransactions).not.toBeNull;
        expect(result.current.allPendingTransactions.length).toBeGreaterThan(0);
      });
    });
  });
