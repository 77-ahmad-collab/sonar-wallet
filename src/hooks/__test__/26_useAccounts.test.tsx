import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import * as EthereumJsWallet from "ethereumjs-wallet";
import * as SolanaWeb3 from "@solana/web3.js";
import { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as nearApiJs from "near-api-js";

import { store as DevStore } from "store/store";
import { useAccounts } from "../useAccounts";
import * as WalletActions from "@slices/newWalletSlice";
import { assert } from "console";
import {
  EVM_Account_Import,
  SOLANA_Account_Import,
  fromSecretKey_return_value1,
  fromSecretKey_return_value2,
  fromSecretKey_return_value3,
  fromSecretKey_return_value4,
  fromSeed_return_value,
  nearApiJs_KeyPair_fromString_return_value,
  nearApiJs_utils_PublicKey_fromString_return_value,
  parseSeedPhrase_return_value,
  payload1,
  payload2,
  payload3,
  payload4,
  payload5,
  privatekey,
  privatekey2,
  walletId,
  wrong_PrivateKey,
  wrong_PrivateKey_Solana,
} from "./payloads/useAccountsPayload";
// import * as nearSeedPhrase from "near-seed-phrase";

const nacl = require("tweetnacl");
const nearSeedPhrase = require("near-seed-phrase");
const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};

Object.defineProperty(exports, "__esModule", {
  value: true,
});

