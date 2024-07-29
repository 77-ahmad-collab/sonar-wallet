import { createSelector } from "@reduxjs/toolkit";

import { selectCurrentNetwork } from ".";
import { NetworksState } from "../networks";
import {
  NetworkFeeSettings,
  TransactionConstruction,
} from "../transaction-construction";

export const selectDefaultNetworkFeeSettings = createSelector(
  (state: { transactionConstruction: TransactionConstruction }) =>
    state.transactionConstruction,
  (state: { networks: NetworksState }) => state.networks,
  selectCurrentNetwork,
  (transactionConstruction, networks, currentNetwork): NetworkFeeSettings => {
    const selectedFeesPerGas =
      transactionConstruction.estimatedFeesPerGas?.[currentNetwork.chainID]?.[
        transactionConstruction.feeTypeSelected
      ] ?? transactionConstruction.customFeesPerGas;
    return {
      feeType: transactionConstruction.feeTypeSelected,
      gasLimit: undefined,
      suggestedGasLimit: transactionConstruction.transactionRequest?.gasLimit,
      values: {
        maxFeePerGas: selectedFeesPerGas?.maxFeePerGas ?? 0n,
        maxPriorityFeePerGas: selectedFeesPerGas?.maxPriorityFeePerGas ?? 0n,
        baseFeePerGas:
          networks.evm[currentNetwork.chainID].baseFeePerGas ?? undefined, // @TODO: Support multi-network
      },
    };
  }
);
