import React from "react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { useSelectAddress } from "../useSelectAddress";
import { FC } from "react";
import { Provider } from "react-redux";
import * as router from "react-router";

import * as walletActions from "@slices/newWalletSlice";
import { store as DevStore, StaticStore } from "store/store";
import { addFromTokenChainFamily } from "@slices/newWalletSlice/";
import { NETWORKS } from "utils/constants";

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

// export const shouldBehaveLikeUseSelectAddressHook = () =>
  describe("useSelectAddress.test", () => {
    beforeEach(() => {
      jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    });
    xit("will test the onTopImageClick ", async () => {
      await act(async () => {
        const setDefaultTokenSelected = jest.spyOn(
          walletActions,
          "setDefaultTokenSelected"
        );
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });

        await result.current.onTopImageClick();
        expect(setDefaultTokenSelected).toHaveBeenCalled();
      });
    });
    xit("recentRecipients", async () => {
      StaticStore.dispatch(addFromTokenChainFamily(NETWORKS.NEAR));
      await act(async () => {
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });

        expect(result.current.recentRecipients.length > 0).toBe(true);
      });
    });
    xit("handleSwitchChange", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });
        const previousIsSwitchAddressBook = result.current.isSwitchAddressBook;
        await result.current.handleSwitchChange();
        expect(result.current.isSwitchAddressBook).not.toEqual(
          previousIsSwitchAddressBook
        );
      });
    });

    xit("handleCloseModalAddressBook", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });
        await result.current.handleCloseModalAddressBook();
        expect(result.current.showModalAddressBook).toBe(false);
      });
    });
    xit("should handle change correctly", async () => {
      await act(async () => {
        const fakeEvent = { target: { value: "testing" } };

        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });

        await result.current.handleChange(fakeEvent as any);

        expect(result.current.value).toBe("testing");
      });
    });
    xit("onPasteHandler", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });
        await result.current.onPasteHandler();

        expect(result.current.value).toBe("");
      });
    });
    xit("validateENSAddress", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });
        const address1 = await result.current.validateENSAddress("samei.eth");

        expect(address1.isValid).toBe(true);
      });
    }, 60000000);

    xit("handleSend", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useSelectAddress(), {
          wrapper,
        });
        await result.current.handleSend();
        expect(navigate).toHaveBeenCalled();
      });
    });
  });
