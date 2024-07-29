import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { NETWORKS } from "utils/constants";
import {
  validateAddress,
  validateEVMAddress,
  validateNearMainnetAddress,
  validateNearTestnetAddress,
  validateSolanaAddress,
} from "../validateAddresses";

// export const utilValidAddress = () =>
describe("validAddresses test cases", () => {
  describe("validateEVMAddress", () => {
    it("should returns false given a zero address", () => {
      expect(
        validateEVMAddress("0x0000000000000000000000000000000000000000")
      ).toBe(false);
    });

    it("should returns false given an invalid address", () => {
      expect(validateEVMAddress("0xABC")).toBe(false);
    });

    it("should returns true given a valid address", () => {
      expect(
        validateEVMAddress("0x70f1a03d2E6D2fea7b70fb0d8a8c9A13e0B9AAcD")
      ).toBe(true);
    });
    it("should returns false given a invalid address", () => {
      expect(
        validateEVMAddress("0x70f1a03d2e6d2fea7b70fb0dirfc9a13e0b9aacf")
      ).toBe(false);
    });
  });

  describe("cases for validateSolanaAddress function", () => {
    it("should return true when given a valid address", () => {
      const addr = "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q";
      expect(validateSolanaAddress(addr)).toBe(true);
    });

    it("should return false when given an invalid address", () => {
      const addr = "6jKb6aQeRUg2sUQ4HU4xf6K4MkDd9zq3vFqJjKU8a3tx";
      expect(validateSolanaAddress(addr)).toBe(false);
    });
  });

  describe("cases for validateNearTestnetAddress function", () => {
    it('validateNearTestnetAddress should return true if address includes ".testnet"', () => {
      expect(validateNearTestnetAddress("testnet.testnet")).toBe(true);
    });

    it('validateNearTestnetAddress should return false if address does not include ".testnet"', () => {
      expect(validateNearTestnetAddress("testnet.test.fail")).toBe(false);
    });

    it("validateNearTestnetAddress should return false mixed case strings", () => {
      expect(validateNearTestnetAddress("tEsTnEt.nEaR.oRg")).toBe(false);
    });
  });

  describe("cases for validateNearMainnetAddress function", () => {
    test("validateNearMainnetAddress should return true if address includes .near", () => {
      const address = "test.near";
      expect(validateNearMainnetAddress(address)).toBe(true);
    });
    it("should return true for valid address with 64 characters", () => {
      const addr =
        "e831b25c42754b4987e31419eba3e3d9b7b33ba116a4f01ac115fd7236e8515a";
      expect(validateNearMainnetAddress(addr)).toBe(true);
    });
    it("should return false for invalid address with 64 characters", () => {
      const addr =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      expect(validateNearMainnetAddress(addr)).toBe(false);
    });
    it("should return false for invalid address", () => {
      const addr = "test.notNear";
      expect(validateNearMainnetAddress(addr)).toBe(false);
    });

    test("validateNearMainnetAddress should return true if address is 64 characters", () => {
      const address =
        "1234567890123456789012345678901234567890123456789012345678901234";
      expect(validateNearMainnetAddress(address)).toBe(true);
    });

    test("validateNearMainnetAddress should return false if address is not 64 characters or includes .near", () => {
      const address = "1234567890123456789012345678901234567890";
      expect(validateNearMainnetAddress(address)).toBe(false);
    });
  });

  describe("cases for validateAddress function", () => {
    it("should return false when given a invalid NEAR address", () => {
      const address = "2m2fncJYnEbkW8zvXF9JhfFPauqv6A7W8Fvx6M7U6SgU6T";
      expect(validateAddress(address, NETWORKS.NEAR)).toBe(false);
      expect(validateAddress("", NETWORKS.NEAR)).toBe(false);
      expect(validateAddress("0x1234", NETWORKS.NEAR)).toBe(false);
      expect(validateAddress("abcd", NETWORKS.NEAR)).toBe(false);
    });

    it("should return true when given a valid NEAR address", () => {
      const address =
        "e831b25c42754b4987e31419eba3e3d9b7b33ba116a4f01ac115fd7236e8515a";
      const chainFamily = NETWORKS.NEAR;
      expect(validateAddress(address, chainFamily)).toBe(true);
    });

    it("should return true when given a valid Solana address", () => {
      const address = "FhfYbEzmKjyD9XhJ1bUgjfWKP8Zvb6Vj1y5fDdV7P8t";
      const chainFamily = NETWORKS.SOLANA;
      expect(validateAddress(address, chainFamily)).toBe(true);
    });

    it("should return false when given a invalid Solana address", () => {
      expect(validateAddress("", NETWORKS.SOLANA)).toBe(false);
      expect(validateAddress("0x1234", NETWORKS.SOLANA)).toBe(false);
      expect(validateAddress("abcd", NETWORKS.SOLANA)).toBe(false);
    });

    it("should return false when given a invalid ENM address", () => {
      expect(validateAddress("", NETWORKS.EVM)).toBe(false);
      expect(validateAddress("abcd", NETWORKS.EVM)).toBe(false);
      expect(validateAddress("0x1234567890123", NETWORKS.EVM)).toBe(false);
    });
  });
});
