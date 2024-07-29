import { DUMMY_IMAGE_URL, HASHEDPASSWORD, NETWORKS } from "utils/constants";
import * as Bip39 from "bip39";
import * as web3 from "@solana/web3.js";
import axios from "axios";

import { StaticStore } from "store/store";
import { decryptMessage } from "utils";
import { API } from "./constants";
import {
  Accounts,
  AllWallets,
  SimpleTileinfoProps,
  WalletsFilter,
} from "interfaces";
import { setTokenImageAndPrice } from "@slices/newWalletSlice";
import { validateNearMainnetAddress } from "./validateAddresses";
import { getDetailSingleTokenInfo } from "./utils.api";
import { BASE_URL } from "api";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "./utils.storage";
import CachedService from "classes/cachedService";
import { setUserLoggedIn } from "@slices/appSlice";
import navigationService from "classes/navigation";
import { AUTHSCREENS } from "theme/constants";

const b58 = require("b58");

/**
 * decrypt all the encrypted pvt keys and arrange them in an object
 * @example
 * {
 *  address: pvt_key
 * }
 * @param chainFamily type string
 */
export const getPrivateKeysOfAccounts = async (chainFamily: string) => {
  let finalObject: { [address: string]: string } = {};
  const storeState = StaticStore.getState();
  const newhashedPassword = CachedService.getHashedPassword();
  const allAccounts = storeState.newWallet.accounts;

  Object.values(allAccounts).forEach((acc) => {
    if (acc.chainFamily === chainFamily) {
      finalObject = {
        ...finalObject,
        [acc.address]: decryptMessage(acc.secret, newhashedPassword),
      };
    }
  });
  return finalObject;
};

/**
 * fetches hashedPassword stored in the session storage
 * @returns hashedPassword string
 */
export const getHashedPassword = async () => {
  const hashedPassword = (await getSessionStorageValue(HASHEDPASSWORD)) as
    | {
        [HASHEDPASSWORD]: string;
      }
    | null
    | string;
  console.log("getHashedPassword", hashedPassword);
  if (hashedPassword) {
    return typeof hashedPassword === "string"
      ? hashedPassword
      : hashedPassword[HASHEDPASSWORD];
  }
  return "";
};

/**
 * store hashedPassword string in session storage
 * @param passwordHash type string
 */
export const setHashedPassword = async (passwordHash: string) => {
  await setSessionStorageValue(HASHEDPASSWORD, passwordHash);
};

/**
 * uses Bip39 to extract keypair incase of given mnemonic and
 * uses b58 decode to extract keypair incase of given pvt key
 * @param secretKey type string
 */
export const extractKeypair = (secretKey: string) => {
  const split = secretKey.split(" ");
  let seed, importedAccount;
  if (split.length > 1) {
    seed = Bip39.mnemonicToSeedSync(secretKey).slice(0, 32);
    importedAccount = web3.Keypair.fromSeed(new Uint8Array(seed));
  } else {
    const address = b58.decode(secretKey);
    importedAccount = web3.Keypair.fromSecretKey(new Uint8Array(address));
  }
  return importedAccount as web3.Keypair;
};

//-----THIS FUNCTION IS COMMENTED AT THE MOMENT BUT CAN HAVE A NEED IN FUTURE
export const getAccountIds = async (publicKey: string, network: number) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const { data } = await axios.get(
    `${
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API]
    }/publicKey/${publicKey}/accounts`
  );
  console.log(data, "datanet");
  return data.length > 0 ? data[0] : "";
};

/**
 * get all accounts of a specific chain Family
 * @param network type SimpleTileinfoProps | string
 */
export async function getSimpleAccountsList(
  network?: SimpleTileinfoProps | string
) {
  const networkTosearch =
    typeof network === "string" ? network : network?.chain;
  const allAccounts = StaticStore.getState().newWallet.accounts;
  return Object.values(allAccounts)
    .map((thisAcc) => {
      if (networkTosearch && thisAcc.chainFamily !== networkTosearch) return;
      return {
        name: thisAcc.name,
        address: thisAcc.address,
        chain: thisAcc.chainFamily,
        walletId: thisAcc.walletId,
      };
    })
    .filter(Boolean);
}

/**
 * Filters the  accounts based on the provided parameters
 * takes in an array of chainFamily, walletIds, excludeAccounts to filter
 * accounts based on the given array parameter
 * @param {Object} parameter Filter criteria
 * @param {string[]} [parameter.chainFamily] Array of chainFamilies to filter by
 * @param {string[]} [parameter.walletIds] Array of walletIds to filter by
 * @param {string[]} [parameter.excludeAccounts] Array of accounts to exclude
 *
 * @returns {Accounts["accAddress"][]} Array of filtered accounts, after all the filtration done
 */
export const filterAccounts = ({
  chainFamily = [],
  walletIds = [],
  excludeAccounts = [],
}: {
  chainFamily?: string[];
  walletName?: string;
  walletIds?: string[];
  excludeAccounts?: string[];
}) => {
  const filteredAccounts: Accounts["accAddress"][] = [];
  const excludeAccountsObj: { [address: string]: boolean } =
    excludeAccounts.reduce(
      (prev, address) => ({ ...prev, [address]: true }),
      {}
    );

  const allAccounts = StaticStore.getState().newWallet.accounts;

  // iterate over each account and checks if they
  // passes these validation checks
  for (const dumbMystery in allAccounts) {
    const account = allAccounts[dumbMystery];

    const chainFamilyCheck = chainFamily.length
      ? chainFamily.some((cf) => cf === account.chainFamily)
      : true;

    const walletIdCheck = walletIds.length
      ? walletIds.some((wi) => wi === account.walletId)
      : true;

    const isInBlackList = Boolean(excludeAccountsObj[dumbMystery]);

    if (chainFamilyCheck && walletIdCheck && !isInBlackList) {
      filteredAccounts.push(account);
    }
  }
  return filteredAccounts;
};

