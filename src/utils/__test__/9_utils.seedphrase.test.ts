import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { convertMnemonicToArray } from "utils/utils.seedPhrase";

// export const utilSeedphrase = () =>
describe("convertMnemonicToArray", () => {
  it("returns an empty string array when input is an empty string", () => {
    const result = convertMnemonicToArray("");
    expect(result).toEqual([""]);
  });

  it("returns an array of single word when input is a single word", () => {
    const result = convertMnemonicToArray("hello");
    expect(result).toEqual(["hello"]);
  });

  it("returns an array of words when input is multiple words", () => {
    const result = convertMnemonicToArray("hello world");
    expect(result).toEqual(["hello", "world"]);
  });

  // Positive tests
  it('convertMnemonicToArray should convert "this is a test" to ["this", "is", "a", "test"]', () => {
    const result = convertMnemonicToArray("this is a test");

    expect(result).toEqual(["this", "is", "a", "test"]);
  });

  // Negative tests
  it('convertMnemonicToArray should not convert "this is a test" to ["this", "is", "test"]', () => {
    expect(convertMnemonicToArray("this is a test")).not.toEqual([
      "this",
      "is",
      "test",
    ]);
  });
});
