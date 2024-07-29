// import { setAppSliceState } from "@slices/appSlice";
// import { setNewWalletState } from "@slices/newWalletSlice";
// import { StaticStore } from "store/store";
// import CachedService from "classes/cachedService";

// //import all hooks here
// import { shouldBehaveLikeAUseAccountsSortHook } from "./1_useAccountsSort.test";
// import { shouldBehaveLikeUseAfterTransactionHook } from "./2_useAfterTransaction.test";
// import { shouldBehaveLikeAUseAllWalletsHook } from "./3_useAllWallets.test";
// import { shouldBehaveLikeUseAppHook } from "./4_useApp.test";
// import { shouldBehaveLikeAUseClipboardHook } from "./5_useClipboard.test";
// import { shouldBehaveLikeAUseCommonHook } from "./6_useCommon.test";
// import { shouldBehaveLikeAUseDashboardHook } from "./7_useDashboard.test";
// import { shouldBehaveLikeAUseGraphDataHook } from "./8_useGraphData.test";
// import { shouldBehaveLikeAUseHoverHook } from "./9_useHover.test";
// import { shouldBehaveLikeAUseIntervalHook } from "./10_useInterval.test";
// import { shouldBehaveLikeAUseLoginHook } from "./11_useLogin.test";
// import { shouldBehaveLikeAUseLongPressHook } from "./12_useLongPress.test";
// import { shouldBehaveLikeAUseNetworkHook } from "./13_useNetwork.test";
// import { shouldBehaveLikeUseSeedPhraseHook } from "./14_useSeedphrase.test";
// import { shouldBehaveLikeUseSelectAddressHook } from "./15_useSelectAddress.test";
// import { shouldBehaveLikeUseSelectTokenHook } from "./16_useSelectToken.test";
// import { shouldBehaveLikeUseSendTransactionHook } from "./17_useSendTransaction.test";
// import { shouldBehaveLikeUseSpeedOrCancelHook } from "./18_useSpeedOrCancel.test";
// import { shouldBehaveLikeUseStep2Hook } from "./19_useStep2.test";
// import { shouldBehaveLikeUseStep3Hook } from "./20_useStep3.test";
// import { shouldBehaveLikeUseStep4Hook } from "./21_useStep4.test";
// import { shouldBehaveLikeUseSwap1InchHook } from "./22_useSwap1Inch.test";
// import { shouldBehaveLikeUseSwapNEARHook } from "./23_useSwapNEAR.test";
// import { shouldBehaveLikeUseTxActivityHook } from "./24_useTxActivity.test";
// import { shouldBehaveLikeUseWalletFilterHook } from "./25_useWalletFilter.test";
// import { shouldBehaveLikeUseAccounts } from "./26_useAccounts.test";

// describe("utils files test cases", () => {
// 	beforeAll(() => {
// 		jest.spyOn(CachedService, "getHashedPassword").mockReturnValue("0x4cc447191e19f3d492b3e6dc74172a6ea597c68880b62674e21af15b90022e35");
// 	});


// 	describe("should behave like use accounts sort", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseAccountsSortHook();
// 	});


// 	describe("should behave like use after transaction", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseAfterTransactionHook();
// 	});


// 	describe("should behave like use all wallets", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseAllWalletsHook();
// 	});


// 	describe("should behave like use app", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseAppHook();
// 	});


// 	describe("should behave like use clipbaord", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseClipboardHook();
// 	});

// 	describe("should behave like use common", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseCommonHook();
// 	});

// 	describe("should behave like use dashboard", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseDashboardHook();
// 	});

// 	describe("should behave like use graph data", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseGraphDataHook();
// 	});

// 	describe("should behave like use hover", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseHoverHook();
// 	});

// 	// describe("should behave like use interval", () => {
// 	// 	StaticStore.dispatch(setAppSliceState());
// 	// 	StaticStore.dispatch(setNewWalletState());
// 	// 	// jest.clearAllMocks();
// 	// 	// jest.resetAllMocks();
// 	// 	shouldBehaveLikeAUseIntervalHook();
// 	// });

// 	describe("should behave like use login", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseLoginHook();
// 	});

// 	describe("should behave like use long press", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseLongPressHook();
// 	});

// 	describe("should behave like use network", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeAUseNetworkHook();
// 	});

// 	describe("should behave like use seed phrase", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSeedPhraseHook();
// 	});

// 	describe("should behave like use select address", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSelectAddressHook();
// 		// console.log("==========SELECT ADDRESS DONE")
// 	});

// 	describe("should behave like use select token", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSelectTokenHook();
// 		// console.log("==========SELECT TOKEN DONE")
// 	});

// 	describe("should behave like use send transaction", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSendTransactionHook();
// 		// console.log("==========SEND TRANSACTION DONE")
// 	});

// 	describe("should behave like use speed or cancle", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSpeedOrCancelHook();
// 		// console.log("==========SPEED OR CANCEL DONE")
// 	});

// 	describe("should behave like use step 2", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseStep2Hook();
// 		// console.log("==========STEP 2 DONE")
// 	});

// 	describe("should behave like use step 3", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseStep3Hook();
// 		// console.log("==========STEP 3 DONE")
// 	});

// 	describe("should behave like use step 4", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseStep4Hook();
// 		// console.log("==========STEP 4 DONE")
// 	});

// 	describe("should behave like use swap 1inch", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSwap1InchHook();
// 		// console.log("==========SWAP 1INCH DONE")
// 	});


// 	describe("should behave like use swap NEAR", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseSwapNEARHook();
// 		// console.log("==========SWAP NEAR DONE")
// 	});

// 	describe("should behave like use Tx activity", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseTxActivityHook();
// 		// console.log("==========TX ACTIVITY DONE")
// 	});

// 	describe("should behave like use wallet filter", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseWalletFilterHook();
// 		// console.log("==========WALLET FILTER DONE")
// 	});

// 	describe("should behave like use accounts", () => {
// 		StaticStore.dispatch(setAppSliceState());
// 		StaticStore.dispatch(setNewWalletState());
// 		// jest.clearAllMocks();
// 		// jest.resetAllMocks();
// 		shouldBehaveLikeUseAccounts();
// 		// console.log("==========ACCOUNTS DONE")
// 	});

// });
