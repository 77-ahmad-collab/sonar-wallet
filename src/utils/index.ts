import axios from "axios";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { parseUnits } from "ethers/lib/utils";
import { Connection } from "@solana/web3.js";
import crypto from "crypto-js";

import { SupportedChainId } from "./constants";
import { StaticStore } from "store/store";
import {
  Activity,
  SecondaryHoldings,
  SwapTransactionData,
  TransactionData,
} from "interfaces";
import { setNonNativeDefault, setRpcUrl } from "@slices/appSlice";
import { BASE_URL } from "api";

export const convertWeiToEther = (wei: number, decimals: number) =>
  parseFloat((wei / 10 ** decimals).toString());

export const convertEtherToWei = (ether: number, decimals: number) =>
  parseInt((ether * 10 ** decimals).toString());

/**
 * gets the token's number of decimals from token's contract and convert it
 * into it's lowest possible unit.
 * @param contract any token ERC20
 * @param value type number
 */
export const convertBalanceToBaseUnit = async (
  contract: ethers.Contract,
  value: number
) => {
  const numOfDecimals = Number(await contract.decimals());
  const amount = parseUnits(
    new BigNumber(value).toFixed(numOfDecimals),
    numOfDecimals
  );
  return amount.toString();
};

export const arraysAreIdentical = (array1: string[], array2: string[]) => {
  let isIdentical = false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] === array2[i]) {
      isIdentical = true;
    } else {
      isIdentical = false;
      break;
    }
  }

  return isIdentical;
};

/**
 * This function is used to shuffle the mnemonic array of seedPhrase words in to some random order.
 * @param array: string[]
 *
 * @returns array -> shuffled array of mnemonic
 */
export const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(getRandomNumber() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

/**
 * uses a safe random number generator to generate a complete random number
 */
export const getRandomNumber = () => {
  const globalObjet = window ?? self;
  const cryptoFunction = globalObjet.crypto;
  let randomNumber: number;
  if (cryptoFunction) {
    randomNumber =
      cryptoFunction.getRandomValues(new Uint16Array(1))[0] / 65536;
  } else {
    randomNumber = Math.random();
  }
  return randomNumber;
};

/**
 * checks if pressed key is either enter or backspace or special character or alphanumeric character
 * @param e type KeyboardEvent
 * @param currentStep type number
 * @param stepNumber type number
 * @param onEnterPress type () => void
 * @param onBackSpacePress type () => void
 * @param onValidKeyPress type (key: string) => void
 * @param thisPassword type string
 * @param thisConfirmPassword type string
 */
export const keyDownListener = (
  e: KeyboardEvent,
  currentStep: number,
  stepNumber: number,
  onEnterPress: () => void,
  onBackSpacePress: () => void,
  onValidKeyPress: (key: string) => void,
  thisPassword?: string,
  thisConfirmPassword?: string
) => {
  if (currentStep === stepNumber) {
    if (e.code === "Tab") {
      e.preventDefault();
    } else if (
      e.code === "Enter" &&
      (currentStep === 3
        ? thisPassword === thisConfirmPassword
          ? true
          : false
        : true)
    ) {
      onEnterPress();
      return;
    }
    if (
      e.code === "NumpadEnter" &&
      (currentStep === 3
        ? thisPassword === thisConfirmPassword
          ? true
          : false
        : true)
    ) {
      onEnterPress();
      return;
    }
    if (e.code === "Backspace") {
      onBackSpacePress();
      return;
    }
    // eslint-disable-next-line
    const SpecialChars = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/); //check for special character
    // eslint-disable-next-line
    const AlphanumericChars = new RegExp(/^[a-zA-Z0-9]*$/); //check for alphanumeric character
    if (
      e.key.length === 1 &&
      (SpecialChars.test(e.key) || AlphanumericChars.test(e.key))
    ) {
      onValidKeyPress(e.key);
    }
  }
};

