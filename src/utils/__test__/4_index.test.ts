import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { ethers } from "ethers";
import { StaticStore } from "store/store";
import {
  arraysAreIdentical,
  checkIfMobile,
  checkSum,
  convertBalanceToBaseUnit,
  convertEtherToWei,
  convertWeiToEther,
  decryptMessage,
  encryptMessage,
  getDataFromClipboard,
  getNameFromAddressBook,
  getRandomNumber,
  getSolanaConnection,
  isStringIncludesTheValue,
  keyDownListener,
  matchAddresses,
  mergeNewAndOldActivityData,
  shuffle,
  truncateAddress,
  truncateName,
} from "utils";
import { NETWORKCHAIN, SupportedChainId } from "utils/constants";
import { transactionData } from "./payload";

const { abi } = require("../../abis/erc20abi.json");

// export const utilIndex = () =>
describe("index.ts", () => {
  describe("convertWeiToEther", () => {
    test("convertWeiToEther should convert 1000000000000000000 WEI to 1 ether", () => {
      expect(convertWeiToEther(1000000000000000000, 18)).toEqual(1);
    });

    test("convertWeiToEther should convert 500000000000000000 WEI to 0.5 ether", () => {
      expect(convertWeiToEther(500000000000000000, 18)).toEqual(0.5);
    });
  });

  describe("convertEtherToWei", () => {
    test("convertEtherToWei should convert ether to wei", () => {
      expect(convertEtherToWei(1.2, 18)).toBe(1200000000000000000);
    });

    test("convertEtherToWei should return 0 when passed 0 ether", () => {
      expect(convertEtherToWei(0, 18)).toBe(0);
    });
  });
  describe("convertBalanceToBaseUnit", () => {
    it("should convert balance properly", async () => {
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[5].NODE_URL
      );
      const contract = new ethers.Contract(
        "0x08209a62C202c2DAF27d2796bb574779cC345889",
        abi,
        ethersProvider
      );
      const value = 5;
      const result = await convertBalanceToBaseUnit(contract, value);
      expect(result).toBe("5000000");
    });

    it("should throw an error if value is not a number", async () => {
      const contract = {
        methods: {
          decimals: jest.fn().mockReturnValueOnce(4),
        },
      };
      const value = "abc";
      await expect(
        convertBalanceToBaseUnit(contract as any, value as any as number)
      ).rejects.toThrow();
    });
  });
  describe("arraysAreIdentical", () => {
    test("arrays are identical", () => {
      const array1 = ["a", "b", "c"];
      const array2 = ["a", "b", "c"];
      expect(arraysAreIdentical(array1, array2)).toBe(true);
    });

    test("arrays are not identical", () => {
      const array1 = ["a", "b", "c"];
      const array2 = ["a", "b", "d"];
      expect(arraysAreIdentical(array1, array2)).toBe(false);
    });
  });
  describe("shuffle", () => {
    test("shuffle should not modify the original array", () => {
      const array = ["a", "b", "c", "d"];
      const originalArray = [...array];
      const shuffledArray = shuffle(array);
      expect(shuffledArray).not.toEqual(originalArray);
    });
  });
  describe("getRandomNumber", () => {
    test("getRandomNumber() should return a random number", () => {
      expect(getRandomNumber()).not.toBeNaN();
    });

    test("getRandomNumber() should be between 0 and 1", () => {
      expect(getRandomNumber()).toBeLessThanOrEqual(1);
      expect(getRandomNumber()).toBeGreaterThanOrEqual(0);
    });
  });
  describe("getDataFromClipboard test", () => {
    it("should return clipboard data", () => {
      document.body.innerHTML =
        '<input type="text" id="someId" value="testValue">';
      expect(getDataFromClipboard("someId")).toBe("");
    });
  });

  describe("keyDownListener", () => {
    const mockEnterPress = jest.fn();
    const mockBackSpacePress = jest.fn();
    const mockValidKeyPress = jest.fn();
    const mockEvent = {
      code: "Enter",
      key: "a",
    } as KeyboardEvent;
    const mockEventTab = {
      code: "Tab",
      key: "b",
      preventDefault: jest.fn(),
    } as any as KeyboardEvent;
    const mockEventNumPadEnter = {
      code: "NumpadEnter",
      key: "c",
    } as KeyboardEvent;
    const mockEventBackSpace = {
      code: "Backspace",
      key: "d",
    } as KeyboardEvent;
    const mockEventSpecialChar = {
      code: "",
      key: "#",
    } as KeyboardEvent;
    const mockEventAlphaNumeric = {
      code: "",
      key: "f",
    } as KeyboardEvent;

    it("should prevent default for Tab press", () => {
      keyDownListener(
        mockEventTab,
        2,
        2,
        mockEnterPress,
        mockBackSpacePress,
        mockValidKeyPress
      );

      expect(mockEventTab.preventDefault).toHaveBeenCalled();
    });

    it("should call onEnterPress for Enter press", () => {
      keyDownListener(
        mockEvent,
        1,
        1,
        mockEnterPress,
        mockBackSpacePress,
        mockValidKeyPress
      );

      expect(mockEnterPress).toHaveBeenCalled();
    });

    it("should call onEnterPress for NumpadEnter press", () => {
      keyDownListener(
        mockEventNumPadEnter,
        2,
        2,
        mockEnterPress,
        mockBackSpacePress,
        mockValidKeyPress
      );

      expect(mockEnterPress).toHaveBeenCalled();
    });

    it("should call onBackSpacePress for BackSpace press", () => {
      keyDownListener(
        mockEventBackSpace,
        2,
        2,
        mockEnterPress,
        mockBackSpacePress,
        mockValidKeyPress
      );

      expect(mockBackSpacePress).toHaveBeenCalled();
    });

    it("should call onValidKeyPress for Special Char press", () => {
      keyDownListener(
        mockEventSpecialChar,
        1,
        1,
        mockEnterPress,
        mockBackSpacePress,
        mockValidKeyPress
      );

      expect(mockValidKeyPress).toHaveBeenCalled();
    });

    it("should call onValidKeyPress for AlphaNumeric press", () => {
      keyDownListener(
        mockEventAlphaNumeric,
        1,
        1,
        mockEnterPress,
        mockBackSpacePress,
        mockValidKeyPress
      );

      expect(mockValidKeyPress).toHaveBeenCalled();
    });
  });
  describe("encryptMessage", () => {
    it("should return ciphertext when given message and secret", () => {
      const message = "Hello World";
      const secret = "secret";

      const ciphertext = encryptMessage(message, secret);

      expect(ciphertext).not.toBeNull();
      expect(ciphertext).not.toBeUndefined();
    });
  });
  describe("decryptMessage", () => {
    test("should return decrypted string", () => {
      const cipherText = "U2FsdGVkX1+3N3dE5Ek+pczkcnQ3xg/VCL/KXFk7iLo=";
      const secret = "secret";
      const expectedResult = "Hello World";

      const result = decryptMessage(cipherText, secret);

      expect(result).toEqual(expectedResult);
    });

    test("should throw error when cipherText is invalid", () => {
      const cipherText = "invalidCipherText";
      const secret = "testSecret";

      expect(() => decryptMessage(cipherText, secret)).toThrow();
    });
  });
  describe("isStringIncludesTheValue", () => {
    describe("isStringIncludesTheValue", () => {
      test("should return true when value is included in the item string", () => {
        expect(isStringIncludesTheValue("Some string", "ring")).toBeTruthy();
      });

      test("should return false when value is included in the item string", () => {
        expect(isStringIncludesTheValue("Some string", "value")).toBeFalsy();
      });
    });
  });
  describe("truncateAddress", () => {
    test("should truncate an address to the first 4 and last 4 characters", () => {
      expect(truncateAddress("abcdefghijklmnopqrstuvwxyz")).toBe("abcd…wxyz");
    });

    test("should return empty string when given an empty string", () => {
      expect(truncateAddress("")).toBe("");
    });
  });
  describe("truncateName", () => {
    // Test 1:
    test("truncateName should return a string that is shorter than or equal to 8 characters", () => {
      const inputName = "John Doe";
      const outputName = truncateName(inputName);
      expect(outputName).toHaveLength(8);
    });

    // Test 2:
    test("truncateName should return an empty string if the given name is empty", () => {
      const inputName = "";
      const outputName = truncateName(inputName);
      expect(outputName).toBe("");
    });
  });
  describe("matchAddresses", () => {
    test("should return true if address1 and address2 are the same", () => {
      expect(matchAddresses("123 Main Street", "123 Main Street")).toBe(true);
    });

    test("should return true if address1 and address2 are the same, but with different casing", () => {
      expect(matchAddresses("123 Main Street", "123 MAIN STREET")).toBe(true);
    });
  });
  describe("checkSum", () => {
    it("should return address if valid", () => {
      const address = "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55";
      expect(checkSum(address)).toBe(address);
    });

    it("should return address if invalid", () => {
      const address = "0xF0109fC8DF283027b6285cc889F5aA624EaC1F56";
      expect(checkSum(address)).toBe(address);
    });
  });

  describe("getSolanaConnection", () => {
    it("should return a Connection object when isMainnet is true", () => {
      const connection = getSolanaConnection(true);

      expect(connection.rpcEndpoint).toBe(
        NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET].NODE_URL
      );
    });

    it("should return a Connection object when isMainnet is false", () => {
      const connection = getSolanaConnection(false);
      expect(connection.rpcEndpoint).toBe(
        NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET].NODE_URL
      );
    });
  });
  describe("getNameFromAddressBook", () => {
    test("it should return the name from address book", () => {
      expect(getNameFromAddressBook("0x123456789")).toBe("");
    });
  });
  describe("mergeNewAndOldActivityData", () => {
    const data = mergeNewAndOldActivityData({
      previousTransactionActivityData:
        StaticStore.getState().newWallet.activity,
      transactionData,
    });

    expect(data).toHaveProperty("0xF0109fC8DF283027b6285cc889F5aA624EaC1F56");
  });
  describe("checkIfMobile", () => {
    test("checkIfMobile()", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "mobile",
        configurable: true,
      });
      expect(checkIfMobile()).toBeTruthy();

      Object.defineProperty(navigator, "userAgent", {
        value: "desktop",
        configurable: true,
      });
      expect(checkIfMobile()).toBeFalsy();
    });
  });
});
