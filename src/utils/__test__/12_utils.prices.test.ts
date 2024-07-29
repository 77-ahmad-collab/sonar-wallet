import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { waitFor } from "@testing-library/react";
import { fetchCoingeckoIDandPriceFromAddress } from "utils/utils.prices";
// import { mockedData } from "./payload/utils.prices";

// export const utilPrices = () =>
describe("Fetch coingecko id and price of the given token address ", () => {
  it("can return token prices with token balance", async () => {
    const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const res = await fetchCoingeckoIDandPriceFromAddress(USDT);
    await waitFor(async () => {
      expect(res).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          price: expect.any(Number),
        })
      );
    });
  }, 60000);

  it("should not fetch token id and price because of not found", async () => {
    await waitFor(async () => {
      const BANANA_TOKEN = "0xd29e06f8d8a2Ac31c838566fb3d79c7c020569ab";
      const res = await fetchCoingeckoIDandPriceFromAddress(BANANA_TOKEN);
      await waitFor(async () => {
        expect(res).toEqual(
          expect.objectContaining({
            id: "",
            price: 0,
          })
        );
      });
    });
  }, 60000);

  it("should throw error of malformed token address", async () => {
    await waitFor(async () => {
      const BANANA_TOKEN = "0xd29e06f8d8a2Ac31c838566fb3d79c7c020569a";
      const res = await fetchCoingeckoIDandPriceFromAddress(BANANA_TOKEN);
      await waitFor(async () => {
        expect(res).toEqual(
          expect.objectContaining({
            id: "",
            price: 0,
          })
        );
      });
    });
  }, 60000);
});
// };
