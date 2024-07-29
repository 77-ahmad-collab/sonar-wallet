import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as router from "react-router";
import * as ETHTX from "@ethereumjs/tx";
import * as walletAction from "@slices/newWalletSlice/index";
import * as appActions from "@slices/appSlice";
import { store as DevStore, StaticStore } from "store/store";
import { useSendTransaction } from "../useSendTransaction";

import {
  // connection_return_value,
  // functionCall_return_value,
  // keyPair_value,
  // sendMoney_return_value,
  // systemProgram_transfer_return_value,
  tokenSelection1,
  tokenSelection2,
  tokenSelection3,
  tokenSelection4,
  tokenSelection5,
  tokenSelection6,
  tokenSelection7,
} from "./payloads/useSendTransaction";

import CachedService from "classes/cachedService";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
jest.mock("@solana/spl-token", () => {
  const originalModule = jest.requireActual("@solana/spl-token");
  return {
    __esModule: true,
    ...originalModule,
    getOrCreateAssociatedTokenAccount: jest.fn().mockReturnValue({
      address: "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
    }),
    transfer: jest
      .fn()
      .mockReturnValue("J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf"),
  };
});
jest.mock("@solana/web3.js", () => {
  const originalModule = jest.requireActual("@solana/web3.js");
  return {
    __esModule: true,
    ...originalModule,
    SystemProgram: {
      transfer: jest.fn().mockReturnValue({
        keys: [
          {
            pubkey: "BeeZ6MeKNYhsUHD9Ta8yHnvRX4YvDJkmzUgJ5c1uk5mB",
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
            isSigner: false,
            isWritable: true,
          },
        ],
        programId: "11111111111111111111111111111111",
        data: [2, 0, 0, 0, 128, 119, 142, 6, 0, 0, 0, 0],
      }),
    },
    sendAndConfirmTransaction: jest
      .fn()
      .mockReturnValue("J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf"),
    // sendAndConfirmTransaction:jest.fn().mockReturnValue()
  };
});
jest.mock("near-api-js", () => {
  const originalModule = jest.requireActual("near-api-js");
  return {
    __esModule: true,
    ...originalModule,
    connect: jest.fn().mockReturnValue({
      account: jest.fn().mockReturnValue({
        sendMoney: jest.fn().mockReturnValue({
          transaction: {
            hash: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
          },
        }),
        functionCall: jest.fn().mockReturnValue({
          transaction: {
            hash: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
          },
        }),
      }),
      connection: {
        provider: {
          txStatus: jest.fn().mockReturnValue({
            receipts_outcome: [
              {
                block_hash: "2rfxGVzWpDoTaUeqcdXPDctzH7mVzyAkpfbYcfGNJgu5",
                id: "C9xk7AhwJmGo2DaMErG7xiXyow52WPHo5ZDE3Jgj7sSs",
                outcome: {
                  executor_id:
                    "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
                  gas_burnt: 424555062500,
                  logs: [],
                  metadata: { gas_profile: [], version: 1 },
                  receipt_ids: ["F4iUCs52phTDEr1AsFx2vkJQ6tn3YEDqHzAGoKXrBk9S"],
                  status: { SuccessValue: "" },
                  tokens_burnt: "42455506250000000000",
                },
                proof: [
                  {
                    direction: "Right",
                    hash: "4rzSe6J2RqNNhFE8BvJRErkwvEPYuZ1GeFysUE54muHi",
                  },
                  {
                    direction: "Right",
                    hash: "8NVBfrvPjrs4Tq1ZY4UG6VJK3jNzjp8Uj82wUAGnp1a4",
                  },
                  {
                    direction: "Left",
                    hash: "HEdobKCtmkRDLmTeb8e5j7fvpaKVe7feJnEJ6PP4pV7m",
                  },
                ],
              },
              {
                block_hash: "CFkrcToi6CFJQkM5tPPYFNiK6frDJYYfD4RJ7n8hGGxh",
                id: "F4iUCs52phTDEr1AsFx2vkJQ6tn3YEDqHzAGoKXrBk9S",
                outcome: {
                  executor_id:
                    "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
                  gas_burnt: 424555062500,
                  logs: [],
                  metadata: { gas_profile: [], version: 1 },
                  receipt_ids: [],
                  status: { SuccessValue: "" },
                  tokens_burnt: "0",
                },
                proof: [
                  {
                    direction: "Left",
                    hash: "CdRYHHamqBPK3rGvgBHYeQpQwUE9dcGBTZV3JVVVLDY4",
                  },
                  {
                    direction: "Left",
                    hash: "3SM6kqFqmopRpUrLKhENb5jSxouuacy8w8K5sAvPg9hG",
                  },
                ],
              },
            ],
            status: { SuccessValue: "" },
            transaction: {
              actions: [{ Transfer: { deposit: "100000000000000000000" } }],
              hash: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
              nonce: 81143639000028,
              public_key:
                "ed25519:5iMxq1LUzy4Fx89HQCaPt8gea6xgAPcAGcdqDveUSXcY",
              receiver_id:
                "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e",
              signature:
                "ed25519:XpXvb1uVZTXZEi5dAX8XiYWijELw6N3o7CBjgDDJ4FoLv3KLJqrNy2TXLKRX1zi51hhA6rdz5cYy8GJNy35sfgG",
              signer_id:
                "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
            },
            transaction_outcome: {
              block_hash: "4Fv7Kh9qsVMhLXhRjJ6xsWJpdkyhED26AnnkVoaYPA1R",
              id: "J3UG3jAnxg8mgX84KyY57supt1LZPzuNEL6CZ4V5iaPf",
              outcome: {
                executor_id:
                  "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
                gas_burnt: 424555062500,
                logs: [],
                metadata: { gas_profile: null, version: 1 },
                receipt_ids: ["C9xk7AhwJmGo2DaMErG7xiXyow52WPHo5ZDE3Jgj7sSs"],
                status: {
                  SuccessReceiptId:
                    "C9xk7AhwJmGo2DaMErG7xiXyow52WPHo5ZDE3Jgj7sSs",
                },
                tokens_burnt: "42455506250000000000",
              },
              proof: [
                {
                  direction: "Left",
                  hash: "HmnFWBBwsexFEeaBNZFCPm3JgrSLfv1NhDaYo4gtotf8",
                },
                {
                  direction: "Right",
                  hash: "CPWKBNGbL6ux2qG51DPPBLUQ1aVZ1tBBViqvUTHQhRpz",
                },
                {
                  direction: "Right",
                  hash: "6S8bKHeL9UUh8ShnNqhPaUVXgjuKQvA2fokGJAXqNxAJ",
                },
              ],
            },
          }),
        },
      },
    }),
    KeyPair: {
      fromString: jest.fn().mockReturnValue({
        publicKey: {
          keyType: 0,
          data: {
            0: 70,
            1: 7,
            2: 67,
            3: 103,
            4: 230,
            5: 217,
            6: 206,
            7: 117,
            8: 118,
            9: 90,
            10: 16,
            11: 239,
            12: 157,
            13: 112,
            14: 100,
            15: 17,
            16: 235,
            17: 254,
            18: 233,
            19: 126,
            20: 50,
            21: 73,
            22: 107,
            23: 247,
            24: 183,
            25: 183,
            26: 30,
            27: 63,
            28: 18,
            29: 70,
            30: 118,
            31: 61,
          },
        },
        secretKey:
          "3V1EKJwptyYhHPbj1e1R4ksSd5rSEkSY8XmXYP6PGqeMVzw3B6bkkNQ1DkgktjRbLiiD8HVf2qhacKfqLy7t2dRe",
        getPublicKey: jest.fn().mockReturnValue({
          keyType: 0,
          data: {
            0: 70,
            1: 7,
            2: 67,
            3: 103,
            4: 230,
            5: 217,
            6: 206,
            7: 117,
            8: 118,
            9: 90,
            10: 16,
            11: 239,
            12: 157,
            13: 112,
            14: 100,
            15: 17,
            16: 235,
            17: 254,
            18: 233,
            19: 126,
            20: 50,
            21: 73,
            22: 107,
            23: 247,
            24: 183,
            25: 183,
            26: 30,
            27: 63,
            28: 18,
            29: 70,
            30: 118,
            31: 61,
          },
        }),
      }),
    },
  };
});

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};