// export const shouldBehaveLikeUseAccounts = () =>

  describe("useAccounts", () => {
    describe("createEVMAccount", () => {
      beforeEach(() => {
        jest.spyOn(EthereumJsWallet.hdkey, "fromMasterSeed").mockReturnValue({
          derivePath: jest.fn().mockReturnValue({
            deriveChild: jest.fn().mockReturnValue({
              getWallet: jest.fn().mockReturnValue({
                getAddress: jest
                  .fn()
                  .mockReturnValue("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"),
                getPrivateKey: jest.fn().mockReturnValue("ahmad"),
              }),
            } as any),
          } as any),
        } as any);
      });
      afterEach(() => {
        jest.restoreAllMocks();
      });
      it("can create evm account", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const payload = payload1;
          const data = result.current.createEVMAccount(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            payload.walletId,
            payload.isFirstTime,
            "ahmad"
          );
          expect(data).not.toThrowError;
        });
      });

      it("should create account and add to the previous created accounts", async () => {
        await act(async () => {
          const introduceAccountActions = jest.spyOn(
            WalletActions,
            "introduceAccountActions"
          );
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const payload = payload2;
          const storeBefore = DevStore.getState().newWallet.accounts;

          result.current.createEVMAccount(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            payload.walletId,
            payload.isFirstTime,
            "test"
          );
          const storeAfter = DevStore.getState().newWallet.accounts;
          console.log(
            "🚀 ~ file: useAccounts.test.tsx:114 ~ awaitact ~ storeAfter:",
            storeAfter
          );

          //new account added will be 0x0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847, because we already passed suffix of '0x' in mock implementattion
          const accountsBefore = Object.keys(storeBefore).filter(
            (key) => key === "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847")
          );

          expect(accountsBefore).toHaveLength(1);
          expect(accountsAfter).toHaveLength(2);
          expect(introduceAccountActions).toHaveBeenCalled();
        });
      });

      it("should override the previous created account because of the same address as a key", async () => {
        jest.spyOn(EthereumJsWallet.hdkey, "fromMasterSeed").mockReturnValue({
          derivePath: jest.fn().mockReturnValue({
            deriveChild: jest.fn().mockReturnValue({
              getWallet: jest.fn().mockReturnValue({
                getAddress: jest
                  .fn()
                  .mockReturnValue("6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"),
                getPrivateKey: jest.fn().mockReturnValue("test"),
              }),
            } as any),
          } as any),
        } as any);

        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const payload = payload3;
          const storeBefore = DevStore.getState().newWallet.accounts;

          result.current.createEVMAccount(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            payload.walletId,
            payload.isFirstTime,
            "test"
          );
          const storeAfter = DevStore.getState().newWallet.accounts;

          //new account added will be 0x0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847, because we already passed suffix of '0x' in mock implementattion
          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847")
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847")
          );

          expect(accountsBefore?.length).toBe(accountsAfter?.length);
          expect(
            storeBefore["0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"].name
          ).toBe("Account 1");
          expect(
            storeAfter["0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"].name
          ).toBe("test");
        });
      });

      it("should set active status to newly created accounts", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const payload = payload4;
          const storeBefore = DevStore.getState().newWallet.filteredAccounts;

          result.current.createEVMAccount(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            payload.walletId,
            payload.isFirstTime,
            "test"
          );
          const storeAfter = DevStore.getState().newWallet.filteredAccounts;

          //new account added will be 0x0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847, because we already passed suffix of '0x' in mock implementattion
          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847")
          );

          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847")
          );

          expect(
            storeAfter["0x0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"].isSelected
          ).toBeTruthy();
          // //matching the same length because we are not adding new account, just updating the name
          expect(accountsAfter?.length).toBe(accountsBefore?.length);
        });
      });
    });

    describe("createSolanaAccount", () => {
      //@NORCE: not testing the derivation path because as an UI is un-editable, so we are not testing it
      beforeEach(() => {
        jest
          .spyOn(nacl.sign.keyPair, "fromSeed")
          .mockReturnValue(fromSeed_return_value);
        jest
          .spyOn(SolanaWeb3.Keypair, "fromSecretKey")
          .mockReturnValue(fromSecretKey_return_value1 as any);
      });
      //clear all mock after all test runs
      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should create account and add to the previous created accounts", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const storeBefore = DevStore.getState().newWallet.accounts;

          const payload = payload5;
          result.current.createSolanaAccount(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            payload.walletId,
            false,
            "test"
          );
          const storeAfter = DevStore.getState().newWallet.accounts;

          //new account added will be EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q, because we already passed a different buffer
          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes("EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q")
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes("AJAN1vu1oYaXRRHfhoZ5SE1sYBcqTabG5ZTGSH2eLrFJ")
          );

          const solanaAccountBefore = Object.values(storeBefore).filter(
            (value) => value.chainFamily === "SOLANA"
          );
          const solanaAccountAfter = Object.values(storeAfter).filter(
            (value) => value.chainFamily === "SOLANA"
          );

          expect(solanaAccountAfter.length).toBe(solanaAccountBefore.length + 1);
          expect(accountsBefore).toHaveLength(accountsAfter.length);
          expect(storeAfter).toHaveProperty(
            "AJAN1vu1oYaXRRHfhoZ5SE1sYBcqTabG5ZTGSH2eLrFJ"
          );
        });
      });

      it("should override the previous created account because of the same address as a key", async () => {
        jest
          .spyOn(SolanaWeb3.Keypair, "fromSecretKey")
          .mockReturnValue(fromSecretKey_return_value2 as any);

        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const storeBefore = DevStore.getState().newWallet.accounts;

          const payload = payload5;
          result.current.createSolanaAccount(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            payload.walletId,

            false,
            "test"
          );
          const storeAfter = DevStore.getState().newWallet.accounts;

          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes("EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q")
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes("EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q")
          );

          expect(accountsBefore?.length).toBe(accountsAfter?.length);
          expect(
            storeBefore["EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q"].name
          ).toBe("Account 1");
          expect(
            storeAfter["EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q"].name
          ).toBe("test");
        });
      });

      it("should set active status to newly created acount", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const storeBefore = DevStore.getState().newWallet.accounts;

          const payload = payload5;
          const storeAfter = DevStore.getState().newWallet.filteredAccounts;

          //new account added will be 0x0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847, because we already passed suffix of '0x' in mock implementattion
          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes("EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q")
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes("EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q")
          );
          expect(
            storeAfter["EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q"].isSelected
          ).toBeTruthy;
          //matching the same length because we are not adding new account, just updating the name
          expect(accountsAfter?.length).toBe(accountsBefore?.length);
        });
      });
    });

    describe("createNearAccount", () => {
      beforeEach(() => {
        jest
          .spyOn(nearSeedPhrase, "parseSeedPhrase")
          .mockReturnValue(parseSeedPhrase_return_value as any);

        jest
          .spyOn(nearApiJs.KeyPair, "fromString")
          .mockReturnValue(nearApiJs_KeyPair_fromString_return_value as any);
        jest
          .spyOn(nearApiJs.utils.PublicKey, "fromString")
          .mockReturnValue(
            nearApiJs_utils_PublicKey_fromString_return_value as any
          );
      });

      it("can create account on near", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const payload = payload5;

          const data = await result.current.createNearAccounts(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            false,

            payload.walletId,
            false
          );
          expect(data).not.toThrowError;
        });
      });

      it("should create account and add to the previous created accounts", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const storeBefore = DevStore.getState().newWallet.accounts;
          const payload = payload5;
          await result.current.createNearAccounts(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            false,

            payload.walletId,
            false
          );
          const storeAfter = DevStore.getState().newWallet.accounts;
          //new account added will be 5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1, because we already passed a different buffer
          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes(
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            )
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes(
              "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
            )
          );

          expect(accountsBefore).toHaveLength(accountsAfter.length);
          expect(storeAfter).toHaveProperty(
            "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
          );
          expect(storeAfter).toHaveProperty(
            "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
          );
        });
      });
      it("should let to import near account", async () => {
        await act(async () => {
          await act(async () => {
            const { result } = await renderHook(() => useAccounts(), {
              wrapper,
            });

            const payload = {
              hashedPassword:
                "0x5e275fae17e242926c01a96878c42e32848ab37e3bcdda430bb9f501e2f8051a",
              generatedMnemonic:
                "harsh april identify stay entry  switch again march defense plano comic end",
              walletCount: 1,
              walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
              isFirstTime: true,
            };

            const response = await result.current.createNearAccounts(
              payload.generatedMnemonic,
              payload.hashedPassword,
              payload.walletCount,
              true,

              payload.walletId,
              false
            );
            expect(response).toBeDefined();
          });
        });
      });

      it("should override the previous created account because of the same address as a key", async () => {
        jest.spyOn(nearApiJs.KeyPair, "fromString").mockReturnValue({
          getPublicKey: jest
            .fn()
            .mockReturnValue(
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            ),
        } as any);

        jest.spyOn(nearApiJs.utils.PublicKey, "fromString").mockReturnValue({
          data: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
        } as any);

        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const storeBefore = DevStore.getState().newWallet.accounts;

          const payload = payload5;
          await result.current.createNearAccounts(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            false,

            payload.walletId,
            false
          );
          const storeAfter = DevStore.getState().newWallet.accounts;

          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes(
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            )
          );
          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes(
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            )
          );

          expect(accountsBefore?.length).toBe(accountsAfter?.length);
          expect(
            storeBefore[
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            ].name
          ).toBe("Near Account 1");
          expect(
            storeAfter[
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            ].name
          ).toBe("Near Account 2");
        });
      });

      it("should set active status to newly created account", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const storeBefore = DevStore.getState().newWallet.accounts;

          const payload = payload5;

          await result.current.createNearAccounts(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.walletCount,
            false,

            payload.walletId,
            false
          );
          const storeAfter = DevStore.getState().newWallet.filteredAccounts;

          //new account added will be 0x0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847, because we already passed suffix of '0x' in mock implementattion
          const accountsBefore = Object.keys(storeBefore).filter((key) =>
            key.includes(
              "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
            )
          );

          const accountsAfter = Object.keys(storeAfter).filter((key) =>
            key.includes(
              "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
            )
          );
          expect(
            storeAfter[
              "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
            ].isSelected
          ).toBeTruthy;
          //matching the same length because we are not adding new account, just updating the name
          expect(accountsAfter?.length).toBe(accountsBefore?.length);
          const filteredNearAccountsBefore = Object.values(storeBefore).filter(
            (account) => account.chainFamily === "NEAR"
          );
          const filteredNearAccountsAfter = Object.values(
            DevStore.getState().newWallet.accounts
          ).filter((account) => account.chainFamily === "NEAR");
          expect(filteredNearAccountsAfter.length).toBe(
            filteredNearAccountsBefore.length
          ); //same length, because same public address account was create in above test case
        });
      });
    });

    describe("importEVMAccount", () => {
      it("can import account on EVM", async () => {
        const [privatekey, walletId, accountName] = [
          "2d68d7fad4a0d360b1a7ef932ca0dac960bca077316ebd4d90c7a447d7d1ec5a",
          "2a6280e4-e1b0-4750-837f-28e0660470dd",
          "ACCOUNT IMPORTED EVM",
        ];
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          const newImportResponse = await result.current.importEVMAccount(
            privatekey,
            walletId,
            accountName
          );
          assert(
            newImportResponse.message.includes("Account imported successfully")
          );
        });
      });

      it("should not let to again import the account", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const reImportResponse = await result.current.importEVMAccount(
            privatekey,
            walletId,
            EVM_Account_Import
          );
          assert(reImportResponse.message.includes("Account already exists"));
        });
      });
      it("should throw error of bad private key length", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          result.current
            .importEVMAccount(wrong_PrivateKey, walletId, EVM_Account_Import)
            .catch((e) => assert(e.message.includes("invalid")));
        });
      });
    });

    describe("importSolanaAccount", () => {
      beforeEach(() => {
        jest
          .spyOn(SolanaWeb3.Keypair, "fromSecretKey")
          .mockReturnValue(fromSecretKey_return_value3 as any);
      });

      it("can import account solana", async () => {
        await act(async () => {
          jest
            .spyOn(SolanaWeb3.Keypair, "fromSecretKey")
            .mockReturnValue(fromSecretKey_return_value4 as any);

          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const data = await result.current.importSolanaAccount(
            privatekey2,
            walletId,
            SOLANA_Account_Import
          );

          expect(data).toEqual({
            status: true,
            message: "Account imported successfully",
            address: "",
          });
          // );
        });
      });
      it("should not let to again import the account", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });

          const data = await result.current.importSolanaAccount(
            privatekey2,
            walletId,
            SOLANA_Account_Import
          );
          expect(data.message).toBe("account already exits");
        });
      });
      it("should throw error of bad private key length", async () => {
        await act(async () => {
          DevStore.getState().newWallet.accounts;
          const { result } = await renderHook(() => useAccounts(), {
            wrapper,
          });
          DevStore.getState().newWallet.accounts;
          result.current
            .importSolanaAccount(
              wrong_PrivateKey_Solana,
              walletId,
              SOLANA_Account_Import
            )
            .catch((e) => assert(e.message.includes("Please enter a valid")));
        });
      });

      // write 2nd test case
    });
  });
