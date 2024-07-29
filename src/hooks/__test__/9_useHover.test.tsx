import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";

import { useHover } from "../useHover";
import { store as DevStore } from "store/store";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseHoverHook = () =>

  describe("useHover", () => {
    it("should update hovering state when onMouseEnter and onMouseLeave are called", async () => {
      await act(async () => {
        const { result, rerender } = await renderHook(() => useHover(), {
          wrapper,
        });

        await result.current[1].onMouseEnter();
        rerender();
        expect(result.current[0]).toBe(true);
        await result.current[1].onMouseLeave();
        expect(result.current[0]).toBe(false);
      });
    });
		console.log("==========HOVER DONE")
  
  });
