import { FC } from "react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react-hooks";

import { useWalletFilter } from "../useWalletFilter";
import { store as DevStore, StaticStore } from "store/store";
import { setFilteredWallet } from "@slices/newWalletSlice";
import { switchNetwork } from "@slices/appSlice";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeUseWalletFilterHook = () =>

  describe("useWalletFilter", () => {
    beforeEach(() => {
      StaticStore.dispatch(setFilteredWallet());
    });
    it("returns the ids of both Wallets for mainnet", () => {
      const walletId1 = "2a6280e4-e1b0-4750-837f-28e0660470dd";
      const walletId2 = "c5121ff6-8d02-43d1-a026-e10a42ba3471";
      const { result } = renderHook(useWalletFilter, {
        wrapper,
      });

      expect(result.current.filteredWallets).toHaveProperty(walletId1);
      expect(result.current.filteredWallets).toHaveProperty(walletId2);
    });

    it("returns the ids of both Wallets for testnet", () => {
      DevStore.dispatch(switchNetwork(true));
      const walletId1 = "2a6280e4-e1b0-4750-837f-28e0660470dd";
      const walletId2 = "c5121ff6-8d02-43d1-a026-e10a42ba3471";
      const { result } = renderHook(useWalletFilter, {
        wrapper,
      });
      expect(result.current.filteredWallets).toHaveProperty(walletId1);
      expect(result.current.filteredWallets).toHaveProperty(walletId2);
    });
  });
