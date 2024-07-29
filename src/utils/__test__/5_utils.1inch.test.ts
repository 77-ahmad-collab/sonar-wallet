import axios from "axios";
import * as ETHTX from "@ethereumjs/tx";
import * as Ethers from "ethers";
import { TransactionRequest } from "@ethersproject/providers";

import {
  buildTxForApproveTradeWithRouter,
  buildTxForSwap,
  checkAllowance,
  findTheBestQuote,
  signAndSendTransaction,
} from "utils/utils.1inch";

import { NETWORKCHAIN } from "utils/constants";
import {
  amount,
  fee,
  findTheBestQuoteData,
  findTheBestQuoteData_wrongInput,
  fromAddress,
  fromTokenAddress,
  gasPrice,
  mockedTxData,
  referrerAddress,
  slippage,
  toTokenAddress,
} from "./payload/utils.1Inch";
import CachedService from "classes/cachedService";

// export const util1inch = () =>
describe("utils.Iinch", () => {
  beforeEach(() => {
    jest
      .spyOn(CachedService, "getHashedPassword")
      .mockReturnValue(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
  });
  describe("checkAllowance", () => {
    it("should return the populated api request url", async () => {
      const data = await checkAllowance(
        56,
        "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
      );
      expect(Number(data)).toEqual(expect.any(Number));
    });
    it("returns the allowance for a given token address and wallet address", () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        data: {
          allowance: 100,
        },
      });

      const chainId = 1;
      const tokenAddress = "0x123456";
      const walletAddress = "0x789012";

      return checkAllowance(chainId, tokenAddress, walletAddress).then(
        (allowance) => {
          expect(axios.get).toHaveBeenCalled();
          expect(allowance).toBe(100);
        }
      );
    });
  });
  describe("findTheBestQuote", () => {
    it("should return a valid response for valid inputs", async () => {
      const { amount, chainId, fee, fromTokenAddress, toTokenAddress, data } =
        findTheBestQuoteData;
      axios.get = jest.fn().mockResolvedValueOnce(data);

      const response = await findTheBestQuote(
        chainId,
        fromTokenAddress,
        toTokenAddress,
        amount,
        fee
      );
      expect(response.status).toBe(200);
    });

    it("should throw an error when invalid inputs are passed", async () => {
      const { amount, chainId, data, fee, fromTokenAddress, toTokenAddress } =
        findTheBestQuoteData_wrongInput;
      axios.get = jest.fn().mockResolvedValueOnce(data);

      const response = await findTheBestQuote(
        chainId,
        fromTokenAddress,
        toTokenAddress,
        amount,
        fee
      );
      await expect(response.status).toBe(400);
    });
  });
  describe("signAndSendTransaction", () => {
    it("can return the transaction hash of the broadcast transaction", async () => {
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
      axios.post = jest.fn().mockResolvedValueOnce({
        data: {
          transactionHash: "0x111111111111111111111",
        },
      });
      const provider = new Ethers.ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[1].NODE_URL
      );
      const data = await signAndSendTransaction(
        1,
        provider,
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
        {} as TransactionRequest
      );
      expect(data).toEqual(expect.any(String));
    });
  });
  describe("buildTxForApproveTradeWithRouter", () => {
    // beforeEach(() => {
    // jest
    //   .spyOn(Ethers.providers, "JsonRpcProvider")
    //   .mockImplementationOnce(() => {
    //     return {
    //       ...Ethers.providers.JsonRpcBatchProvider,
    //       waitForTransaction: jest.fn().mockReturnValue({ test: "value" }),
    //       estimateGas: jest.fn().mockResolvedValueOnce(2122),
    //       getTransactionCount: jest.fn().mockReturnValue(1),
    //     } as any;
    //   });
    // });
    it("should return the transaction object for approve trade with router ", async () => {
      const spy = jest
        .spyOn(Ethers.providers, "JsonRpcProvider")
        .mockImplementationOnce(() => {
          return {
            ...Ethers.providers.JsonRpcBatchProvider,
            waitForTransaction: jest.fn().mockReturnValue({ test: "value" }),
            estimateGas: jest.fn().mockResolvedValueOnce(2122),
            getTransactionCount: jest.fn().mockReturnValue(1),
          } as any;
        });
      const provider = new Ethers.ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[1].NODE_URL
      );
      axios.get = jest.fn().mockResolvedValueOnce({
        data: {
          gasLimit: 21000,
        },
      });

      const data = await buildTxForApproveTradeWithRouter(
        1,
        provider,
        "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847"
      );

      expect(data).toHaveProperty("gasLimit");
      expect(data).toHaveProperty("nonce");
      expect(data).toHaveProperty("gasPrice");
      spy.mockClear();
    });
  });

  describe("buildTxForSwap", () => {
    // beforeEach(() => {
    // jest
    //   .spyOn(Ethers.providers, "JsonRpcProvider")
    //   .mockImplementationOnce(() => {
    //     return {
    //       ...Ethers.providers.JsonRpcBatchProvider,
    //       waitForTransaction: jest.fn().mockReturnValue({ test: "value" }),
    //       estimateGas: jest.fn().mockResolvedValueOnce(2122),
    //       getTransactionCount: jest.fn().mockReturnValue(1),
    //     } as any;
    //   });
    // });
    it("can return the swap transaction data", async () => {
      const spy = jest
        .spyOn(Ethers.providers, "JsonRpcProvider")
        .mockImplementationOnce(() => {
          return {
            ...Ethers.providers.JsonRpcBatchProvider,
            waitForTransaction: jest.fn().mockReturnValue({ test: "value" }),
            estimateGas: jest.fn().mockResolvedValueOnce(2122),
            getTransactionCount: jest.fn().mockReturnValue(1),
          } as any;
        });
      const provider = new Ethers.providers.JsonRpcProvider(
        NETWORKCHAIN[1].NODE_URL
      );
      axios.get = jest.fn().mockResolvedValueOnce(mockedTxData);

      const data = await buildTxForSwap(
        1,
        provider,
        fromTokenAddress,
        toTokenAddress,
        amount,
        fromAddress,
        slippage,
        referrerAddress,
        fee,
        gasPrice
      );

      const tx = data.tx;
      expect(tx.nonce).not.toBeUndefined();
      expect(tx.gasLimit).not.toBeUndefined();
      expect(tx.gasPrice).not.toBeUndefined();
      expect(tx.value).not.toBeUndefined();
      expect(tx.data).not.toBeUndefined();
      spy.mockClear();
    });
  });
});
