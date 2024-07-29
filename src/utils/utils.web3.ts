import { ethers } from "ethers";
import Common from "@ethereumjs/common";
import { Transaction as TX } from "@ethereumjs/tx";

import { CHAIN_TX, COINGECKO_ID, NODE_URL } from "utils/constants";
import { getStateFromStorage } from "./utils.storage";
import { decryptMessage } from "utils";
import { EIP1559TransactionRequest } from "background-related/networks";
import { StaticStore } from "store/store";
import { EthersRPCProvider } from "interfaces";
import { EIP712TypedData } from "background-related/types";
import { getHashedPassword } from "./utils.wallets";
const { abi } = require("abis/erc20abi.json");

export const initializeEthersWalletForDapp = async () => {
  const state = await getStateFromStorage();
  const connectedAccount = state.dappInfo.dAppConnectAddress;
  const accounts = state.newWallet.accounts;
  const hashedPassword = await getHashedPassword();
  const privateKey = decryptMessage(
    accounts[connectedAccount].secret,
    hashedPassword
  );
  return new ethers.Wallet(privateKey);
};

export const signTypedMessage = async (typedData: EIP712TypedData) => {
  const wallet = await initializeEthersWalletForDapp();
  const { EIP712Domain, ...typesForSigning } = typedData.types;
  const res = await wallet._signTypedData(
    typedData.domain,
    typesForSigning,
    typedData.message
  );
  return res || "";
};

export const signMessage = async (message: string) => {
  const wallet = await initializeEthersWalletForDapp();
  const res = await wallet.signMessage(message);
  return res || "";
};

export const sendTransaction = async (
  privateKey: string,
  transaction: any,
  //   gasInfo: GasInfo,
  callBack: (obj: any, p: any) => void,
  onTxHashReceive: (txObj: any, txHash: string) => void
) => {
  const state = await getStateFromStorage();
  const { gasInfo, feeType } = state.app.networkFeeSettings;
  const NETWORKCHAIN = state.app.NETWORKCHAIN;
  const CurrentDappChainId = state.dappInfo.dAppNetwork;
  const node =
    NETWORKCHAIN[
      Number(
        transaction?.network?.chainID ?? Number(CurrentDappChainId)
      ) as keyof typeof NETWORKCHAIN
    ][NODE_URL];
  const id =
    NETWORKCHAIN[
      Number(
        transaction?.network?.chainID ?? Number(CurrentDappChainId)
      ) as keyof typeof NETWORKCHAIN
    ][COINGECKO_ID];
  const chain: any =
    NETWORKCHAIN[
      Number(
        transaction?.network?.chainID ?? Number(CurrentDappChainId)
      ) as keyof typeof NETWORKCHAIN
    ][CHAIN_TX];

  let common;

  // const gasData = await getGasPrice(Number(transaction.network.chainID));
  if (id === "ethereum") {
    common = new Common({ chain: chain });
  } else {
    common = Common.custom(chain);
  }

  const web3 = new ethers.providers.JsonRpcProvider(node);
  const nonce = await web3.getTransactionCount(transaction.from);

  const pvtKey = Buffer.from(privateKey.split("x")[1], "hex");
  const transactionObj = {
    from: transaction.from,
    to: transaction.to,
    value: transaction.value,
    gasPrice: ethers.utils.hexlify(
      ethers.utils.parseUnits(gasInfo[feeType].gwei.toString(), "gwei")
    ),
    gasLimit: ethers.utils.hexlify(
      Number((Number(transaction.gasLimit) * 1.5).toFixed(0))
    ),
    nonce,
    data: transaction.data,
  };

  console.log("transactionObj", transactionObj);

  const tx = new TX(transactionObj, { common });

  const signedTx = tx.sign(pvtKey);

  const serializedTx = signedTx.serialize();
  const raw = "0x" + serializedTx.toString("hex");

  // ethers.js way
  const { hash: txHash } = await web3.sendTransaction(raw);

  onTxHashReceive(transactionObj, txHash);
  console.log("transactionHash", txHash);
  // const transactionHash = txHash;

  const txReceipt = await web3.waitForTransaction(txHash);
  callBack(transactionObj, txReceipt);
  return txReceipt.transactionHash;
  // return transactionHash;
};

export const getNounce = async (
  transactionRequest: EIP1559TransactionRequest
) => {
  const state = await getStateFromStorage();
  const CurrentDappChainId = state.dappInfo.dAppNetwork;
  const NETWORKCHAIN = state.app.NETWORKCHAIN;

  const node =
    NETWORKCHAIN[
      Number(
        transactionRequest?.network?.chainID ?? Number(CurrentDappChainId)
      ) as keyof typeof NETWORKCHAIN
    ][NODE_URL];

  const web3 = new ethers.providers.JsonRpcProvider(node);

  return await web3.getTransactionCount(transactionRequest.from);
};

export const initializeWalletWithAddress = async (
  address: string,
  provider?: EthersRPCProvider
) => {
  const store = StaticStore.getState();
  const allAccounts = store.newWallet.accounts;
  console.log("🚀 ~ file: utils.web3.ts:151 ~ allAccounts:", allAccounts);
  const hashedPassword = await getHashedPassword();
  const pvtKey = decryptMessage(allAccounts[address].secret, hashedPassword);
  return new ethers.Wallet(pvtKey, provider);
};

export const convertObjectToHex = (data: Record<string, unknown>) => {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify(data)));
};

/**
 * This methods converts the amount in WEI. Determine the estimated gas.
 * token decimals and its symbol using the contract
 * @returns {Object} contract - The contract instance
 * @returns {number} estimateGas - The estimated gas for the transaction
 * @returns {number} numOfDecimals - The number of decimals of the token
 * @returns {string} tokenSymbol - The symbol of the token
 */
export const initializeContractAndFetchAmount = async (
  amount: number,
  address: string,
  tokenAddress: string,
  web3: EthersRPCProvider
) => {
  const EthersWallet = await initializeWalletWithAddress(address, web3);

  const contract = new ethers.Contract(tokenAddress, abi, EthersWallet);

  const numOfDecimals = Number(await contract.decimals());

  console.log({ numOfDecimals });

  const amountInWei = ethers.utils
    .parseUnits(amount.toString(), numOfDecimals)
    .toString();
  console.log({ amountInWei });

  const estimateGas = await (
    await contract.estimateGas.transfer(address, amountInWei)
  ).toNumber();
  console.log({ estimateGas });

  return { contract, estimateGas };
};

/**
 * fetchUserNativeBalance
 *
 * Fetches the native balance of an any web3 account address
 *
 * @param {string} address - The user's  address
 * @param {Web3} web3 - EthersRPCProvider
 *
 * @returns {number} - The user's native balance
 */
export const fetchUserNAtiveBalance = async (
  address: string,
  web3: EthersRPCProvider
) => {
  const balance = await web3.getBalance(address);

  return Number(ethers.utils.formatUnits(balance));
};
