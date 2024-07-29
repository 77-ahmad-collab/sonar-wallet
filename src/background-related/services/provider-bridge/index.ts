//@ts-nocheck

import browser, { Runtime } from "webextension-polyfill";
import {
  AllowedQueryParamPage,
  EIP1193Error,
  EIP1193_ERROR_CODES,
  EXTERNAL_PORT_NAME,
  PermissionRequest,
  PortRequestEvent,
  PortResponseEvent,
  RPCRequest,
  isTallyConfigPayload,
} from "../../../provider-bridge-shared";
import { TransactionRequest as EthersTransactionRequest } from "@ethersproject/abstract-provider";
import BaseService from "../base";
import InternalEthereumProviderService, {
  DAppRequestEvent,
} from "../internal-ethereum-provider";
import { ProviderBridgeServiceDatabase, getOrCreateDB } from "./db";
import { ServiceCreatorFunction, ServiceLifecycleEvents } from "../types";
import PreferenceService from "../preferences";
import logger from "../../lib/logger";
import {
  checkPermissionSign,
  checkPermissionSignTransaction,
  checkPermissionSignTypedData,
} from "./authorization";
import showExtensionPopup from "./show-popup";
import { HexString } from "../../types";
import { WEBSITE_ORIGIN } from "../../constants/website";
import { PermissionMap } from "./utils";
import { toHexChainID } from "../../networks";
import { DAPPEVENTS } from "utils/constants";
import { reloadDapp } from "utils/utils.dapp";
import { dispatchWithEmitter, getStateFromStorage } from "utils/utils.storage";
import {
  ISignMessageAction,
  ISignTransactionAction,
  ISwitchNetworkAction,
} from "interfaces";

type Events = ServiceLifecycleEvents & {
  requestPermission: PermissionRequest;
  initializeAllowedPages: PermissionMap;
  setClaimReferrer: string;
  setOriginEvent: DAppRequestEvent<string, void>;
  setSwitchNetworkDataEvent: DAppRequestEvent<ISwitchNetworkAction, void>;
  setDappNetworkEvent: DAppRequestEvent<string, void>;
  setRequestAccountsDataEvent: DAppRequestEvent<IRequestAccountsAction, void>;
  setMethodEvent: DAppRequestEvent<string, void>;
  setSignMessageEvent: DAppRequestEvent<ISignMessageAction, void>;
  setSignTransactionDataEvent: DAppRequestEvent<ISignTransactionAction, void>;
  setPermChangeNetworkEvent: DAppRequestEvent<"true" | "false", void>;
};

/**
 * The ProviderBridgeService is responsible for the communication with the
 * provider-bridge (content-script).
 *
 * The main purpose for this service/layer is to provide a transition
 * between the untrusted communication from the window-provider - which runs
 * in shared dapp space and can be modified by other extensions - and our
 * internal service layer.
 *
 * The responsibility of this service is 2 fold.
 * - Provide connection interface - handle port communication, connect, disconnect etc
 * - Validate the incoming communication and make sure that what we receive is what we expect
 */
