import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { FC } from "react";
import { Provider } from "react-redux";
import { renderHook } from "@testing-library/react-hooks";

import { store as DevStore } from "store/store";
import { useAccountsSort } from "hooks";
import { NETWORKS } from "utils/constants";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseAccountsSortHook = () => 
  describe("useAccountsSort", () => {
    it("will test wallet filter", async () => {
      const { result } = await renderHook(() => useAccountsSort(), { wrapper });
      const { sortedAccountsByChainFamily } = result.current;

      expect(sortedAccountsByChainFamily).toHaveProperty(NETWORKS.EVM);
      expect(sortedAccountsByChainFamily).toHaveProperty(NETWORKS.SOLANA);
      expect(sortedAccountsByChainFamily).toHaveProperty(NETWORKS.NEAR);
    });
		console.log("==========ACCOUNTS SORT DONE")

  });
