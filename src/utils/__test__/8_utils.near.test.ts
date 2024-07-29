import * as RefFinanceSdk from "@ref-finance/ref-sdk";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import CachedService from "classes/cachedService";
import * as NearApiJs from "near-api-js";

import * as utilNear from "utils/utils.near";
import {
  accessKey,
  accessKey2,
  accessKey3,
  accessKey4,
  accessKey5,
  transaction,
  transaction3,
  transaction4,
  transaction5,
} from "./payload/utils.near";

// export const utilNearTest = () => {
jest.mock("@ref-finance/ref-sdk", () => {
  const originalModule = jest.requireActual("@ref-finance/ref-sdk");
  return {
    __esModule: true,
    ...originalModule,
    transformTransactions: jest.fn().mockReturnValue([
      {
        signerId:
          "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
        receiverId:
          "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
        actions: [
          {
            params: {
              methodName: "FUncCALL",
              args: "",
              gas: 100,
              deposit: 0.1,
            },
          },
        ],
      },
    ]),
  };
});

jest.mock("near-api-js", () => {
  const originalModule = jest.requireActual("near-api-js");
  return {
    __esModule: true,
    ...originalModule,

    KeyPair: {
      fromString: jest
        .fn()
        .mockReturnValue(
          "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
        ),
    },
    providers: {
      JsonRpcProvider: jest.fn().mockReturnValue({
        query: jest.fn().mockImplementation(() => "access"),
        block: jest.fn().mockResolvedValue({
          header: {
            hash: "0x11111111111111",
          },
        }),
      }),
    },
    transactions: {
      createTransaction: jest.fn().mockImplementation(() => "neartx"),
      signTransaction: jest
        .fn()
        .mockReturnValue([
          "",
          "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
        ]),
      functionCall: jest.fn(),
    },
    utils: {
      PublicKey: {
        from: jest.fn(),
      },
      serialize: {
        base_decode: jest.fn(),
      },
    },
  };
});
describe("utils.near", () => {
  beforeEach(() => {
    jest
      .spyOn(CachedService, "getHashedPassword")
      .mockReturnValue(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
  });

  describe("validateAccessKey", () => {
    it("should return accessKey if permission is 'FullAccess'", () => {
      expect(utilNear.validateAccessKey(transaction, accessKey)).toBe(
        accessKey
      );
    });
    it("should return null if transaction receiver_id is different from the accessKey's receiver_id", () => {
      expect(utilNear.validateAccessKey(transaction, accessKey2)).toBeNull();
    });

    it("should return false if transaction action type is not FunctionCall", () => {
      expect(utilNear.validateAccessKey(transaction3, accessKey3)).toBeFalsy();
    });

    it("should return false if transaction methodName is included in the accessKey's method_names", () => {
      expect(utilNear.validateAccessKey(transaction4, accessKey4)).toBeFalsy();
    });

    it("should return false if transaction methodName is not  included in the accessKey's method_names", () => {
      expect(utilNear.validateAccessKey(transaction5, accessKey5)).toBeTruthy();
    });
  });
  describe(" getMemorySignerInner", () => {
    it("should return an InMemorySigner", async () => {
      const signer = await utilNear.getMemorySignerInner({
        AccountId:
          "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      });

      expect(signer).toBeDefined();
    });
  });
  describe("getSignedTransactionsByMemoryKeyInner", () => {
    it("can return the signed transaction", async () => {
      jest.spyOn(utilNear, "getMemorySignerInner").mockReturnValue({
        getPublicKey: jest
          .fn()
          .mockReturnValue(
            "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
          ),
      } as any);
      jest.spyOn(utilNear, "validateAccessKey").mockReturnValue(true);
      jest.spyOn(RefFinanceSdk, "transformTransactions").mockReturnValue([
        {
          signerId:
            "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
          receiverId:
            "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
          actions: [
            {
              params: {
                methodName: "FUncCALL",
                args: "",
                gas: 100,
                deposit: 0.1,
              },
            },
          ],
        },
      ] as any);
      jest
        .spyOn(NearApiJs.providers, "JsonRpcProvider")
        .mockImplementation(() => {
          return {
            query: jest.fn().mockImplementation(() => "access"),
            block: jest.fn().mockReturnValue({
              header: {
                hash: "0x11111111111111",
              },
            }),
          } as any;
        });
      // .mockReturnValue();
      const data = await utilNear.getSignedTransactionsByMemoryKeyInner({
        transactionsRef: {} as RefFinanceSdk.Transaction[],
        AccountId:
          "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
      });

      expect(data instanceof Array).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
// };