/**
 * encrypt any given message using AES algorithm
 * @param message type string
 * @param secret type string
 */
export const encryptMessage = (message: string, secret: string) => {
  const ciphertext = crypto.AES.encrypt(
    JSON.stringify(message),
    secret
  ).toString();

  return ciphertext;
};

/**
 * decrypt any given message using AES algorithm and secret.
 * will throw error if the secret key is wrong.
 * @param cipherText type string
 * @param secret type string
 */
export const decryptMessage = (cipherText: string, secret: string) => {
  const bytes = crypto.AES.decrypt(cipherText, secret);
  const decryptedText = JSON.parse(bytes.toString(crypto.enc.Utf8));

  return decryptedText;
};

export const isStringIncludesTheValue = (item: string, value: string) =>
  item.toLowerCase().includes(value.toLowerCase());

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function truncateName(name: string): string {
  if (!name) return "";
  if (name.length > 8) return `${name.slice(0, 8)}...`;
  else return name;
}

/**
 * get the latest copied data from clipboard
 * @param inputId string
 */
export const getDataFromClipboard = (inputId: string) => {
  // THIS WILL WORK ONLY IN BUILD

  const inputActiveState =
    document.getElementById(inputId) === document.activeElement;
  // create a new input element
  const t = document.createElement("input");
  t.style.position = "absolute";
  t.style.top = "0";
  // append this element inside body
  document.body.appendChild(t);
  // focus the input element
  t.focus({ preventScroll: true });
  // execute the paste command to paste the last copied text inside it
  if (document.execCommand) document.execCommand("paste");
  // if any previous input was active then bring the focus back to that input
  if (inputActiveState) {
    document.getElementById(inputId)?.focus({ preventScroll: true });
  }
  const text = t.value;
  // remove the newly created input field
  document.body.removeChild(t);
  return text;

  // THIS WILL WORK ONLY IN DEV

  // try {
  //   const text = await navigator.clipboard.readText();
  //   return text;
  // } catch (error) {
  //   console.log("clipboard error", error);
  //   return "";
  // }
};

export const matchAddresses = (address1: string, address2: string) =>
  address1?.toLowerCase() === address2?.toLowerCase();

export const checkSum = (address: string) => {
  if (!address) return address;
  if (!ethers.utils.isAddress(address)) return address;
  return ethers.utils.getAddress(address);
};

/**
 * get intialized solana connection based on mainnet or testnet
 * @param isMainnet type boolean
 */
export const getSolanaConnection = (isMainnet: boolean) => {
  const NETWORKCHAIN = StaticStore.getState().app.NETWORKCHAIN;
  const rpc = isMainnet
    ? NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET].NODE_URL
    : NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET].NODE_URL;

  const socket = isMainnet
    ? NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET].SOCKET_URL
    : NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET].SOCKET_URL;
  return new Connection(rpc, {
    commitment: "confirmed",
    wsEndpoint: socket,
  });
};

export const getSolanaConnectionForTransaction = (isMainnet: boolean) => {
  const NETWORKCHAIN = StaticStore.getState().app.NETWORKCHAIN;
  const rpc = isMainnet
    ? NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET].SECONDARY_RPC // rpc needs to be chnaged
    : NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET].SECONDARY_RPC; // rpc needs to be chnaged

  const socket = isMainnet
    ? NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET].SOCKET_URL
    : NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET].SOCKET_URL;
  return new Connection(rpc, {
    commitment: "confirmed",
    wsEndpoint: socket,
  });
};

export const getNameFromAddressBook = (address: string) => {
  const addressBook = StaticStore.getState().app.addressBook;
  let name = "";
  Object.keys(addressBook).forEach((value) => {
    if (value === address) name = addressBook[value].name;
  });
  return name;
};

//------------------------------------------Function to merge new activity item and old activity