const navigate = jest.fn();

// export const shouldBehaveLikeUseSendTransactionHook = () => 

  describe("useSendTransaction", () => {
    beforeEach(() => {
      jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    });
    describe("sendEVMTransaction", () => {
      beforeEach(() => {
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection1));
        jest
          .spyOn(CachedService, "getHashedPassword")
          .mockReturnValue(
            "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
          );
      });
      it("should sucessfully place the transactions and update the states on EVM Network", async () => {
        jest.spyOn(ETHTX, "Transaction").mockImplementation(() => {
          return {
            sign: jest.fn().mockReturnValue({
              serialize: jest.fn().mockReturnValue({
                toString: jest
                  .fn()
                  .mockReturnValue(
                    "f86d4184b2d05e0083016378942d7044d07cef44580f7780c829d6a10fda34d5dd86b5e620f480008083027126a09d8925d84ed764bc73788f2466c66860656de63e21ed5d1a0ba8a295bd7b5be3a010256dfaa36fa806792bc0845cee2c2a3ad754bab272e8e8e1646fa2dcbd137b"
                  ),
              }),
            }),
          } as any;
        });
        const setPendingTransactionStates = jest.spyOn(
          appActions,
          "setPendingTransactionStates"
        );
        const addInProgressTransactionHash = jest.spyOn(
          appActions,
          "addInProgressTransactionHash"
        );

        await act(async () => {
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });
          await result.current.sendEVMTransaction();
          expect(setPendingTransactionStates).toHaveBeenCalled();
          expect(addInProgressTransactionHash).toHaveBeenCalled();
          expect(navigate).toHaveBeenCalled();
        });
      }, 60000);
      it("should return an error message, when used the data that  is not correct", async () => {
        const setTokenSelected = jest.spyOn(walletAction, "setTokenSelected");

        await act(async () => {
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });
          await result.current.sendEVMTransaction();
          expect(setTokenSelected).toHaveBeenCalledWith({
            error: {
              message: "Oops, something went wrong. Please try again later.",
              open: true,
            },
          });
        });
      });
    });
    describe("sendNearTRansaction", () => {
      it("should be able to transfer near token", async () => {
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection2));
        await act(async () => {
          const setTransactionActivityData = jest.spyOn(
            walletAction,
            "setTransactionActivityData"
          );
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });

          await result.current.sendNEARTransaction();
          expect(navigate).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
        });
      });
      it("should be able to transfer non native near token", async () => {
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection3));
        await act(async () => {
          const setTransactionActivityData = jest.spyOn(
            walletAction,
            "setTransactionActivityData"
          );
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });

          await result.current.sendNEARTransaction();
          expect(navigate).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
        });
      });

      it("transaction should be failed", async () => {
        jest.clearAllMocks();
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection4));
        await act(async () => {
          const setAlert = jest.spyOn(appActions, "setAlert");

          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });

          await result.current.sendNEARTransaction();
          expect(setAlert).toHaveBeenCalled();
        });
      });
    });

    describe("sendSolanaTransaction", () => {
      it("should be able to transfer native tokens on solana network", async () => {
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection5));
        await act(async () => {
          const setTransactionActivityData = jest.spyOn(
            walletAction,
            "setTransactionActivityData"
          );
          const setAlert = jest.spyOn(appActions, "setAlert");
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });

          await result.current.sendSOLANATransaction();
          expect(navigate).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
          expect(setAlert).toHaveBeenCalled();
        });
      });
      it("should be able to transfer non-native tokens on solana network", async () => {
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection6));
        await act(async () => {
          const setTransactionActivityData = jest.spyOn(
            walletAction,
            "setTransactionActivityData"
          );
          const setAlert = jest.spyOn(appActions, "setAlert");
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });

          await result.current.sendSOLANATransaction();
          expect(navigate).toHaveBeenCalled();
          expect(setTransactionActivityData).toHaveBeenCalled();
          expect(setAlert).toHaveBeenCalled();
        });
      });
      it("solana transfer will fail", async () => {
        StaticStore.dispatch(walletAction.setTokenSelected(tokenSelection7));
        await act(async () => {
          const setTransactionTrigerredMessage = jest.spyOn(
            appActions,
            "setTransactionTrigerredMessage"
          );
          const setAlert = jest.spyOn(appActions, "setAlert");
          const { result } = await renderHook(() => useSendTransaction(), {
            wrapper,
          });

          await result.current.sendSOLANATransaction();
          expect(navigate).toHaveBeenCalled();
          expect(setTransactionTrigerredMessage).toHaveBeenCalled();
          expect(setAlert).toHaveBeenCalled();
        });
      });
    });
  });
