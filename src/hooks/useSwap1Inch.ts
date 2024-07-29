import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import BigNumber from "bignumber.js";

import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { matchAddresses } from "utils";
import {
  ACTIVITY_STATUS_TYPES,
  NATIVE_TOKEN_ADDRESS,
  NETWORKS,
  NODE_URL,
  SWAP_REFERRER_ADDRESS,
  SWAP_REFERRER_FEE,
  TX_TYPES,
  Tx_METHODS,
} from "utils/constants";
import {
  addInProgressTransactionHash,
  setIsHoldFinish,
  setNetworkFeeSettings,
  setPendingTransactionStates,
  setSlideAnimation,
  setSlippageToleranceSettings,
} from "@slices/appSlice";
import {
  setDefaultSwapSelectedTokens,
  setSwapSelectedTokens,
  setTokenInfo,
} from "@slices/newWalletSlice";
import { addGas, fetchTransactionCostInEther } from "utils/utils.gas";
import {
  buildTxForApproveTradeWithRouter,
  buildTxForSwap,
  checkAllowance,
  findTheBestQuote,
  signAndSendTransaction,
} from "utils/utils.1inch";
import {
  checkIfReflectToken,
  dispatchDynamicSwapMsg,
  dispatchInsufficientFundsMsg,
  initializeTokenContract,
} from "utils/utils.swap";
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
import {
  getPopulatedSwapTxDetail,
  storeTransactionActivityData,
} from "utils/utils.activity";
import { useNavigate } from "react-router";
import { dynamicBalanceUpdater, introduceNewToken } from "utils/utils.holdings";

