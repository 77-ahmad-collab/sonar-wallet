import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as EtherProjectUnits from "@ethersproject/units";
import * as router from "react-router";
import * as Ethers from "ethers";

import { store as DevStore } from "store/store";
import * as appActions from "@slices/appSlice";
import { useSwap1Inch } from "../useSwap1Inch";
import * as Utils1Inch from "utils/utils.1inch";
import * as GasUtils from "utils/utils.gas";
import * as SWAPUTILS from "utils/utils.swap";
import * as walletActions from "@slices/newWalletSlice";
import { TX_TYPES } from "utils/constants";
import {
  account_with_less_native_balance,
  account_with_zero_native_balance,
  account_without_address,
  amount2TokenA,
  amount2TokenB,
  estimateSwapPrice1Inch,
  findTheBestQuote_return_value,
  giveApproval1Inch,
  handle1InchSwap,
  token2A,
  useSwap1Inch_payload,
  useSwap1Inch_payload2,
} from "./payloads/useSwap1Inch";
import CachedService from "classes/cachedService";
import { NetworkFeeTypeChosen } from "interfaces";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={DevStore}>{children}</Provider>{" "}
    </BrowserRouter>
  );
};

const navigate = jest.fn();
const mockedFn = jest.fn();
jest.useFakeTimers();
jest.spyOn(global, "setInterval");

