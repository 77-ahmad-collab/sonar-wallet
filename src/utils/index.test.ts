import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

import { NETWORKS } from "./constants";
import {
  getAllAccountsOfSingleWallet,
  getSimpleAccountsList,
} from "./utils.wallets";

describe("test", () => {
  it("should return an array of accounts For the Evm chain", async () => {
    const network = NETWORKS.EVM;
    const result = await getSimpleAccountsList(network);

    expect(result.map((item) => item?.chain)).toEqual([network]);
    expect(result.map((item) => item?.name)).toBeDefined();
    expect(result.map((item) => item?.address)).toBeDefined();
    expect(result.map((item) => item?.walletId)).toBeDefined();
  });
  it("should return an array of accounts For the Near chain", async () => {
    const network = NETWORKS.NEAR;
    const result = await getSimpleAccountsList(network);

    expect(result.map((item) => item?.chain)).toEqual([network]);
  });

  it("should return an array of accounts For the Solana chain", async () => {
    const network = NETWORKS.SOLANA;
    const result = await getSimpleAccountsList(network);

    expect(result.map((item) => item?.chain)).toEqual([network]);
  });
  it("getSimpleAccountsList() returns an array of all accounts if no network provided", async () => {
    const result = await getSimpleAccountsList();
    expect(result.map((item) => item?.chain)).toContain(NETWORKS.EVM);
  });

  it("getSimpleAccountsList() returns empty array if invalid network provided", async () => {
    const result = await getSimpleAccountsList("invalidNetwork");
    expect(result).toHaveLength(0);
  });

  // BREAK FOR ANOTHER FUNCTION -------------------------------------------------------------

  //Positive Unit test 1
  it("Given a walletId it should return an array of account addresses", () => {
    expect(
      getAllAccountsOfSingleWallet("648fb1e1-85da-4c4f-b036-82e6cea4adbb")
    ).toBeInstanceOf(Array);
  });

  //Positive Unit test 2
  it("Given a walletId it should return the expected array of account addresses", () => {
    expect(
      getAllAccountsOfSingleWallet("648fb1e1-85da-4c4f-b036-82e6cea4adbb")
    ).toEqual([
      "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
      "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
      "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
    ]);
  });

  // Negative Unit Test Case 1
  test("getAllAccountsOfSingleWallet() should return an empty array when invalid walletId is passed", () => {
    expect(getAllAccountsOfSingleWallet("")).toEqual([]);
  });

  // Negative Unit Test Case 2
  test("getAllAccountsOfSingleWallet() should return an empty array when a walletId is passed that doesnt exist in the store", () => {
    expect(getAllAccountsOfSingleWallet("12345")).toEqual([]);
  });
});
