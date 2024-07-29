import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";

import { useClipboard } from "../useClipboard";
import { store as DevStore } from "store/store";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// will not work in development

jest.mock("../../utils/index.ts", () => {
  return {
    getDataFromClipboard: jest.fn(() => "test-value"),
    __esModule: true,
  };
});

// export const shouldBehaveLikeAUseClipboardHook = () => 

  describe("useClipboard", () => {
    it("should call setInterval every 3 seconds", async () => {
      const setInterval = jest.spyOn(window, "setInterval");

      await act(async () => {
        renderHook(() => useClipboard(), { wrapper })
      })
        
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 3000);
    });
    describe("useClipboard", () => {
      let spy: any;
      const setClipboardValue= jest.fn();
      let selectedInputId: string;
      let clipboardValue: unknown;

      beforeEach(() => {
        selectedInputId = "input_id";
        global.document.execCommand = jest.fn();
        clipboardValue = "value from clipboard";
        spy = jest
          .spyOn(React, "useState")
          .mockReturnValue([clipboardValue, setClipboardValue]);
        //   jest.spyOn(window.document, "execCommand").mockImplementation(() => {
        //     // Do something here.
        //     return true;
        //   });
        //   spy = jest.spyOn(React, 'useEffect').mockReturnValue(null);
        //   spy = jest.spyOn(React, 'useAppSelector').mockReturnValue({selectedInputId});
        //   spy = jest.spyOn("../../utils/index.ts", 'getDataFromClipboard').mockReturnValue(clipboardValue);
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it("should set clipboard value on mount", async () => {
        await act(async () => {

          const { result } = renderHook(() => useClipboard(), { wrapper });
          console.log(
            "🚀 ~ file: useClipboard.test.tsx:28 ~ it ~ result",
            result.current
            );
            // expect(await useClipboard()).toEqual(clipboardValue);
          })
        //   expect(getDataFromClipboard).toHaveBeenCalledWith(selectedInputId);
      });
    });
		console.log("==========CLIPBOARD DONE")

  });
