import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import {
  formatAddress,
  formatAmount,
  numFormatter,
  toFixed,
  toReadableAmount,
} from "utils/formatters";

// export const utilFormatter = () =>
describe("formatters file test cases", () => {
  describe("test casses for formatAddress", () => {
    it("formatAddress should return address with ellipses in the middle", () => {
      const address = "0x6b03f25c8d6d7de08b2e2f7d3b3be3d7f9e97c9c";
      const formattedAddress = formatAddress(address);
      expect(formattedAddress).toBe("0x...97c9c");
    });
  });

  describe("test cases for formatAmount", () => {
    it("Should return 0 when amount is 0", () => {
      expect(formatAmount(0)).toBe("0");
    });

    it("Should return <0.001 when amount is less than 0.001", () => {
      expect(formatAmount(0.0005)).toBe("<0.001");
    });

    it("Should return 0.000000001 when amount is less than 0.001", () => {
      expect(formatAmount(0.000000001)).toBe("<0.001");
    });

    it("Should return <0.01 when amount is less than 0.01", () => {
      expect(formatAmount(0.0095)).toBe("<0.01");
    });

    it("Should return the correct number when amount is greater than 100k", () => {
      expect(formatAmount(123456)).toBe("123.46K");
    });

    it("Should return the correct number when amount is greater than 1M", () => {
      expect(formatAmount(12345678)).toBe("12.35M");
    });
    it("Should return the correct number when amount is greater than 1P", () => {
      expect(formatAmount(1234567812345678)).toBe("1.23P");
    });

    it("Should return the correct number when amount is 25000000000000000", () => {
      expect(formatAmount(25000000000000000)).toBe("25000000000000000");
    });

    it("Should return the correct number when amount is greater than 100B", () => {
      expect(formatAmount(123456781234)).toBe("123.46B");
    });

    it("should format 0 correctly", () => {
      expect(formatAmount(0)).toEqual("0");
    });

    it("should format < 0.001 correctly", () => {
      expect(formatAmount(0.0005)).toEqual("<0.001");
    });

    it("should format < 0.01 correctly", () => {
      expect(formatAmount(0.009)).toEqual("<0.01");
    });

    it("should format > 0.01 correctly", () => {
      expect(formatAmount(0.5)).toEqual("0.5");
    });

    it("should format > 1 correctly", () => {
      expect(formatAmount(5)).toEqual("5");
    });

    it("should format > 1 correctly", () => {
      expect(formatAmount(0.00005)).toEqual("<0.001");
    });

    it("should format > 1000 correctly", () => {
      expect(formatAmount(5000)).toEqual("5K");
    });
  });

  describe("test cases for toFixed function", () => {
    test("returns a string with 2 decimals when a number is passed", () => {
      expect(toFixed(2.1234)).toBe(2.1234);
    });

    test("returns a 0.2 if a number is 0.2", () => {
      expect(toFixed(0.2)).toBe(0.2);
    });

    test("returns a same number if a number contains no decimal", () => {
      expect(toFixed(2)).toBe(2);
    });

    test("test for huge number", () => {
      expect(toFixed(20000000000000000000000)).toBe("20000000000000000000000");
    });

    test("test for too small number", () => {
      expect(toFixed(0.000000000000002)).toBe("0.000000000000002");
    });

    test("test for too small number", () => {
      expect(toFixed(0.0000000000000000002)).toBe(
        "0.00000000000000000019999999999999998"
      );
    });

    test("enters string as parameter", () => {
      expect(toFixed(2)).toBe(2);
    });
  });

  describe("test cases for numFormatter function", () => {
    test('should return { amount: 9007199254740992, symbol: "", status: true } for 2**53', () => {
      expect(numFormatter(2 ** 53)).toEqual({
        amount: 9007199254740992,
        symbol: "",
        status: true,
      });
    });
    test('should return { amount: 9007199254740992, symbol: "", status: true } for more than 2**53', () => {
      expect(numFormatter(2 ** 53 + 2)).toEqual({
        amount: 0,
        symbol: "",
        status: true,
      });
    });
  });

  describe("toReadableAmount", () => {
    test("should convert a BigNumberish value to a human-readable format with default unit", () => {
      expect(toReadableAmount("1000000000000000000")).toBe("1.0");
      expect(toReadableAmount("1234567890123456789")).toBe(
        "1.234567890123456789"
      );
    });

    test("should convert a BigNumberish value to a human-readable format with custom unit", () => {
      expect(toReadableAmount("1000000000000000000", "ether")).toBe("1.0");
      expect(toReadableAmount("1234567890123456789", "gwei")).toBe(
        "1234567890.123456789"
      );
    });
  });

  it("tests for bigger amount", () => {
    expect(numFormatter(25000000)).toEqual({
      amount: 25,
      symbol: "M",
      status: true,
    });

    expect(numFormatter(25000000000)).toEqual({
      amount: 25,
      symbol: "B",
      status: true,
    });
    expect(numFormatter(25000000000000)).toEqual({
      amount: 25,
      symbol: "T",
      status: true,
    });

    //todo: 25000000000000000 should return 25P
    expect(numFormatter(25000000000000000)).toEqual({
      amount: 0,
      symbol: "",
      status: true,
    });

    //todo: 25000000000000000000 should return 25E
    expect(numFormatter(25000000000000000000)).toEqual({
      amount: 0,
      symbol: "",
      status: true,
    });
  });

  it("tests for less than 0.00000001 amount", () => {
    expect(numFormatter(0.00000000002)).toEqual({
      amount: 0,
      symbol: "",
      status: false,
    });
    //todo: 0.0000000000004 should give 0 if above test gives so
    expect(numFormatter(0.0000000000004, 15)).toEqual({
      amount: 40000000000000,
      symbol: "",
      status: false,
    });

    //todo: 0.00004 should give 0 if above test gives so
    expect(numFormatter(0.00004, 15)).toEqual({
      amount: 0.00004,
      symbol: "",
      status: true,
    });
  });
  test('should return { amount: 2.50, symbol: "K", status: true } for 25000', () => {
    expect(numFormatter(25000)).toEqual({
      amount: 25,
      symbol: "K",
      status: true,
    });
  });

  test('should return { amount: 2.50, symbol: "K", status: true } for 25000', () => {
    expect(numFormatter(25000)).toEqual({
      amount: 25,
      symbol: "K",
      status: true,
    });
  });

  test('should return { amount: 2.50, symbol: "K", status: true } for 25000', () => {
    expect(numFormatter(25000)).toEqual({
      amount: 25,
      symbol: "K",
      status: true,
    });
  });

  test('should return { amount: 2.50, symbol: "K", status: true } for 25000 with precision 3', () => {
    expect(numFormatter(25000, 3)).toEqual({
      amount: 25,
      symbol: "K",
      status: true,
    });
  });
});
