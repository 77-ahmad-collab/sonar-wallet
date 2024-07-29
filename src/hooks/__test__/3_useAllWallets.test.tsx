import { FC } from "react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react-hooks";
import * as SolanaWeb3 from "@solana/web3.js";
import "@testing-library/jest-dom/extend-expect";
import * as EthereumJsWallet from "ethereumjs-wallet";
import * as nearApiJs from "near-api-js";
import { BrowserRouter } from "react-router-dom";

import { useAllWallets } from "../useAllWallets";
import { store as DevStore, StaticStore } from "store/store";
import * as hooks from "../index";
import { Accounts } from "interfaces";
import {
  fromSecretKey_return_value,
  fromSeed_return_value,
  fromString_return_value,
  parseSeedPhrase_return_value,
  payload,
} from "./payloads/useAllWallets";

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

type NEAR_ACCOUNTS = {
  [x: string]: Accounts;
};

jest.mock("./../index.ts", () => {
  return {
    __esModule: true, //    <----- this __esModule: true is important
    ...jest.requireActual("../index.ts"),
  };
});

Object.defineProperty(exports, "__esModule", {
  value: true,
});

// export const shouldBehaveLikeAUseAllWalletsHook = () => 

  describe("useAllWallets", () => {
    let useAccountsHook: jest.SpyInstance<
      {
        createEVMAccount: any;
        createSolanaAccount: any;
        createNearAccounts: any;
      },
      []
    > | null = null;

    beforeAll(() => {
      useAccountsHook = jest.spyOn(hooks, "useAccounts");
      //create EVM mocks
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

      //create SOLANA mocks
      jest
        .spyOn(nacl.sign.keyPair, "fromSeed")
        .mockReturnValue(fromSeed_return_value);
      jest
        .spyOn(SolanaWeb3.Keypair, "fromSecretKey")
        .mockReturnValue(fromSecretKey_return_value as any);

      //create NEAR mocks
      jest
        .spyOn(nearSeedPhrase, "parseSeedPhrase")
        .mockReturnValue(parseSeedPhrase_return_value as any);

      jest.spyOn(nearApiJs.KeyPair, "fromString").mockReturnValue({
        getPublicKey: jest.fn().mockReturnValue(fromString_return_value),
      } as any);

      jest.spyOn(nearApiJs.utils.PublicKey, "fromString").mockReturnValue({
        data: fromString_return_value,
      } as any);
    });

    describe("test for useAllWallets", () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it("will test wallet filter", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useAllWallets(), {
            wrapper,
          });

          result.current.addWallet(
            payload.generatedMnemonic,
            payload.hashedPassword,
            payload.importWallet,
            payload.initialImport,

            "test"
          );
          const storeAfter = StaticStore.getState().newWallet.allWallets;
          const newExpiry = StaticStore.getState().app.expirationTime;
          const expiryDuration = StaticStore.getState().app.loginExpiryPeriod;

          const EVM_ACCOUNTS_LENGTH =
            storeAfter["2a6280e4-e1b0-4750-837f-28e0660470dd"].EVM.length;
          const SOLANA_ACCOUNTS_LENGTH =
            storeAfter["2a6280e4-e1b0-4750-837f-28e0660470dd"].SOLANA.length;
          const NEAR_ACCOUNTS_LENGTH =
            storeAfter["2a6280e4-e1b0-4750-837f-28e0660470dd"].NEAR.length;

          expect(storeAfter).toHaveProperty(
            "2a6280e4-e1b0-4750-837f-28e0660470dd"
          );
          expect(EVM_ACCOUNTS_LENGTH).toBe(SOLANA_ACCOUNTS_LENGTH);
          expect(EVM_ACCOUNTS_LENGTH).toBe(NEAR_ACCOUNTS_LENGTH);
          expect(newExpiry).toBeGreaterThan(expiryDuration);
        });
      });
    });
		console.log("==========ALL WALLETS DONE")

  });
