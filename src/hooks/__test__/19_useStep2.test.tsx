import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";
import { fireEvent } from "@testing-library/react";

import { store as DevStore } from "store/store";
import { useStep2 } from "../useStep2";
import * as appActions from "../../store/slices/appSlice";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeUseStep2Hook = () =>

  describe("useStep2", () => {
    it("will check password validation", async () => {
      await act(async () => {
        const setPasswordDispatch = jest.spyOn(appActions, "setPassword");
        const { result } = await renderHook(() => useStep2(jest.fn(), 2), {
          wrapper,
        });

        result.current.setPassword("test.com");

        expect(result.current.password).toBe("test.com");
        expect(setPasswordDispatch).not.toHaveBeenCalled();
        result.current.setPassword("1");

        expect(result.current.error).toStrictEqual({
          message: "",
          status: false,
        });
        fireEvent.keyDown(document, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });

        await result.current.onEnterPress();
        expect(result.current.error).toStrictEqual({
          message:
            "Password must be at least 8 characters long, should contain upper & lower case letters, at least 1 number & 1 special character",
          status: true,
        });
      });
    });

    it("should pass for Valid password with no error", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useStep2(jest.fn(), 2), {
          wrapper,
        });
        result.current.setPassword("Muqeet123*#$");
        await result.current.onEnterPress();
        expect(result.current.error).toStrictEqual({
          message: "",
          status: false,
        });
        fireEvent.keyDown(document, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });
        fireEvent.keyDown(document, {
          key: "0",
          code: "Digit0",
          charCode: 48,
        });
      });
    });
  });
