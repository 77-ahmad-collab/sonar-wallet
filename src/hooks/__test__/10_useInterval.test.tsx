import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";

import { store as DevStore } from "store/store";
import useInterval from "../useInterval";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

jest.useFakeTimers();
jest.spyOn(global, "setInterval");

// export const shouldBehaveLikeAUseIntervalHook = () => 

  describe("useInterval", () => {
    it("should call the callback passed to the hook every delay number of milliseconds", async () => {
      // await act(async () => {
      const mockCallback = () => console.log("MY NAME "); //jest.fn(() => console.log("my micl"));
      const delay = 1000;
      await renderHook(() => useInterval(mockCallback, delay), {
        wrapper,
      });

      expect(setInterval).toHaveBeenCalledTimes(1);
    }, 10_000);
    //   });
		console.log("==========INTERVAL DONE")

  });