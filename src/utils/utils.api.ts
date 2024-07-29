import axios, { AxiosResponse } from "axios";

import coingeckoApi from "../store/apis/CoinGecko";
import { BASE_URL } from "../api";
import { DUMMY_IMAGE_URL, GRAPH_PERIODS } from "./constants";
import { GraphQueryData } from "interfaces";

/**
 * calls backend to fetch monthly, daily or weekly prices data
 * of the given tokens
 * @param tokens type GraphQueryData
 * @param period type GRAPH_PERIODS
 */
export const fetchGraphDataApi = async (
  tokens: GraphQueryData,
  period: GRAPH_PERIODS
) => {
  const response: AxiosResponse<{ data: number[]; profit: number }, any> =
    await axios.post(`${BASE_URL}/graph/data/${period}`, {
      ...tokens,
    });
  if (!response) {
    return {
      data: {
        data: [],
        profit: 0,
      },
    };
  }

  if (
    response.data.data.some((item) => item == 0) &&
    Object.keys(tokens).length > 0
  ) {
    return {
      data: {
        data: [
          179.35568917477684, 180.8559826055093, 172.60754673825062,
          171.95654722378924, 170.78764949952105, 153.9282333632558,
          160.51429472099122, 183.1469637185326, 181.99619920485776,
          199.56980220764927, 196.88406266403413, 196.9417714054181,
          196.61833213541212, 194.3468640065813, 196.90749618149303,
        ],
        profit: 0,
      },
    };
  }

  return response;
};

/**
 * calls backend to fetch coingecko ids of of array of tokens addresses
 * in a single api call.
 * @param addresses type string
 */
export const fetchMultipleCoingeckoIds = async (addresses: string[]) => {
  const response: AxiosResponse<string[], any> = await axios.post(
    `${BASE_URL}/tokens/get-coingecko-ids`,
    {
      addresses,
    }
  );
  return response.data ?? [];
};

/**
 * calls coingecko server to fetch a detailed info about a single token
 * @param coingeckoId type string
 */
export const getDetailSingleTokenInfo = async (coingeckoId: string) => {
  try {
    const response: AxiosResponse<
      {
        market_data: {
          price_change_percentage_24h: number;
          current_price: { usd: number };
        };
        description: { en: string };
        image: {
          thumb: string;
        };
      },
      any
    > = await coingeckoApi.get(
      `/coins/${coingeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    // console.log(response, "THE RESPONSE");
    return response.data;
  } catch (error) {
    return {
      market_data: {
        price_change_percentage_24h: 0,
        current_price: { usd: 0 },
      },
      description: { en: "" },
      image: {
        thumb: DUMMY_IMAGE_URL,
      },
    };
  }
};
/**
 * calls coingecko server to fetch a detailed info about a single token
 * @param coingeckoId type string
 */
export const getDetailSingleTokenInfoInDapp = async (coingeckoId: string) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { method: "GET" }
    );

    const stringifyData = await response.text();
    const data: {
      market_data: {
        price_change_percentage_24h: number;
        current_price: { usd: number };
      };
      description: { en: string };
      image: {
        thumb: string;
      };
    } = JSON.parse(stringifyData);
    return data;
  } catch (error) {
    return {
      market_data: {
        price_change_percentage_24h: 0,
        current_price: { usd: 0 },
      },
      description: { en: "" },
      image: {
        thumb: DUMMY_IMAGE_URL,
      },
    };
  }
};

/**
 * calls conigecko server to fetch usd prices of multiple tokens in a single api call
 * @param coingeckoIds type sting[]
 * @param currency type string
 */
export const getMultipleTokenPrices = async (
  coingeckoIds: string[],
  currency = "usd"
) => {
  let singleStringIds = "";
  coingeckoIds.forEach(
    (id) => (singleStringIds = singleStringIds.concat(`%2C${id}`))
  );
  const response: AxiosResponse<{ [id: string]: { usd: number } }, unknown> =
    await coingeckoApi.get(
      `/simple/price?ids=${singleStringIds.replace(
        "%2C",
        ""
      )}&vs_currencies=${currency}`
    );

  console.log("response", response);
  if (response?.status === 200 && Object.keys(response.data).length > 0) {
    return response.data;
  }
  return {};
};
