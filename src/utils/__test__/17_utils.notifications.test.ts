import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { generateNotification } from "utils/utils.notifications";

jest.mock("@extend-chrome/notify", () => {
  // const originalModule = jest.requireActual("@extend-chrome/notify");
  return {
    __esModule: true,
    // ...originalModule,
    notify: {
      create: jest.fn().mockReturnValue(2),
    },
  };
});
jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
// export const generateNotificationTest = () =>
describe("generateNotification", () => {
  it("should generate notification", async () => {
    const id = generateNotification("title", "message");
    jest.advanceTimersByTime(5000);
    expect(id).toBeDefined();
  }, 600000);
});
