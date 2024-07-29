//@ts-nocheck

import { createSlice } from "@reduxjs/toolkit";
import Emittery from "emittery";
import { PermissionRequest } from "../provider-bridge-shared";
import { createBackgroundAsyncThunk } from "./utils";
import { keyPermissionsByChainIdAddressOrigin } from "../background-related/services/provider-bridge/utils";
import {
  // ROPSTEN,
  // RINKEBY,
  AVAX,
  AVAXT,
  Aurora,
  BSC,
  BSCT,
  Cronos,
  // CronosT,
  ETHEREUM,
  Fantom,
  FantomTestnet,
  GOERLI,
  Mumbai,
  POLYGON,
} from "../background-related/constants";
import { SUPPORT_POLYGON } from "../background-related/features";

export type DAppPermissionState = {
  permissionRequests: { [origin: string]: PermissionRequest };
  allowed: {
    evm: {
      // @TODO Re-key by origin-chainID-address
      [chainID: string]: {
        [address: string]: {
          [origin: string]: PermissionRequest;
        };
      };
    };
  };
};

export const initialState: DAppPermissionState = {
  permissionRequests: {},
  allowed: { evm: {} },
};

export type Events = {
  requestPermission: PermissionRequest;
  grantPermission: PermissionRequest;
  denyOrRevokePermission: PermissionRequest;
  grantChangeNetworkPermission: PermissionRequest;
  rejectChangeNetworkPermission: PermissionRequest;
};

export const emitter = new Emittery<Events>();

// Async thunk to bubble the permissionGrant action from  store to emitter.
export const grantPermission = createBackgroundAsyncThunk(
  "dapp-permission/permissionGrant",
  async (permission: PermissionRequest) => {
    // console.log("GRANT PERMISSION", permission);
    emitter.emit("grantPermission", {
      ...permission,
    });
    return permission;
  }
);

export const grantChangeNetworkPermission = createBackgroundAsyncThunk(
  "dapp-permission/networkPermissionGrant",
  async (permission: PermissionRequest) => {
    // console.log(
    //   "mystery - granting permission to change network in store/dapp.ts",
    //   permission
    // );
    emitter.emit("grantChangeNetworkPermission", {
      ...permission,
    });
    return permission;
  }
);

export const rejectChangeNetworkPermission = createBackgroundAsyncThunk(
  "dapp-permission/networkPermissionReject",
  async (permission: PermissionRequest) => {
    // console.log(
    //   "mystery - granting permission to change network in store/dapp.ts",
    //   permission
    // );
    emitter.emit("rejectChangeNetworkPermission", {
      ...permission,
    });
    return permission;
  }
);
// Async thunk to bubble the permissionDenyOrRevoke action from  store to emitter.
export const denyOrRevokePermission = createBackgroundAsyncThunk(
  "dapp-permission/permissionDenyOrRevoke",
  async (permission: PermissionRequest) => {
    await emitter.emit("denyOrRevokePermission", permission);
    return permission;
  }
);

const dappSlice = createSlice({
  name: "dapp-permission",
  initialState,
  reducers: {
    initializePermissions: (
      immerState,
      {
        payload: allowed,
      }: {
        payload: {
          evm: {
            [chainID: string]: {
              [address: string]: {
                [origin: string]: PermissionRequest;
              };
            };
          };
        };
      }
    ) => {
      immerState.allowed = allowed;
    },
    requestPermission: (
      state,
      { payload: request }: { payload: PermissionRequest }
    ) => {
      if (state.permissionRequests[request.origin]?.state !== "allow") {
        return {
          ...state,
          permissionRequests: {
            // Quick fix: store only the latest permission request.
            // TODO: put this back when we fixed the performance issues and/or updated our UI to handle multiple requests
            // ...state.permissionRequests,
            [request.origin]: { ...request },
          },
        };
      }

      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        grantPermission.fulfilled,
        (
          immerState,
          { payload: permission }: { payload: PermissionRequest }
        ) => {
          const updatedPermissionRequests = {
            ...immerState.permissionRequests,
          };
          delete updatedPermissionRequests[permission.origin];

          // Support Both networks regardless of which one initiated grant request
          const permissions = [
            // ROPSTEN,
            // RINKEBY,
            GOERLI,
            ETHEREUM,
            POLYGON,
            AVAX,
            AVAXT,
            BSC,
            BSCT,
            Fantom,
            FantomTestnet,
            Mumbai,
            Cronos,
            // CronosT,
            Aurora,
          ].map((network) => ({
            ...permission,
            chainID: network.chainID,
          }));

          const allowedPermission = keyPermissionsByChainIdAddressOrigin(
            SUPPORT_POLYGON ? permissions : [permission],
            immerState.allowed
          );

          immerState.allowed = allowedPermission;
        }
      )
      .addCase(
        denyOrRevokePermission.fulfilled,
        (
          immerState,
          { payload: permission }: { payload: PermissionRequest }
        ) => {
          const updatedPermissionRequests = {
            ...immerState.permissionRequests,
          };
          delete updatedPermissionRequests[permission.origin];
          [
            // ROPSTEN,
            // RINKEBY,
            GOERLI,
            ETHEREUM,
            POLYGON,
            AVAX,
            AVAXT,
            BSC,
            BSCT,
            Fantom,
            FantomTestnet,
            Mumbai,
            Cronos,
            // CronosT,
            Aurora,
          ].forEach((network) => {
            if (
              immerState.allowed.evm[network.chainID]?.[
                permission.accountAddress
              ]
            ) {
              const { [permission.origin]: _, ...withoutOriginToRemove } =
                immerState.allowed.evm[network.chainID][
                  permission.accountAddress
                ];
              immerState.allowed.evm[network.chainID][
                permission.accountAddress
              ] = withoutOriginToRemove;
            }
          });
        }
      );
  },
});

export const { requestPermission, initializePermissions } = dappSlice.actions;

export default dappSlice.reducer;
