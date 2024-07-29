import { StatusCodes, TransportStatusError } from "@ledgerhq/errors";
import KeyringService, { KeyringAccountSigner } from "../keyring";

import {
  EIP1559TransactionRequest,
  SignedEVMTransaction,
} from "../../networks";
import { EIP712TypedData, HexString } from "../../types";
import BaseService from "../base";
import { ServiceCreatorFunction, ServiceLifecycleEvents } from "../types";
import ChainService from "../chain";
import { AddressOnNetwork } from "../../accounts";
import { assertUnreachable } from "../../lib/utils/type-guards";
import { signTypedMessage } from "utils/utils.web3";

type SigningErrorReason = "userRejected" | "genericError";
type ErrorResponse = {
  type: "error";
  reason: SigningErrorReason;
};

export type TXSignatureResponse =
  | {
      type: "success-tx";
      signedTx: SignedEVMTransaction;
    }
  | ErrorResponse;

export type SignatureResponse =
  | {
      type: "success-data";
      signedData: string;
    }
  | ErrorResponse;

type Events = ServiceLifecycleEvents & {
  signingTxResponse: TXSignatureResponse;
  signingDataResponse: SignatureResponse;
  personalSigningResponse: SignatureResponse;
};

/**
 * An AccountSigner that represents a read-only account. Read-only accounts
 * generally cannot sign.
 */
export const ReadOnlyAccountSigner = { type: "read-only" } as const;

/**
 * An AccountSigner carries the appropriate information for a given signer to
 * act on a signing request. The `type` field always carries the signer type,
 * but the rest of the object is signer-specific and should be treated as
 * opaque outside of the specific signer's service.
 */
export type AccountSigner = typeof ReadOnlyAccountSigner | KeyringAccountSigner;

export type SignerType = AccountSigner["type"];

type AddressHandler = {
  address: string;
  signer: SignerType;
};

function getSigningErrorReason(err: unknown): SigningErrorReason {
  if (err instanceof TransportStatusError) {
    const transportError = err as Error & { statusCode: number };
    switch (transportError.statusCode) {
      case StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED:
        return "userRejected";
      default:
    }
  }

  return "genericError";
}

/**
 * The SigningService is intended hide and demultiplex of accesses
 * to concrete signer implementations.
 *
 * It also emits all the abstract signing-related event to subscribers
 * grabbing this responsibility from each different implementation.
 *
 */
export default class SigningService extends BaseService<Events> {
  addressHandlers: AddressHandler[] = [];

  static create: ServiceCreatorFunction<
    Events,
    SigningService,
    [Promise<KeyringService>, Promise<ChainService>]
  > = async (keyringService, chainService) => {
    return new this(await keyringService, await chainService);
  };

  private constructor(
    private keyringService: KeyringService,
    private chainService: ChainService
  ) {
    super();
  }

  protected async internalStartService(): Promise<void> {
    await super.internalStartService(); // Not needed, but better to stick to the patterns
  }

  async deriveAddress(signerID: AccountSigner): Promise<HexString> {
    if (signerID.type === "keyring") {
      return this.keyringService.deriveAddress(signerID);
    }

    throw new Error(`Unknown signerID: ${signerID}`);
  }

  private async signTransactionWithNonce(
    transactionWithNonce: EIP1559TransactionRequest & { nonce: number },
    accountSigner: AccountSigner
  ): Promise<SignedEVMTransaction> {
    // console.log("accountSigner", accountSigner);
    switch (accountSigner.type) {
      case "keyring":
        return this.keyringService.signTransaction(
          {
            address: transactionWithNonce.from,
            network: transactionWithNonce.network,
          },
          transactionWithNonce
        );
      case "read-only":
        throw new Error("Read-only signers cannot sign.");
      default:
        //@ts-ignore
        return assertUnreachable(accountSigner);
    }
  }

  async removeAccount(
    address: HexString,
    signerType?: SignerType
  ): Promise<void> {
    if (signerType) {
      switch (signerType) {
        case "keyring":
          await this.keyringService.hideAccount(address);
          break;
        case "read-only":
          break; // no additional work here, just account removal below
        default:
          //@ts-ignore
          assertUnreachable(signerType);
      }
    }
    await this.chainService.removeAccountToTrack(address);
  }

  async signTransaction(
    transactionRequest: EIP1559TransactionRequest,
    accountSigner: AccountSigner
  ): Promise<SignedEVMTransaction> {
    const transactionWithNonce =
      await this.chainService.populateEVMTransactionNonce(transactionRequest);

    // console.log("transactionWithNonce", transactionWithNonce);

    try {
      const signedTx = await this.signTransactionWithNonce(
        transactionWithNonce,
        accountSigner
      );

      this.emitter.emit("signingTxResponse", {
        type: "success-tx",
        signedTx,
      });

      return signedTx;
    } catch (err) {
      this.emitter.emit("signingTxResponse", {
        type: "error",
        reason: getSigningErrorReason(err),
      });

      this.chainService.releaseEVMTransactionNonce(transactionWithNonce);

      throw err;
    }
  }

  addTrackedAddress(address: string, handler: SignerType): void {
    this.addressHandlers.push({ address, signer: handler });
  }

  async signTypedData({
    typedData,
    account,
    accountSigner,
  }: {
    typedData: EIP712TypedData;
    account: AddressOnNetwork;
    accountSigner: AccountSigner;
  }): Promise<string> {
    try {
      if (account) {
        const signedData = await signTypedMessage(typedData);
        // console.log("signedDataaaaaaaaaaa", signedData);

        this.emitter.emit("signingDataResponse", {
          type: "success-data",
          signedData: signedData,
        });

        return signedData;
      }

      return "";
    } catch (err) {
      this.emitter.emit("signingDataResponse", {
        type: "error",
        reason: getSigningErrorReason(err),
      });

      throw err;
    }
  }

  async signData(
    addressOnNetwork: AddressOnNetwork,
    message: string,
    accountSigner: AccountSigner
  ): Promise<string> {
    this.signData = this.signData.bind(this);
    try {
      let signedData;
      switch (accountSigner.type) {
        case "keyring":
          signedData = await this.keyringService.personalSign({
            signingData: message,
          });
          break;
        case "read-only":
          throw new Error("Read-only signers cannot sign.");
        default:
          //@ts-ignore
          assertUnreachable(accountSigner);
      }

      this.emitter.emit("personalSigningResponse", {
        type: "success-data",
        signedData,
      });
      return signedData;
    } catch (err) {
      if (err instanceof TransportStatusError) {
        const transportError = err as Error & { statusCode: number };
        switch (transportError.statusCode) {
          case StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED:
            this.emitter.emit("personalSigningResponse", {
              type: "error",
              reason: "userRejected",
            });
            throw err;
          default:
            break;
        }
      }
      this.emitter.emit("personalSigningResponse", {
        type: "error",
        reason: "genericError",
      });
      throw err;
    }
  }
}
