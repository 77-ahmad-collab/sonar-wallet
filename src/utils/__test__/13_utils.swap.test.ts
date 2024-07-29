import Common from "@ethereumjs/common";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

import * as ETHTX from "@ethereumjs/tx";
import * as RefFinanceSdk from "@ref-finance/ref-sdk";

import { ethers } from "ethers";
import { CHAIN_TX, NATIVE_TOKEN_ADDRESS, NETWORKCHAIN } from "utils/constants";
import * as walletAction from "@slices/newWalletSlice/index";
import {
  dispatchDynamicSwapMsg,
  dispatchFetchingMsg,
  dispatchInsufficientFundsMsg,
  dispatchSwapTokenA,
  dispatchSwapTokenB,
  filterSwapTokens,
  getSwapContractAdressAndContract,
  getSwapIdealTokenLists,
  getSwapTokens,
  getSwapTransactionRawData,
  initializeTokenContract,
  validateSwapSelectedTokensData,
} from "utils/utils.swap";
import {
  filterSwapTokensData,
  filterSwapTokensData2,
  mockTokenBSelected,
  mockTokenSelected,
} from "./payload/utils.swap";
import CachedService from "classes/cachedService";

// const tx = new Transaction.Transaction("SSSSS" as any)
// export const utilSwap = () =>
describe("utils.swap", () => {
  beforeEach(() => {
    jest
      .spyOn(CachedService, "getHashedPassword")
      .mockReturnValue(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
  });

  describe("getSwapContractAdressAndContract", () => {
    it("should return the data for the non-native tokens and non reflection", async () => {
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[1].NODE_URL
      );
      const data = await getSwapContractAdressAndContract(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",

        1,
        ethersProvider,
        1000000000000000000,
        1000000000000000000,
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        0.1,
        true
      );
      expect(data.routerV2).toBeUndefined();
      expect(data.isReflection).toBeFalsy;
      expect(data.quote).toBeDefined();
    }, 60000);
    it("should return the data for the native tokens and non reflection", async () => {
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[1].NODE_URL
      );
      const data = await getSwapContractAdressAndContract(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        NATIVE_TOKEN_ADDRESS,

        1,
        ethersProvider,
        1000000000000000000,
        1000000000000000000,
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        0.1,
        true
      );
      expect(data.routerV2).toBeUndefined();
      expect(data.isReflection).toBeFalsy;
      expect(data.quote).toBeDefined();
    }, 60000);
    it("should return the data for the native tokenA and tokenB is reflection token", async () => {
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[56].NODE_URL
      );
      const data = await getSwapContractAdressAndContract(
        "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
        NATIVE_TOKEN_ADDRESS,

        56,
        ethersProvider,
        0.0000000001,
        0.1,
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        0.1,
        false
      );

      expect(data.routerV2).not.toBeUndefined();
      expect(data.isReflection).toBeTruthy;
      expect(data.quote).toBeDefined();
    }, 60000);
    it("should return the data for the non-native tokenA and tokenB is reflection token", async () => {
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[56].NODE_URL
      );
      const data = await getSwapContractAdressAndContract(
        NATIVE_TOKEN_ADDRESS,
        "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",

        56,
        ethersProvider,
        0.0000000001,
        0.1,
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        0.1,
        false
      );

      expect(data.routerV2).not.toBeUndefined();
      expect(data.isReflection).toBeTruthy;
      expect(data.quote).toBeDefined();
    }, 60000);

    it("should return an error message when there is an insufficient assets liquidity", async () => {
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[56].NODE_URL
      );
      const data = await getSwapContractAdressAndContract(
        NATIVE_TOKEN_ADDRESS,
        "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",

        1,
        ethersProvider,
        0.0000000001,
        0.1,
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        0.1,
        false
      );

      expect(data.quote.error).toBe(400);
    }, 60000);
  });
  describe("initializeTokenContract", () => {
    it("should return the contract instance", async () => {
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      const ethersInstance = new ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[1].NODE_URL
      );
      const contractInstance = await initializeTokenContract(
        DAI,
        ethersInstance
      );

      expect(contractInstance).toBeDefined();
    });
  });

  describe("getSwapTokens", () => {
    it("should return the swap tokens page wise on EVM NETWORK", async () => {
      const data = await getSwapTokens(1, 1, "");
      expect(data.tokens.map((item) => item?.chainId)).toBeDefined();
      expect(data.tokens.map((item) => item?.address)).toBeDefined();
    });
    it("should return the searched token  on EVM NETWORK", async () => {
      const searchedToken = "0xA3a7f7ccc7b3f5BE5828f92cC33Cf5cAfb027443";
      const data = await getSwapTokens(56, 1, searchedToken);
      expect(
        data.tokens
          .map((item) => item?.chainId)
          .filter(
            (item) =>
              item.toString().toLowerCase() === searchedToken.toLowerCase()
          ).length > 0
      ).toBeTruthy;
    }, 600000);
    it("should return the swap tokens page wise on NEAR NETWORK", async () => {
      jest.spyOn(RefFinanceSdk, "ftGetTokensMetadata").mockReturnValue({
        token: {
          id: "0xxxxxx",
          name: "near",
          symbol: "near",
          decimals: 24,
          icon: "",
        },
      } as any);
      const data = await getSwapTokens(101, 1, "");
      console.log("🚀 ~ file: 12_utils.swap.test.ts:76 ~ it ~ data:", data);

      expect(data.tokens.map((item) => item?.chainId)).toBeDefined();
      expect(data.tokens.map((item) => item?.address)).toBeDefined();
      expect(data.tokens.length).toBeGreaterThan(0);
      expect(data.hasMorePages).toBeTruthy;
    }, 60000);
    it("should return the token list empty", async () => {
      const data = await getSwapTokens(1, null as any, "");

      expect(data.tokens.length).toBeFalsy;
    });
    it("should return the searched swap token on NEAR NETWORK", async () => {
      const searchedToken = "near";
      const data = await getSwapTokens(101, 1, searchedToken);

      expect(
        data.tokens
          .map((item) => item?.chainId)
          .filter(
            (item) =>
              item.toString().toLowerCase() === searchedToken.toLowerCase()
          ).length > 0
      ).toBeTruthy;
    });
  });
  describe("filterSwapTokens", () => {
    it("should return the filtered tokens on bsc chain", async () => {
      const { account, tokenA, tokens } = filterSwapTokensData;
      const data = await filterSwapTokens(tokens, 56, account, tokenA);

      expect(Object.keys(data.toTokens[56].tokens).length).toBeGreaterThan(0);
    });
    it("should return the empty totokens", async () => {
      const { account, tokenA, tokens } = filterSwapTokensData2;
      const data = await filterSwapTokens(tokens, 56, account, tokenA);

      expect(data.toTokens).toEqual({});
    });
  });
  describe("getSwapTransactionRawData", () => {
    it("can return the sign transaction data ", async () => {
      jest.spyOn(ETHTX, "Transaction").mockImplementation(() => {
        return {
          sign: jest.fn().mockReturnValue({
            serialize: jest.fn().mockReturnValue({
              toString: jest
                .fn()
                .mockReturnValue(
                  "f86d4184b2d05e0083016378942d7044d07cef44580f7780c829d6a10fda34d5dd86b5e620f480008083027126a09d8925d84ed764bc73788f2466c66860656de63e21ed5d1a0ba8a295bd7b5be3a010256dfaa36fa806792bc0845cee2c2a3ad754bab272e8e8e1646fa2dcbd137b"
                ),
            }),
          }),
        } as any;
      });
      const chainTx = NETWORKCHAIN[1][CHAIN_TX];
      const data = await getSwapTransactionRawData(
        "5GXcdhlPvfPZihjycV/GAtIl4uh0BJMK9ojXxnFCR6TCsYNaxCEB5bskTsB",
        new Common({ chain: chainTx }),
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );

      expect(data).toBeDefined();
    });
  });
  describe("dispatchSwapTokenA", () => {
    it("should dispatch swap tokenA", async () => {
      const setSwapSelectedTokens = jest.spyOn(
        walletAction,
        "setSwapSelectedTokens"
      );

      await dispatchSwapTokenA(mockTokenSelected);

      expect(setSwapSelectedTokens).toHaveBeenCalled();
    });
  });
  describe("dispatchSwapTokenB", () => {
    it("should dispatch swap tokenB", async () => {
      const setSwapSelectedTokens = jest.spyOn(
        walletAction,
        "setSwapSelectedTokens"
      );

      await dispatchSwapTokenB(mockTokenBSelected);

      expect(setSwapSelectedTokens).toHaveBeenCalled();
    });
  });
  describe("getSwapIdealTokenLists", () => {
    it("should return the swap ideal List according to the chain", () => {
      const data = getSwapIdealTokenLists(1);
      expect(data.map((value) => value.symbol).includes("ETH")).toBeTruthy;
    });
    it("should return an empty ideal list when wrong chainId is provided", () => {
      const data = getSwapIdealTokenLists(1000);

      expect(data.length).toBe(0);
    });
  });
  describe("dispatch different error messages", () => {
    it("should dispatch an error message  Insufficient funds for gas", () => {
      const setSwapSelectedTokens = jest.spyOn(
        walletAction,
        "setSwapSelectedTokens"
      );
      dispatchInsufficientFundsMsg();
      expect(setSwapSelectedTokens).toHaveBeenCalledWith({
        error: {
          message: "Insufficient funds for gas",
          open: true,
        },
        loading: false,
      });
    });
    it("should dispatch a message  Fetching...", () => {
      const setSwapSelectedTokens = jest.spyOn(
        walletAction,
        "setSwapSelectedTokens"
      );
      dispatchFetchingMsg();
      expect(setSwapSelectedTokens).toHaveBeenCalledWith({
        error: {
          message: "Fetching...",
          open: true,
        },
        warning: "",
      });
    });
    it("should dispatch a message  Token B must be selected", () => {
      const setSwapSelectedTokens = jest.spyOn(
        walletAction,
        "setSwapSelectedTokens"
      );
      dispatchDynamicSwapMsg("Token B must be selected");
      expect(setSwapSelectedTokens).toHaveBeenCalledWith({
        error: {
          message: "Token B must be selected",
          open: true,
        },
      });
    });
  });
  describe("validateSwapSelectedTokensData", () => {
    it("should return a message Choose the sell token", () => {
      const data = validateSwapSelectedTokensData(
        { amount: "0", amountInUsd: "0" },
        { amount: "0", amountInUsd: "0" },
        {
          address: "",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          chainId: 1,

          coingeckoId: "ethereum",
          balance: 0,
          rawBalance: "",
          balanceInUsd: 0,

          reflectionExists: false,
          isNative: false,

          price: 0,
        },
        {
          address: "",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          chainId: 1,

          balance: 0,
          rawBalance: "",
          balanceInUsd: 0,

          reflectionExists: false,
          isNative: false,

          coingeckoId: "",
          price: 0,
        }
      );

      expect(data.message).toBe("Choose Sell token");
      expect(data.open).toBeTruthy;
    });

    // ITS CODE IS COMMENTED
    // it("should return a message Please enter the valid amount", () => {
    //   const data = validateSwapSelectedTokensData(
    //     { amount: "0", amountInUsd: "0" },
    //     { amount: "0", amountInUsd: "0" },
    //     {
    //       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //       name: "Ethereum",
    //       symbol: "ETH",
    //       decimals: 18,
    //       image:
    //         "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    //       chainId: 1,

    //       coingeckoId: "ethereum",
    //       balance: 0,
    //       rawBalance: "",
    //       balanceInUsd: 0,
    //       amount: 0,
    //       amountInUsd: 0,
    //       reflectionExists: false,
    //       isNative: false,
    //       sellAmount: 0,
    //       price: 0,
    //     },
    //     {
    //       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //       name: "Ethereum",
    //       symbol: "ETH",
    //       decimals: 18,
    //       image:
    //         "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    //       chainId: 1,

    //       balance: 0,
    //       rawBalance: "",
    //       balanceInUsd: 0,
    //       amount: 0,
    //       amountInUsd: 0,
    //       reflectionExists: false,
    //       isNative: false,
    //       buyAmount: 0,
    //       coingeckoId: "",
    //       price: 0,
    //     }
    //   );

    //   expect(data.message).toBe("Please enter the valid amount");
    //   expect(data.open).toBeTruthy;
    // });
    it("should return a message Choose the buy token", () => {
      const data = validateSwapSelectedTokensData(
        { amount: "10", amountInUsd: "0" },
        { amount: "10", amountInUsd: "0" },
        {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          chainId: 1,

          coingeckoId: "ethereum",
          balance: 0,
          rawBalance: "",
          balanceInUsd: 0,

          reflectionExists: false,
          isNative: false,

          price: 0,
        },
        {
          address: "",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          image:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMDRfMTM4NjY1KSI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMzMwNF8xMzg2NjUpIj4KPHBhdGggZD0iTTgwIDQwQzgwIDE3LjkwODYgNjIuMDkxNCAwIDQwIDBDMTcuOTA4NiAwIDAgMTcuOTA4NiAwIDQwQzAgNjIuMDkxNCAxNy45MDg2IDgwIDQwIDgwQzYyLjA5MTQgODAgODAgNjIuMDkxNCA4MCA0MFoiIGZpbGw9IiM2MjdFRUEiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVWMzMuNDY1OEw1Ni4yOCA0MC40NEw0MC42NDExIDE1WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPHBhdGggZD0iTTQwLjY0MTEgMTVMMjUgNDAuNDRMNDAuNjQxMSAzMy40NjU4VjE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwLjY0MTEgNTIuNDA2NFY2NC45NTM2TDU2LjI5MDQgNDMuMzQ2Mkw0MC42NDExIDUyLjQwNjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPgo8cGF0aCBkPSJNNDAuNjQxMSA2NC45NTM2VjUyLjQwNDJMMjUgNDMuMzQ2Mkw0MC42NDExIDY0Ljk1MzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDAuNjQxMSA0OS41MDIyTDU2LjI4IDQwLjQ0TDQwLjY0MTEgMzMuNDdWNDkuNTAyMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBkPSJNMjUgNDAuNDRMNDAuNjQxMSA0OS41MDIyVjMzLjQ3TDI1IDQwLjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz4KPC9nPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMDRfMTM4NjY1Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMwNF8xMzg2NjUiPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
          chainId: 1,

          balance: 0,
          rawBalance: "",
          balanceInUsd: 0,

          reflectionExists: false,
          isNative: false,

          coingeckoId: "",
          price: 0,
        }
      );

      expect(data.message).toBe("Choose Buy token");
      expect(data.open).toBeTruthy;
    });
  });
});
