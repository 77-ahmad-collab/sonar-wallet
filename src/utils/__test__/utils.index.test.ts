// import { setAppSliceState } from "@slices/appSlice";
// import { setNewWalletState } from "@slices/newWalletSlice";
// import { StaticStore } from "store/store";
// import { utilHoldings } from "./1_utils.holdings.test";
// import { utilWallet } from "./2_utils.wallet.test";
// import { utilFormatter } from "./3_formatters.test";
// import { utilIndex } from "./4_index.test";
// import { util1inch } from "./5_utils.1inch.test";
// import { utilDapp } from "./6_utils.dapp.test";
// import { utilGas } from "./7_utils.gas.test";
// import { utilNearTest } from "./8_utils.near.test";
// import { utilSeedphrase } from "./9_utils.seedphrase.test";
// import { utilValidAddress } from "./10_validAddresses.test";
// import { utilApi } from "./11_utils.api.test";
// import { utilPrices } from "./12_utils.prices.test";
// import { utilSwap } from "./13_utils.swap.test";
// import { utilSend } from "./14_utils.send.test";
// import { utilActivity } from "./15_utils.activity.test";
// import { utilStorage } from "./16_utils.storage.test";
// import { generateNotificationTest } from "./17_utils.notifications.test";

// import CachedService from "classes/cachedService";
// jest.mock("near-api-js", () => {
//   const originalModule = jest.requireActual("near-api-js");
//   return {
//     __esModule: true,
//     ...originalModule,

//     KeyPair: {
//       fromString: jest
//         .fn()
//         .mockReturnValue(
//           "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
//         ),
//     },
//     providers: {
//       JsonRpcProvider: jest.fn().mockReturnValue({
//         query: jest.fn().mockImplementation(() => "access"),
//         block: jest.fn().mockResolvedValue({
//           header: {
//             hash: "0x11111111111111",
//           },
//         }),
//       }),
//     },
//     transactions: {
//       createTransaction: jest.fn().mockImplementation(() => "neartx"),
//       signTransaction: jest
//         .fn()
//         .mockReturnValue([
//           "",
//           "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
//         ]),
//       functionCall: jest.fn(),
//     },
//     utils: {
//       PublicKey: {
//         from: jest.fn(),
//       },
//       serialize: {
//         base_decode: jest.fn(),
//       },
//     },
//   };
// });
// describe("utils files test cases", () => {
//   beforeAll(() => {
//     jest
//       .spyOn(CachedService, "getHashedPassword")
//       .mockReturnValue(
//         "0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35"
//       );
//   });

//   beforeEach(() => {
//     // jest.resetAllMocks();
//     // jest.clearAllMocks();
//   });

//   describe("should behave utilWallet", () => {
//     utilWallet();
//   });

//   describe("should behave like formatter file", () => {
//     StaticStore.dispatch(setAppSliceState());
//     StaticStore.dispatch(setNewWalletState());
//     // jest.clearAllMocks();
//     // jest.resetAllMocks();
//     utilFormatter();
//   });

//   describe("should behave like utils index file", () => {
//     StaticStore.dispatch(setAppSliceState());
//     StaticStore.dispatch(setNewWalletState());
//     // jest.clearAllMocks();
//     // jest.resetAllMocks();
//     utilIndex();
//   });

//   describe("utilHoldings", () => {
//     StaticStore.dispatch(setAppSliceState());
//     StaticStore.dispatch(setNewWalletState());
//     // jest.clearAllMocks();
//     // jest.resetAllMocks();
//     utilHoldings();
//   });
//   // describe("should behave like  utils1inch", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   util1inch();
//   // });

//   // describe("should behave like  utilDapp", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilDapp();
//   // });

//   // describe("should behave like utilGas", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();

//   //   utilGas();
//   // });

//   // describe("should behave like utilNear", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilNearTest();
//   // });

//   // describe("should behave like utilSeedphrase", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilSeedphrase();
//   // });
//   // describe("should behave like  utilValidAddress", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilValidAddress();
//   // });
//   // describe("should behave like  utilApi", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilApi();
//   // });

//   // describe("utilPrices", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilPrices();
//   // });
//   // describe("utilSwap", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilSwap();
//   // });

//   // describe("utilSend", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilSend();
//   // });

//   // describe("utilActivity", () => {
//   //   // StaticStore.dispatch(setAppSliceState());
//   //   // StaticStore.dispatch(setNewWalletState());
//   //   // jest.clearAllMocks();
//   //   // jest.resetAllMocks();
//   //   utilActivity();
//   // });

//   // describe("utilStorage", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   jest.clearAllMocks();
//   //   jest.resetAllMocks();
//   //   utilStorage();
//   // });
//   // describe("utilNotifications", () => {
//   //   StaticStore.dispatch(setAppSliceState());
//   //   StaticStore.dispatch(setNewWalletState());
//   //   jest.clearAllMocks();
//   //   jest.resetAllMocks();
//   //   generateNotificationTest();
//   // });
// });