// export const shouldBehaveLikeUseSwap1InchHook = () =>
  describe("use1Inch", () => {
    beforeEach(() => {
      jest
        .spyOn(CachedService, "getHashedPassword")
        .mockReturnValue(
          "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
        );
    });
    describe("estimateSwapPrice1Inch", () => {
      const {
        account,
        amountTokenA,
        amountTokenB,
        feeType,
        gasInfo,
        isTokenA,
        networkFeeSettings,
        prevAllowance,
        prevAmountTokenA,
        prevAmountTokenB,
        slippageTolerance,
        slippageType,
        tokenA,
        tokenB,
      } = estimateSwapPrice1Inch;
      const currentRatio = 0.25;
      const isMaxAmountDeducted = false;
      let parseUnits: any, findTheBestQuote: any, checkAllowance: any;
      beforeEach(() => {
        findTheBestQuote = jest
          .spyOn(Utils1Inch, "findTheBestQuote")
          .mockReturnValue(findTheBestQuote_return_value as any);
        parseUnits = jest
          .spyOn(EtherProjectUnits, "parseUnits")
          .mockReturnValue("2491941250000000" as any);
        checkAllowance = jest.spyOn(Utils1Inch, "checkAllowance");
      });
      it("should not find the quote price, if tokenA amount is 0", async () => {
        const amountTokenA = {
          amount: "0",
          amountInUsd: " 0.762583861325",
        };
        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            tokenA,
            tokenB,
            account,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amountTokenA,
            amountTokenB,
            isTokenA,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(parseUnits).not.toHaveBeenCalled();
          expect(findTheBestQuote).not.toHaveBeenCalled();
        });
      });

      it("should dispatch an error message Insufficient funds available", async () => {
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload2),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            token2A,
            tokenB,
            account,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amount2TokenA,
            amount2TokenB,
            true,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            error: {
              message: "Insufficient funds available",
              open: true,
            },
          });
        });
      });
      it("should dispatch an error message when native balance is 0", async () => {
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload2),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            tokenA,
            tokenB,
            account_with_zero_native_balance,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amountTokenA,
            amountTokenB,
            true,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            error: {
              message: "Insufficient funds for gas",
              open: true,
            },
            loading: false,
          });
        });
      });
      it("should terminate the function when allowance is 0", async () => {
        jest.spyOn(GasUtils, "addGas").mockResolvedValue({
          [NetworkFeeTypeChosen.Slow]: {
            usd: 1,
            gwei: 14,
            time: 0.5,
          },
          [NetworkFeeTypeChosen.Average]: {
            usd: 1.4,
            gwei: 20,
            time: 1,
          },
          [NetworkFeeTypeChosen.Fast]: {
            usd: 4,
            gwei: 30,
            time: 0.2,
          },
          [NetworkFeeTypeChosen.Custom]: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
        });
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        const prevAllowance = {
          allowance: 0,
        };
        checkAllowance.mockReturnValue("0" as any);
        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload2),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            tokenA,
            tokenB,
            account,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amountTokenA,
            amountTokenB,
            true,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            allowance: "0",
            loading: false,
            error: {
              message: "",
              open: false,
            },
            warning: "",
          });
        });
      }, 60000);
      it("should thrown an error, when transaction cost is greater than the native token balance", async () => {
        jest.spyOn(GasUtils, "addGas").mockResolvedValue({
          [NetworkFeeTypeChosen.Slow]: {
            usd: 1,
            gwei: 14,
            time: 0.5,
          },
          [NetworkFeeTypeChosen.Average]: {
            usd: 1.4,
            gwei: 20,
            time: 1,
          },
          [NetworkFeeTypeChosen.Fast]: {
            usd: 4,
            gwei: 30,
            time: 0.2,
          },
          [NetworkFeeTypeChosen.Custom]: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
        });
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        checkAllowance.mockReturnValue(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935" as any
        );
        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload2),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            tokenA,
            tokenB,
            account_with_less_native_balance,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amountTokenA,
            amountTokenB,
            true,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            error: {
              message: "Insufficient funds for gas",
              open: true,
            },
            loading: false,
          });
        });
      }, 60000);
      it("should false the error state and close the loading when estimates done", async () => {
        jest.spyOn(GasUtils, "addGas").mockResolvedValue({
          [NetworkFeeTypeChosen.Slow]: {
            usd: 1,
            gwei: 14,
            time: 0.5,
          },
          [NetworkFeeTypeChosen.Average]: {
            usd: 1.4,
            gwei: 20,
            time: 1,
          },
          [NetworkFeeTypeChosen.Fast]: {
            usd: 4,
            gwei: 30,
            time: 0.2,
          },
          [NetworkFeeTypeChosen.Custom]: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
        });
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload2),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            tokenA,
            tokenB,
            account,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amountTokenA,
            amountTokenB,
            true,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            loading: false,
            error: {
              message: "",
              open: false,
            },
            warning: "",
          });
        });
      }, 60000);
      it("should produce an error on wrong input ", async () => {
        jest.spyOn(GasUtils, "addGas").mockResolvedValue({
          [NetworkFeeTypeChosen.Slow]: {
            usd: 1,
            gwei: 14,
            time: 0.5,
          },
          [NetworkFeeTypeChosen.Average]: {
            usd: 1.4,
            gwei: 20,
            time: 1,
          },
          [NetworkFeeTypeChosen.Fast]: {
            usd: 4,
            gwei: 30,
            time: 0.2,
          },
          [NetworkFeeTypeChosen.Custom]: {
            usd: 0,
            gwei: 0,
            time: 0,
          },
        });
        const feeType = 4;
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload2),
            {
              wrapper,
            }
          );

          await result.current.estimateSwapPrice1Inch(
            tokenA,
            tokenB,
            account,
            networkFeeSettings,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType,
            amountTokenA,
            amountTokenB,
            true,
            prevAmountTokenA,
            prevAmountTokenB,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );

          expect(setSwapSelectedTokens).toBeCalled();
        });
      }, 60000);
    });
    describe("giveApproval1Inch", () => {
      const { account, feeType, gasInfo, tokenA } = giveApproval1Inch;
      beforeEach(() => {
        jest
          .spyOn(Utils1Inch, "buildTxForApproveTradeWithRouter")
          .mockReturnValue({ gasLimit: 21000 } as any);
      });
      jest
        .spyOn(Utils1Inch, "signAndSendTransaction")
        .mockReturnValue(
          "0x2853a9f4e93284127b3696a4554f3db4c82d9635b2bc7d104a5870e9054fef91" as any
        );
      it("can give approval", async () => {
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );
        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload),
            {
              wrapper,
            }
          );
          await result.current.giveApproval1Inch(
            tokenA,
            account,
            gasInfo,
            feeType
          );
          jest.advanceTimersByTime(100000000);
          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            error: {
              message: "Approving...",
              open: true,
            },
            loading: true,
          });
        });
      });
      it("throw an error on wrong input", async () => {
        const feeType = 4;
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );
        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload),
            {
              wrapper,
            }
          );
          await result.current.giveApproval1Inch(
            tokenA,
            account,
            gasInfo,
            feeType
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            loading: false,
          });
        });
      });
    });

    describe("handle1InchSwap", () => {
      beforeEach(() => {
        jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
        jest.spyOn(Ethers.providers, "JsonRpcProvider").mockImplementation(() => {
          return {
            waitForTransaction: jest.fn().mockReturnValue({ test: "value" }),
          } as any;
        });
        jest
          .spyOn(EtherProjectUnits, "parseUnits")
          .mockReturnValue("2491941250000000" as any);
      });
      jest.spyOn(SWAPUTILS, "checkIfReflectToken").mockResolvedValue(false);
      jest.spyOn(SWAPUTILS, "initializeTokenContract").mockReturnValue({
        contract: "testing",
      } as any);
      jest.spyOn(Utils1Inch, "buildTxForSwap").mockReturnValue({
        tx: {
          gasLimit: 21000,
        },
      } as any);
      jest
        .spyOn(Utils1Inch, "signAndSendTransaction")
        .mockReturnValue(
          "0x2853a9f4e93284127b3696a4554f3db4c82d9635b2bc7d104a5870e9054fef91" as any
        );
      const {
        account,
        feeType,
        gasInfo,
        slippageTolerance,
        slippageType,
        tokenA,
        tokenB,
      } = handle1InchSwap;
      it("will swap BNB TO ping", async () => {
        const setPendingTransactionStates = jest.spyOn(
          appActions,
          "setPendingTransactionStates"
        );
        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload),
            {
              wrapper,
            }
          );
          await result.current.handle1InchSwap(
            tokenA,
            tokenB,
            account,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType
          );

          expect(setPendingTransactionStates).toHaveBeenCalledWith({
            isTransactionCompleted: false,
            isHoldFinish: false,
            isSlideAnimationCompleted: false,
            slideAnimation: "contract",
            txType: TX_TYPES.Swap,
          });
        });
      }, 60000000);
      it("should throw an error when wrong parameters are passed", async () => {
        const setSwapSelectedTokens = jest.spyOn(
          walletActions,
          "setSwapSelectedTokens"
        );

        await act(async () => {
          const { result } = await renderHook(
            () => useSwap1Inch(useSwap1Inch_payload),
            {
              wrapper,
            }
          );
          await result.current.handle1InchSwap(
            tokenA,
            tokenB,
            account_without_address,
            slippageTolerance,
            slippageType,
            gasInfo,
            feeType
          );

          expect(setSwapSelectedTokens).toHaveBeenCalledWith({
            warning: expect.any(String),
          });
        });
      }, 60000000);
    });
  });