/**
 * This function is responsible to merge new activity item and old activity.
 * @param transactionData  TransactionData | SwapTransactionData
 * @param previousTransactionActivityData Activity
 *
 * @returns newTransactionActivity -> returns updated activity object
 */
export const mergeNewAndOldActivityData = ({
  transactionData,

  previousTransactionActivityData,
}: {
  transactionData: TransactionData | SwapTransactionData;

  previousTransactionActivityData: Activity;
}) => {
  const { address } = transactionData;
  let newTransactionActivity = previousTransactionActivityData;
  const isSameAddressActivityExist = previousTransactionActivityData?.[address];
  const isSameChainIdActivityExist =
    previousTransactionActivityData?.[address]?.[transactionData.chainId];
  newTransactionActivity = {
    ...newTransactionActivity,
    [address]: {
      ...(isSameAddressActivityExist ? newTransactionActivity[address] : {}),
      [transactionData.chainId]: {
        ...(isSameChainIdActivityExist
          ? newTransactionActivity[address][transactionData.chainId]
          : {}),
        [transactionData.transactionHash]: transactionData,
      },
    },
  };
  return newTransactionActivity;
};

export const checkIfMobile = () =>
  navigator.userAgent.toLowerCase().includes("mobile");

const getRandomNumberInRange = (randomNumberLimit: number) => {
  return Math.floor(Math.random() * randomNumberLimit);
};

export const changeRpcFromTheList = () => {
  const { rpcsList } = StaticStore.getState().app;
  const supportedChainIds = Object.keys(rpcsList);

  supportedChainIds.forEach((chainId) => {
    const rpcsUrl = rpcsList[+chainId].rpcUrl;
    const randomIndex = getRandomNumberInRange(rpcsUrl.length);
    const randomRpc = rpcsUrl[randomIndex];

    // now you should dispatch that rpc
    StaticStore.dispatch(setRpcUrl({ chainId, url: randomRpc }));
  });
};

export const getTopTokenList = async () => {
  const expiry = StaticStore.getState().app.nonNativeDefaultAndTopTokens.expiry;
  if (new Date().getTime() > expiry) {
    const request = await axios.get(`${BASE_URL}/tokens/top/list`);
    const data = request.data;
    StaticStore.dispatch(setNonNativeDefault(data));
  }
};

// export const convertDefaultTokensInToSecondaryHoldings = () => {
//   let defaultTokens: SecondaryHoldings = {};
//   const {
//     app: {
//       NETWORKCHAIN,
//       nonNativeDefaultAndTopTokens: { tokens },
//     },
//     newWallet: { tokenInfo, secondaryHoldings },
//   } = StaticStore.getState();

//   const copy = { ...secondaryHoldings };
//   Object.assign(defaultTokens, copy);

//   Object.keys(tokens).forEach((address) => {
//     const value = tokens[address];
//     const checkSumAddress = checkSum(value.address);
//     const balance = 0;
//     const rawBalance = "0";
//     const balanceInUsd = 0;