export default class ProviderBridgeService extends BaseService<Events> {
  #pendingPermissionsRequests: {
    [origin: string]: (value: unknown) => void;
  } = {};

  openPorts: Array<Runtime.Port> = [];

  static create: ServiceCreatorFunction<
    Events,
    ProviderBridgeService,
    [Promise<InternalEthereumProviderService>, Promise<PreferenceService>]
  > = async (internalEthereumProviderService, preferenceService) => {
    return new this(
      await getOrCreateDB(),
      await internalEthereumProviderService,
      await preferenceService
    );
  };

  private constructor(
    private db: ProviderBridgeServiceDatabase,
    private internalEthereumProviderService: InternalEthereumProviderService,
    private preferenceService: PreferenceService
  ) {
    super();
    browser.runtime.onConnect.addListener(async (port) => {
      if (port.name === EXTERNAL_PORT_NAME && port.sender?.url) {
        port.onMessage.addListener((event) => {
          this.onMessageListener(port as Required<browser.Runtime.Port>, event);
        });
        port.onDisconnect.addListener(() => {
          this.openPorts = this.openPorts.filter(
            (openPort) => openPort !== port
          );
        });
        this.openPorts.push(port);

        // we need to send this info ASAP so it arrives before the webpage is initializing
        // so we can set our provider into the correct state, BEFORE the page has a chance to
        // to cache it, store it etc.
        port.postMessage({
          id: "tallyHo",
          jsonrpc: "2.0",
          result: {
            method: "tally_getConfig",
            defaultWallet: await this.preferenceService.getDefaultWallet(),
          },
        });
      }
      // TODO: on internal provider handlers connect, disconnect, account change, network change
    });
  }

  protected async internalStartService(): Promise<void> {
    await super.internalStartService(); // Not needed, but better to stick to the patterns

    this.emitter.emit(
      "initializeAllowedPages",
      await this.db.getAllPermission()
    );
  }

  async getAccountAddress() {
    const accountAddress = (await getStateFromStorage()).dappInfo
      .dAppConnectAddress;
    return accountAddress;
  }

  async onMessageListener(
    port: Required<browser.Runtime.Port>,
    event: PortRequestEvent
  ): Promise<void> {
    const { url, tab } = port.sender;
    if (typeof url === "undefined") {
      return;
    }

    const { origin: reduxOrigin } = (await getStateFromStorage()).dappInfo;

    const { origin } = new URL(url);
    if (!origin.includes("chrome-extension") && reduxOrigin !== origin) {
      // localStorage.setItem("origin", origin); // migrated
      await dispatchWithEmitter(this.emitter, "setOriginEvent", origin);
    }
    const completeTab =
      typeof tab !== "undefined" && typeof tab.id !== "undefined"
        ? {
            ...tab,
            // Firefox sometimes requires an extra query to get favicons,
            // unclear why but may be related to
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1417721 .
            ...(await browser.tabs.get(tab.id)),
          }
        : tab;
    const faviconUrl = completeTab?.favIconUrl ?? "";
    const title = completeTab?.title ?? "";

    const response: PortResponseEvent = {
      id: event.id,
      jsonrpc: "2.0",
      result: [],
    };

    const { chainID } =
      await this.internalEthereumProviderService.getActiveOrDefaultNetwork(
        origin
      );
    const originPermission = await this.checkPermission(origin, chainID);
    // console.log("event", event);
    if (isTallyConfigPayload(event.request)) {
      // let's start with the internal communication
      response.id = "tallyHo";
      response.result = {
        method: event.request.method,
        defaultWallet: await this.preferenceService.getDefaultWallet(),
        chainId: toHexChainID(chainID),
      };
    } else if (event.request.method === "tally_setClaimReferrer") {
      const referrer = event.request.params[0];
      if (origin !== WEBSITE_ORIGIN || typeof referrer !== "string") {
        logger.warn(`invalid 'setClaimReferrer' request`);
        return;
      }

      this.emitter.emit("setClaimReferrer", String(referrer));

      response.result = null;
    } else if (event.request.method === "eth_chainId") {
      // we need to send back the chainId independent of dApp permission if we want to be compliant with MM and web3-react
      // We are calling the `internalEthereumProviderService.routeSafeRPCRequest` directly here, because the point
      // of this exception is to provide the proper chainId for the dApp, independent from the permissions.
      // localStorage.setItem("dAppNetwork", chainID); // migrated
      response.result =
        await this.internalEthereumProviderService.routeSafeRPCRequest(
          event.request.method,
          event.request.params,
          origin
        );
    } else if (event.request.method === DAPPEVENTS.switchNetwork) {
      const permissionRequest: PermissionRequest =
        await this.prepareNewPermissionRequest(origin, faviconUrl, title);

      // localStorage.setItem("dAppNetwork", chainID); // migrated
      // localStorage.setItem("permission", JSON.stringify(permissionRequest)); // migrated
      // localStorage.setItem("method", DAPPEVENTS.switchNetwork); // migrated
      // localStorage.setItem(
      //   "dapp-method-param",
      //   JSON.stringify(event.request.params)
      // ); // migrated
      await dispatchWithEmitter(this.emitter, "setSwitchNetworkDataEvent", {
        dAppNetwork: chainID,
        permission: permissionRequest,
        method: DAPPEVENTS.switchNetwork,
        dappMethodParam: event.request.params,
      });

      const blockUntilUserAction = await this.requestNetworkChangePermission(
        origin
      );

      await blockUntilUserAction;

      const changeNetworkPerm = await this.checkChangeNetworkPermission();
      // console.log("changeNetworkPerm", changeNetworkPerm);

      if (changeNetworkPerm) {
        const res =
          await this.internalEthereumProviderService.routeSafeRPCRequest(
            event.request.method,
            event.request.params,
            origin
          );
        // console.log("network change response", res);
        response.result = res;
      } else {
        response.result = new EIP1193Error(
          EIP1193_ERROR_CODES.userRejectedRequest
        ).toJSON();
      }
    } else if (typeof originPermission !== "undefined") {
      // if it's not internal but dapp has permission to communicate we proxy the request
      // TODO: here comes format validation
      // localStorage.setItem("dAppNetwork", chainID); // migrated
      await dispatchWithEmitter(this.emitter, "setDappNetworkEvent", chainID);
      response.result = await this.routeContentScriptRPCRequest(
        originPermission,
        event.request.method,
        event.request.params,
        origin
      );
    }
    // else if (event.request.method === "wallet_addEthereumChain") {
    //   response.result =
    //     await this.internalEthereumProviderService.routeSafeRPCRequest(
    //       event.request.method,
    //       event.request.params,
    //       origin
    //     );
    // }
    else if (event.request.method === DAPPEVENTS.requestAccounts) {
      // if it's external communication AND the dApp does not have permission BUT asks for it
      // then let's ask the user what he/she thinks

      // localStorage.setItem("method", DAPPEVENTS.requestAccounts); // migrated
      const permissionRequest: PermissionRequest =
        await this.prepareNewPermissionRequest(origin, faviconUrl, title);
      // localStorage.setItem("permission", JSON.stringify(permissionRequest)); // migrated
      // localStorage.setItem("dAppNetwork", permissionRequest.chainID); // migrated
      await dispatchWithEmitter(this.emitter, "setRequestAccountsDataEvent", {
        method: DAPPEVENTS.requestAccounts,
        permission: permissionRequest,
        dAppNetwork: permissionRequest.chainID,
      });

      const blockUntilUserAction = await this.requestPermission(
        permissionRequest
      );
      await blockUntilUserAction;

      const persistedPermission = await this.checkPermission(
        origin,
        permissionRequest.chainID
      );
      // console.log("persistedPermission", persistedPermission);
      if (persistedPermission) {
        // if agrees then let's return the account data

        response.result = await this.routeContentScriptRPCRequest(
          persistedPermission,
          "eth_accounts",
          event.request.params,
          origin
        );
      } else {
        // if user does NOT agree, then reject

        response.result = new EIP1193Error(
          EIP1193_ERROR_CODES.userRejectedRequest
        ).toJSON();
      }
    } else {
      // sorry dear dApp, there is no love for you here
      response.result = new EIP1193Error(
        EIP1193_ERROR_CODES.unauthorized
      ).toJSON();
    }

    port.postMessage(response);
  }

  notifyContentScriptAboutConfigChange(newDefaultWalletValue: boolean): void {
    reloadDapp();

    // chrome.tabs.reload();
    this.openPorts.forEach((p) => {
      p.postMessage({
        id: "tallyHo",
        result: {
          method: "tally_getConfig",
          defaultWallet: newDefaultWalletValue,
          shouldReload: true,
        },
      });
    });
  }

  notifyContentScriptsAboutAddressChange(newAddress?: string): void {
    this.openPorts.forEach(async (port) => {
      // we know that url exists because it was required to store the port
      const { origin } = new URL(port.sender?.url as string);
      const { chainID } =
        await this.internalEthereumProviderService.getActiveOrDefaultNetwork(
          origin
        );
      if (await this.checkPermission(origin, chainID)) {
        port.postMessage({
          id: "tallyHo",
          result: {
            method: "tally_accountChanged",
            address: [newAddress],
          },
        });
      } else {
        port.postMessage({
          id: "tallyHo",
          result: {
            method: "tally_accountChanged",
            address: [],
          },
        });
      }
    });
  }

  async requestPermission(
    permissionRequest: PermissionRequest
  ): Promise<unknown> {
    this.emitter.emit("requestPermission", permissionRequest);
    await showExtensionPopup(AllowedQueryParamPage.dappPermission);
    return new Promise((resolve) => {
      this.#pendingPermissionsRequests[permissionRequest.origin] = resolve;
    });
  }

  async requestNetworkChangePermission(origin: string): Promise<unknown> {
    await showExtensionPopup(AllowedQueryParamPage.changeNetwork);

    return new Promise((resolve) => {
      this.#pendingPermissionsRequests[origin] = resolve;
    });
  }
  async requestSignMessagePermission(origin: string): Promise<unknown> {
    await showExtensionPopup(AllowedQueryParamPage.signData);

    return new Promise((resolve) => {
      this.#pendingPermissionsRequests[origin] = resolve;
    });
  }

  async checkChangeNetworkPermission(): boolean {
    const permission = (await getStateFromStorage()).dappInfo.permChangeNetwork;
    // console.log("mystery - check permission ", permission);
    if (permission === "true") {
      // localStorage.removeItem("perm-change-network");
      await dispatchWithEmitter(
        this.emitter,
        "setPermChangeNetworkEvent",
        "false"
      );
      return true;
    }
    return false;
  }

  async grantNetworkChangePermission(
    permission: PermissionRequest
  ): Promise<void> {
    // console.log(
    //   "mystery - givnig change network permission in provider bridge",
    //   permission
    // );
    if (this.#pendingPermissionsRequests[permission.origin]) {
      // console.log(
      //   "mystery - pendingPermissionsRequests found for this change network"
      // );
      this.#pendingPermissionsRequests[permission.origin](permission);
      delete this.#pendingPermissionsRequests[permission.origin];
    }
  }

  async rejectNetworkChangePermission(
    permission: PermissionRequest
  ): Promise<void> {
    console.log("PERMISSION", permission);
    if (permission.state !== "deny") return;
    // console.log(
    //   "mystery - givnig change network permission in provider bridge",
    //   permission
    // );
    if (this.#pendingPermissionsRequests[permission.origin]) {
      // console.log(
      //   "mystery - pendingPermissionsRequests found for this change network"
      // );
      this.#pendingPermissionsRequests[permission.origin](permission);
      delete this.#pendingPermissionsRequests[permission.origin];
    }
  }
  async grantPermission(permission: PermissionRequest): Promise<void> {
    // FIXME proper error handling if this happens - should not tho
    if (permission.state !== "allow" || !permission.accountAddress) return;

    await this.db.setPermission(permission);

    if (this.#pendingPermissionsRequests[permission.origin]) {
      this.#pendingPermissionsRequests[permission.origin](permission);
      delete this.#pendingPermissionsRequests[permission.origin];
    }
  }

  async denyOrRevokePermission(permission: PermissionRequest): Promise<void> {
    // FIXME proper error handling if this happens - should not tho
    if (permission.state !== "deny" || !permission.accountAddress) {
      return;
    }

    // TODO make this multi-network friendly
    await this.db.deletePermission(
      permission.origin,
      permission.accountAddress,
      permission.chainID
    );

    if (this.#pendingPermissionsRequests[permission.origin]) {
      this.#pendingPermissionsRequests[permission.origin]("Time to move on");
      delete this.#pendingPermissionsRequests[permission.origin];
    }

    this.notifyContentScriptsAboutAddressChange();
  }

  async checkPermission(
    origin: string,
    chainID: string
  ): Promise<PermissionRequest | undefined> {
    const currentAddress = await this.getAccountAddress();
    if (currentAddress) {
      return this.db.checkPermission(origin, currentAddress, chainID);
    }
    // TODO make this multi-network friendly
  }

  async routeSafeRequest(
    method: string,
    params: unknown[],
    origin: string,
    popupPromise: Promise<browser.Windows.Window>
  ): Promise<unknown> {
    const response = await this.internalEthereumProviderService
      .routeSafeRPCRequest(method, params, origin)
      .finally(async () => {
        // Close the popup once we're done submitting.
        const popup = await popupPromise;
        if (typeof popup.id !== "undefined") {
          browser.windows.remove(popup.id);
        }
      });
    return response;
  }

  async routeContentScriptRPCRequest(
    enablingPermission: PermissionRequest,
    method: string,
    params: RPCRequest["params"],
    origin: string
  ): Promise<unknown> {
    try {
      switch (method) {
        case DAPPEVENTS.requestAccounts:
        case "eth_accounts":
          return [enablingPermission.accountAddress];
        case "eth_signTypedData":
        case "eth_signTypedData_v1":
        case "eth_signTypedData_v3":
        case DAPPEVENTS.approval:
          // localStorage.setItem("method", "eth_signTypedData_v4"); // migrated
          await dispatchWithEmitter(
            this.emitter,
            "setMethodEvent",
            "eth_signTypedData_v4"
          );
          checkPermissionSignTypedData(
            params[0] as HexString,
            enablingPermission
          );

          return await this.routeSafeRequest(
            method,
            params,
            origin,
            showExtensionPopup(AllowedQueryParamPage.approve)
          );
        case "eth_sign":
          checkPermissionSign(params[0] as HexString, enablingPermission);
          return await this.routeSafeRequest(
            method,
            params,
            origin,
            showExtensionPopup(AllowedQueryParamPage.signTransaction)
          );
        case DAPPEVENTS.signMessage:
          // localStorage.setItem(
          //   "permission",
          //   JSON.stringify(enablingPermission)
          // ); // migrated
          // localStorage.setItem("method", DAPPEVENTS.signMessage); // migrated
          await dispatchWithEmitter(this.emitter, "setSignMessageEvent", {
            permission: enablingPermission,
            method: DAPPEVENTS.signMessage,
          });
          checkPermissionSign(params[1] as HexString, enablingPermission);

          return await this.routeSafeRequest(
            method,
            params,
            origin,
            showExtensionPopup(AllowedQueryParamPage.personalSignData)
          );
        case "eth_signTransaction":
        case DAPPEVENTS.sendTransaction:
          // localStorage.setItem(
          //   "permission",
          //   JSON.stringify(enablingPermission)
          // ); // migrated
          // localStorage.setItem("method", DAPPEVENTS.sendTransaction); // migrated
          // localStorage.setItem("transactionObject", JSON.stringify(params[0])); // migrated
          await dispatchWithEmitter(
            this.emitter,
            "setSignTransactionDataEvent",
            {
              permission: enablingPermission,
              method: DAPPEVENTS.sendTransaction,
              transactionObject: params[0],
            }
          );
          checkPermissionSignTransaction(
            params[0] as EthersTransactionRequest,
            enablingPermission
          );

          return await this.routeSafeRequest(
            method,
            params,
            origin,
            showExtensionPopup(AllowedQueryParamPage.signTransaction)
          );

        default: {
          return await this.internalEthereumProviderService.routeSafeRPCRequest(
            method,
            params,
            origin
          );
        }
      }
    } catch (error) {
      logger.log("error processing request", error);
      return new EIP1193Error(EIP1193_ERROR_CODES.userRejectedRequest).toJSON();
    }
  }

  async prepareNewPermissionRequest(
    origin: string,
    faviconUrl: string,
    title: string
  ): PermissionRequest {
    // const prevPermission = JSON.parse(localStorage.getItem("permission"));
    const dAppChainID = Number(
      (await this.internalEthereumProviderService.routeSafeRPCRequest(
        "eth_chainId",
        [],
        origin
      )) as string
    ).toString();
    return {
      origin,
      chainID: dAppChainID,
      faviconUrl,
      title,
      state: "request",
      // another field added to keep track of current account address
      // accountAddress: prevPermission.accountAddress,
    };
  }
}
