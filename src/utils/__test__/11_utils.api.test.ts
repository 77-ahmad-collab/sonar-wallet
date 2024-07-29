import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import coingeckoApi from "store/apis/CoinGecko";

import {
  fetchGraphDataApi,
  fetchMultipleCoingeckoIds,
  getDetailSingleTokenInfo,
  getMultipleTokenPrices,
} from "utils/utils.api";
import {
  expectedResult,
  fetchGraphDataApiData,
  responseData,
} from "./payload/utils.api";

// export const utilApi = () =>
describe("utils.api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("fetchMultipleCoingeckoIds", () => {
    it("should send a POST request with the given addresses", async () => {
      const addresses = ["0xabc", "0xdef"];
      // axios.post = jest.fn().mockResolvedValue({ data: ["ABC", "DEF"] });
      jest.spyOn(axios, "post").mockResolvedValue({ data: ["ABC", "DEF"] });

      const result = await fetchMultipleCoingeckoIds(addresses);
      console.log("🚀 ~ file: 4_utils.api.test.ts:58 ~ it ~ result:", result);

      expect(axios.post).toHaveBeenCalled();
      expect(result).toEqual(["ABC", "DEF"]);
    });
    it("should return an empty array when no response data is returned", async () => {
      const addresses = ["0xabc", "0xdef"];
      axios.post = jest.fn().mockResolvedValue({});
      jest.spyOn(axios, "post").mockResolvedValueOnce({});
      const result = await fetchMultipleCoingeckoIds(addresses);

      expect(result).toEqual([]);
    });
  });

  describe("fetchGraphDataApi", () => {
    it("should return an AxiosResponse object with a data and profit attribute", async () => {
      const { mockData, mockPeriod } = fetchGraphDataApiData;
      jest.spyOn(axios, "post").mockResolvedValue({
        data: {
          data: [1, 2, 3, 4],
          profit: 100,
        },
      });
      const { data } = await fetchGraphDataApi(mockData, mockPeriod);
      expect(data).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          profit: expect.any(Number),
        })
      );
    }, 6000);
  });

  describe("getMultipleTokenPrices", () => {
    it("should return a both token prices", async () => {
      const response = await getMultipleTokenPrices(["dai", "tether"]);

      expect("dai" in response).toBe(true);
      expect("tether" in response).toBe(true);
    }, 6000);

    it("should return empty object when 0 ids are passed", async () => {
      const response = await getMultipleTokenPrices([]);

      expect(response).toMatchObject({});
    }, 40000);
  });

  describe("getDetailSingleTokenInfo", () => {
    test("should return response data from api", async () => {
      //@ts-ignore
      coingeckoApi.get = jest.fn(() =>
        Promise.resolve({
          data: responseData,
        })
      );
      const result = await getDetailSingleTokenInfo("coingecko_id");
      expect(result).toEqual(responseData);
      expect(coingeckoApi.get).toHaveBeenCalledTimes(1);
      expect(coingeckoApi.get).toHaveBeenCalledWith(
        "/coins/coingecko_id?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
      );
    });

    test("should return default data if api call fails", async () => {
      coingeckoApi.get = jest.fn(() => Promise.reject());
      const result = await getDetailSingleTokenInfo("coingecko_id");
      expect(result).toEqual(expectedResult);
      expect(coingeckoApi.get).toHaveBeenCalledTimes(1);
      expect(coingeckoApi.get).toHaveBeenCalledWith(
        "/coins/coingecko_id?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
      );
    });
  });
});
