import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
// import { fetchMock } from "hooks/__test__/apiMock";
import * as Bip39 from "bip39";
import * as web3 from "@solana/web3.js";
import b58 from "b58";

import { NETWORKS } from "utils/constants";
import {
  calculateRatioAmount,
  extractKeypair,
  fetchImageAndUpdateTokenPrice,
  filterAccounts,
  getAccountIds,
  getAllAccountsOfSingleWallet,
  getHashedPassword,
  getPrivateKeysOfAccounts,
  getSimpleAccountsList,
  getfilterWalletInfo,
  setHashedPassword,
} from "utils/utils.wallets";

import { StaticStore } from "store/store";
import {
  setAccountsSelected,
  setFilteredWallet,
  setNewWallet,
} from "@slices/newWalletSlice";
import {
  fetchImageAndUpdateTokenPriceData,
  fetchImageAndUpdateTokenPriceData2,
  selectedAccount1,
  selectedAccount2,
  selectedAccount3,
} from "./payload/utils.wallet";
import CachedService from "classes/cachedService";
import * as utilStorageActions from "utils/utils.storage";

// export const utilWallet = () =>
describe("utls.wallet", () => {
  beforeEach(() => {
    // jest.restoreAllMocks();
    jest
      .spyOn(CachedService, "getHashedPassword")
      .mockReturnValue(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
  });

  describe("getHashedPassword", () => {
    it("should return hashed password", async () => {
      jest
        .spyOn(utilStorageActions, "getSessionStorageValue")
        .mockResolvedValue(
          "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
        );

      const result = await getHashedPassword();
      expect(result).toBe(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
    });
  });

  describe("setHashedPassword", () => {
    it("should set hashed password", async () => {
      jest
        .spyOn(utilStorageActions, "setSessionStorageValue")
        .mockImplementation(
          jest
            .fn()
            .mockReturnValue(
              "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
            )
        );

      await setHashedPassword(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
      expect(utilStorageActions.setSessionStorageValue).toHaveBeenCalled();
    });
  });

  describe("test casses for utils.wallets", () => {
    it("getPrivateKeysOfAccounts for EVM", async () => {
      const result = await getPrivateKeysOfAccounts(NETWORKS.EVM);
      expect(result).toMatchObject({
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847":
          "c63c96f7abe0d36f4eaa105ebc0910e242c50b3baee295a12e98f4e73160d157",
      });
    });

    it("getPrivateKeysOfAccounts for Near", async () => {
      const result = await getPrivateKeysOfAccounts(NETWORKS.NEAR);
      expect(result).toMatchObject({
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d":
          "ed25519:3V1EKJwptyYhHPbj1e1R4ksSd5rSEkSY8XmXYP6PGqeMVzw3B6bkkNQ1DkgktjRbLiiD8HVf2qhacKfqLy7t2dRe",
      });
    });

    it("getPrivateKeysOfAccounts for Solana", async () => {
      const result = await getPrivateKeysOfAccounts(NETWORKS.SOLANA);
      expect(result).toMatchObject({
        EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q:
          "4vx1oN4YyFKPGRVaivpRiAJ6EY4kke3ErgeTu8U76brCJHJYUAbYpihqR5iiqbju55kk2npwchhJDHbJKnbQ1NCW",
      });
    });
  });

  describe("extractKeypair", () => {
    it("should throw an error if no secret key is provided", () => {
      expect(() => {
        extractKeypair("asdas");
      }).toThrowError("bad secret key size");
    });

    it("should throw an error if no secret key is provided", () => {
      expect(() => {
        extractKeypair("");
      }).toThrowError("bad secret key size");
    });

    it("should be able to extract a keypair when given a seed phrase", () => {
      const seedPhrase =
        "render pride evolve zero come skirt media truly winter yard crush buffalo";
      const expectedResult = web3.Keypair.fromSeed(
        new Uint8Array(Bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32))
      );
      const result = extractKeypair(seedPhrase);
      expect(result).toEqual(expectedResult);
    });

    // Test 2
    xit("should be able to extract a keypair when given a secret key", () => {
      // @secret-key key when testing
      const secretKey = ""; //removed
      const expectedResult = web3.Keypair.fromSecretKey(
        new Uint8Array(b58.decode(secretKey))
      );
      const result = extractKeypair(secretKey);
      expect(result).toEqual(expectedResult);
    });
  });
  describe("getAccountIds", () => {
    it("should fetch ids for near", async () => {
      const data = await getAccountIds(
        "e831b25c42754b4987e31419eba3e3d9b7b33ba116a4f01ac115fd7236e8515a",
        101
      );
      expect(data).toBe("");
    }, 90000);
  });

  describe("filterAccounts test cases", () => {
    const accounts = StaticStore.getState().newWallet.accounts;
    const accountDetails = Object.keys(accounts).map((key) => accounts[key]);

    it("should get filtered account details from all chain", async () => {
      const data = await filterAccounts({
        chainFamily: [NETWORKS.EVM, NETWORKS.SOLANA, NETWORKS.NEAR],
        walletIds: [
          "2a6280e4-e1b0-4750-837f-28e0660470dd",
          "c5121ff6-8d02-43d1-a026-e10a42ba3471",
        ],
      });

      expect(data).toStrictEqual(accountDetails);
    });
    it("should get filtered account details from all chain with exluded account", async () => {
      const excludeAccount = "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847";
      const data = await filterAccounts({
        chainFamily: [NETWORKS.EVM, NETWORKS.SOLANA, NETWORKS.NEAR],
        walletIds: [
          "2a6280e4-e1b0-4750-837f-28e0660470dd",
          "c5121ff6-8d02-43d1-a026-e10a42ba3471",
        ],
        excludeAccounts: [excludeAccount],
      });
      expect(data).toStrictEqual(
        accountDetails.filter((acc) => acc.address != excludeAccount)
      );
    });
  });

  describe("calculateRatioAmount", () => {
    it("returns correct amount when given a valid ratio", () => {
      expect(calculateRatioAmount(100, 0.5)).toBe(50);
    });

    it("returns a number when given a valid ratio and amount", () => {
      expect(typeof calculateRatioAmount(100, 0.5)).toBe("number");
    });

    it("returns 0 when given 0 as amount", () => {
      expect(calculateRatioAmount(0, 0.5)).toBe(0);
    });
  });

  describe("getSimpleAccountsList", () => {
    it("should return an array of accounts For the Evm chain", async () => {
      const network = NETWORKS.EVM;
      const result = await getSimpleAccountsList(network);

      expect([...new Set(result.map((item) => item?.chain))]).toEqual([
        network,
      ]);
      expect(result.map((item) => item?.name)).toBeDefined();
      expect(result.map((item) => item?.address)).toBeDefined();
      expect(result.map((item) => item?.walletId)).toBeDefined();
    });
    it("should return an array of accounts For the Near chain", async () => {
      const network = NETWORKS.NEAR;
      const result = await getSimpleAccountsList(network);

      expect([...new Set(result.map((item) => item?.chain))]).toEqual([
        network,
      ]);
    });

    it("should return an array of accounts For the Solana chain", async () => {
      const network = NETWORKS.SOLANA;
      const result = await getSimpleAccountsList(network);

      expect([...new Set(result.map((item) => item?.chain))]).toEqual([
        network,
      ]);
    });
    it("getSimpleAccountsList() returns an array of all accounts if no network provided", async () => {
      const result = await getSimpleAccountsList();
      expect(result.map((item) => item?.chain)).toContain(NETWORKS.EVM);
    });

    it("getSimpleAccountsList() returns empty array if invalid network provided", async () => {
      const result = await getSimpleAccountsList("invalidNetwork");
      expect(result).toHaveLength(0);
    });
  });

  describe("getAllAccountsOfSingleWallet", () => {
    it("Given a walletId it should return an array of account addresses", () => {
      expect(
        getAllAccountsOfSingleWallet("2a6280e4-e1b0-4750-837f-28e0660470dd")
      ).toBeInstanceOf(Array);
    });

    it("Given a walletId it should return the expected array of account addresses", () => {
      expect(
        getAllAccountsOfSingleWallet("2a6280e4-e1b0-4750-837f-28e0660470dd")
      ).toEqual([
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      ]);
    });

    it("getAllAccountsOfSingleWallet() should return an empty array when invalid walletId is passed", () => {
      expect(getAllAccountsOfSingleWallet("")).toEqual([]);
    });

    it("getAllAccountsOfSingleWallet() should return an empty array when a walletId is passed that doesnt exist in the store", () => {
      expect(getAllAccountsOfSingleWallet("12345")).toEqual([]);
    });
  });

  describe("getfilterWalletInfo", () => {
    it("Should return the text1 with All Wallets", () => {
      const data = getfilterWalletInfo(
        StaticStore.getState().newWallet.filteredWallets,
        StaticStore.getState().newWallet.accounts,
        StaticStore.getState().newWallet.allWallets,
        false
      );
      expect(data.text1).toEqual("All Wallets");
    });
    it("Should return the text1 with Multiple Accounts", () => {
      StaticStore.dispatch(setAccountsSelected(selectedAccount1));

      const data = getfilterWalletInfo(
        StaticStore.getState().newWallet.filteredWallets,
        StaticStore.getState().newWallet.accounts,
        StaticStore.getState().newWallet.allWallets,
        false
      );

      expect(data.text1).toEqual("Multiple Accounts");
    });

    it("when there is all wallets and on testnet ", () => {
      StaticStore.dispatch(setFilteredWallet());
      const data = getfilterWalletInfo(
        StaticStore.getState().newWallet.filteredWallets,
        StaticStore.getState().newWallet.accounts,
        StaticStore.getState().newWallet.allWallets,
        true
      );

      expect(data.text1).toEqual("All Wallets");
    });

    it(" when only single account is active", () => {
      StaticStore.dispatch(setAccountsSelected(selectedAccount2));

      const data = getfilterWalletInfo(
        StaticStore.getState().newWallet.filteredWallets,
        StaticStore.getState().newWallet.accounts,
        StaticStore.getState().newWallet.allWallets,
        false
      );
      console.log("🚀 ~ file: 2_utils.wallet.test.ts:309 ~ it ~ data:", data);
      expect(data.text1).toEqual(
        StaticStore.getState().newWallet.accounts[
          "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
        ].name
      );
    });

    it(" when multiple accounts are active and single active wallet", () => {
      StaticStore.dispatch(
        setAccountsSelected([
          {
            address: "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
            value: true,
          },
        ])
      );

      const data = getfilterWalletInfo(
        StaticStore.getState().newWallet.filteredWallets,
        StaticStore.getState().newWallet.accounts,
        StaticStore.getState().newWallet.allWallets,
        false
      );

      expect(data.text1).toEqual("Multiple Accounts");
    });
    it("when single accounts are active and multiple active wallet", () => {
      StaticStore.dispatch(setNewWallet());
      StaticStore.dispatch(setAccountsSelected(selectedAccount3));

      const data = getfilterWalletInfo(
        StaticStore.getState().newWallet.filteredWallets,
        StaticStore.getState().newWallet.accounts,
        StaticStore.getState().newWallet.allWallets,
        false
      );

      // THis address as the last active addres
      expect(data.text1).toEqual(
        StaticStore.getState().newWallet.accounts[
          "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q"
        ].name
      );
    });
  });

  describe("fetchImageAndUpdateTokenPrice", () => {
    it("should fetch image and update token price when active", async () => {
      const { address, isActive, singleTokenInfo, symbol } =
        fetchImageAndUpdateTokenPriceData;

      await fetchImageAndUpdateTokenPrice({
        isActive,
        singleTokenInfo,
        address,
        symbol,
      });

      const accounts = await StaticStore.getState().newWallet.tokenInfo;

      expect(accounts[`${address}_${symbol}`]).toBeDefined();

      expect(accounts[`${address}_${symbol}`]).toMatchObject({
        ...singleTokenInfo,
        coingeckoId: "ethereum",
        image: expect.any(String),
      });
    }, 90000);

    it("should fetch image and update token price when active", async () => {
      const { address, isActive, singleTokenInfo, symbol } =
        fetchImageAndUpdateTokenPriceData2;

      await fetchImageAndUpdateTokenPrice({
        isActive,
        singleTokenInfo,
        address,
        symbol,
      });

      const accounts = await StaticStore.getState().newWallet.tokenInfo;

      expect(accounts[`${address}_${symbol}`]).toBeDefined();

      expect(accounts[`${address}_${symbol}`]).toMatchObject({
        ...singleTokenInfo,
        image: expect.any(String),
      });
    }, 90000);
  });
});
