import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Provider } from "react-redux";
import * as NEARUTILS from "utils/utils.near";
import * as NearRefFinance from "@ref-finance/ref-sdk";

import { store as DevStore } from "store/store";
import * as appActions from "@slices/appSlice";
import { useSwapNEAR } from "../useSwapNEAR";
import { EstimateSwapHookProps } from "interfaces";
import * as newWalletActions from "@slices/newWalletSlice";
import { MemoryRouter } from "react-router";
import * as refFinanceFunctions from "@ref-finance/ref-sdk";
import * as utilsGasFunctions from "utils/utils.gas";
import * as utilsSwapFunctions from "utils/utils.swap";
import * as utilsHoldingFunction from "utils/utils.holdings";

import * as estimateSwapPayload from "./payloads/NEARSwapPayload";
import CachedService from "classes/cachedService";

const {
  NEAR_TO_WNEAR,
  CHAINID_ERROR,
  DAI_TO_ETH,
  DAI_TO_NEAR,
  ETH_TO_DAI_WITH_ZERO_AMOUNT,
  NEAR_TO_WNEAR_WITH_LOW_BALANCE,
  NEAR_TO_WNEAR_WITH_ZERO_AMOUNT,
  NEAR_TO_DAI,
  MAX_NEAR_SWAP_TO_WNEAR,
  WRAP_NEAR_TO_DAI,
  WRAP_NEAR_TO_NEAR,
  NEAR_TO_ETH,
  changeAccountDetailsInNewWalletSlice,
} = estimateSwapPayload;

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <Provider store={DevStore}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
};

jest.useFakeTimers({ timerLimit: 1_000_000_000 });
jest.spyOn(global, "setTimeout");
jest.setTimeout(1_000_000_000);

