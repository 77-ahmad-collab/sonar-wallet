import { useCallback, useMemo } from "react";
import {
  introduceAccountActions,
  setAccountsFilter,
} from "@slices/newWalletSlice";
import * as Bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import { Account, Keypair } from "@solana/web3.js";
import { KeyPair, utils } from "near-api-js";
import { ethers } from "ethers";
import { hdkey } from "ethereumjs-wallet";

import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import { checkSum, encryptMessage } from "utils";
import {
  EVM,
  EVM_DERIVATION_PATH,
  NEAR,
  NETWORKS,
  NON_NATIVE_DEFAULT,
  SOLANA,
} from "utils/constants";
import { setAccounts } from "@slices/newWalletSlice";
import { Accounts, FilteredAccounts } from "interfaces";
import { parseSeedPhrase } from "near-seed-phrase";
import CachedService from "classes/cachedService";
import { ProcessHoldings } from "classes";

const nacl = require("tweetnacl");
const b58 = require("b58");
// const { parseSeedPhrase } = require("near-seed-phrase");

export const useAccounts = () => {
  const { allWallets, accounts } = useAppSelector((state) => state.newWallet);
  const { TokensToBeAddedInEachAccount } = useAppSelector((state) => state.app);
  const hashedPassword = useMemo(() => CachedService.getHashedPassword(), []);
  const dispatch = useAppDispatch();

  const checkAccountExist = (address: string) => Boolean(accounts[address]);

  /**
   * uses ethers.js to import an EVM account from a pvt key
   * and add it to accounts, wallet and filtered account.
   * returns status and message of operation
   * @param pvtKey type string
   * @param walletId type string
   * @param accountName type string
   */
  const importEVMAccount = async (
    pvtKey: string,
    walletId: string,
    accountName: string
  ) => {
    const wallet = new ethers.Wallet(pvtKey);
    const accountAddress = checkSum(wallet.address);
    if (wallet) {
      const accountExist = checkAccountExist(accountAddress);
      if (accountExist) {
        return { status: true, message: "account already exits", address: "" };
      } else {
        // store the encrypted pvt key in redux
        const secret = encryptMessage(
          wallet.privateKey.split("x")[1],
          hashedPassword
        );
        // let accountNo = allWallets[walletId][EVM].length;
        // accountNo += 1;
        const newAccount: Accounts = {
          [accountAddress]: {
            name: accountName,
            address: accountAddress,
            secret,
            walletId,
            createdAt: new Date().getTime(),
            isImported: true,
            chainFamily: NETWORKS.EVM,
            balanceInUsd: 0,
          },
        };

        const updatedAllWallets = addAccAddressToWallet(
          walletId,
          EVM,
          accountAddress
        );

        const HoldingsProcessor = addDefaultTokensInSingleAccount(
          accountAddress,
          EVM
        );

        // immediately select the imported account in wallet filter
        const filteredAccounts: FilteredAccounts =
          processAccountsFilteration(accountAddress);

        await dispatch(
          introduceAccountActions({
            updatedAllWallets,
            tokenHoldings: HoldingsProcessor.allHoldings,
            tokenInfo: HoldingsProcessor.allTokenInfo,
            newAccount,
            filteredAccounts: { accounts: filteredAccounts, walletId },
          })
        );

        return {
          status: true,
          message: "Account imported successfully",
          address: "",
        };
      }
    }
    return { status: false, message: "Unable to Import Account" };
  };

  /**
   * uses Bip39 and ethereumjs-wallet to create a
   * derived account using seedphrase. by default it will
   * create the first derived account, and adds it to
   * accounts and filtered accounts in redux
   * @param generatedMnemonic type string
   * @param hashedPassword type string
   * @param walletCount type number
   * @param walletId type string
   * @param isFirstTime type boolean
   * @param accountName type string
   * @returns
   */
  const createEVMAccount = (
    generatedMnemonic: string,
    hashedPassword: string,
    walletCount: number,
    walletId: string,
    isFirstTime: boolean,
    accountName?: string
  ): Accounts => {
    let deriveChildNum = 0;
    let accountNo = 1;
    // if user is not creating the first ever wallet in sonar wallet
    // then it means it is creating another derived account in already created wallet
    if (!isFirstTime) {
      const thisWalletAccounts = allWallets[walletId][EVM];
      const numNativeAcc = thisWalletAccounts.filter(
        (accAddress) => !accounts[accAddress].isImported
      ).length;
      deriveChildNum = numNativeAcc;
    }

    // inspired from metamask to make sure derived accounts are consistent
    const seed = Bip39.mnemonicToSeedSync(generatedMnemonic);
    const hdwallet = hdkey.fromMasterSeed(new Uint8Array(seed) as any);
    const derivedPath = hdwallet.derivePath(EVM_DERIVATION_PATH);
    const child = derivedPath.deriveChild(deriveChildNum);
    const wallet = child.getWallet();
    const address = checkSum(`0x${wallet.getAddress().toString("hex")}`);
    const pk = wallet.getPrivateKey().toString("hex");
    const secret = encryptMessage(pk, hashedPassword);
    if (walletCount !== 0 && !isFirstTime) {
      accountNo = allWallets[walletId][EVM].length;
      accountNo += 1;
    }
    const newAccount: Accounts = {
      [address]: {
        name: accountName || `Account ${accountNo}`,
        address,
        secret,
        walletId,
        createdAt: new Date().getTime(),
        isImported: false,
        chainFamily: NETWORKS.EVM,
        balanceInUsd: 0,
      },
    };

    const introduceAccountActionsObj = {
      updatedAllWallets: {},
      tokenHoldings: {},
      tokenInfo: {},
      newAccount,
      filteredAccounts: { accounts: {}, walletId: "" },
    };
    // this will only run when we are creating an account from settings
    if (!isFirstTime) {
      introduceAccountActionsObj.updatedAllWallets = addAccAddressToWallet(
        walletId,
        EVM,
        address
      );
      const HoldingsProcessor = addDefaultTokensInSingleAccount(address, EVM);

      introduceAccountActionsObj.tokenHoldings = HoldingsProcessor.allHoldings;

      introduceAccountActionsObj.tokenInfo = HoldingsProcessor.allTokenInfo;
    }

    const filteredAccounts: FilteredAccounts =
      processAccountsFilteration(address);

    introduceAccountActionsObj.filteredAccounts = {
      accounts: filteredAccounts,
      walletId,
    };

    dispatch(introduceAccountActions(introduceAccountActionsObj));

    return newAccount;
  };

  /**
   * uses ed25519-hd-key to create a solana account from given
   * mnemonic. user can provide their own derive path, to match with
   * other solana account creation.
   */
  const createSolanaAccount = useCallback(
    (
      generatedMnemonic: string,
      hashedPassword: string,
      walletCount: number,
      walletId: string,
      isFirstTime: boolean,
      accountName?: string,
      derivationpath?: string
    ): Accounts => {
      let accountNo = 1;
      // let walletId = 1;
      // refer to solana docs to learn about solana account creation
      const seed = Bip39.mnemonicToSeedSync(generatedMnemonic);
      const path = derivationpath ? derivationpath : `m/44'/501'/0'`;
      const derivedSeed = ed25519.derivePath(path, seed.toString("hex")).key;
      const account = new Account(
        nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
      );
      const keypair = Keypair.fromSecretKey(account.secretKey);
      const SOLANASECRET = encryptMessage(
        b58.encode(keypair.secretKey),
        hashedPassword
      );
      if (walletCount !== 0 && !isFirstTime) {
        accountNo = allWallets[walletId][SOLANA].length;
        accountNo += 1;
      }
      const address = keypair.publicKey.toString();
      const newAccount: Accounts = {
        [address]: {
          name: accountName || `Account ${accountNo}`,
          address: address,
          secret: SOLANASECRET,
          createdAt: new Date().getTime(),
          isImported: false,
          walletId,
          chainFamily: NETWORKS.SOLANA,
          balanceInUsd: 0,
          derivationpath: path,
        },
      };

      const introduceAccountActionsObj = {
        updatedAllWallets: {},
        tokenHoldings: {},
        tokenInfo: {},
        newAccount,
        filteredAccounts: { accounts: {}, walletId: "" },
      };

      // this will only run when we are creating an account from settings
      if (!isFirstTime) {
        introduceAccountActionsObj.updatedAllWallets = addAccAddressToWallet(
          walletId,
          SOLANA,
          address
        );

        const HoldingsProcessor = addDefaultTokensInSingleAccount(
          address,
          SOLANA
        );

        introduceAccountActionsObj.tokenHoldings =
          HoldingsProcessor.allHoldings;

        introduceAccountActionsObj.tokenInfo = HoldingsProcessor.allTokenInfo;
      }

      const filteredAccounts: FilteredAccounts = processAccountsFilteration(
        keypair.publicKey.toString()
      );

      introduceAccountActionsObj.filteredAccounts = {
        accounts: filteredAccounts,
        walletId,
      };

      dispatch(introduceAccountActions(introduceAccountActionsObj));

      return newAccount;
    },
    []
  );

  /**
   * uses b58 to decode given pvt key and extract account address
   * from it. then saves in redux in different states.
   * @param privateKey type string
   * @param walletId type string
   * @param accountName type string
   */
  const importSolanaAccount = async (
    privateKey: string,
    walletId: string,
    accountName: string
  ) => {
    try {
      const secret = encryptMessage(privateKey, hashedPassword);
      const b58SecretKey = b58.decode(privateKey);
      const { publicKey } = Keypair.fromSecretKey(b58SecretKey);
      const address = publicKey.toString();
      const accountExist = checkAccountExist(publicKey.toString());
      if (accountExist) {
        return { status: true, message: "account already exits" };
      } else {
        const newAccount: Accounts = {
          [address]: {
            name: accountName,
            address,
            secret,
            walletId,
            createdAt: new Date().getTime(),
            isImported: true,
            chainFamily: NETWORKS.SOLANA,
            balanceInUsd: 0,
          },
        };
        const updatedAllWallets = addAccAddressToWallet(
          walletId,
          SOLANA,
          address
        );

        const HoldingsProcessor = addDefaultTokensInSingleAccount(
          address,
          SOLANA
        );

        const filteredAccounts: FilteredAccounts =
          processAccountsFilteration(address);

        await dispatch(
          introduceAccountActions({
            updatedAllWallets,
            tokenHoldings: HoldingsProcessor.allHoldings,
            tokenInfo: HoldingsProcessor.allTokenInfo,
            newAccount,
            filteredAccounts: { accounts: filteredAccounts, walletId },
          })
        );
        return {
          status: true,
          message: "Account imported successfully",
          address: "",
        };
      }
    } catch (error) {
      return { status: true, message: "Please enter a valid private key" };
    }
  };

  /**
   * extract pvt key public key from the given mnemonic
   * by using near-seed-phrase package
   * @param phrase type string
   */
  const importNearWallet = (phrase: string) => {
    const { secretKey } = parseSeedPhrase(phrase);
    const keyPair: KeyPair = KeyPair.fromString(secretKey);
    const publicKey = keyPair.getPublicKey().toString();
    const accountIdsByPublickKey = "";
    const mainnetAddress = "";
    return {
      secretKey,
      publicKey,
      existingPublicKey: accountIdsByPublickKey,
      mainnetAddress,
    };
  };

  /**
   * add the near account in its respective states in redux
   */
  const createNearAccounts = useCallback(
    (
      generatedMnemonic: string,
      hashedPassword: string,
      walletCount: number,
      importWallet: boolean,
      walletId: string,
      isFirstTime: boolean
    ) => {
      let existingPublicKey = "";
      let accountNo = 1;
      // let walletId = 1;
      let mainnetAddress = "";
      let publicKey = "";
      let secretKey = "";

      ({ secretKey, existingPublicKey, publicKey, mainnetAddress } =
        importNearWallet(generatedMnemonic));

      const NEARSECRET = encryptMessage(secretKey, hashedPassword);

      if (walletCount !== 0 && !isFirstTime) {
        accountNo = allWallets[walletId].NEAR.length;
        accountNo += 1;
      }

      if (!existingPublicKey && importWallet) {
        existingPublicKey = (
          utils.PublicKey.fromString(publicKey).data as Buffer
        ).toString("hex");
      }

      if (!mainnetAddress) {
        mainnetAddress = (
          utils.PublicKey.fromString(publicKey).data as Buffer
        ).toString("hex");
      }

      // const NEAR_TESTNET: Accounts = {
      //   [`${existingPublicKey}_TESTNET`]: {
      //     name: `Near Testnet Account ${accountNo}`,
      //     address: `${existingPublicKey}_TESTNET`,
      //     secret: NEARSECRET,
      //     createdAt: new Date().getTime(),
      //     walletId,
      //     isImported,
      //     chainFamily: NETWORKS.NEAR_TESTNET,
      //     balanceInUsd: 0,
      //   },
      // };
      // dispatch(setAccounts(NEAR_TESTNET));

      // const filteredAccountsNearTestnet: FilteredAccounts =
      //   processAccountsFilteration(`${existingPublicKey}_TESTNET`);
      // dispatch(setAccountsFilter({ accounts: filteredAccountsNearTestnet , walletId}));

      const NEAR_MAINNNET: Accounts = {
        [mainnetAddress]: {
          name: `Near Account ${accountNo}`,
          address: mainnetAddress,
          secret: NEARSECRET,
          createdAt: new Date().getTime(),
          walletId,
          isImported: false,
          chainFamily: NETWORKS.NEAR,
          balanceInUsd: 0,
        },
      };

      dispatch(setAccounts(NEAR_MAINNNET));

      const filteredAccountsNearMainnet: FilteredAccounts =
        processAccountsFilteration(mainnetAddress);
      dispatch(
        setAccountsFilter({ accounts: filteredAccountsNearMainnet, walletId })
      );

      return {
        // [NETWORKS.NEAR_TESTNET]: NEAR_TESTNET,
        [NETWORKS.NEAR]: NEAR_MAINNNET,
      };
    },
    []
  );

  /**
   * returns the given account address by adding into its respective wallet
   * and chainFamily
   * @param walletId type string
   * @param network type keyof typeof NETWORKS
   * @param address type string
   */
  const addAccAddressToWallet = (
    walletId: string,
    network: keyof typeof NETWORKS,
    address: string
  ) => {
    const walletToUpdate = {
      ...StaticStore.getState().newWallet.allWallets[walletId],
    };
    const networkToUpdate = [...walletToUpdate[network]];
    if (typeof networkToUpdate !== "string") {
      networkToUpdate.push(address);
    }
    const updatedWallet = {
      [walletId]: {
        ...walletToUpdate,
        [network as unknown as keyof typeof walletToUpdate]: networkToUpdate,
      },
    };
    return updatedWallet;
  };

  const processAccountsFilteration = useCallback((address: string) => {
    return {
      [address]: {
        isSelected: true,
      },
    };
  }, []);

  /**
   * adds default tokens to only one account in one chain Family, in token Holding and token Info.
   * and returns the Initialized ProcessHolding class object for further use if necessary
   * @param address string
   * @param chainFamily EVM | NEAR | SOLANA
   * @returns ProcessHoldings class object
   */
  const addDefaultTokensInSingleAccount = (
    address: string,
    chainFamily: keyof typeof NETWORKS
  ) => {
    const store = StaticStore.getState().newWallet;
    const HoldingsProcessor = new ProcessHoldings(
      store.tokenHoldings,
      store.tokenInfo
    );
    const chainIds =
      chainFamily === EVM
        ? [
            1, 5, 137, 80001, 56, 97, 250, 4002, 25, 338, 43114, 43113,
            1313161554,
          ]
        : chainFamily === SOLANA
        ? [102, 103]
        : chainFamily === NEAR
        ? [101]
        : [];

    const chainWithAddress: {
      EVM: string[];
      NEAR: string[];
      SOLANA: string[];
    } = {
      EVM: [],
      NEAR: [],
      SOLANA: [],
    };
    chainWithAddress[chainFamily].push(address);
    HoldingsProcessor.addDefaultTokens(
      chainIds,
      {
        name: "",
        walletId: "",
        seedphrase: "",
        balanceInUsd: 0,
        ...chainWithAddress,
      },
      chainFamily === EVM
        ? [...TokensToBeAddedInEachAccount, ...NON_NATIVE_DEFAULT]
        : []
    );
    return HoldingsProcessor;
  };

  return {
    createEVMAccount,
    createSolanaAccount,
    createNearAccounts,
    importEVMAccount,
    addAccAddressToWallet,
    importSolanaAccount,
    checkAccountExist,
  };
};
