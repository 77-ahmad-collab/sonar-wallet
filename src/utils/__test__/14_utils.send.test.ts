import { getSendTransactionRawData } from "utils/utils.send";
import * as ETHTX from "@ethereumjs/tx";

// export const utilSend = () =>
describe("utils.send", () => {
  it("should return the raw data", async () => {
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
    const data = await getSendTransactionRawData(
      "",
      {},
      "0x6e99aEF6bF2e9eB63BC2D3b5DDeE79CeeF52D847",
      "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
    );
    expect(data).toBeDefined();
  });
});
