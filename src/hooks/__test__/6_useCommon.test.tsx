import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";

import { store as DevStore } from "store/store";
import { useCommon } from "hooks";

import * as dappActions from "@slices/dappInfoSlice";
import * as appActions from "@slices/appSlice";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};
// export const shouldBehaveLikeAUseCommonHook = () =>
  describe("useCommon", () => {
      //intially setting this, because it is set on the onboarding page and will be available in the localstorage everytime
      //remoev this will cause the JSON.parse syntax error
      localStorage.setItem("defaultWallet", "true");

      describe("toggleDefaultWallet", () => {
      it("should toggle the default wallet value in localStorage", async () => {
        await act(async () => {
          const setPermission = jest.spyOn(dappActions, "setPermission");
          const setDAppConnectAddress = jest.spyOn(
            dappActions,
            "setDAppConnectAddress"
          );
          const { result } = await renderHook(() => useCommon(), {
            wrapper,
          });

          const spyWindowOpen = jest.spyOn(window, "close");
          spyWindowOpen.mockImplementation(jest.fn());
          result.current.toggleDefaultWallet();
          expect(setPermission).toHaveBeenCalled();
          expect(setDAppConnectAddress).toHaveBeenCalled();
        });
      });
    });

    describe("disconnectDapp", () => {

        it("should set permission key and account address to empty string and remove dAppConnectAddress", async () => {
        const setPermission = jest.spyOn(dappActions, "setPermission");
        const setAlert = jest.spyOn(appActions, "setAlert");
        await act(async () => {
          const { result } = await renderHook(() => useCommon(), {
            wrapper,
          });

          result.current.disconnectDapp(
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
          );
        });
        expect(setPermission).toHaveBeenCalled();
        expect(setAlert).toHaveBeenCalled();
      });
    });

		console.log("==========COMMON DONE")
  
  });