//     if (
//       defaultTokens[value.chainId as keyof typeof defaultTokens] !== undefined
//     ) {
//       defaultTokens = {
//         ...defaultTokens,
//         [value.chainId]: {
//           ...defaultTokens[value.chainId],
//           tokens: {
//             ...defaultTokens[value.chainId].tokens,
//             [`${
//               value.name
//             }_${checkSumAddress}_${value.symbol.toLocaleUpperCase()}`]: {
//               address: checkSumAddress,
//               name: value.name,
//               symbol: value.symbol,
//               decimals: value.decimals,
//               image: value.image,
//               balance,
//               rawBalance,
//               balanceInUsd,
//               isActive:
//                 tokenInfo?.[`${checkSumAddress}_${value.symbol}`]?.isActive ||
//                 false,
//               accounts: {
//                 ["0x2c34f78650239F446Fe128DdF35F5cD8Ad1d115f"]: {
//                   name: "",
//                   balance,
//                   rawBalance,
//                   balanceInUsd,
//                   walletName: "",
//                 },
//               },
//             },
//           },
//         },
//       };
//     } else {
//       defaultTokens = {
//         [value.chainId]: {
//           name: NETWORKCHAIN[value.chainId].NAME,
//           image: NETWORKCHAIN[value.chainId].LOGO,
//           balanceInUsd: 0,
//           tokens: {
//             [`${value.name}_${checkSumAddress}_${value.symbol}`]: {
//               address: checkSumAddress,
//               name: value.name,
//               symbol: value.symbol,
//               decimals: value.decimals,
//               image: value.image,
//               balance,
//               rawBalance,
//               balanceInUsd,
//               isActive:
//                 tokenInfo?.[`${checkSumAddress}_${value.symbol}`] || false,
//               accounts: {
//                 ["0x2c34f78650239F446Fe128DdF35F5cD8Ad1d115f"]: {
//                   name: "",
//                   balance,
//                   rawBalance,
//                   balanceInUsd,
//                   walletName: "",
//                 },
//               },
//             },
//           },
//         },
//         ...defaultTokens,
//       };
//     }
//   });
//   console.log(
//     "🚀 ~ file: index.tsx:139 ~ useEffect ~ defaultTokens:",
//     defaultTokens
//   );
//   return defaultTokens;
// };

export const createDefaultTokenObject = (
  value: any,
  checkSumAddress: string,
  tokenInfo: any
) => {
  const balance = 0;
  const rawBalance = "0";
  const balanceInUsd = 0;

  return {
    [`${value.name}_${checkSumAddress}_${value.symbol.toLocaleUpperCase()}`]: {
      address: checkSumAddress,
      name: value.name,
      symbol: value.symbol,
      decimals: value.decimals,
      image: value.image,
      balance,
      rawBalance,
      balanceInUsd,
      isActive:
        tokenInfo?.[`${checkSumAddress}_${value.symbol}`]?.isActive || false,
      accounts: {
        ["0x2c34f78650239F446Fe128DdF35F5cD8Ad1d115f"]: {
          name: "",
          balance,
          rawBalance,
          balanceInUsd,
          walletName: "",
        },
      },
    },
  };
};

export const getStoreData = () => {
  const {
    app: {
      NETWORKCHAIN,
      nonNativeDefaultAndTopTokens: { tokens },
    },
    newWallet: { tokenInfo, secondaryHoldings },
  } = StaticStore.getState();

  return { NETWORKCHAIN, tokens, tokenInfo, secondaryHoldings };
};

export const convertDefaultTokensInToSecondaryHoldings = () => {
  let defaultTokens: SecondaryHoldings = {};

  const { NETWORKCHAIN, tokens, tokenInfo, secondaryHoldings } = getStoreData();

  defaultTokens = { ...secondaryHoldings };

  Object.keys(tokens).forEach((address) => {
    const value = tokens[address];
    const checkSumAddress = checkSum(value.address);

    if (
      defaultTokens[value.chainId as keyof typeof defaultTokens] !== undefined
    ) {
      defaultTokens = {
        ...defaultTokens,
        [value.chainId]: {
          ...defaultTokens[value.chainId],
          tokens: {
            ...defaultTokens[value.chainId].tokens,
            ...createDefaultTokenObject(value, checkSumAddress, tokenInfo),
          },
        },
      };
    } else {
      defaultTokens = {
        [value.chainId]: {
          name: NETWORKCHAIN[value.chainId].NAME,
          image: NETWORKCHAIN[value.chainId].LOGO,
          balanceInUsd: 0,
          tokens: {
            ...createDefaultTokenObject(value, checkSumAddress, tokenInfo),
          },
        },
        ...defaultTokens,
      };
    }
  });

  console.log(
    "🚀 ~ file: index.tsx ~ useEffect ~ defaultTokens:",
    defaultTokens
  );
  return defaultTokens;
};
