import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "store/store";
import { matchAddresses } from "utils";
import { NATIVE_TOKEN_ADDRESS, NETWORKS } from "utils/constants";
import {
  setDefaultSwapSelectedTokens,
  setSwapSelectedTokens,
} from "@slices/newWalletSlice";
import { useSwap1Inch, useSwapNEAR } from "hooks";
import {
  dispatchDynamicSwapMsg,
  validateSwapSelectedTokensData,
} from "utils/utils.swap";
import {
  AmountTokenA,
  AmountTokenB,
  ITokenA,
  ITokenB,
  Location,
  SwapLocationState,
} from "interfaces";

export const useSwap = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation() as Location<SwapLocationState>;

  const { slippageToleranceSettings, networkFeeSettings, isHoldFinish } =
    useAppSelector((state) => state.app);
  const { swapSelectedTokens } = useAppSelector((state) => state.newWallet);

  const { gasInfo, feeType } = networkFeeSettings;
  const { slippageTolerance, slippageType } = slippageToleranceSettings;

  const {
    tokenA,
    tokenB,
    account,
    error,
    allowance,
    loading,
    transactionsRef,
    warning,
  } = swapSelectedTokens;

  const [showTransactionFeeComponent, setShowTransactionFeeComponent] =
    useState(false);

  const [flipToken, setFlipToken] = useState<"flip1" | "flip2">();

  const [amountTokenA, setAmountTokenA] = useState({
    amount: "",
    amountInUsd: "0",
  });
  const [amountTokenB, setAmountTokenB] = useState({
    amount: "",
    amountInUsd: "0",
  });
  const [currentRatio, setCurrentRatio] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);
  const [progress, setProgress] = useState(0);

  const totalInUsd = useMemo(() => {
    if (Number(amountTokenA.amountInUsd) > 0) {
      return Number(gasInfo[feeType].usd) + Number(amountTokenA.amountInUsd);
    }

    return Number(gasInfo[feeType].usd);
  }, [feeType, gasInfo, amountTokenA.amountInUsd]);

  const [isMaxAmountDeducted, setIsMaxAmountDeducted] = useState(false);

  const prevAmountTokenA = useRef(amountTokenA).current;
  const prevAmountTokenB = useRef(amountTokenB).current;
  const prevAllowance = useRef({ allowance }).current;
  const mountedRef = useRef(true);

  const { estimateSwapPriceNEAR, handleNEARSwap } = useSwapNEAR({
    setAmountTokenA,
    setAmountTokenB,
    setIsMaxAmountDeducted,
    amountTokenA,
    amountTokenB,
    transactionFee: gasInfo[feeType].usd,
    totalInUsd,
    mountedRef,
  });

  const { estimateSwapPrice1Inch, giveApproval1Inch, handle1InchSwap } =
    useSwap1Inch({
      setAmountTokenA,
      setAmountTokenB,
      setIsMaxAmountDeducted,
      amountTokenA,
      amountTokenB,
      transactionFee: gasInfo[feeType].usd,
      totalInUsd,
      mountedRef,
    });

  const onTopImageClick = async () => {
    navigate("/index.html");
    await dispatch(setDefaultSwapSelectedTokens());
  };

  useEffect(() => {
    if (!location.state?.tokenDetail && !location.state?.selectToken)
      dispatch(setDefaultSwapSelectedTokens());
  }, []);

  useEffect(() => {
    if (error.open) setShowTransactionFeeComponent(false);
    else setShowTransactionFeeComponent(true);
  }, [error.open]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (tokenA.address && tokenB.address && !isHoldFinish) {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 0 : prevProgress + 10
        );
      }
    }, 1500);

    return () => {
      clearInterval(timer);
    };
  }, [isHoldFinish]);

  useEffect(() => {
    if (progress >= 100 && tokenA.address && tokenB.address && !isHoldFinish) {
      setRefreshKey((oldKey) => oldKey + 1);
    }
  }, [progress, tokenA.address, tokenB.address, isHoldFinish]);

  /**
   * flip swap tokens TOKENA <=> TOKENB
   */
  const handleFlipTokens = () => {
    if (isHoldFinish) return;

    setFlipToken(flipToken === "flip1" ? "flip2" : "flip1");

    if (tokenA.address && tokenB.address) {
      const newTokenA: ITokenA = Object.assign({ ...tokenA }, { ...tokenB });
      const newTokenB: ITokenB = Object.assign({ ...tokenB }, { ...tokenA });

      const newAmountTokenA: AmountTokenA = Object.assign(
        { ...amountTokenA },
        { ...amountTokenB }
      );
      const newAmountTokenB: AmountTokenB = Object.assign(
        { ...amountTokenB },
        { ...amountTokenA }
      );

      dispatch(
        setSwapSelectedTokens({
          tokenA: newTokenA,
          tokenB: newTokenB,
          error: {
            message: "Fetching...",
            open: true,
          },
          warning: "",
        })
      );

      setAmountTokenA(newAmountTokenA);
      setAmountTokenB(newAmountTokenB);
      setCurrentRatio(0);
      setProgress(100);
    }
  };

  /**
   * Check allowance of tokens
   * @returns {boolean} Whether the token is approved by the contract or not.
   */
  const isTokenApproved = useMemo(
    () =>
      !(
        allowance == 0 &&
        !matchAddresses(tokenA.address, NATIVE_TOKEN_ADDRESS) &&
        account.chainFamily === NETWORKS.EVM
      ),
    [allowance, tokenA.address]
  );

  //for tokenA (EVM)
  useEffect(() => {
    (async () => {
      const validationResult = validateSwapSelectedTokensData(
        amountTokenA,
        amountTokenB,
        tokenA,
        tokenB
      );

      if (validationResult.open) {
        dispatchDynamicSwapMsg(validationResult.message);
      }

      if (
        tokenB.address &&
        tokenA.address &&
        tokenA.chainId &&
        account.chainFamily === NETWORKS.EVM
        // &&
        // prevAmountTokenA?.amount !== amountTokenA.amount
      ) {
        if (!validationResult.open) {
          dispatch(
            setSwapSelectedTokens({
              loading: true,
            })
          );

          estimateSwapPrice1Inch(
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
        }
      }
    })();
  }, [
    account.chainFamily,
    tokenB.address,
    tokenA.address,
    tokenA.chainId,
    amountTokenA.amount,
    feeType,
    slippageTolerance,
    slippageType,
    prevAmountTokenA,
    prevAmountTokenB,
    allowance,
    prevAllowance,
    refreshKey,
  ]);

  //for NEAR tokenA
  useEffect(() => {
    (async () => {
      const validationResult = validateSwapSelectedTokensData(
        amountTokenA,
        amountTokenB,
        tokenA,
        tokenB
      );

      if (validationResult.open) {
        dispatchDynamicSwapMsg(validationResult.message);
      }

      if (
        tokenB.address &&
        tokenA.address &&
        tokenA.chainId &&
        account.chainFamily === NETWORKS.NEAR
        // &&
        // prevAmountTokenA?.amount !== amountTokenA.amount
      ) {
        if (!validationResult.open) {
          dispatch(
            setSwapSelectedTokens({
              loading: true,
            })
          );

          estimateSwapPriceNEAR(
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
            allowance,
            prevAllowance,
            currentRatio,
            isMaxAmountDeducted
          );
        }
      }
    })();
  }, [
    account.chainFamily,
    tokenB.address,
    tokenA.address,
    tokenA.chainId,
    amountTokenA.amount,
    slippageTolerance,
    slippageType,
    prevAmountTokenA,
    prevAmountTokenB,
    allowance,
    prevAllowance,
    refreshKey,
  ]);

  /**
   * Execute the given swap transaction
   */
  const handleSwap = async () => {
    if (loading || warning.length > 0) return;

    if (account.chainFamily === NETWORKS.EVM) {
      handle1InchSwap(
        tokenA,
        tokenB,
        account,
        slippageTolerance,
        slippageType,
        gasInfo,
        feeType
      );
    } else if (account.chainFamily === NETWORKS.NEAR) {
      handleNEARSwap(tokenA, tokenB, account, transactionsRef);
    }
  };

  /**
   * Executes the approval request to the contract
   */
  const handleApproval = async () => {
    if (loading || warning.length > 0) return;

    if (!isTokenApproved) {
      giveApproval1Inch(tokenA, account, gasInfo, feeType);
    }
  };

  return {
    onTopImageClick,
    handleSwap,
    showTransactionFeeComponent,
    setShowTransactionFeeComponent,
    setFlipToken,
    flipToken,
    handleFlipTokens,
    isTokenApproved,
    handleApproval,
    totalInUsd,
    amountTokenA,
    setAmountTokenA,
    amountTokenB,
    setAmountTokenB,
    currentRatio,
    setCurrentRatio,
    setIsMaxAmountDeducted,
    setRefreshKey,
    progress,
    setProgress,
  };
};
