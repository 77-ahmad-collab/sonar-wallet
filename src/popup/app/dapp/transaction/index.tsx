import {
  DappLayout,
  LoadingScreen,
  RainbowLoader,
  TransactionFee,
} from "components";
import { useEffect, useState } from "react";

import { DAPPEVENTS } from "utils/constants";
import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import {
  rejectTransactionSignature,
  signTransaction,
} from "store/transaction-construction";
import { Text } from "@styled";
import { addGas } from "utils/utils.gas";
import {
  GasInfo,
  setIsHoldFinish,
  setNetworkFeeSettings,
} from "@slices/appSlice";
import { closeDappWindow, isClosingAfterConfirm } from "utils/utils.dapp";
import { getDetailSingleTokenInfo } from "utils/utils.api";
import { convertWeiToEther } from "utils";
import { EIP1559TransactionRequest } from "background-related/networks";

const DappTransaction = () => {
  const { accounts } = useAppSelector((state) => state.newWallet);
  const {
    permission,
    method,
    dAppNetwork: dappChainId,
    transactionObject,
    dAppConnectAddress: dappAddress,
  } = useAppSelector((state) => state.dappInfo);

  const { networkFeeSettings, isHoldFinish, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );

  const [loading, setLoading] = useState(false);
  const [totalUsd, settotalUsd] = useState(0);
  const [rejecting, setRejecting] = useState(false);

  const dispatch = useAppDispatch();

  const ButtonTitle = () => {
    if (isHoldFinish) {
      return (
        <>
          <span style={{ opacity: 0.7 }}>Confirmed</span>
        </>
      );
    }

    if (loading) {
      return (
        <RainbowLoader
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
          size={25}
        />
      );
    } else {
      return (
        <>
          <span style={{ opacity: 0.7 }}>Hold to</span> Confirm
        </>
      );
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    setTimeout(() => {
      if (!isClosingAfterConfirm()) {
        if (method === DAPPEVENTS.sendTransaction) {
          dispatch(rejectTransactionSignature());
        }
      }
    }, 1000);
    setTimeout(() => {
      closeDappWindow(false);
      setRejecting(false);
    }, 2000);
  };

  const handleConfirm = async () => {
    await dispatch(setIsHoldFinish(true));

    if (method === DAPPEVENTS.sendTransaction) {
      // For normal transactions
      transactionObject.chainID = dappChainId;
      transactionObject.gasLimit = transactionObject.gas;
      await dispatch(
        signTransaction({
          transaction: transactionObject as EIP1559TransactionRequest,
          method: {
            type: "keyring",
          } as any,
        })
      );
    }
    closeDappWindow(true);
  };

  useEffect(() => {
    // fetch network fee values and update the totalUsd
    (async () => {
      setLoading(true);
      const gasInfoResponse = await addGas(
        Number(dappChainId),
        Number(transactionObject.gas)
      );
      dispatch(
        setNetworkFeeSettings({
          feeType: StaticStore.getState().app.networkFeeSettings.feeType,
          gasInfo: { ...gasInfoResponse },
        })
      );
      await calculateTotalUsd(gasInfoResponse);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    // will not run the first time when network fee is not updated yet
    if (totalUsd > 0) {
      (async () => {
        setLoading(true);
        await calculateTotalUsd(networkFeeSettings.gasInfo);
        setLoading(false);
      })();
    }
  }, [networkFeeSettings]);

  const calculateTotalUsd = async (gasInfoResponse: GasInfo) => {
    const chainInfo = NETWORKCHAIN[+dappChainId];
    const coingeckoId = chainInfo.NATIVE_TOKEN_COINGECKO_ID;
    const decimals = chainInfo.DECIMALS;
    const {
      market_data: { current_price },
    } = await getDetailSingleTokenInfo(coingeckoId);
    const PriceInUsd = current_price.usd.toString();
    if (PriceInUsd) {
      // incase on no value, pass 0
      const valueInUsd = transactionObject?.value
        ? convertWeiToEther(transactionObject.value as number, decimals) *
          Number(PriceInUsd)
        : 0;
      const currentGasInfo = gasInfoResponse[networkFeeSettings.feeType];
      const totalUsd = valueInUsd + currentGasInfo.usd;
      settotalUsd(totalUsd);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleReject);
    return () => window.removeEventListener("beforeunload", handleReject);
  }, []);

  return rejecting ? (
    <LoadingScreen text={`${loading ? "Connecting" : "Rejecting"} ...`} />
  ) : (
    <DappLayout
      topic={"Confirm Transaction"}
      dappName={permission?.title ?? ""}
      dappImage={permission?.faviconUrl ?? ""}
      dappLink={permission?.origin ?? ""}
      hideFooter={true}
      handleConfirm={handleConfirm}
      handleReject={handleReject}
      method={method}
      toEntityName={permission?.origin}
      toEntityImage={permission?.faviconUrl}
      onEntityName={accounts[dappAddress].name}
      containerStyle={{ padding: "15px 0px 0px 0px" }}
    >
      <TransactionFee
        dAppMode={true}
        hexData={transactionObject?.data as string}
        Title={
          <Text size={16} align="center">
            Dapp
            <br />
            Interaction
          </Text>
        }
        handleClick={handleConfirm}
        handleReject={handleReject}
        method={method}
        show={true}
        hideTransactionFeeComponent={() => {}}
        ButtonTitle={<ButtonTitle />}
        loading={loading}
        chainFamily="EVM"
        totalInUsd={totalUsd}
      />
    </DappLayout>
  );
};

export default DappTransaction;