// export const shouldBehaveLikeUseSwapNEARHook = () =>

  describe("useSwapNEAR hook's describe", () => {
    beforeEach(() => {
      jest
        .spyOn(CachedService, "getHashedPassword")
        .mockReturnValue(
          "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
        );
    });
    //use this function in test cases to render hook and call estimateSwapPriceNEAR function
    //redundancy is minimized
    async function callFunctionForHook(
      paramObject: typeof estimateSwapPayload.NEAR_TO_WNEAR,
      payload: EstimateSwapHookProps
    ) {
      const { result } = await renderHook(() => useSwapNEAR(payload), {
        wrapper,
      });

      const estimateResponse = await result.current.estimateSwapPriceNEAR(
        paramObject.tokenA,
        paramObject.tokenB,
        paramObject.account,
        paramObject.networkFeeSettings,
        paramObject.slippageTolerance,
        paramObject.slippageType,
        paramObject.gasInfo,
        paramObject.feeType,
        paramObject.amountTokenA,
        paramObject.amountTokenB,
        paramObject.isTokenA,
        paramObject.prevAmountTokenA,
        paramObject.prevAmountTokenB,
        paramObject.allowance,
        paramObject.prevAllowance,
        paramObject.currentRatio,
        paramObject.isMaxAmountDeducted
      );
      return estimateResponse;
    }

    describe("estimateSwapPriceNEAR function", () => {
      const ftGetTokenMetadata = jest.spyOn(
        refFinanceFunctions,
        "ftGetTokenMetadata"
      );
      const estimatingSwap = jest.spyOn(refFinanceFunctions, "estimateSwap");
      const expectedOtputFn = jest.spyOn(
        refFinanceFunctions,
        "getExpectedOutputFromSwapTodos"
      );
      const nearWithDraw = jest.spyOn(
        refFinanceFunctions,
        "nearWithdrawTransaction"
      );
      const nonEVMGas = jest.spyOn(utilsGasFunctions, "calculateNonEvmGasFee");
      const fetchingPricesMsg = jest.spyOn(
        utilsSwapFunctions,
        "dispatchFetchingMsg"
      );
      const customNetworkFeeForSwap = jest.spyOn(
        appActions,
        "setNetworkFeeSettings"
      );
      const dynamicSwapMsg = jest.spyOn(
        utilsSwapFunctions,
        "dispatchDynamicSwapMsg"
      );
      const swapSelectedToken = jest.spyOn(
        newWalletActions,
        "setSwapSelectedTokens"
      );

      const payload: EstimateSwapHookProps = {
        setAmountTokenA: jest.fn(),
        setAmountTokenB: jest.fn(),
        setIsMaxAmountDeducted: jest.fn(),
        amountTokenA: {
          amount: "1",
          amountInUsd: "1",
        },
        amountTokenB: {
          amount: "1",
          amountInUsd: "1",
        },
        transactionFee: 1,
        totalInUsd: 1,
        mountedRef: {
          current: true,
        },
      };

      afterEach(() => {
        jest.clearAllMocks();
      });

      it("swap NEAR to Wrapped NEAR", async () => {
        await act(async () => {
          console.log("near to wnear ========================\n");
          await callFunctionForHook(NEAR_TO_WNEAR, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");

          //becuase it's a near to wnear swap, not token to token or token to near or wrap near to token
          expect(estimatingSwap).not.toHaveBeenCalled();
          expect(expectedOtputFn).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...NEAR_TO_WNEAR.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
        });
      });

      it("swap wrap NEAR to NEAR", async () => {
        await act(async () => {
          console.log("wnear to near ========================\n");
          await callFunctionForHook(WRAP_NEAR_TO_NEAR, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");

          //becuase it's a wrap near to near swap, not token to token or token to near or wrap near to token
          expect(estimatingSwap).not.toHaveBeenCalled();
          expect(expectedOtputFn).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...WRAP_NEAR_TO_NEAR.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
        });
      });

      it("swap wrap NEAR to token", async () => {
        await act(async () => {
          console.log("near to token ========================\n");
          await callFunctionForHook(WRAP_NEAR_TO_DAI, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");

          //becuase it's a wrap near to token swap, not token to token or token to near or wrap near to token
          expect(estimatingSwap).toHaveBeenCalled();
          expect(expectedOtputFn).toHaveBeenCalled();
          expect(nearWithDraw).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...WRAP_NEAR_TO_DAI.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
        });
      });

      it("swap NEAR to DAI", async () => {
        await act(async () => {
          console.log("near to dai ========================\n");
          await callFunctionForHook(NEAR_TO_DAI, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).toHaveBeenCalledWith(
            "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near"
          );

          //because, it is native to token swap
          expect(estimatingSwap).toHaveBeenCalled();
          expect(expectedOtputFn).toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...NEAR_TO_DAI.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
        });
      });

      it("swap DAI to NEAR", async () => {
        await act(async () => {
          console.log("dai to near ========================\n");
          await callFunctionForHook(DAI_TO_NEAR, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith(
            "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near"
          );
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");

          //because, it is token to native swap
          expect(estimatingSwap).toHaveBeenCalled();
          expect(expectedOtputFn).toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...DAI_TO_NEAR.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
        });
      });

      it("swap NEAR to ETH", async () => {
        await (async () => {
          console.log("near to eth ========================\n");
          await callFunctionForHook(NEAR_TO_ETH, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("aurora");

          //because, it is native to token swap
          expect(estimatingSwap).toHaveBeenCalled();
          expect(expectedOtputFn).toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...NEAR_TO_WNEAR.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },

            // result.current.estimateSwapPriceNEAR(...NEAR_TO_ETH)
          });
        });
      });

      it("should dispatch for insufficient funds", async () => {
        await act(async () => {
          console.log("insufficient ========================\n");
          await callFunctionForHook(NEAR_TO_WNEAR_WITH_LOW_BALANCE, payload);

          //only this call will be made, rest execution will be stopped
          expect(dynamicSwapMsg).toHaveBeenCalledWith(
            "Insufficient funds available"
          );
          expect(ftGetTokenMetadata).not.toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).not.toHaveBeenCalledWith("aurora");

          //because, it is native to token swap
          expect(estimatingSwap).not.toHaveBeenCalled();
          expect(expectedOtputFn).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
        });
      });

      it("swap DAI to ETH", async () => {
        await act(async () => {
          console.log("dai to eth ========================\n");
          await callFunctionForHook(DAI_TO_ETH, payload);
          //below two statements indicates that, it is a token to token swap
          expect(ftGetTokenMetadata).toHaveBeenCalledWith(
            "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near"
          );
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("aurora");
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...NEAR_TO_WNEAR.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
          // result.current.estimateSwapPriceNEAR(...DAI_TO_ETH)
        });
      });

      it("throw error for malformed chainid for coingecko call", async () => {
        await act(async () => {
          console.log("error wrong chainID ========================\n");
          await callFunctionForHook(CHAINID_ERROR, payload);

          expect(swapSelectedToken).toHaveBeenCalledWith({
            error: {
              message: expect.any(String),
              open: true,
            },
          });
        });
      });

      it("change chain family and swap NEAR to Wrap NEAR", async () => {
        await act(async () => {
          const swapSelectedTokenState =
            DevStore.getState().newWallet.swapSelectedTokens;
          // console.log("swapSelectedTokenState", swapSelectedTokenState);
          await act(async () => {
            const { result } = await renderHook(() => useSwapNEAR(payload), {
              wrapper,
            });

            //changeAccountDetailsInNewWalletSlice
            DevStore.dispatch(
              newWalletActions.setSwapSelectedTokens({
                account: { ...changeAccountDetailsInNewWalletSlice },
              })
            );

            const swapSelectedTokenStateAFTER =
              DevStore.getState().newWallet.swapSelectedTokens;
            // console.log("swapSelectedTokenStateAFTER", swapSelectedTokenStateAFTER);

            console.log("near change chain family \n =======================");
            await result.current.estimateSwapPriceNEAR(
              NEAR_TO_WNEAR.tokenA,
              NEAR_TO_WNEAR.tokenB,
              NEAR_TO_WNEAR.account,
              NEAR_TO_WNEAR.networkFeeSettings,
              NEAR_TO_WNEAR.slippageTolerance,
              NEAR_TO_WNEAR.slippageType,
              NEAR_TO_WNEAR.gasInfo,
              NEAR_TO_WNEAR.feeType,
              NEAR_TO_WNEAR.amountTokenA,
              NEAR_TO_WNEAR.amountTokenB,
              NEAR_TO_WNEAR.isTokenA,
              NEAR_TO_WNEAR.prevAmountTokenA,
              NEAR_TO_WNEAR.prevAmountTokenB,
              NEAR_TO_WNEAR.allowance,
              NEAR_TO_WNEAR.prevAllowance,
              NEAR_TO_WNEAR.currentRatio,
              NEAR_TO_WNEAR.isMaxAmountDeducted
            );
          });
        });
      });

      it("swap NEAR to Wrap NEAR with zero amount input of token A", async () => {
        await act(async () => {
          await callFunctionForHook(NEAR_TO_WNEAR_WITH_ZERO_AMOUNT, payload);

          //in this case, only the localState is updated and function execution stops immediately
          expect(ftGetTokenMetadata).not.toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).not.toHaveBeenCalledWith("aurora");

          //because, it is native to token swap
          expect(estimatingSwap).not.toHaveBeenCalled();
          expect(expectedOtputFn).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
        });
      });

      it("swapping ETH to DAI with zero amount", async () => {
        await act(async () => {
          await callFunctionForHook(ETH_TO_DAI_WITH_ZERO_AMOUNT, payload);

          //in this case, only the localState is updated and function execution stops immediately
          expect(ftGetTokenMetadata).not.toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).not.toHaveBeenCalledWith("aurora");

          //because, it is native to token swap
          expect(estimatingSwap).not.toHaveBeenCalled();
          expect(expectedOtputFn).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when max swap
        });
      });

      ///@NOTE: this test case is not working, because the function is calling
      it("swap max NEAR to Wrap NEAR", async () => {
        await act(async () => {
          await callFunctionForHook(MAX_NEAR_SWAP_TO_WNEAR, payload);

          // expect(ftGetTokenMetadata).toHaveBeenCalledTimes(2);
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");
          expect(ftGetTokenMetadata).toHaveBeenCalledWith("wrap.near");

          //becuase it's a near to wnear swap, not token to token or token to near or wrap near to token
          expect(estimatingSwap).not.toHaveBeenCalled();
          expect(expectedOtputFn).not.toHaveBeenCalled();
          expect(fetchingPricesMsg).not.toHaveBeenCalled(); //only called, when not max swap and swap is from native
          expect(customNetworkFeeForSwap).toHaveBeenCalledWith({
            feeType: 3,
            gasInfo: {
              ...MAX_NEAR_SWAP_TO_WNEAR.gasInfo,
              //because near fee seting is custom
              3: {
                gwei: expect.any(Number),
                time: expect.any(Number),
                usd: expect.any(Number),
              },
            },
          });
        });
      });
    });

    describe("handleNEARSwap function", () => {
      beforeEach(() => {
        jest
          .spyOn(NEARUTILS, "getSignedTransactionsByMemoryKeyInner")
          .mockResolvedValue({} as any);
        jest
          .spyOn(NearRefFinance, "sendTransactionsByMemoryKey")
          .mockResolvedValue([
            {
              transaction: {
                hash: "CdhDGNeMqqWfDgWu5JS32Reuu3sitM8c2jYSgA9sT3Pz",
              },
              status: {
                Failure: false,
              },
            },
          ] as any);
      });
      it("should swap tokens on Near Chain", async () => {
        const setCompletedTransactionStates = jest.spyOn(
          appActions,
          "setCompletedTransactionStates"
        );
        jest
          .spyOn(utilsHoldingFunction, "introduceNewToken")
          .mockResolvedValue("done" as any);
        jest
          .spyOn(utilsHoldingFunction, "getHoldings")
          .mockResolvedValue("promise resolved" as any);
        await act(async () => {
          const { result } = await renderHook(
            () =>
              useSwapNEAR({
                setAmountTokenA: jest.fn(),
                setAmountTokenB: jest.fn(),
                setIsMaxAmountDeducted: jest.fn(),
                amountTokenA: {
                  amount: "0.066548729758650606",
                  amountInUsd: "0.06652270920531497",
                },
                amountTokenB: {
                  amount: "0.029596908571238882182457",
                  amountInUsd: "0",
                },
                transactionFee: 0.040679999999999994,
                totalInUsd: 0.10720270920531497,
                mountedRef: {
                  current: true,
                },
              }),
            {
              wrapper,
            }
          );
          await result.current.handleNEARSwap(
            {
              address:
                "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
              name: "USD Coin",
              symbol: "USDC.e",
              decimals: 18,
              image:
                "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
              balance: 0.2661949190346024,
              balanceInUsd: 0.266045583685024,

              chainId: 101,
              reflectionExists: false,
              isNative: false,

              coingeckoId: "usd-coin",
              rawBalance: "266194919034602424",
              price: 1,
            },
            {
              address: "near",
              name: "NEAR",
              symbol: "NEAR",
              decimals: 24,
              image:
                "data:image/png;base64,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",
              balance: 0.25773485027758214,
              balanceInUsd: 0.5824807616273355,
              chainId: 101,
              reflectionExists: false,
              isNative: false,
              rawBalance: "0.25773485027758214",
              coingeckoId: "",
              price: 1,
            },
            {
              address:
                "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
              name: "Near Account 1",
              walletName: "Wallet 1",
              chainFamily: "NEAR",
              nativeTokenBalance: 0.25773485027758214,
              nativeTokenSymbol: "NEAR",
              image:
                "data:image/png;base64,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",
              nativeTokenBalanceInRaw: "0.25773485027758214",
            },
            [
              {
                receiverId:
                  "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
                functionCalls: [
                  {
                    methodName: "ft_transfer_call",
                    args: {
                      receiver_id: "v2.ref-finance.near",
                      amount: "66548729758650606",
                      msg: '{"force":0,"actions":[{"pool_id":67,"token_in":"6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near","token_out":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","amount_in":"66548729758650606","min_amount_out":"0"},{"pool_id":4,"token_in":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","token_out":"wrap.near","min_amount_out":"29569082322686572000000"}]}',
                    },
                    gas: "180000000000000",
                    amount: "0.000000000000000000000001",
                  },
                ],
              },
              {
                receiverId: "wrap.near",
                functionCalls: [
                  {
                    methodName: "near_withdraw",
                    args: {
                      amount: "29572039526639238283459",
                    },
                    amount: "0.000000000000000000000001",
                  },
                ],
              },
            ]
          );

          expect(setCompletedTransactionStates).toHaveBeenCalled();
        });
      }, 60000);
      it("should throw an error when account address is not correct", async () => {
        const setIsHoldFinish = jest.spyOn(appActions, "setIsHoldFinish");

        const setSlideAnimation = jest.spyOn(appActions, "setSlideAnimation");

        await act(async () => {
          const { result } = await renderHook(
            () =>
              useSwapNEAR({
                setAmountTokenA: jest.fn(),
                setAmountTokenB: jest.fn(),
                setIsMaxAmountDeducted: jest.fn(),
                amountTokenA: {
                  amount: "0.066548729758650606",
                  amountInUsd: "0.06652270920531497",
                },
                amountTokenB: {
                  amount: "0.029596908571238882182457",
                  amountInUsd: "0",
                },
                transactionFee: 0.040679999999999994,
                totalInUsd: 0.10720270920531497,
                mountedRef: {
                  current: true,
                },
              }),
            {
              wrapper,
            }
          );
          await result.current.handleNEARSwap(
            {
              address:
                "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
              name: "Dai Stablecoin",
              symbol: "DAI",
              decimals: 18,
              image:
                "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
              balance: 0.2661949190346024,
              balanceInUsd: 0.266045583685024,
              chainId: 101,
              reflectionExists: false,
              isNative: false,
              coingeckoId: "dai",
              rawBalance: "266194919034602424",
              price: 1,
            },
            {
              address: "near",
              name: "NEAR",
              symbol: "NEAR",
              decimals: 24,
              image:
                "data:image/png;base64,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",
              balance: 0.25773485027758214,
              balanceInUsd: 0.5824807616273355,
              chainId: 101,
              reflectionExists: false,
              isNative: false,
              rawBalance: "0.25773485027758214",
              coingeckoId: "",
              price: 1,
            },
            {
              address: "",
              name: "Near Account 1",
              walletName: "Wallet 1",
              chainFamily: "NEAR",
              nativeTokenBalance: 0.25773485027758214,
              nativeTokenSymbol: "NEAR",
              image:
                "data:image/png;base64,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",
              nativeTokenBalanceInRaw: "0.25773485027758214",
            },
            [
              {
                receiverId:
                  "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
                functionCalls: [
                  {
                    methodName: "ft_transfer_call",
                    args: {
                      receiver_id: "v2.ref-finance.near",
                      amount: "66548729758650606",
                      msg: '{"force":0,"actions":[{"pool_id":67,"token_in":"6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near","token_out":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","amount_in":"66548729758650606","min_amount_out":"0"},{"pool_id":4,"token_in":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","token_out":"wrap.near","min_amount_out":"29569082322686572000000"}]}',
                    },
                    gas: "180000000000000",
                    amount: "0.000000000000000000000001",
                  },
                ],
              },
              {
                receiverId: "wrap.near",
                functionCalls: [
                  {
                    methodName: "near_withdraw",
                    args: {
                      amount: "29572039526639238283459",
                    },
                    amount: "0.000000000000000000000001",
                  },
                ],
              },
            ]
          );
          expect(setIsHoldFinish).toHaveBeenCalled();
          expect(setSlideAnimation).toHaveBeenCalled();
        });
      }, 60000);
    });
  });
