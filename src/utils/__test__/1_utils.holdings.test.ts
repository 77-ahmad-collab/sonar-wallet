import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { waitFor } from "@testing-library/react";
import { ethers } from "ethers";
import { act } from "@testing-library/react-hooks";

import { SecondaryHoldings } from "interfaces";
import { connect } from "near-api-js";
import { Account } from "near-api-js/lib/account";
import { StaticStore } from "store/store";
import { getSolanaConnection } from "utils";
import { ProcessHoldings } from "classes";

import {
  API,
  API_KEY,
  CONFIG,
  ETHERSCAN_API_KEY,
  NATIVE_TOKEN_COINGECKO_ID,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  NETWORKCHAIN,
  NETWORKS,
  NODE_URL,
  WRAPPED_ADDRESS,
} from "utils/constants";

import {
  checkAccountFeasibility,
  checkPingFeasibility,
  checkWalletFeasibility,
  dynamicBalanceUpdater,
  getFilteredTokensList,
  getHoldings,
  getSortedAccounts,
  getTokenHoldingGlobally,
  sortByHoldings,
} from "utils/utils.holdings";
import * as utilsAPIS from "utils/utils.api";
// import * as appActions from "@slices/appSlice";
import * as newWalletActions from "@slices/newWalletSlice";
// import {
//   setTokenInfo,
// } from "@slices/newWalletSlice";
import { extractKeypair, getPrivateKeysOfAccounts } from "utils/utils.wallets";
import {
  dynamicBalanceChecker,
  mockAccount1,
  mockAccount2,
  obj,
} from "./payload/utils.holding";
import CachedService from "classes/cachedService";
import { switchNetwork } from "../../store/slices/appSlice/appSlice";
import {
  balanceInThatChain,
  fetchAllHoldingTokens,
  fetchChainBalance,
  fetchTxHistoryAction,
} from "utils/utils.holdingsEVM";
import {
  fetchNearBalance,
  fetchNearTokenHolding,
  showAllHoldingsNear,
} from "utils/utils.holdingsNEAR";
import {
  fetchAllHoldingsSolana,
  fetchBalanceSolana,
  showAllHoldingsSolana,
} from "utils/utils.holdingsSOLANA";

// import Web3 from "web3";

// jest.useFakeTimers({ timerLimit: 1_000_000_000 });
// jest.spyOn(global, "setTimeout");
// jest.setTimeout(1_000_000_000);

