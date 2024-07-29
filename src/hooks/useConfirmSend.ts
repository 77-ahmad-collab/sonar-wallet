import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router";
import BigNumber from "bignumber.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import {
  NEAR,
  NETWORKS,
  SOLANA,
  SOLANA_ADDRESS,
  SupportedChainId,
  solanaTranserFees,
  solanaTranserFeesInLamports,
} from "utils/constants";
import { useSendTransaction } from "hooks";
import {
  setIsHoldFinish,
  setNetworkFeeSettings,
  setSlideAnimation,
} from "store/slices/appSlice";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import {
  setDefaultTokenSelected,
  setTokenSelected,
} from "@slices/newWalletSlice";
import {
  addGas,
  calculateNonEvmGasFee,
  estimateGasLimit,
} from "utils/utils.gas";
import { NetworkFeeTypeChosen } from "interfaces";
import { toFixed, toReadableAmount } from "utils/formatters";

export const useConfirmSend = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { sendEVMTransaction, sendNEARTransaction, sendSOLANATransaction } =
    useSendTransaction();

  const {
    tokenSelected: { token, from, to, error },
  } = useAppSelector((state) => state.newWallet);

  const {
    isSlideAnimationCompleted,
    networkFeeSettings,
    minimumSolTokenBalance,
    NETWORKCHAIN,
  } = useAppSelector((state) => state.app);

  const { gasInfo, feeType } = networkFeeSettings;

  const [showTransactionFeeComponent, setShowTransactionFeeComponent] =
    useState(false);
  const [currentRatio, setCurrentRatio] = useState(0);
  const [inputWidth, setWidth] = useState("5.5ch");

  const totalInUsd = useMemo(() => {
    if (to.amount > 0) {
      return gasInfo[feeType].usd + to.amountInUsd;
    }
    return gasInfo[feeType].usd;
  }, [to.amount, feeType, gasInfo]);

  /**
   * This function is used on an onClick event on the icon used in the top header of the confirm page.
   * It simply navigate to select token screen
   */
  const onTopImageClick = () => {
    dispatch(setDefaultTokenSelected());
    navigate("/send/selecttoken");
  };

  /**
   * This function is used when hold to confirm button, animation completes
   */
  const handlePreserved = () => {
    if (isSlideAnimationCompleted === true) {
      dispatch(setSlideAnimation("expand"));
      dispatch(setIsHoldFinish(true));
    }
  };

  /**
   * This function is called when reject button  is triggered.
   * Navigate to the select token screen.
   * Resets the selected tokens state
   */
  const handleReject = () => {
    navigate("/send/selecttoken");
    dispatch(setDefaultTokenSelected());
  };

  /**
   * This method calculates the width of the input field based on the amount of characters.
   * It increase the width based on the number of characters
   * Set the width to either the calculated width or 100% if it's a percent value flag is set to true.
   */
  const updateInputWidth = (amount: string, isPercent: boolean) => {
    const charactersLength = amount.toString().length;
    let width = 5.5;

    if (charactersLength > 1) {
      if (amount.includes(".")) width = charactersLength * 4;
      else width = charactersLength * 4.4;
    }
    if (width < 33) {
      setWidth(`${width}ch`);
    } else if (isPercent) {
      setWidth(`100%`);
    }
  };

  /**
   * Handles the change event of the search field in the confirm page screen
   * @param {ChangeEvent<HTMLInputElement>} event - The change event of the input element
   * This method will also update the input div width according to the length of input
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value.trim();
    if (amount === "" || validator.isFloat(amount)) {
      updateInputWidth(amount, false);
      updateEnteredAmount(amount);
      setCurrentRatio(0);
    }
  };

  /**
   * Updates the amount of tokens to transfer.
   * @param {string} amount The amount of tokens to transfer.
   * This method also calculates the token price in USD. Dispatch an action to update the token selected to transfer.
   * Reset the current ratio to 0
   */
  const updateEnteredAmount = (amount: string) => {
    dispatch(
      setTokenSelected({
        to: {
          ...to,
          amount,
          amountInUsd: +amount * token.price,
        },
        error: {
          message: "",
          open: false,
        },
      })
    );
  };

  const getRawBalance = async (ratio: number) => {
    let rawBalance = from.rawBalance;
    if (
      token.chainId === SupportedChainId.SOLANA_MAINNET &&
      token.address === SOLANA_ADDRESS &&
      ratio === 1
    ) {
      const amountToBeDeducted =
        solanaTranserFeesInLamports + minimumSolTokenBalance;

      const balance = new BigNumber(from.rawBalance).minus(
        new BigNumber(amountToBeDeducted)
      );
      if (!balance.isLessThanOrEqualTo(0)) {
        rawBalance = balance.toString();
      }
    }
    return rawBalance;
  };

  /*
   * This function is triggered when a user clicks on a ratio button.
   * It calculates a new amount based on the ratio, updates the width of the input field accordingly,
   * updates the amount entered by the user, and sets the current ratio.
   */
  const onRatioClick = async (ratio: number) => {
    const rawBalance = await getRawBalance(ratio);
    const newAmountInRaw = new BigNumber(rawBalance).times(ratio).toFixed(0);
    const newAmount = toReadableAmount(newAmountInRaw, token.decimals);

    updateInputWidth(toFixed(newAmount), true);
    updateEnteredAmount(toFixed(newAmount.toString()));
    setCurrentRatio(ratio);
  };

  /*
   * This function is used to determine either the solana token amount is valid or not incase of max.
   * Because, in solana there are some requirements.
   * You must have minimum balance.
   * You must have rent fees.
   * Remaining amount can be transferred easily.
   */

  const checkValidationOnSolTransferAmount = () => {
    const minimumSolBalance = minimumSolTokenBalance / LAMPORTS_PER_SOL;
    const tokenAmountToTransfer =
      +to.amount + minimumSolBalance + solanaTranserFees;
    if (tokenAmountToTransfer > from.balance) {
      dispatch(
        setTokenSelected({
          error: {
            message: "Insufficient funds available",
            open: true,
          },
        })
      );
    }
  };

  /**
   * This function will re ren, whenever the token amount value will be changed and will call the check validation function
   */
  useEffect(() => {
    checkValidation();
  }, [to]);

  /**
   * This method is used to validate the token transfer amount
   * if the amount is greater than balance or if the amount is less than or equal to zero, an error message is dispatched
   */
  const checkValidation = useCallback(() => {
    if (
      token.chainId === SupportedChainId.SOLANA_MAINNET &&
      token.address === SOLANA_ADDRESS
    ) {
      checkValidationOnSolTransferAmount();
    } else if (to.amount > from.balance) {
      dispatch(
        setTokenSelected({
          error: {
            message: "Insufficient funds available",
            open: true,
          },
        })
      );
    }
    if (to.amount <= 0) {
      dispatch(
        setTokenSelected({
          error: {
            message: "Please enter amount",
            open: true,
          },
        })
      );
    }
  }, [to]);

  /**
   * This particular useEffect will check the value of the error.open state and set the showTransactionFeeComponent state accordingly either to show or hide
   * the component.
   * It will only run when the error.open value changes.
   */
  useEffect(() => {
    if (error.open) setShowTransactionFeeComponent(false);
    else setShowTransactionFeeComponent(true);
  }, [error.open]);

  //SEND EVM GAS
  /**
   * This useEffect is to check for token address, from address, token chainId and from chainFamily
   * for the given network parameters, it estimates gas limit and adds gas.
   * The action being dispatched here is setNetworkFeeSettings which will set the network fee settings in the store.
   * The object passed as an argument contains the fee type and the associated gas info for that fee type.
   */
  useEffect(() => {
    (async () => {
      if (
        token.address &&
        from.address &&
        token.chainId &&
        from.chainFamily === NETWORKS.EVM
      ) {
        const estimateGas = await estimateGasLimit(
          token.address,
          from.address,
          Number(token.chainId)
        );
        const gasInfoResponse = await addGas(
          Number(token.chainId),
          estimateGas ?? 0
        );
        dispatch(
          setNetworkFeeSettings({
            feeType: StaticStore.getState().app.networkFeeSettings.feeType,
            gasInfo: { ...gasInfoResponse },
          })
        );
      }
    })();
  }, [token.address, from.address, token.chainId, from.chainFamily]);

  //SEND NEAR & SOLANA GAS
  /**
   * This  useEffect is used to calculate the gas fee for non-EVM chains.
   * It checks for the non-evm chainIds and if it is non EVM.
   * Then the calculate calculateNonEvmGasFee will be called and the result will be stored in the redux
   *   */
  useEffect(() => {
    (async () => {
      if (
        NETWORKCHAIN[token.chainId]?.chain === SOLANA ||
        NETWORKCHAIN[token.chainId]?.chain === NEAR
      ) {
        const { gasFeeInUsd, gasInDefaultGasUnit } =
          await calculateNonEvmGasFee(token.chainId);
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
      }
    })();
  }, []);

  /**
   * This function handle transactions function for different networks.
   * EVM
   * NEAR
   * SOLANA
   */
  const handleTransaction = async () => {
    if (token.chainId === SupportedChainId.NEAR) {
      await sendNEARTransaction();
    } else if (
      token.chainId === SupportedChainId.SOLANA_DEVNET ||
      token.chainId === SupportedChainId.SOLANA_MAINNET
    ) {
      await sendSOLANATransaction();
    } else {
      await sendEVMTransaction();
    }
  };

  return {
    handleChange,
    handleTransaction,
    handleReject,
    handlePreserved,
    onTopImageClick,
    showTransactionFeeComponent,
    setShowTransactionFeeComponent,
    inputWidth,
    currentRatio,
    onRatioClick,
    totalInUsd,
  };
};
