import { Transaction as TX } from "@ethereumjs/tx";

import { StaticStore } from "store/store";
import { decryptMessage } from "utils";

export const getSendTransactionRawData = async (
  data: any,
  common: any,
  address: string,
  hashedPassword: string
) => {
  const { accounts } = StaticStore.getState().newWallet;

  const privateKey = await decryptMessage(
    accounts[address].secret,
    hashedPassword
  );
  const pvtKey = Buffer.from(privateKey, "hex");
  // console.log({ privateKey, pvtKey, data });
  // console.log({ common });
  const tx = new TX(data, { common });
  const signedTx = tx.sign(pvtKey);
  // console.log({ signedTx });
  const serializedTx = signedTx.serialize();
  const raw = "0x" + serializedTx.toString("hex");
  return raw;
};
