import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";
import { fireEvent } from "@testing-library/react";

import { store as DevStore } from "store/store";
import { useStep3 } from "../useStep3";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeUseStep3Hook = () =>

describe("useStep3", () => {
  it("sets confirmPassword correctly", async () => {
    await act(async () => {
      const { result } = await renderHook(() => useStep3(jest.fn(), 3), {
        wrapper,
      });
      const confirmPassword = "123";
      result.current.setConfirmPassword(confirmPassword);
      expect(result.current.confirmPassword).toBe("123");
    });
  });

  it("sets isSomethingWrong to true when confirmPassword does not match password", async () => {
    const { result } = await renderHook(() => useStep3(jest.fn(), 3), {
      wrapper,
    });
    await act(async () => {
      const confirmPassword = "Ahmed123*qwe";
      await result.current.setConfirmPassword(confirmPassword);
    });
    expect(result.current.isSomethingWrong).toBe(true);
  });

  it("handleGoBack function ", async () => {
    const { result } = await renderHook(() => useStep3(jest.fn(), 3), {
      wrapper,
    });
    await act(async () => {
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

      result.current.handleGoBack();
    });
  });
});
