import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import {
  EstimateSwapView,
  Pool as RefPool,
  SwapOptions as RefSwapOptions,
  StablePool,
  Transaction,
  estimateSwap,
  fetchAllPools,
  ftGetTokenMetadata,
  getExpectedOutputFromSwapTodos,
  getStablePools,
  init_env,
  instantSwap,
  nearDepositTransaction,
  nearWithdrawTransaction,
  sendTransactionsByMemoryKey,
} from "@ref-finance/ref-sdk";
import { transactions as nearTransactions } from "near-api-js";

import { useAppDispatch, useAppSelector } from "store/store";
import {
  ACTIVITY_STATUS_TYPES,
  AMOUNT_MAX_PERCENT,
  NEAR_ADDRESS,
  NETWORKS,
  SupportedChainId,
  TX_TYPES,
  TransactionFailureMessage,
  TransactionSuccessMessage,
  Tx_METHODS,
} from "utils/constants";
import {
  setCompletedTransactionStates,
  setIsHoldFinish,
  setNetworkFeeSettings,
  setSlideAnimation,
  setSlippageToleranceSettings,
  setTransactionTrigerredMessage,
} from "@slices/appSlice";
import { setSwapSelectedTokens, setTokenInfo } from "@slices/newWalletSlice";
import { calculateNonEvmGasFee } from "utils/utils.gas";
import {
  dispatchDynamicSwapMsg,
  dispatchFetchingMsg,
  dispatchInsufficientFundsMsg,
} from "utils/utils.swap";
import { toFixed } from "utils/formatters";
import {
  AmountTokenA,
  AmountTokenB,
  EstimateSwapHookProps,
  GasInfo,
  IAccount,
  ITokenA,
  ITokenB,
  NetworkFeeSettings,
  NetworkFeeTypeChosen,
  SlippageTolerance,
  SlippageType,
  SlippageTypeChosen,
} from "interfaces";
import { getSignedTransactionsByMemoryKeyInner } from "utils/utils.near";
import {
  getPopulatedSwapTxDetail,
  storeTransactionActivityData,
} from "utils/utils.activity";
import { useNavigate } from "react-router";
import { getHoldings, introduceNewToken } from "utils/utils.holdings";