// export const utilHoldings = () => {
const rpc = process.env.REACT_APP_ANKR_API_KEY;
describe("holdings file test cases", () => {
  beforeEach(() => {
    jest
      .spyOn(CachedService, "getHashedPassword")
      .mockReturnValue(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
  });

  describe("fetchAllHoldingTokens", () => {
    it("should return the holdings when there is", async () => {
      const GOERLI_CHAINID = 5;
      const data = await fetchAllHoldingTokens(
        "0xd2ffE9246458e9e7F3c51e15Ae3F1d69797fDc60",
        "https://api-goerli.etherscan.io/api",
        ETHERSCAN_API_KEY,
        `${NETWORKCHAIN[GOERLI_CHAINID][NODE_URL]}`,
        5
      );
      console.log("🚀 ~ file: utils.holdings.test.ts:148 ~ it ~ data:", data);

      expect(Array.isArray(data)).toBe(true);
      expect(data?.map((value) => value.tokenName)).toBeDefined();
    }, 60000);
    it("should return the empty holding on ethereum mainnet", async () => {
      // jest.spyOn(axios, "get").mockResolvedValueOnce({
      //   status: "0",
      //   message: "No transactions found",
      //   result: [],
      // });
      // jest.unmock(axios.get())
      const ETH_CHAINID = 1;
      const data = await fetchAllHoldingTokens(
        "0xd2ffE9246458e9e7F3c51e15Ae3F1d69797fDc60",
        "https://api.etherscan.io/api",
        ETHERSCAN_API_KEY,
        `${NETWORKCHAIN[ETH_CHAINID][NODE_URL]}`,
        1
      );
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
      expect(data).not.toBeUndefined();
    }, 90000);

    xit("should throw error when wrong parameters are provided", async () => {
      const data = await fetchAllHoldingTokens(
        "0xd2ffE9246458e9e7F3c51e15Ae3F1d69797fDc60",
        "https://api-goerli.etherscan.io/api",
        ETHERSCAN_API_KEY,
        `https://rpc.ankr.com/eth/${rpc}`, //--wrong rpc
        1
      );

      expect(data).toBeUndefined();
    }, 60000);
  });

  describe("fetchChainBalance file test cases", () => {
    it("fetches the balance of a given address", async () => {
      const address = "0x002b69D61028E3fF415bd8427E11A1D7FC39101b";
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        `https://rpc.ankr.com/eth_goerli/${rpc}`
      );

      const { balance, rawBalance } = await fetchChainBalance(
        address,
        ethersProvider
      );
      expect(balance).not.toBeNull();
      expect(rawBalance).not.toBeNull();
      expect(balance).not.toBeUndefined();
      expect(rawBalance).not.toBeUndefined();
      expect(balance).toEqual(expect.any(String));
      expect(rawBalance).toEqual(expect.any(ethers.BigNumber));
    }, 90000);
    // Test case 2
    it("it should return an object with balance and rawBalance", async () => {
      const address = "0x002b69D61028E3fF415bd8427E11A1D7FC39101b";

      const ethersProvider = new ethers.providers.JsonRpcProvider(
        `https://rpc.ankr.com/eth_goerli/${rpc}`
      );
      const result = await fetchChainBalance(address, ethersProvider);

      const { balance, rawBalance } = result;

      expect(balance).not.toBeNull();
      expect(rawBalance).not.toBeNull();
      expect(balance).not.toBeUndefined();
      expect(rawBalance).not.toBeUndefined();
      expect(result).toStrictEqual(
        expect.objectContaining({
          balance: expect.any(String),
          rawBalance: expect.any(ethers.BigNumber),
        })
      );
    }, 90000);
  });

  describe("balanceInThatChain file test cases", () => {
    // example jest test case
    test("balanceInThatChain should return the correct data object", async () => {
      // const ethersProvider = new ethers.providers.JsonRpcProvider(
      //   `https://rpc.ankr.com/eth_goerli/${rpc}`
      // );

      const GOERLI_ID = 5;
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[GOERLI_ID as keyof typeof NETWORKCHAIN][NODE_URL]
      );
      const address = "0x002b69D61028E3fF415bd8427E11A1D7FC39101b";
      const { balance, rawBalance, balanceInUSD, price } =
        await balanceInThatChain(
          address,
          NETWORKCHAIN[5].NATIVE_TOKEN_COINGECKO_ID,
          ethersProvider
        );

      expect(balance).toEqual(expect.any(String));
      expect(rawBalance).toEqual(expect.any(String));
      expect(balanceInUSD).toBeDefined();
      expect(price).toBeDefined();
    }, 60000);
  });

  describe("fetchNearBalance", () => {
    it("should return the availableNear balance for an account", async () => {
      const availableNear = await fetchNearBalance(
        mockAccount1 as unknown as Account
      );
      console.log(
        "🚀 ~ file: utils.holdings.test.ts:182 ~ it ~ availableNear:",
        availableNear
      );

      expect(availableNear).toEqual(
        expect.objectContaining({
          availableNativeBalance: expect.any(Number),
          availableNativeBalanceInRaw: expect.any(String),
        })
      );
    });
    it("should throw an error when account balance is negative", async () => {
      const availableNear = await fetchNearBalance(
        mockAccount2 as unknown as Account
      );
      console.log(
        "🚀 ~ file: utils.holdings.test.ts:198 ~ it ~ availableNear:",
        availableNear
      );
      expect(availableNear.availableNativeBalance).toBeLessThan(0);
    });
  });

  describe("showAllHoldingsNear", () => {
    it("should return near holdings of the account", async () => {
      // const near = await connect(CONFIG[network]);
      const nearAccountId =
        "be67da0a559df560cc7cbc8cbfcacd007e3a6d04503ddb3313f59512e5ddbf4e";

      const network = 101;
      const near = await connect(CONFIG[network]);
      const allTokens = await showAllHoldingsNear(nearAccountId, near, network);

      expect(allTokens?.map((value) => value.tokenName)).toBeDefined();
      expect(allTokens?.map((value) => value.tokenAddress)).toBeDefined();
    });
  });

  describe("fetchBalanceSolana", () => {
    xit("can return holding of solana ", async () => {
      const importedAccount = await extractKeypair(
        "" // @secret-key key when testing
      );

      const solanaChainId = 102;
      const solanaTestnetConnection = getSolanaConnection(false);
      const result = await fetchBalanceSolana(
        importedAccount.publicKey,
        solanaTestnetConnection,
        solanaChainId
      );

      expect(result).toBeDefined();
      expect(result?.tokenSymbol).toBe("SOL");
      expect(result?.tokenBalance).toBeDefined();
      expect(result?.tokenBalanceRawInteger).toBeDefined();
      expect(result?.priceInUSD).toBeDefined();
      expect(result?.tokenAddress).toBeDefined();
      expect(result?.tokenDecimal).toBe(9);
      expect(result?.image).toBeDefined();
      expect(result?.tokenPrice).toBeDefined();
    });

    xit("should response correctly if 0 solana  balance", async () => {
      const importedAccount = await extractKeypair(
        "" // @secret-key key when testing
      );

      const solanaChainId = 103;
      const solanaMainnetConnection = getSolanaConnection(true);
      const result = await fetchBalanceSolana(
        importedAccount.publicKey,

        solanaMainnetConnection,
        solanaChainId
      );

      expect(result).toBeDefined();
      //   expect(result?.tokenSymbol).toEqual("");
    });
    xit("should not break the code, if any error", async () => {
      const importedAccount = await extractKeypair(
        "" // @secret-key key when testing
      );

      const solanaChainId = 103;

      const result = await fetchBalanceSolana(
        importedAccount.publicKey,
        "" as any,
        solanaChainId
      );

      expect(result?.tokenSymbol).toEqual("");
    });
  });

  describe("showAllHoldingsSolana", () => {
    it("should return an empty array of token info", async () => {
      const address = "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q";
      const connection = getSolanaConnection(true);
      const SolanaTokens = await showAllHoldingsSolana(address, connection);
      expect(SolanaTokens).toStrictEqual([]);
    });
    it("should return an array of token info of the account", async () => {
      const address = "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti";
      const connection = getSolanaConnection(true);
      const SolanaTokens = await showAllHoldingsSolana(address, connection);
      expect(SolanaTokens?.map((value) => value.tokenName)).toBeDefined();
      expect(SolanaTokens?.map((value) => value.tokenAddress)).toBeDefined();
    });
    it("should return an empty array, when connection not found", async () => {
      const address = "";
      const connection = "";
      const SolanaTokens = await showAllHoldingsSolana(
        address,
        connection as any
      );

      expect(SolanaTokens).toHaveLength(0);
    });
  });

  describe("getTokenHoldingGlobally", () => {
    it("returns the token amount when token address and chain id are provided", () => {
      const tokenAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
      const chainId = 56;
      const tokenAmount = getTokenHoldingGlobally(tokenAddress, chainId);
      expect(tokenAmount).toEqual({
        amount: expect.any(Number),
      });
    });
    it("returns 0 when token address and wrong chain id are provided", () => {
      const tokenAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
      const chainId = 2;
      const tokenAmount = getTokenHoldingGlobally(tokenAddress, chainId);

      expect(tokenAmount).toEqual({
        amount: 0,
      });
    });
  });

  describe("checkPingFeasibility", () => {
    it("should return correct response if total balance of ping token is greater than or equal to MIN_PING_HOLDING_LIMIT", () => {
      expect(checkPingFeasibility()).toEqual(false);
    });
  });

  describe("checkWalletFeasibility", () => {
    it("Should return an object containing permission and has enough ping", () => {
      const walletFeasibility = checkWalletFeasibility();
      expect(walletFeasibility).toEqual(
        expect.objectContaining({
          permission: expect.any(Boolean),
          hasEnoughPing: expect.any(Boolean),
        })
      );
    });
  });

  describe("checkAccountFeasibility", () => {
    it("should return an object with permission and hasEnoughPing properties", () => {
      const walletId = "2a6280e4-e1b0-4750-837f-28e0660470dd";
      const result = checkAccountFeasibility(walletId);
      expect(result).toHaveProperty("permission");
      expect(result).toHaveProperty("hasEnoughPing");
    });
  });
  describe("getFilteredTokensList", () => {
    const isZeroHolding = (filterObject: SecondaryHoldings) => {
      let isIncludeZeroHolding = false;
      Object.keys(filterObject).forEach((key) => {
        Object.keys(filterObject[key].tokens).forEach((tokenKey) => {
          if (filterObject[key].tokens[tokenKey].balance == 0) {
            isIncludeZeroHolding = true;
          }
        });
      });
      return isIncludeZeroHolding;
    };
    it("Should return the filtered token holding,with 0 balance as well", () => {
      const secondaryHoldings =
        StaticStore.getState().newWallet.secondaryHoldings;
      const filterObject = getFilteredTokensList(
        "a",
        secondaryHoldings,
        true,
        true
      );
      expect(isZeroHolding(filterObject)).toBeTruthy();
    });
    it("Should return the filtered token  holding whose balance greater than 0,", () => {
      const secondaryHoldings =
        StaticStore.getState().newWallet.secondaryHoldings;
      const filterObject = getFilteredTokensList(
        "a",
        secondaryHoldings,
        false,
        true
      );
      expect(isZeroHolding(filterObject)).toBeFalsy();
    });
  });

  describe("dynamicBalanceUpdater", () => {
    test("should dynamically update the balance", async () => {
      const previousBalance =
        StaticStore.getState().newWallet.tokenHoldings[
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
        ][56]["0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"].rawAmount;

      await dynamicBalanceUpdater(dynamicBalanceChecker);
      const afterBalance =
        StaticStore.getState().newWallet.tokenHoldings[
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
        ][56]["0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"].rawAmount;

      expect(previousBalance).not.toEqual(afterBalance);
    }, 600000);
  });

  describe("fetchTxHistoryAction", () => {
    it("should return the tokens history of the address on binance chain", async () => {
      const chainId = 56;
      const currentChainInfo = NETWORKCHAIN[chainId];
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN][NODE_URL]
      );
      await waitFor(
        async () => {
          const holdings = await fetchTxHistoryAction(
            "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
            currentChainInfo[API],
            currentChainInfo[API_KEY],
            currentChainInfo[NODE_URL],
            chainId,
            currentChainInfo[WRAPPED_ADDRESS],
            currentChainInfo[NATIVE_TOKEN_COINGECKO_ID],
            ethersProvider,
            currentChainInfo[NATIVE_TOKEN_NAME],
            currentChainInfo[NATIVE_TOKEN_SYMBOL],
            currentChainInfo.LOGO
          );
        },
        { timeout: 8000000 }
      );
    });
    it("should return the tokens history of the address on ethereum chain", async () => {
      jest.clearAllMocks();
      const chainId = 1;
      const currentChainInfo = NETWORKCHAIN[chainId];
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN][NODE_URL]
      );
      await act(async () => {
        // await waitFor(
        // async () => {
        const holdings = await fetchTxHistoryAction(
          "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
          currentChainInfo[API],
          currentChainInfo[API_KEY],
          currentChainInfo[NODE_URL],
          chainId,
          currentChainInfo[WRAPPED_ADDRESS],
          currentChainInfo[NATIVE_TOKEN_COINGECKO_ID],
          ethersProvider,
          currentChainInfo[NATIVE_TOKEN_NAME],
          currentChainInfo[NATIVE_TOKEN_SYMBOL],
          currentChainInfo.LOGO
        );
        expect(holdings).toBeDefined();
        // },
        // { timeout: 80000 }
      });
      // );
    });
  });

  // describe("getWalletHoldings", () => {
  //   // jest.setTimeout(1000000);

  //   test("getWalletHoldings should return object", async () => {
  //     const walletHolding = await getWalletHoldings();
  //     const afterState = StaticStore.getState().newWallet.tokenHoldings;

  //     expect(
  //       afterState["0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"][43114][
  //         "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  //       ].amount
  //     ).not.toBe(0);
  //   }, 60000);
  // });

  describe("getHoldings", () => {
    jest.spyOn(ethers.providers, "JsonRpcProvider").mockImplementation(() => {
      return {
        getBalance: jest.fn().mockReturnValue("1000000000000000000"),
      } as any;
    });

    const setTokenInfo = jest.spyOn(newWalletActions, "setTokenInfo");
    const setTokenHoldings = jest.spyOn(newWalletActions, "setTokenHoldings");

    const payload = {
      // "usdt.tether-token.near_USDt": {
      //   name: "Tether USD",
      //   symbol: "USDt",
      //   image:
      //     "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      //   decimals: 6,
      //   address: "usdt.tether-token.near",
      //   isActive: false,
      //   coingeckoId: "",
      //   price: 0,
      // },
      "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near_USDT.e": {
        name: "Tether USD",
        symbol: "USDT.e",
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iLTEiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MSIgcng9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjQ1NV8zOTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ1NV8zOTYiIHgxPSI0MCIgeTE9Ii0xIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRUIwMEZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwRjBGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
        decimals: 6,
        address: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        isActive: false,
        coingeckoId: "tether",
        price: 0.999322,
      },
    };

    /**
     * @Ahmed
     */
    const HoldingsProcessor = new ProcessHoldings({}, payload);
    // HoldingsProcessor.

    beforeAll(async () => {
      jest
        .spyOn(utilsAPIS, "fetchMultipleCoingeckoIds")
        .mockResolvedValue(["dai"]);
    });
    it("should call for the holdings of EVM", async () => {
      await act(async () => {
        const holdings = await getHoldings(["EVM"]);
      });
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      expect(setTokenInfo).toHaveBeenCalled();
      expect(setTokenHoldings).toHaveBeenCalled();

      const afterState = StaticStore.getState().newWallet.tokenHoldings;
      expect(afterState).toHaveProperty(
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
      );
    }, 60_000);

    it("should call for the holdings of EMV testnet", async () => {
      StaticStore.dispatch(switchNetwork(true));

      await act(async () => {
        const holdings = await getHoldings(["EVM"]);
      });

      await new Promise((resolve) => setTimeout(resolve, 5_000));

      expect(setTokenInfo).toHaveBeenCalled();
      expect(setTokenHoldings).toHaveBeenCalled();

      const afterState = StaticStore.getState().newWallet.tokenHoldings;
      expect(afterState).toHaveProperty(
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
      );
    }, 60_000);

    it("should call for the holdings of SOLANA", async () => {
      await act(async () => {
        const holdings = await getHoldings(["SOLANA"]);
        // expect(holdings).toStrictEqual([])
      });
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      expect(setTokenInfo).toHaveBeenCalled();
      expect(setTokenHoldings).toHaveBeenCalled();

      const afterState = StaticStore.getState().newWallet.tokenHoldings;
      console.log(
        "🚀 ~ file: utils.holdings.test.ts:562 ~ it ~ afterState:",
        afterState
      );
      //  @dev
      //   "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti"
    }, 70_000);

    it("should call for the holdings of SOLANA testnet", async () => {
      StaticStore.dispatch(switchNetwork(true));

      await act(async () => {
        const holdings = await getHoldings(["SOLANA"]);
        // expect(holdings).toStrictEqual([])
      });
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      expect(setTokenInfo).toHaveBeenCalled();
      expect(setTokenHoldings).toHaveBeenCalled();

      const afterState = StaticStore.getState().newWallet.tokenHoldings;
      //  @dev
      //   "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti"
    }, 70_000);

    it("should call for the holdings of NEAR", async () => {
      // StaticStore.dispatch(newWalletActions.setTokenInfo(payload));
      await act(async () => {
        const holdings = await getHoldings(["NEAR"]);
        // expect(holdings).toStrictEqual([])
      });
      await new Promise((resolve) => setTimeout(resolve, 5_000));

      expect(setTokenInfo).toHaveBeenCalled();
      expect(setTokenHoldings).toHaveBeenCalled();

      const afterState = StaticStore.getState().newWallet.tokenHoldings;
      expect(afterState).toHaveProperty(
        "46074367e6d9ce75765a10ef9d706411ebfee97e32496bf7b7b71e3f1246763d"
      );
    }, 70_000);
  });

  describe("sortByHoldings", () => {
    it("should sort tokens by balance in descending order", () => {
      const result = sortByHoldings(obj);
      expect(Object.keys(result)[0]).toBe(
        "ETH_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      );
    });
    // Test case 2
    it("should sort tokens by balance in descending order", () => {
      const result = sortByHoldings(obj);
      expect(Object.keys(result)[0]).toBe(
        "ETH_0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      );
    });
  });

  describe("getSortedAccounts", () => {
    test("test getSortedAccounts()", () => {
      const accountsByChainFamily = getSortedAccounts();
      expect(typeof accountsByChainFamily).toBe("object");
    });
    // Test Case 2:
    test("test getSortedAccounts() with valid data", () => {
      const accountsByChainFamily = getSortedAccounts();
      expect(Object.values(accountsByChainFamily).length).not.toBe(0);
    });
  });

  describe("fetchNearTokenHolding", () => {
    test("test fetchNearTokenHolding()", async () => {
      const nearTokenHolding = await fetchNearTokenHolding(
        "e831b25c42754b4987e31419eba3e3d9b7b33ba116a4f01ac115fd7236e8515a",
        101
      );
      expect(typeof nearTokenHolding).toBe("object");
    }, 60000);
    // Test Case 2:
    test("test fetchNearTokenHolding() with valid data", async () => {
      const nearTokenHolding = await fetchNearTokenHolding(
        "995fed71084e306c86506d69340798f6c88360770513814ce9815ee4e55e36fb",
        101
      );
      expect(Object.values(nearTokenHolding).length).not.toBe(0);
    }, 60000);
    test("test fetchNearTokenHolding() with error", async () => {
      await waitFor(
        async () => {
          const nearTokenHolding = await fetchNearTokenHolding(
            "995fed71084e306c86506d69340798f6c88360770513814ce9815ee4e55easdh",
            101
          );
          expect(nearTokenHolding).toStrictEqual([]);
        },
        { timeout: 50000 }
      );
    });
  });

  describe("fetchAllHoldingsSolana", () => {
    test("test cases", async () => {
      const address = "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q";
      await act(async () => {
        // await waitFor(
        // async () => {
        const solanaAddressWithSecretKeys = await getPrivateKeysOfAccounts(
          NETWORKS.SOLANA
        );
        const secretKey = solanaAddressWithSecretKeys[address];
        const solanaConnection = await getSolanaConnection(false);
        const nearTokenHolding = await fetchAllHoldingsSolana(
          address,
          secretKey,
          102,
          solanaConnection
        );
        expect(typeof nearTokenHolding).toBe("object");
        expect("tokenName" in nearTokenHolding[0]).toBe(true);
        // },
        // { timeout: 50000 }
        // );
      });
    }, 60000);
  });
});
// };
