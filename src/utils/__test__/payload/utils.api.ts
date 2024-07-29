import { DUMMY_IMAGE_URL } from "utils/constants";

const fetchGraphDataApiData = {
  mockData: {
    binancecoin: 0.009967765,
    sonar: 0.008384872,
    "avalanche-2": 0.016352705381998903,
    near: 0.37994837982944607,
  },
  mockPeriod: 30,
};

const responseData = {
  market_data: {
    price_change_percentage_24h: 0,
    current_price: { usd: 0 },
  },
  description: { en: "" },
  image: {
    thumb: DUMMY_IMAGE_URL,
  },
};

const expectedResult = {
  market_data: {
    price_change_percentage_24h: 0,
    current_price: { usd: 0 },
  },
  description: { en: "" },
  image: {
    thumb: DUMMY_IMAGE_URL,
  },
};

export { fetchGraphDataApiData, responseData, expectedResult };