export const useSwapNEAR = ({
  setAmountTokenA,
  setAmountTokenB,
  setIsMaxAmountDeducted,
  amountTokenA,
  amountTokenB,
  transactionFee,
  totalInUsd,
}: EstimateSwapHookProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { slippageToleranceSettings, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );
  const {
    swapSelectedTokens: { account },
    tokenInfo,
  } = useAppSelector((state) => state.newWallet);

  const { slippageTolerance, slippageType } = slippageToleranceSettings;

  /**
   * Update the slippage Tolerance for the NEAR swap
   */
  useEffect(() => {
    (async () => {
      if (account.chainFamily === NETWORKS.NEAR) {
        await dispatch(
          setSlippageToleranceSettings({
            ...slippageToleranceSettings,
            slippageTolerance: {
              ...slippageTolerance,
              [SlippageTypeChosen.First]: {
                value: 0.5,
              },
              [SlippageTypeChosen.Second]: {
                value: 1,
              },
              [SlippageTypeChosen.Third]: {
                value: 3,
              },
              [SlippageTypeChosen.Custom]: {
                value: slippageTolerance[slippageType].value,
              },
            },
          })
        );
      }
    })();
  }, [account.chainFamily]);

  /**
   * @function
   * Get swap quotation and estimate gas price for NEAR chain
   * @param tokenA: ITokenA
   * @param tokenB: ITokenB
   * @param networkFeeSettings: NetworkFeeSettings
   * @param slippageTolerance: SlippageTolerance
   * @param slippageType: SlippageType
   * @param gasInfo: GasInfo
   * @param feeType: NetworkFeeTypeChosen
   * @param amountTokenA: AmountTokenA
   * @param amountTokenB: AmountTokenB
   * @param isTokenA: boolean
   * @param prevAmountTokenA: AmountTokenA
   * @param prevAmountTokenB: AmountTokenB
   * @param allowance: number
   * @param prevAllowance: { allowance: number }
   * @param currentRatio: number
   * @param isMaxAmountDeducted: boolean
   */
  const estimateSwapPriceNEAR = useCallback(
    debounce(
      async (
        tokenA: ITokenA,
        tokenB: ITokenB,
        account: IAccount,
        networkFeeSettings: NetworkFeeSettings,
        slippageTolerance: SlippageTolerance,
        slippageType: SlippageType,
        gasInfo: GasInfo,
        feeType: NetworkFeeTypeChosen,
        amountTokenA: AmountTokenA,
        amountTokenB: AmountTokenB,
        isTokenA: boolean,
        prevAmountTokenA: AmountTokenA,
        prevAmountTokenB: AmountTokenB,
        allowance: number,
        prevAllowance: { allowance: number },
        currentRatio: number,
        isMaxAmountDeducted: boolean
      ) => {
        try {
          console.log("here near now", amountTokenA);
          if (
            // !mountedRef.current ||
            amountTokenA.amount.length === 0 ||
            Number(amountTokenA.amount) === 0
          ) {
            setAmountTokenB((state) => ({
              ...state,
              amount: "0",
              amountInUsd: "0",
            }));
            prevAmountTokenB.amount = "0";
            dispatch(
              setSwapSelectedTokens({
                error: {
                  message: "Please enter the valid amount",
                  open: true,
                },
              })
            );
            return null;
          }

          if (Number(amountTokenA.amount) > tokenA.balance) {
            dispatchDynamicSwapMsg("Insufficient funds available");
            return;
          }

          init_env("mainnet");

          const isTokenANative = tokenA.address === NEAR_ADDRESS;
          const isTokenBNative = tokenB.address === NEAR_ADDRESS;

          const isTokenAWrapped = tokenA.address === "wrap.near";
          const isTokenBWrapped = tokenB.address === "wrap.near";

          const tokenIn = await ftGetTokenMetadata(
            isTokenANative ? "wrap.near" : tokenA.address
          );
          const tokenOut = await ftGetTokenMetadata(
            isTokenBNative ? "wrap.near" : tokenB.address
          );

          const { ratedPools, unRatedPools, simplePools } =
            await fetchAllPools();
          const stablePools: RefPool[] = unRatedPools.concat(ratedPools);
          const stablePoolsDetail: StablePool[] = await getStablePools(
            stablePools
          );
          const options: RefSwapOptions = {
            enableSmartRouting: true,
            stablePools,
            stablePoolsDetail,
          };

          let swapTodos: EstimateSwapView[] = [];
          let amountOut = "0";

          if (
            (isTokenANative && isTokenBWrapped) ||
            (isTokenAWrapped && isTokenBNative)
          ) {
            console.log("if ");
            amountOut = toFixed(amountTokenA.amount).toString();
          } else {
            console.log("else ");
            swapTodos = await estimateSwap({
              tokenIn,
              tokenOut,
              amountIn: toFixed(amountTokenA.amount).toString(),
              simplePools,
              options,
            });

            amountOut = getExpectedOutputFromSwapTodos(
              swapTodos,
              tokenOut.id
            ).toFixed(24);
          }

          setAmountTokenB((state) => ({
            ...state,
            amount: amountOut,
            amountInUsd: (tokenB.price * Number(amountOut)).toString(),
          }));
          prevAmountTokenB.amount = amountOut.toString();

          if (Number(amountTokenA.amount) > tokenA.balance) {
            dispatch(
              setSwapSelectedTokens({
                error: {
                  message: "Insufficient funds available",
                  open: true,
                },
              })
            );
            return;
          }

          const slipp = slippageTolerance[slippageType].value;
          const slippagePercentage = slipp ? slipp / 100 : 1 / 100;

          let transactionsRef: Transaction[] = [];

          if (
            (isTokenANative && isTokenBWrapped) ||
            (isTokenAWrapped && isTokenBNative)
          ) {
            if (isTokenANative && isTokenBWrapped) {
              const nearDepositTxRef = await nearDepositTransaction(
                toFixed(amountTokenA.amount).toString()
              );
              transactionsRef.unshift(nearDepositTxRef);
            } else if (isTokenAWrapped && isTokenBNative) {
              const nearWithdrawTxRef = await nearWithdrawTransaction(
                amountOut
              );
              transactionsRef.push(nearWithdrawTxRef);
            }
          } else {
            transactionsRef = await instantSwap({
              tokenIn,
              tokenOut,
              amountIn: toFixed(amountTokenA.amount).toString(),
              swapTodos,
              slippageTolerance: slippagePercentage,
              AccountId: account.address,
              // referralId: "ref-fee.testnet",
            });

            if (isTokenANative) {
              const nearDepositTxRef = await nearDepositTransaction(
                toFixed(amountTokenA.amount).toString()
              );
              transactionsRef.unshift(nearDepositTxRef);
            }

            if (isTokenBNative) {
              const nearWithdrawTxRef = await nearWithdrawTransaction(
                amountOut
              );
              transactionsRef.push(nearWithdrawTxRef);
            }
          }

          const gas = transactionsRef.reduce(
            (partialSum, a) => partialSum + Number(a.functionCalls[0].gas || 0),
            0
          );

          console.log("transactionsRef", transactionsRef, "gas", gas);

          // prompt errro for gas
          const {
            gasFeeInUsd,
            gasInDefaultGasUnit,
            transactionCost: costTransaction,
          } = await calculateNonEvmGasFee(tokenA.chainId, gas);

          let transactionCost = costTransaction;

          if (isTokenANative) {
            //incase of MAX amount of native tokens
            if (
              // Number(amountTokenA.amount) === Number(account.nativeTokenBalance)
              currentRatio === AMOUNT_MAX_PERCENT &&
              !isMaxAmountDeducted
            ) {
              const deductedAmount =
                Number(account.nativeTokenBalance) - Number(transactionCost);

              console.log("dedcuted amount", deductedAmount);

              if (deductedAmount > 0) {
                dispatchFetchingMsg();
                setIsMaxAmountDeducted(true);
                setAmountTokenA((state) => ({
                  ...state,
                  amount: deductedAmount.toString(),
                  amountInUsd: (
                    tokenA.price * Number(deductedAmount)
                  ).toString(),
                }));
                return;
              }
            }

            transactionCost =
              Number(transactionCost) + Number(amountTokenA.amount);
          }

          if (Number(transactionCost) > Number(account.nativeTokenBalance)) {
            dispatchInsufficientFundsMsg();
            return;
          }

          dispatch(
            setNetworkFeeSettings({
              feeType: NetworkFeeTypeChosen.Custom,
              gasInfo: {
                ...gasInfo,
                [NetworkFeeTypeChosen.Custom]: {
                  usd: gasFeeInUsd,
                  time: 0.2,
                  gwei: gasInDefaultGasUnit,
                },
              },
            })
          );

          dispatch(
            setSwapSelectedTokens({
              transactionsRef: transactionsRef,
              loading: false,
              error: {
                message: "",
                open: false,
              },
            })
          );
        } catch (error: any) {
          console.log("estimateSwapPriceNEAR", error);
          dispatch(
            setSwapSelectedTokens({
              error: {
                message: error.message,
                open: true,
              },
            })
          );
        }
      },
      500,
      {
        leading: process.env.isTesting ? true : false,
      }
    ),
    []
  );

  const handleNEARSwap = async (
    tokenA: ITokenA,
    tokenB: ITokenB,
    account: IAccount,
    transactionsRef: Transaction[]
  ) => {
    try {
      console.log({
        tokenA,
        tokenB,
        account,
        transactionsRef,
      });

      dispatch(setIsHoldFinish(true));

      const signedTransactions: nearTransactions.SignedTransaction[] =
        await getSignedTransactionsByMemoryKeyInner({
          transactionsRef,
          AccountId: account.address,
        });
      dispatch(
        setTransactionTrigerredMessage(
          "Your Near transaction might be confirmed or terminated"
        )
      );
      console.log("signedTransactions", signedTransactions);

      const res = await sendTransactionsByMemoryKey({
        signedTransactions,
      });
      console.log("res", res);
      if (res.length > 0) {
        const tokenAInfo = tokenInfo[`${tokenA.address}_${tokenA.symbol}`];

        // enable tokenA if it is disabled
        if (!tokenAInfo?.isActive) {
          await dispatch(
            setTokenInfo({
              [`${tokenAInfo.address}_${tokenAInfo.symbol}`]: {
                ...tokenAInfo,
                isActive: true,
              },
            })
          );
          // wait at least 2 seconds for all the other states to execute
          // just to be on the safe side
          await new Promise((r) => setTimeout(r, 2000));
        }

        await dispatch(
          setCompletedTransactionStates({
            txType: TX_TYPES.Swap,
            message:
              typeof res[0].status === "object"
                ? res[0].status["SuccessValue"] !== undefined
                  ? TransactionSuccessMessage
                  : TransactionFailureMessage
                : TransactionSuccessMessage,
          })
        );

        const transactionData = getPopulatedSwapTxDetail({
          account,
          amountTokenA,
          amountTokenB,
          isDappTransaction: false,
          isCancelEnabled: false,
          isSpeedUpEnabled: false,
          nonce: 1,
          txMethod: Tx_METHODS.normal,
          status:
            typeof res[0].status === "object"
              ? res[0].status["SuccessValue"] !== undefined
                ? ACTIVITY_STATUS_TYPES.success
                : ACTIVITY_STATUS_TYPES.failed
              : ACTIVITY_STATUS_TYPES.success,

          tokenA,
          tokenB,
          transactionFeeInUsd: +transactionFee,
          transactionHash: res[0].transaction.hash,
          transactionObject: {},
          timeStamp: Date.now(),
          tokenAprice: tokenA.price,
          tokenBprice: tokenB.price,
        });
        // console.log(transactionData, "HERE IS YOUR TRANSACTION DATA");
        await storeTransactionActivityData({ transactionData });

        // create a copy of tokenB because it gets clear
        // when we reach at dashboard
        const copyTokenB = { ...tokenB };
        await introduceNewToken({
          accAddress: account.address,
          chainId: NETWORKCHAIN[SupportedChainId.NEAR].CHAIN_ID,
          tokenInfo: {
            address: copyTokenB.address,
            name: copyTokenB.name,
            symbol: copyTokenB.symbol,
            decimals: copyTokenB.decimals,
            image: copyTokenB.image,
            coingeckoId: "",
            isActive: true,
            price: 0,
          },
        });

        dispatch(setIsHoldFinish(false));
        dispatch(setTransactionTrigerredMessage(""));

        navigate("/index.html");

        getHoldings(["NEAR"]);
      }
    } catch (error) {
      console.log("near swap error", error);
      dispatch(setIsHoldFinish(false));
      dispatch(setSlideAnimation("contract"));
    }
  };

  return { estimateSwapPriceNEAR, handleNEARSwap };
};
