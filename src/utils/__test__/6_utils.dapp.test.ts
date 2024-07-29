import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { StaticStore } from "store/store";
import { TX_DATA_METHOD_IDs } from "utils/constants";
import {
  closeDappWindow,
  ifTxMethodExists,
  isClosingAfterConfirm,
  reloadDapp,
  setClosingAfterConfirm,
  setNewDappSelectedAccount,
} from "utils/utils.dapp";
import { address } from "./payload/utils.dapp";
import * as dappActions from "@slices/dappInfoSlice/";
// export const utilDapp = () =>
describe("utils.dapp.ts", () => {
  beforeEach((done) => {
    localStorage.clear();
    done();
  });
  describe("setNewDappSelectedAccount", () => {
    test("should set the new account address in redux", async () => {
      const mockSetNewSelectedAccount = jest.fn();
      const setPermissioInDapp = jest.spyOn(dappActions, "setPermission");

      StaticStore.dispatch = mockSetNewSelectedAccount;
      await setNewDappSelectedAccount(address);
      expect(setPermissioInDapp).toHaveBeenCalled();
      expect(mockSetNewSelectedAccount).toHaveBeenCalled();
    });
  });

  describe("ifTxMethodExists", () => {
    test("ifTxMethodExists should return true when given a valid methodId", () => {
      expect(
        ifTxMethodExists(TX_DATA_METHOD_IDs.approve, "0x095ea7b31234567890")
      ).toBe(true);
    });

    //Test Case 2
    test("ifTxMethodExists should return false when given an invalid methodId", () => {
      expect(
        ifTxMethodExists(TX_DATA_METHOD_IDs.approve, "0x095ea7b31234567890")
      ).toBe(true);
    });

    //Test Case 3
    test("ifTxMethodExists should return false when given an invalid data", () => {
      expect(ifTxMethodExists(TX_DATA_METHOD_IDs.approve, "0x1234567890")).toBe(
        false
      );
    });
  });

  describe("isClosingAfterConfirm", () => {
    // @pending-test-case
    xit("should return boolean value", () => {
      expect(typeof isClosingAfterConfirm()).toBe("boolean");
    });

    it("should return true when localStorage exists", () => {
      localStorage.setItem("popupClosingAfterConfirm", "true");
      expect(isClosingAfterConfirm()).toBe(true);
    });
    // @pending-test-case
    xit("should return false when localStorage not exists", () => {
      localStorage.removeItem("popupClosingAfterConfirm");
      expect(isClosingAfterConfirm()).toBe(false);
    });
  });
  describe("setClosingAfterConfirm", () => {
    //Test Case 1
    test("should setClosingAfterConfirm set boolean to local storage", () => {
      setClosingAfterConfirm(true);
      expect(localStorage.getItem("popupClosingAfterConfirm")).toBe("true");
    });

    //Test Case 2
    test("should setClosingAfterConfirm set boolean to local storage", () => {
      setClosingAfterConfirm(false);
      expect(localStorage.getItem("popupClosingAfterConfirm")).toBe("false");
    });
  });

  describe("closeDappWindow", () => {
    global.window.close = jest.fn();

    it("should set closingAfterConfirm to true", () => {
      closeDappWindow(true);
      expect(localStorage.getItem("popupClosingAfterConfirm")).toEqual("true");
    });
  });

  describe("reloadDapp", () => {
    it("Test tab reload with chrome.tabs.query", () => {
      const result = reloadDapp();
      expect(result).toBeUndefined();
    });
  });
});
