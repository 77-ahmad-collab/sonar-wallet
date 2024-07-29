import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { useNetwork } from "../useNetwork";
import { FC } from "react";
import { Provider } from "react-redux";

import { store as DevStore, StaticStore } from "store/store";
import { switchNetwork } from "@slices/appSlice";
import { MAINNET_CHAINS, TESTNET_CHAINS } from "utils/constants";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseNetworkHook = () =>
  describe("useNetwork", () => {
    it("should return the currentChainIDs for mainnet", async () => {
      //by default, for test cases, the network is set to testnet
      //that is why we are dispatching the switchNetwork action
      StaticStore.dispatch(switchNetwork(false));

      await act(async () => {
        const { result } = await renderHook(() => useNetwork(), {
          wrapper,
        });

        expect(result.current.currentChainIDs).toEqual(
          Object.keys(MAINNET_CHAINS).map(Number)
        );
      });
    });

    it("should return the currentChainIDs for testnet", async () => {
      await act(async () => {
        StaticStore.dispatch(switchNetwork(true));
        const { result } = await renderHook(() => useNetwork(), {
          wrapper,
        });

        expect(result.current.currentChainIDs).toEqual(
          Object.keys(TESTNET_CHAINS).map(Number)
        );
      });
    });
		console.log("==========NETWORK DONE")
  
  });