/**
 * returns array of account addresses of a single wallet
 * e.g accounts created from that wallet seedphrase and
 * accounts imported in that wallet
 * @param walletId type string
 */
export const getAllAccountsOfSingleWallet = (walletId: string) => {
  const thisWallet = StaticStore.getState().newWallet.allWallets[walletId];
  const chainFamilies = Object.keys(NETWORKS);
  let allaccountsAddresses: string[] = [];
  chainFamilies.forEach((family) => {
    allaccountsAddresses = allaccountsAddresses.concat(
      thisWallet?.[family as keyof typeof NETWORKS]
    );
  });
  return allaccountsAddresses;
};

/**
 * iterate over all the filteredWallets to decide
 * the text to be shown on wallet filter button
 *
 * @param filteredWallets type WalletsFilter
 * @param accounts type Accounts
 * @param allWallets type AllWallets
 * @param isTestnet type boolean
 */
export const getfilterWalletInfo = (
  filteredWallets: WalletsFilter,
  accounts: Accounts,
  allWallets: AllWallets,
  isTestnet: boolean
) => {
  let totalAccounts = 0;
  let totalWallets = 0;
  let totalActiveAccounts = 0;
  let totalActiveWallets = 0;
  const filteredWithAddressArray: { [walletid: string]: string[] } = {};
  let lastActiveAddress = "";
  let lastActiveWalletId = "";

  // counter and populator
  for (const walletid in filteredWallets) {
    const thisWallet = filteredWallets[walletid];
    totalWallets = totalWallets + 1;
    filteredWithAddressArray[walletid] = [];
    let thisWalletHasActiveAccount = false;

    for (const address in thisWallet) {
      const account = thisWallet[address];
      totalAccounts = totalAccounts + 1;
      // because near account will not be counted on testnet
      if (isTestnet && validateNearMainnetAddress(address)) {
        totalAccounts = totalAccounts - 1;
      } else if (account.isSelected) {
        filteredWithAddressArray[walletid].push(address);
        // keeep track of last active account in case only one account is active
        lastActiveAddress = address;
        // add active wallet and accounts count
        totalActiveAccounts = totalActiveAccounts + 1;
        if (!thisWalletHasActiveAccount) {
          thisWalletHasActiveAccount = true;
          totalActiveWallets = totalActiveWallets + 1;
          // keeep track of last active wallet in case only one wallet is active
          lastActiveWalletId = walletid;
        }
      }
    }
  }

  // incase of all wallets are selected or no account selected
  if (totalActiveAccounts === totalAccounts || totalActiveAccounts === 0) {
    return {
      text1: "All Wallets",
      text2: "",
      address: "",
    };
  }
  // if only one active account
  else if (totalActiveAccounts === 1) {
    // if one active account and one active wallet
    if (totalWallets === 1) {
      return {
        text1: accounts[lastActiveAddress].name,
        text2: "",
        address: lastActiveAddress,
      };
    }
    // if one active account but multiple active wallets
    else {
      return {
        text1: accounts[lastActiveAddress].name,
        text2: allWallets[accounts[lastActiveAddress].walletId].name,
        address: lastActiveAddress,
      };
    }
  }
  // if multiple active accounts but one active wallet
  else if (totalActiveWallets === 1) {
    return {
      text1: "Multiple Accounts",
      text2: allWallets[lastActiveWalletId].name,
      address: "",
    };
  }
  // if multiple active accounts accross multiple active wallets
  else {
    return {
      text1: "Multiple Accounts",
      text2: "",
      address: "",
    };
  }
};

export const calculateRatioAmount = (amount: number, ratio: number) => {
  return amount * ratio;
};

export const fetchImageAndUpdateTokenPrice = async ({
  isActive,
  singleTokenInfo,
  address,
  symbol,
}: {
  isActive: boolean;
  singleTokenInfo: {
    name: string;
    symbol: string;
    image: string;
    decimals: number;
    address: string;
    isActive: boolean;
    coingeckoId: string;
  };
  address: string;
  symbol: string;
}) => {
  let image = "";
  let price = 0;
  if (isActive && singleTokenInfo && singleTokenInfo.coingeckoId) {
    const tokenDetail = await getDetailSingleTokenInfo(
      singleTokenInfo.coingeckoId
    );
    console.log({ tokenDetail }, singleTokenInfo);
    price = tokenDetail.market_data.current_price.usd;

    if (
      tokenDetail.image.thumb &&
      (singleTokenInfo.image === "" ||
        singleTokenInfo.image === DUMMY_IMAGE_URL)
    ) {
      image = tokenDetail.image.thumb;
    }
  } else {
    const request = await axios.get(`${BASE_URL}/tokens/image/${address}`);
    image = request.data.image;
  }

  if (image) {
    StaticStore.dispatch(
      setTokenImageAndPrice({
        tokenAddress: address,
        tokenSymbol: symbol,
        image,
        price,
      })
    );
  }
};

export const LockWallet = () => {
  StaticStore.dispatch(setUserLoggedIn(false));
  navigationService.navigate(AUTHSCREENS.auth);
  CachedService.setHashedPassword("");
};
