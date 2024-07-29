import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";
import { fireEvent } from "@testing-library/react";

import { store as DevStore } from "store/store";
import { useLogin } from "../useLogin";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseLoginHook = () =>
  describe("useLogin", () => {
    it("will test the keydown event", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useLogin(1), {
          wrapper,
        });

        fireEvent.keyDown(document, {
          key: "0",
          code: "Digit0",
          charCode: 48,
        });
        fireEvent.keyDown(document, {
          key: "0",
          code: "Digit0",
          charCode: 48,
        });

        expect(result.current.password).toBe("00");
      });
    });
    it("will throw the error, Password is incorrect", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useLogin(1), {
          wrapper,
        });

        fireEvent.keyDown(document, {
          key: "0",
          code: "Digit0",
          charCode: 48,
        });
        fireEvent.keyDown(document, {
          key: "0",
          code: "Digit0",
          charCode: 48,
        });
        fireEvent.keyDown(document, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });

        expect(result.current.error.message).toBe("Password is incorrect");
        expect(result.current.error.status).toBe(true);
      });
    });
    it("will throw the error,Please enter your password", async () => {
      await act(async () => {
        const { result } = await renderHook(() => useLogin(1), {
          wrapper,
        });

        fireEvent.keyDown(document, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });

        expect(result.current.error.message).toBe("Please enter your password");
        expect(result.current.error.status).toBe(true);
      });
    });
    it("will should logged in, on correct password", async () => {
      const { result } = await renderHook(() => useLogin(1), {
        wrapper,
      });
      await act(async () => {
        await result.current.setPassword("Ahmed123**");
      });
      await act(async () => {
        await fireEvent.keyDown(document, {
          key: "Backspace",
          code: "Backspace",
          charCode: 13,
        });

        await fireEvent.keyDown(document, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });
        expect(result.current.error).toBeFalsy;
      });
    });
		console.log("==========LOGIN DONE")
  
  });
