import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { OPEN_IN_WEB } from "theme/constants";
import { getStorageSyncValue, setStorageSyncValue } from "utils/utils.storage";

// from 'sinon-chrome'
import { act } from "@testing-library/react";

// will not work in development environment
// export const utilStorage = () =>
describe("setStorageSyncValue", () => {
  it("should set value to localStorage if OPEN_IN_WEB", async () => {
    const keyName = "testKey";
    const value = { name: "test" };
    await setStorageSyncValue(keyName, value);
    // jest.useFakeTimers();'
    act(() => {
      jest.runAllTimers();
    });

    expect(localStorage.getItem(keyName)).toEqual(JSON.stringify(value));
    await new Promise((r) => setTimeout(r, 3000));
  }, 60000);

  it("store value in chrome storage", (done) => {
    // chrome.storage.sync.set.mockImplementation((_data: any, cb: () => void) => {
    //   cb();
    // });

    const keyName = "testKeyName";
    const value = { name: "test" };
    // await chrome.storage.sync.set("key", value);
    // expect(chrome.storage.sync.set).toHaveBeenCalledWith({ key: value });
    setStorageSyncValue(keyName, value)
      .then((res) => {
        console.log(res, "RESSSSSS");
      })
      .catch((err) => console.log(err, "ERRRRRRRRRRRRRRRRRRRR----"));
    done();
    // console.log(result, "THE RESULT IN THE TEST CASES");
  });

  it("should set value to STORAGE if not OPEN_IN_WEB", async () => {
    const keyName = "testKeyName";
    const value = { name: "testName" };

    const mockSet = jest.fn();
    window.chrome = {
      storage: {
        // @ts-ignore
        local: {
          set: mockSet,
        },
      },
    };

    await setStorageSyncValue(keyName, value);
    console.log(mockSet, "THE MOCK SET not open");
    expect(mockSet).toBeDefined();
  });

  it("should return object for web", async () => {
    const keyName = "testKey";
    const expectedValue = { test: "value" };

    localStorage.setItem(keyName, JSON.stringify(expectedValue));
    const result = await getStorageSyncValue(keyName);
    console.log(result, "THE RESULT for web");
    expect(result).toEqual(expectedValue);
  }, 60000);

  it("returns an empty object when no existing item is found in localStorage", async () => {
    const itemKey = "myItem";
    const expectedValue = {};
    localStorage.removeItem(itemKey);

    const result = await getStorageSyncValue(itemKey);
    console.log(result, "THE RESULT localStorag");
    expect(result).toEqual(expectedValue);
  }, 60000);

  it("returns an empty object when non-existing keyName passed", async () => {
    console.log(OPEN_IN_WEB, "open in the wbe");
    const result = await getStorageSyncValue("non-existing-key");
    console.log(result, "THE RESULT key passed");
    expect(result).toEqual({});
  }, 60000);
});
