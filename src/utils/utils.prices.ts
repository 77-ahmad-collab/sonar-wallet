import {
  fetchMultipleCoingeckoIds,
  getDetailSingleTokenInfo,
} from "./utils.api";

/**
 * helping function used in a condition when we need to fetch price
 * from coingecko without knowing coingecko id
 * @param tokenAddress string
 * @returns . { id: string, price: number }
 */
export const fetchCoingeckoIDandPriceFromAddress = async (
  tokenAddress: string
) => {
  const initialRes = {
    id: "",
    price: 0,
  };
  try {
    const coingeckoIds = await fetchMultipleCoingeckoIds([tokenAddress]);
    if (coingeckoIds[0]) {
      const info = await getDetailSingleTokenInfo(coingeckoIds[0]);
      return {
        id: coingeckoIds[0],
        price: info.market_data.current_price.usd,
      };
    }
    return initialRes;
  } catch {
    return initialRes;
  }
};
