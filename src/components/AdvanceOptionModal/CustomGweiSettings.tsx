import { ChangeEvent, useEffect, useMemo, useState } from "react";
import validator from "validator";

import { CustomAmountComponent } from "components";
import { Text } from "@styled";
import { useAppDispatch, useAppSelector } from "store/store";
import { NATIVE_TOKEN_COINGECKO_ID, ZERO_ADDRESS } from "utils/constants";
import { formatAmount } from "utils/formatters";
import { setNetworkFeeSettings } from "@slices/appSlice";
import { NetworkFeeTypeChosen, SetStateNumberType } from "interfaces";
import { estimateGasLimit } from "utils/utils.gas";
import { getDetailSingleTokenInfo } from "utils/utils.api";

type Props = {
  setStep: SetStateNumberType;
  step: number;
};

const CustomGweiSettings = ({ setStep, step }: Props) => {
  const dispatch = useAppDispatch();
  const {
    networkFeeSettings: { gasInfo, feeType },
    isDappRoutes,
    NETWORKCHAIN,
  } = useAppSelector((state) => state.app);

  const {
    tokenSelected: { from, token },
    swapSelectedTokens: { tokenA, account },
    secondaryHoldings,
  } = useAppSelector((state) => state.newWallet);

  const { dAppNetwork, transactionObject, dAppConnectAddress } = useAppSelector(
    (state) => state.dappInfo
  );

  const chainId = useMemo(() => {
    if (token.chainId) {
      return token.chainId;
    } else if (tokenA.chainId) {
      return tokenA.chainId;
    } else {
      if (dAppNetwork) {
        return Number(dAppNetwork);
      }
    }
    return 1;
  }, [token.chainId, tokenA.chainId]);

  const userAddress = useMemo(() => {
    if (from.address) {
      return from.address;
    } else if (account.address) {
      return account.address;
    } else {
      if (dAppConnectAddress) {
        return dAppConnectAddress;
      }
    }
    return ZERO_ADDRESS;
  }, [token.chainId, tokenA.chainId]);

  //if any error occur cutom gewi refer here
  const [customGwei, setCustomGWei] = useState(
    gasInfo[feeType].gwei.toString()
  );
  const [nativeTokenInUsd, setNativeTokenInUsd] = useState(0);
  const [estimateGas, setEstimateGas] = useState(0);
  const [calculatedGasEstimation, setCalculatedGasEstimation] = useState(
    gasInfo[feeType].usd
  );
  const [customGweiError, setCustomGweiError] = useState("");

  useEffect(() => {
    //if any error occur custom gwei refer here
    const amount = gasInfo[feeType].gwei.toString();
    setCustomGWei(amount);
    setCalculatedGasEstimation(gasInfo[feeType].usd);
  }, [step]);

  /**
   *
   * @param event custom slippage value
   */
  const handleCustomGweiChange = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value.trim();

    if (validator.isFloat(amount) || amount === "") {
      const estimateGasInUSD =
        ((+amount * estimateGas) / 10 ** 9) * parseFloat(`${nativeTokenInUsd}`);
      setCustomGWei(amount);
      setCustomGweiError("");
      setCalculatedGasEstimation(estimateGasInUSD);
    }
  };

  const handleCustomGweiClose = () => {
    setCustomGweiError("");
    setStep(1);
  };

  /**
   * @description check validations for gwei value
   * @returns boolean
   */
  const isValidGwei = () => {
    const tokenId = `${NETWORKCHAIN[chainId].NATIVE_TOKEN_NAME}_${NETWORKCHAIN[chainId].NATIVE_TOKEN_ADDRESS}_${NETWORKCHAIN[chainId].NATIVE_TOKEN_SYMBOL}`;
    const nativeTokenAmount =
      secondaryHoldings[+chainId]?.tokens?.[tokenId]?.accounts[userAddress]
        ?.balance;

    if (!nativeTokenAmount) {
      setCustomGweiError(`not enough funds for gas`);
      return false;
    } else if (
      Number(customGwei) >
      gasInfo[NetworkFeeTypeChosen.Fast].gwei + 15
    ) {
      setCustomGweiError(`too much gas provided`);
      return false;
    } else if (Number(customGwei) < gasInfo[NetworkFeeTypeChosen.Slow].gwei) {
      setCustomGweiError("Gas fee too low");
      return false;
    }
    return true;
  };

  /**
   * set custom gwei values
   */
  const handleCustomGweiSubmit = async () => {
    if (isValidGwei()) {
      const { time: slowTime, gwei: slowGwei } =
        gasInfo[NetworkFeeTypeChosen.Slow];
      const { time: avgTime, gwei: avgGwei } =
        gasInfo[NetworkFeeTypeChosen.Average];
      const { time: fastTime, gwei: fastGwei } =
        gasInfo[NetworkFeeTypeChosen.Fast];

      const customWait =
        +customGwei > fastGwei
          ? fastTime - 0.3
          : +customGwei > avgGwei
          ? avgTime - 0.3
          : +customGwei > slowGwei
          ? slowTime - 0.3
          : slowTime + 0.3;
      const newcustomGwei = +customGwei;
      const customGas = calculatedGasEstimation;

      await dispatch(
        setNetworkFeeSettings({
          feeType: NetworkFeeTypeChosen.Custom,
          gasInfo: {
            ...gasInfo,
            3: {
              usd: customGas,
              gwei: newcustomGwei,
              time: customWait,
            },
          },
        })
      );
      handleCustomGweiClose();
    }
  };

  /**
   * set native token price in usd
   */
  useEffect(() => {
    (async () => {
      if (chainId) {
        const coingeckoId =
          NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN][
            NATIVE_TOKEN_COINGECKO_ID
          ];
        const {
          market_data: { current_price },
        } = await getDetailSingleTokenInfo(coingeckoId);
        setNativeTokenInUsd(parseFloat(current_price.usd.toString()));
      }
    })();
  }, [chainId, open]);

  /**
   * DAPP
   * Estimate gas wit respect to dapp
   */
  useEffect(() => {
    if (isDappRoutes) {
      setEstimateGas(+(transactionObject.gas as string));
    }
  }, []);

  /**
   * SEND
   * Estimate gas wit respect to send
   */
  useEffect(() => {
    (async () => {
      if (token.address && userAddress && chainId) {
        const estimateGas = await estimateGasLimit(
          token.address,
          userAddress,
          chainId
        );
        setEstimateGas(+estimateGas);
      }
    })();
  }, [token.address, userAddress, open, chainId]);

  // /**
  //  * SWAP
  //  * Estimate gas wit respect to swap
  //  */
  // useEffect(() => {
  //   (async () => {
  //     if (tokenB.address && tokenA.address && tokenA.chainId) {
  //       const data = await getSwapPrices(
  //         "1000000000000000000",
  //         tokenB.address,
  //         tokenA.address,
  //         tokenA.chainId,
  //         0.1,
  //         "",
  //         true
  //       );
  //       const estimateGas = +data.gas;
  //       setEstimateGas(estimateGas);
  //     }
  //   })();
  // }, [tokenB.address, tokenA.address, tokenA.chainId]);

  const handleOnSave = () => {
    handleCustomGweiSubmit();
  };

  const handeOnReset = () => {
    handleCustomGweiClose();
  };

  return (
    <>
      <CustomAmountComponent
        handleChange={handleCustomGweiChange}
        value={customGwei}
        title={"Set custom gas"}
        onCancel={handleCustomGweiClose}
        error={customGweiError}
        handleOnSave={handleOnSave}
        handeOnReset={handeOnReset}
        placeholder={
          <>
            <Text className="f-title-md" weight={500} style={{ opacity: 0.7 }}>
              GWEI
            </Text>
            <Text className="f-body-sm ">
              ~{formatAmount(calculatedGasEstimation)} USD
            </Text>
          </>
        }
      />
    </>
  );
};
export default CustomGweiSettings;
