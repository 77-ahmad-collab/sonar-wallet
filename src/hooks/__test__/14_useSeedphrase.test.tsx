import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import * as router from "react-router";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as EthereumJsWallet from "ethereumjs-wallet";
import * as SolanaWeb3 from "@solana/web3.js";
import * as nearApiJs from "near-api-js";

import { store as DevStore, StaticStore } from "store/store";
import {
  useSeedPhrase,
  useSeedPhraseStep1,
  useSeedPhraseStep2,
} from "../useSeedPhrase";
import * as appActions from "@slices/appSlice";
import { isMnemonicSaved } from "@slices/appSlice";
import CachedService from "classes/cachedService";
import {
  fromSecretKey_return_value1,
  fromSeed_return_value,
  nearApiJs_KeyPair_fromString_return_value,
  nearApiJs_utils_PublicKey_fromString_return_value,
  parseSeedPhrase_return_value,
} from "./payloads/useAccountsPayload";

const nearSeedPhrase = require("near-seed-phrase");
const nacl = require("tweetnacl");

const navigate = jest.fn();
const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>
    </BrowserRouter>
  );
};
jest.useFakeTimers();
jest.spyOn(global, "setTimeout");


// export const shouldBehaveLikeUseSeedPhraseHook = () => 

  describe("useSeedphrase.ts", () => {
    beforeEach(() => {
      jest
        .spyOn(CachedService, "getHashedPassword")
        .mockReturnValue(
          "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
        );
      jest.spyOn(EthereumJsWallet.hdkey, "fromMasterSeed").mockReturnValue({
        derivePath: jest.fn().mockReturnValue({
          deriveChild: jest.fn().mockReturnValue({
            getWallet: jest.fn().mockReturnValue({
              getAddress: jest
                .fn()
                .mockReturnValue("0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"),
              getPrivateKey: jest.fn().mockReturnValue("test"),
            }),
          } as any),
        } as any),
      } as any);

      //create SOLANA mocks
      jest
        .spyOn(nacl.sign.keyPair, "fromSeed")
        .mockReturnValue(fromSeed_return_value);
    });
    describe("useSeedPhraseStep1", () => {
      it("will test step1 of seedphrase", async () => {
        const mockFunction = jest.fn();
        const { result } = await renderHook(
          () => useSeedPhraseStep1(mockFunction),
          {
            wrapper,
          }
        );

        result.current.handleOnSave();
        expect(mockFunction).toHaveBeenCalled();
      });
    });

    describe("useSeedPhraseStep2", () => {
      beforeEach(() => {
        jest
          .spyOn(nacl.sign.keyPair, "fromSeed")
          .mockReturnValue(fromSeed_return_value);
        jest
          .spyOn(SolanaWeb3.Keypair, "fromSecretKey")
          .mockReturnValue(fromSecretKey_return_value1 as any);

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
      it("will test the confirm seedphrase function", async () => {
        const { result } = await renderHook(() => useSeedPhraseStep2(), {
          wrapper,
        });
        await act(async () => {
          await result.current.setSeedPhrase(["test"]);

          await result.current.confirmSeedPhrase("pigeon", 0);
        });

        await act(() => {
          expect(result.current.seedPhrase.includes("pigeon")).toBe(true);
        });
      });
      it("will test the handleSeedPhrase ", async () => {
        await act(async () => {
          const { result } = await renderHook(() => useSeedPhraseStep2(), {
            wrapper,
          });

          console.log(
            result.current,
            "------------------------------------------------------"
          );
          await result.current.handleSeedPhrase("Wallet 1");
          jest.advanceTimersByTime(1000);
          result.current.setSeedPhrase([
            "pigeon",
            "language",
            "blur",
            "blast",
            "artist",
            "behind",
            "arrive",
            "layer",
            "party",
            "deputy",
            "legal",
            "put",
          ]);
        });
      });
    });

    describe("useSeedphrase", () => {
      beforeEach(() => {
        jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
      });
      it("should run the case, when user has not saved mnemonic ", async () => {
        await act(async () => {
          const setwalletCreatedAlert = jest.spyOn(
            appActions,
            "setwalletCreatedAlert"
          );
          const { result } = await renderHook(() => useSeedPhrase(), {
            wrapper,
          });

          result.current.onBackPress();
          expect(setwalletCreatedAlert).toHaveBeenCalled();
        });
      });
      it("should run the case, when user has press back button", async () => {
        await act(async () => {
          const setwalletCreatedAlert = jest.spyOn(
            appActions,
            "setwalletCreatedAlert"
          );
          const { result } = await renderHook(() => useSeedPhrase(), {
            wrapper,
          });
          result.current.setStep(2);

          result.current.onBackPress();
          expect(setwalletCreatedAlert).toHaveBeenCalled();
        });
      });
      it("should navigate to back screen", async () => {
        await act(async () => {
          StaticStore.dispatch(isMnemonicSaved(true));
          const setwalletCreatedAlert = jest.spyOn(
            appActions,
            "setwalletCreatedAlert"
          );
          const { result } = await renderHook(() => useSeedPhrase(), {
            wrapper,
          });
          //   result.current.setStep(1);

          result.current.onBackPress();
          expect(setwalletCreatedAlert).toHaveBeenCalled();
          expect(navigate).toHaveBeenCalled();
        });
      });
    });
		console.log("==========SEED PHRASE DONE")

  });