export const useSwap1Inch = ({
  setAmountTokenA,
  setAmountTokenB,
  setIsMaxAmountDeducted,
  amountTokenA,
  amountTokenB,
  transactionFee,
  totalInUsd,
  mountedRef,
}: EstimateSwapHookProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { slippageToleranceSettings, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );
  const { swapSelectedTokens } = useAppSelector((state) => state.newWallet);

  const { tokenA, tokenB, account, initialSlippage } = swapSelectedTokens;
  const { slippageTolerance, slippageType } = slippageToleranceSettings;

  /**
   * Detect whether the tokens are reflection and update default slippage
   */
  useEffect(() => {
    (async () => {
      if (
        tokenA.address &&
        tokenB.address &&
        tokenA.chainId &&
        account.chainFamily === NETWORKS.EVM
      ) {
        const nodeURL = NETWORKCHAIN[tokenA.chainId][NODE_URL];
        const web3 = new ethers.providers.JsonRpcProvider(nodeURL);
        let slipp = 0;

        const tokenAContract = await initializeTokenContract(
          tokenA.address,
          web3
        );
        const tokenBContract = await initializeTokenContract(
          tokenB.address,
          web3
        );

        const isTokenAReflection = await checkIfReflectToken(tokenAContract);
        const isTokenBReflection = await checkIfReflectToken(tokenBContract);

        console.log({
          isTokenAReflection,
          isTokenBReflection,
        });

        if (isTokenAReflection) {
          slipp = slipp + 10;
        }
        if (isTokenBReflection) {
          slipp = slipp + 10;
        }

        await dispatch(
          setSwapSelectedTokens({
            initialSlippage: slipp,
          })
        );
      }
    })();
  }, [tokenA.address, tokenB.address, tokenA.chainId, account.chainFamily]);

  /**
   * Update the slippage Tolerance for the EVM swap
   */
  useEffect(() => {
    (async () => {
      if (account.chainFamily === NETWORKS.EVM) {
        await dispatch(
          setSlippageToleranceSettings({
            ...slippageToleranceSettings,
            slippageTolerance: {
              ...slippageTolerance,
              [SlippageTypeChosen.First]: {
                value: 1 + initialSlippage,
              },
              [SlippageTypeChosen.Second]: {
                value: 3 + initialSlippage,
              },
              [SlippageTypeChosen.Third]: {
                value: 5 + initialSlippage,
              },
              [SlippageTypeChosen.Custom]: {
                value: slippageTolerance[slippageType].value + initialSlippage,
              },
            },
          })
        );
      }
    })();
  }, [initialSlippage]);

  /**
   * @function
   * Get swap quotation and estimate gas price for EVM chain
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
  const estimateSwapPrice1Inch = useCallback(
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
        prevAllowance: { allowance: number },
        currentRatio: number,
        isMaxAmountDeducted: boolean
      ) => {
        try {
          console.log("SFDd", mountedRef.current, amountTokenA.amount);

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

          const chainId = tokenA.chainId;
          const walletAddress = account.address;

          //tokenA
          const fromTokenAddress = tokenA.address;
          const fromTokenDecimals = tokenA.decimals;
          const fromTokenSymbol = tokenA.symbol;

          //tokenB
          const toTokenAddress = tokenB.address;
          const toTokenDecimals = tokenB.decimals;

          const nodeURL = NETWORKCHAIN[chainId][NODE_URL];
          // const provider = new ethers.providers.JsonRpcProvider(nodeURL);

          //1inch get price
          const amount = parseUnits(
            new BigNumber(amountTokenA.amount).toFixed(fromTokenDecimals),
            fromTokenDecimals
          );

          console.log("amount after", amount.toString());

          const quote = await findTheBestQuote(
            chainId,
            fromTokenAddress,
            toTokenAddress,
            amount.toString(),
            SWAP_REFERRER_FEE
          );
          console.log("/quote", quote);

          //tokenB
          const buyAmount = new BigNumber(
            formatUnits(quote.toTokenAmount, toTokenDecimals)
          );
          const buyAmountInRaw = new BigNumber(quote.toTokenAmount);

          //tokenA
          const sellAmount = new BigNumber(
            formatUnits(quote.fromTokenAmount, fromTokenDecimals)
          );
          const sellAmountInRaw = new BigNumber(quote.fromTokenAmount);

          if (isTokenA) {
            setAmountTokenB((state) => ({
              ...state,
              amount: buyAmount.toString(),
              amountInUsd: buyAmount.multipliedBy(tokenB.price).toString(),
            }));
            prevAmountTokenB.amount = buyAmount.toString();
          } else {
            setAmountTokenA((state) => ({
              ...state,
              amount: sellAmount.toString(),
              amountInUsd: sellAmount.multipliedBy(tokenA.price).toString(),
            }));
            prevAmountTokenA.amount = sellAmount.toString();
          }

          console.log("sellAmountInRaw", sellAmountInRaw.toFixed(0));

          if (sellAmountInRaw.gt(new BigNumber(tokenA.rawBalance))) {
            dispatchDynamicSwapMsg("Insufficient funds available");
            return null;
          }

          if (new BigNumber(account.nativeTokenBalanceInRaw).isZero()) {
            dispatchInsufficientFundsMsg();
            return null;
          }

          const estimateGas = +quote.estimatedGas;
          const gasInfoResponse = await addGas(chainId, estimateGas);
          dispatch(
            setNetworkFeeSettings({
              ...networkFeeSettings,
              gasInfo: { ...gasInfoResponse },
            })
          );

          const allowance = await checkAllowance(
            chainId,
            fromTokenAddress,
            walletAddress
          );
          console.log("Allowance: ", allowance);

          if (Number(allowance) === 0) {
            dispatch(
              setSwapSelectedTokens({
                allowance: allowance,
                loading: false,
                error: {
                  message: "",
                  open: false,
                },
                warning: "",
              })
            );
            return null;
          }

          if (prevAllowance.allowance !== allowance) {
            dispatch(
              setSwapSelectedTokens({
                allowance: allowance,
              })
            );
            prevAllowance.allowance = allowance;
          }

          let transactionCostInEther = await fetchTransactionCostInEther(
            Number(estimateGas),
            Number(gasInfo[feeType].gwei)
          );

          if (matchAddresses(tokenA.address, NATIVE_TOKEN_ADDRESS)) {
            transactionCostInEther =
              Number(transactionCostInEther) + Number(amountTokenA.amount);
          }

          if (
            Number(transactionCostInEther) > Number(account.nativeTokenBalance)
          ) {
            dispatchInsufficientFundsMsg();
            return null;
          }

          dispatch(
            setSwapSelectedTokens({
              loading: false,
              error: {
                message: "",
                open: false,
              },
              warning: "",
            })
          );
        } catch (error: any) {
          console.log("error 1inch", error);

          dispatchDynamicSwapMsg(
            error?.response?.data?.description ||
              "An error has occurred. Please check the input and try again."
          );
        }
      },
      800,
      {
        leading: process.env.isTesting ? true : false,
      }
    ),
    []
  );

  const giveApproval1Inch = async (
    tokenA: ITokenA,
    account: IAccount,
    gasInfo: GasInfo,
    feeType: NetworkFeeTypeChosen
  ) => {
    try {
      dispatch(
        setSwapSelectedTokens({
          loading: true,
          error: {
            message: "Approving...",
            open: true,
          },
        })
      );

      const chainId = tokenA.chainId;
      const walletAddress = account.address;
      //tokenA
      const fromTokenAddress = tokenA.address;

      const nodeURL = NETWORKCHAIN[chainId][NODE_URL];
      const provider = new ethers.providers.JsonRpcProvider(nodeURL);

      // First, let's build the body of the transaction
      const transactionForSign: TransactionRequest =
        await buildTxForApproveTradeWithRouter(
          chainId,
          provider,
          fromTokenAddress,
          walletAddress
        );

      console.log("Transaction for approve: ", transactionForSign);

      const transactionCostInEther = await fetchTransactionCostInEther(
        Number(transactionForSign.gasLimit),
        gasInfo[feeType].gwei
      );

      if (
        Number(transactionCostInEther) >= Number(account.nativeTokenBalance)
      ) {
        dispatchInsufficientFundsMsg();
        return null;
      }

      // Send a transaction and get its hash
      const approveTxHash = await signAndSendTransaction(
        chainId,
        provider,
        walletAddress,
        transactionForSign
      );
      console.log("Approve tx hash: ", approveTxHash);

      const interval = setInterval(async () => {
        const txReceipt = await provider.getTransactionReceipt(approveTxHash);
        console.log("Approve tx", txReceipt);
        if (txReceipt && txReceipt.status) {
          const allowance = await checkAllowance(
            chainId,
            fromTokenAddress,
            walletAddress
          );
          console.log("allowance after giving approval", allowance);
          if (Number(allowance) > 0) {
            clearInterval(interval);
            dispatch(
              setSwapSelectedTokens({
                allowance: allowance,
              })
            );
          }
        }
      }, 5000);
    } catch (error) {
      console.log("approval error", error);
      dispatch(
        setSwapSelectedTokens({
          loading: false,
        })
      );
    }
  };

  const handle1InchSwap = async (
    tokenA: ITokenA,
    tokenB: ITokenB,
    account: IAccount,
    slippageTolerance: SlippageTolerance,
    slippageType: SlippageType,
    gasInfo: GasInfo,
    feeType: NetworkFeeTypeChosen
  ) => {
    try {
      dispatch(setIsHoldFinish(true));

      const state = StaticStore.getState();

      const chainId = tokenA.chainId;
      const walletAddress = account.address;

      const fromTokenAddress = tokenA.address;
      const fromTokenDecimals = tokenA.decimals;

      const toTokenAddress = tokenB.address;

      const tokenAInfo =
        state.newWallet.tokenInfo[`${tokenA.address}_${tokenA.symbol}`];

      const gasPrice = ethers.utils.parseUnits(
        gasInfo[feeType].gwei.toString(),
        "gwei"
      );

      const nodeURL = NETWORKCHAIN[chainId][NODE_URL];

      const provider = new ethers.providers.JsonRpcProvider(nodeURL);

      const fromTokenContract = await initializeTokenContract(
        fromTokenAddress,
        provider
      );

      const isFromTokenReflection = await checkIfReflectToken(
        fromTokenContract
      );

      const amount = parseUnits(
        new BigNumber(amountTokenA.amount).toFixed(fromTokenDecimals),
        fromTokenDecimals
      );

      const swap = await buildTxForSwap(
        chainId,
        provider,
        fromTokenAddress,
        toTokenAddress,
        amount.toString(),
        walletAddress,
        slippageTolerance[slippageType].value.toString(),
        SWAP_REFERRER_ADDRESS,
        isFromTokenReflection ? "0" : SWAP_REFERRER_FEE,
        gasPrice.toString()
      );
      console.log("/swap", swap);

      const transactionForSign: TransactionRequest = swap.tx;
      console.log("transactionForSign", transactionForSign);

      // Send a transaction and get its hash
      const txHash = await signAndSendTransaction(
        chainId,
        provider,
        walletAddress,
        transactionForSign
      );

      console.log("transactionHash", txHash);

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

      const item = getPopulatedSwapTxDetail({
        account,
        amountTokenA,
        amountTokenB,
        isDappTransaction: false,
        isCancelEnabled: true,
        isSpeedUpEnabled: true,
        nonce: Number(transactionForSign.nonce),
        txMethod: Tx_METHODS.normal,
        status: ACTIVITY_STATUS_TYPES.pending,
        tokenA,
        tokenB,
        transactionFeeInUsd: +transactionFee,
        transactionHash: "",
        transactionObject: transactionForSign,
        timeStamp: Date.now(),
        tokenAprice: tokenA.price,
        tokenBprice: tokenB.price,
      });

      const dynamicBalanceChecker = {
        [chainId]: {
          web3Instance: provider,
          addresses: [account.address],
          tokens: [tokenA.address, tokenB.address],
          contractAddress: NETWORKCHAIN[+chainId].BALANCE_CHECKER,
        },
      };

      await storeTransactionActivityData({
        transactionData: { ...item, transactionHash: txHash },
      });

      dispatch(setDefaultSwapSelectedTokens());

      dispatch(
        addInProgressTransactionHash({
          chainId,
          nonce: Number(transactionForSign.nonce),
          transactionHash: txHash,
        })
      );
      dispatch(
        setPendingTransactionStates({
          isTransactionCompleted: false,
          isHoldFinish: false,
          isSlideAnimationCompleted: false,
          slideAnimation: "contract",
          txType: TX_TYPES.Swap,
        })
      );

      // create a copy of tokenB because it gets clear
      // when we reach at dashboard
      const copyTokenB = { ...tokenB };
      await introduceNewToken({
        accAddress: account.address,
        chainId,
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

      navigate("/index.html");

      const transactionReceipt = await provider.waitForTransaction(txHash);

      //@ts-ignore-end --TEMPORARY FIX
      console.log(
        "---============--------TRANSACTION---------RECEIPT--=========",
        transactionReceipt
      );
      console.log(
        "SWAP SUCCESS=====================##########===============######=="
      );
      console.log(transactionReceipt, "transactionReceipt");

      //update balance of that token after tx complete
      dynamicBalanceUpdater(dynamicBalanceChecker);
    } catch (error: any) {
      console.log("Error handle1InchSwap", error);
      dispatch(setIsHoldFinish(false));
      dispatch(setSlideAnimation("contract"));

      let errorWarning = "Oops, something went wrong. Please try again later.";
      if (error?.response?.data?.description) {
        errorWarning = error?.response?.data?.description;
        if (error?.response?.data?.description === "cannot estimate") {
          errorWarning =
            "Cannot estimate. Please try increase the slippage tolerance and try again.";
        }
      }

      dispatch(
        setSwapSelectedTokens({
          warning: errorWarning,
        })
      );
    }
  };

  return { estimateSwapPrice1Inch, giveApproval1Inch, handle1InchSwap };
};
