import {
  InValidAccessKeyError,
  NoPuiblicKeyError,
  Transaction,
  TransformedTransaction,
  getConfig,
  transformTransactions,
} from "@ref-finance/ref-sdk";
import {
  InMemorySigner,
  KeyPair,
  keyStores,
  transactions as nearTransactions,
  providers,
  utils,
} from "near-api-js";
import BN from "bn.js";
import { AccessKeyView } from "near-api-js/lib/providers/provider";

import { StaticStore } from "store/store";
import { decryptMessage } from "utils";
import CachedService from "classes/cachedService";

export const provider = new providers.JsonRpcProvider({
  url: getConfig().nodeUrl,
});

export const validateAccessKey = (
  transaction: TransformedTransaction,
  accessKey: AccessKeyView
) => {
  if (accessKey.permission === "FullAccess") {
    return accessKey;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { receiver_id, method_names } = accessKey.permission.FunctionCall;

  if (transaction.receiverId !== receiver_id) {
    return null;
  }

  return transaction.actions.every((action) => {
    if (action.type !== "FunctionCall") {
      return false;
    }

    const { methodName, deposit } = action.params;

    if (method_names.length && method_names.includes(methodName)) {
      return false;
    }

    return parseFloat(deposit) <= 0;
  });
};

export const getMemorySignerInner = async ({
  AccountId,
}: {
  AccountId: string;
}) => {
  const { accounts } = StaticStore.getState().newWallet;
  const hashedPassword = CachedService.getHashedPassword();

  const private_key = decryptMessage(
    accounts[AccountId].secret,
    hashedPassword
  );

  const myKeyStore = new keyStores.InMemoryKeyStore();
  myKeyStore.setKey(
    getConfig().networkId,
    AccountId,
    KeyPair.fromString(private_key)
  );

  const signer = new InMemorySigner(myKeyStore);

  return signer;
};

export const getSignedTransactionsByMemoryKeyInner = async ({
  transactionsRef,
  AccountId,
}: {
  transactionsRef: Transaction[];
  AccountId: string;
}) => {
  const transactions = transformTransactions(transactionsRef, AccountId);

  const block = await provider.block({ finality: "final" });

  const signedTransactions: Array<nearTransactions.SignedTransaction> = [];
  const signer = await getMemorySignerInner({
    AccountId,
  });

  for (let i = 0; i < transactions.length; i += 1) {
    const transaction = transactions[i];

    const publicKey = await signer.getPublicKey(
      AccountId,
      getConfig().networkId
    );
    if (!publicKey) {
      throw NoPuiblicKeyError;
    }

    const accessKey = await provider.query<AccessKeyView>({
      request_type: "view_access_key",
      finality: "final",
      account_id: AccountId,
      public_key: publicKey.toString(),
    });

    if (!validateAccessKey(transaction, accessKey)) {
      throw InValidAccessKeyError;
    }

    const tx = nearTransactions.createTransaction(
      AccountId,
      utils.PublicKey.from(publicKey.toString()),
      transactions[i].receiverId,
      accessKey.nonce + i + 1,
      transaction.actions.map((action) => {
        const { methodName, args, gas, deposit } = action.params;
        return nearTransactions.functionCall(
          methodName,
          args,
          new BN(gas),
          new BN(deposit)
        );
      }),
      utils.serialize.base_decode(block.header.hash)
    );

    const [, signedTx] = await nearTransactions.signTransaction(
      tx,
      signer,
      transactions[i].signerId,
      getConfig().networkId
    );
    signedTransactions.push(signedTx);
  }

  return signedTransactions;
};
