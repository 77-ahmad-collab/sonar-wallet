import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";

import { store as DevStore, StaticStore } from "store/store";
import useLongPress from "../useLongPress";
import { setSlideAnimation } from "@slices/appSlice";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseLongPressHook = () =>

  describe("useLongPress", () => {
    it("will test out the long press functionality", async () => {
      await act(async () => {
        const { result } = await renderHook(
          () =>
            useLongPress(
              () => {},
              1000,
              () => {
                StaticStore.dispatch(setSlideAnimation("expand"));
              },
              () => {
                StaticStore.dispatch(setSlideAnimation("contract"));
              }
            ),
          {
            wrapper,
          }
        );

        expect(result.current.onMouseDown).not.toBeUndefined();
        await result.current.onMouseDown();

        expect(result.current.onMouseUp).not.toBeUndefined();
        await result.current.onMouseUp();
      });
    });
		console.log("==========LONG PRESS DONE")
  
  });
