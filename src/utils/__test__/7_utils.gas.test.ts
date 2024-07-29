import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { SupportedChainId } from "utils/constants";
import * as utilWallet from "utils/utils.wallets";
import {
  addGas,
  calculateGasSpeed,
  calculateNonEvmGasFee,
  estimateGasLimit,
  fetchTransactionCostInEther,
  getGasPrice,
  getSpeedUpCancelGasPriceInWei,
} from "utils/utils.gas";
import {
  AURORA_MAINNET,
  BINANCE_MAINNET,
  CRONOS_MAINNET,
  ETHEREUM_MAINNET,
  POLYGON_MAINNET,
  addGas_payload,
  calculateNonEvmGasFee_payload,
  check_estimate_payload,
} from "./payload/utils.gas";
import CachedService from "classes/cachedService";

describe("utils.gas.ts", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest
      .spyOn(CachedService, "getHashedPassword")
      .mockReturnValue(
        "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
      );
  });

  describe("estimateGasLimit", () => {
    test("check EstimateGasLimit", async () => {
      jest
        .spyOn(utilWallet, "getHashedPassword")
        .mockResolvedValueOnce(
          "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
        );
      const { address, chainId, tokenAddress } = check_estimate_payload;
      const estimate = await estimateGasLimit(tokenAddress, address, chainId);
      expect(estimate).not.toBeUndefined();
    }, 60000);
  });

  describe("getGasPrice", () => {
    it("returns gas price when network is AURORA MAINNET", async () => {
      jest.spyOn(axios, "get").mockResolvedValueOnce(AURORA_MAINNET);
      const gasPrice = await getGasPrice(SupportedChainId.AURORA_MAINNET);
      expect(gasPrice).toEqual({
        safeLow: expect.any(Number),
        average: expect.any(Number),
        fast: expect.any(Number),
        avgWait: expect.any(Number),
        fastWait: expect.any(Number),
        safeLowWait: expect.any(Number),
      });
    }, 90000);

    it("returns gas price when network is CRONOS MAINNET", async () => {
      jest.spyOn(axios, "get").mockResolvedValueOnce(CRONOS_MAINNET);
      const gasPrice = await getGasPrice(SupportedChainId.CRONOS_MAINNET);

      expect(gasPrice).toEqual({
        safeLow: expect.any(Number),
        average: expect.any(Number),
        fast: expect.any(Number),
        avgWait: expect.any(Number),
        fastWait: expect.any(Number),
        safeLowWait: expect.any(Number),
      });
    }, 90000);

    it("returns gas price when network is POLYGON MAINNET", async () => {
      // axios.get = jest.fn().mockResolvedValueOnce(POLYGON_MAINNET);
      jest.spyOn(axios, "get").mockResolvedValueOnce(POLYGON_MAINNET);
      expect(await getGasPrice(SupportedChainId.POLYGON_MAINNET)).toEqual({
        safeLow: expect.any(Number),
        average: expect.any(Number),
        fast: expect.any(Number),
        avgWait: expect.any(Number),
        fastWait: expect.any(Number),
        safeLowWait: expect.any(Number),
      });
    }, 90000);
    it("returns gas price when network is BINANCE MAINNET", async () => {
      // axios.get = jest.fn().mockResolvedValueOnce(BINANCE_MAINNET);
      jest.spyOn(axios, "get").mockResolvedValueOnce(BINANCE_MAINNET);
      const gasPrice = await getGasPrice(SupportedChainId.BINANCE_SMART_CHAIN);
      expect(gasPrice).toEqual({
        safeLow: expect.any(Number),
        average: expect.any(Number),
        fast: expect.any(Number),
        avgWait: expect.any(Number),
        fastWait: expect.any(Number),
        safeLowWait: expect.any(Number),
      });
    }, 90000);

    it("returns gas price when network is ETHEREUM MAINNET", async () => {
      // axios.get = jest.fn().mockResolvedValueOnce(ETHEREUM_MAINNET);
      jest.spyOn(axios, "get").mockResolvedValueOnce(ETHEREUM_MAINNET);
      const gasPrice = await getGasPrice(SupportedChainId.ETHEREUM_MAINNET);

      expect(gasPrice).toEqual({
        safeLow: expect.any(Number),
        average: expect.any(Number),
        fast: expect.any(Number),
        avgWait: expect.any(Number),
        fastWait: expect.any(Number),
        safeLowWait: expect.any(Number),
      });
    }, 90000);
  });

  describe("calculateGasSpeed", () => {
    it("should return all the gas speeds", async () => {
      const result = await calculateGasSpeed(1, 100);
      expect(result).toBeTruthy();
      expect(result).toHaveProperty("safeLow");
      expect(result).toHaveProperty("average");
      expect(result).toHaveProperty("fast");
      expect(result).toHaveProperty("custom");
      expect(result).toHaveProperty("safeLowGwei");
      expect(result).toHaveProperty("averageGwei");
      expect(result).toHaveProperty("fastGwei");
      expect(result).toHaveProperty("customGwei");
      expect(result).toHaveProperty("safeLowWait");
      expect(result).toHaveProperty("fastWait");
      expect(result).toHaveProperty("avgWait");
      expect(result).toHaveProperty("customWait");
    }, 90000);

    it("should throw an error if the network is invalid", async () => {
      await expect(calculateGasSpeed(10, 100)).rejects.toThrow(
        "Error in gas speed"
      );
    }, 90000);
  });

  describe("addGas", () => {
    it(" calculates gas price and returns the corresponding gas info", async () => {
      const { chainId, estimateGas } = addGas_payload;
      const result = await addGas(chainId, estimateGas);

      expect(result).toBeTruthy();
      expect(result).toHaveProperty("0");
      expect(result).toHaveProperty("1");
      expect(result).toHaveProperty("2");
      expect(result).toHaveProperty("3");
      expect(result[0]).toHaveProperty("usd");
      expect(result[0]).toHaveProperty("gwei");
      expect(result[0]).toHaveProperty("time");
    }, 90000);
  });

  describe("calculateNonEvmGasFee", () => {
    test("check calculateNonEvmGasFee", async () => {
      const { chainId, gas } = calculateNonEvmGasFee_payload;

      const estimate = await calculateNonEvmGasFee(chainId, gas);
      expect(estimate).toEqual(
        expect.objectContaining({
          gasFeeInUsd: expect.any(Number),
          gasInDefaultGasUnit: expect.any(Number),
          transactionCost: expect.any(Number),
        })
      );
    }, 90000);
  });

  describe("fetchTransactionCostInEther", () => {
    it("should return the cost of the transaction in ether", async () => {
      const estimateGas = 100000000;
      const gwei = 1000;
      const expectedResult = 100;
      const result = await fetchTransactionCostInEther(estimateGas, gwei);
      expect(result).toBe(expectedResult);
    }, 90000);
    it("should return 0 if estimateGas is 0", async () => {
      const estimateGas = 0;
      const gwei = 10;
      const expectedResult = 0;
      const result = await fetchTransactionCostInEther(estimateGas, gwei);
      expect(result).toBe(expectedResult);
    }, 90000);
    it("should return 0 if gwei is 0", async () => {
      const estimateGas = 10;
      const gwei = 0;
      const expectedResult = 0;
      const result = await fetchTransactionCostInEther(estimateGas, gwei);
      expect(result).toBe(expectedResult);
    }, 90000);
  });
  describe("getSpeedUpCancelGasPriceInWei", () => {
    test("returns 3 times the previous gas price if it is between 0 and 30 Gwei", () => {
      expect(getSpeedUpCancelGasPriceInWei(1000000000)).toEqual("3000000000");
      expect(getSpeedUpCancelGasPriceInWei(200000000)).toEqual("600000000");
      expect(getSpeedUpCancelGasPriceInWei(30000000)).toEqual("90000000");
      expect(getSpeedUpCancelGasPriceInWei(1000000)).toEqual("3000000");
    }, 90000);

    test("returns 1.5 times the previous gas price if it is between 30 and 100 Gwei", () => {
      expect(getSpeedUpCancelGasPriceInWei(40000000000)).toEqual("60000000000");
      expect(getSpeedUpCancelGasPriceInWei(70000000000)).toEqual(
        "105000000000"
      );
      expect(getSpeedUpCancelGasPriceInWei(60000000000)).toEqual("90000000000");
    }, 90000);

    test("returns 1.4 times the previous gas price if it is between 100 and 200 Gwei", () => {
      expect(getSpeedUpCancelGasPriceInWei(150000000000)).toEqual(
        "210000000000"
      );
      expect(getSpeedUpCancelGasPriceInWei(180000000000)).toEqual(
        "252000000000"
      );
      expect(getSpeedUpCancelGasPriceInWei(120000000000)).toEqual(
        "168000000000"
      );
    }, 90000);

    test("returns 1.3 times the previous gas price if it is between 200 and 300 Gwei", () => {
      expect(getSpeedUpCancelGasPriceInWei(250000000000)).toEqual(
        "325000000000"
      );
      expect(getSpeedUpCancelGasPriceInWei(270000000000)).toEqual(
        "351000000000"
      );
    },90000);

    test("returns 1.2 times the previous gas price if it is between 300 and 400 Gwei", () => {
      expect(getSpeedUpCancelGasPriceInWei(350000000000)).toEqual(
        "420000000000"
      );
      expect(getSpeedUpCancelGasPriceInWei(370000000000)).toEqual(
        "444000000000"
      );
    },90000);

    test("returns 1.2 times the previous gas price if it is above 400 Gwei", () => {
      expect(getSpeedUpCancelGasPriceInWei(450000000000)).toEqual(
        "540000000000"
      );
      expect(getSpeedUpCancelGasPriceInWei(470000000000)).toEqual(
        "564000000000"
      );
    },90000);
  });
});
