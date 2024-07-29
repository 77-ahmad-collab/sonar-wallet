import { TransformedTransaction } from "@ref-finance/ref-sdk";
import { AccessKeyView } from "near-api-js/lib/providers/provider";

const transaction: TransformedTransaction = {
  actions: [],
  receiverId: "receiver_id",
  signerId: "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d",
};

const accessKey: AccessKeyView = {
  permission: "FullAccess",
  nonce: 0,
  block_height: 0,
  block_hash: "",
};

const accessKey2: AccessKeyView = {
  permission: {
    FunctionCall: {
      receiver_id: "different_receiver_id",
      method_names: [],
      allowance: "11",
    },
  },
  nonce: 0,
  block_height: 0,
  block_hash: "",
};

const transaction3: TransformedTransaction = {
  actions: [
    {
      type: "Transfer",
      params: {
        methodName: "method_name",
        deposit: "0",
        args: {},
        gas: "11",
      },
    },
  ],
  receiverId: "receiver_id",
  signerId: "",
};

const accessKey3: AccessKeyView = {
  permission: {
    FunctionCall: {
      receiver_id: "receiver_id",
      method_names: [],
      allowance: "11",
    },
  },
  nonce: 0,
  block_height: 0,
  block_hash: "",
};

const transaction4: TransformedTransaction = {
  actions: [
    {
      type: "FunctionCall",
      params: {
        methodName: "method_name",
        deposit: "0",
        args: {},
        gas: "11",
      },
    },
  ],
  receiverId: "receiver_id",
  signerId: "",
};

const accessKey4: AccessKeyView = {
  permission: {
    FunctionCall: {
      receiver_id: "receiver_id",
      method_names: ["method_name"],
      allowance: "11",
    },
  },
  nonce: 0,
  block_height: 0,
  block_hash: "",
};

const transaction5: TransformedTransaction = {
  actions: [
    {
      type: "FunctionCall",
      params: {
        methodName: "method_name",
        deposit: "0",
        args: {},
        gas: "11",
      },
    },
  ],
  receiverId: "receiver_id",
  signerId: "",
};

const accessKey5: AccessKeyView = {
  permission: {
    FunctionCall: {
      receiver_id: "receiver_id",
      method_names: ["different_method_name"],
      allowance: "11",
    },
  },
  nonce: 0,
  block_height: 0,
  block_hash: "",
};

export {
  accessKey,
  transaction,
  accessKey2,
  accessKey3,
  transaction3,
  transaction4,
  accessKey4,
  transaction5,
  accessKey5,
};
