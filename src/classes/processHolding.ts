import {
  AddressWithChainId,
  AllWallets,
  AnkrResponseAsset,
  INON_NATIVE_DEFAULT,
  SingleEthHistory,
  TokenHoldings,
  TokenInfo,
} from "interfaces";
import { StaticStore } from "store/store";
import { checkSum, matchAddresses } from "utils";
import {
  AnkerChainIds,
  NATIVE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
} from "utils/constants";
import {
  fetchMultipleCoingeckoIds,
  getMultipleTokenPrices,
} from "utils/utils.api";
import { getSortedAccounts } from "utils/utils.holdings";

interface HoldingsThatArrived {
  [chainId: string]: {
    [token_address: string]: boolean;
  };
}

/**
 * @class A class that takes all the holdings from Ankr, SOLANA, NEAR and EVM token-history
 * and does the following operations
 */

export class ProcessHoldings {
  allHoldings: TokenHoldings;
  allTokenInfo: TokenInfo;
  tkAddressesForCoinGeckoIds: string[];
  tokenIdentitiesForCoinGeckoIds: string[];

  /**
   * initialize allHoldings and allTokenInfo
   *
   * @param tokenHoldings current tokenHolding of redux
   * @param tokenInfo current tokenInfo of redux
   */
  constructor(tokenHoldings: TokenHoldings = {}, tokenInfo: TokenInfo = {}) {
    this.allHoldings = Object.assign({}, tokenHoldings);
    this.allTokenInfo = Object.assign({}, tokenInfo);
    this.tkAddressesForCoinGeckoIds = [];
    this.tokenIdentitiesForCoinGeckoIds = [];
  }

  /**
   * converts history holdings into standard TokenHolding format used in redux
   * and stores inside local holding state of class
   *
   * @param holdings array of history holdings
   * @param chainId current chain
   * @param address current address
   */
  processTokenHoldings(
    holdings: SingleEthHistory[],
    chainId: number,
    address: string
  ) {
    if (holdings.length > 0) {
      // make deep copy of object to avoid any referencing issues
      const copyHolding: TokenHoldings = JSON.parse(
        JSON.stringify(this.allHoldings)
      );

      // make sure the address and chain is available
      const holdingsThatArrived: HoldingsThatArrived = {};
      copyHolding[address] ?? (copyHolding[address] = {});
      copyHolding[address][chainId] ?? (copyHolding[address][chainId] = {});
      holdingsThatArrived[chainId] ?? (holdingsThatArrived[chainId] = {});

      holdings.forEach((singleHolding) => {
        this.collectTokenInfo(singleHolding);

        copyHolding[address][chainId][singleHolding.tokenAddress] = {
          rawAmount: singleHolding.tokenBalanceRawInteger,
          symbol: singleHolding.tokenSymbol,
        };
        holdingsThatArrived[chainId][singleHolding.tokenAddress] = true;
      });

      // incase if the token gets zero which was previously not zero
      copyHolding[address] = this.makeTheRestHoldingZero(
        copyHolding[address],
        holdingsThatArrived
      );
      this.allHoldings = Object.assign({}, copyHolding);
      console.log(
        "🚀 ~ file: processHolding.ts:94 ~ ProcessHoldings ~ this.allHoldings:",
        this.allHoldings,
        this.tkAddressesForCoinGeckoIds
      );
    }
  }

  /**
   * converts ankr response holdings into standard TokenHolding format used in redux
   * and stores inside local holding state of class
   *
   * @param holdings array of ankr response holding
   * @param address current address
   */
  processAnkrHoldings(holdings: AnkrResponseAsset[], address: string) {
    if (holdings.length) {
      const copyHolding: TokenHoldings = {};

      const holdingsThatArrived: HoldingsThatArrived = {};
      copyHolding[address] ?? (copyHolding[address] = {});

      holdings.forEach((singleHolding) => {
        this.collectAnkrTokenInfo(singleHolding);

        const chainId =
          AnkerChainIds[singleHolding.blockchain as keyof typeof AnkerChainIds];
        copyHolding[address][chainId] ?? (copyHolding[address][chainId] = {});
        holdingsThatArrived[chainId] ?? (holdingsThatArrived[chainId] = {});

        copyHolding[address][chainId][this.returnTokenAddress(singleHolding)] =
          {
            rawAmount: singleHolding.balanceRawInteger,
            symbol: singleHolding.tokenSymbol,
          };
        holdingsThatArrived[chainId][this.returnTokenAddress(singleHolding)] =
          true;
      });

      // incase if the token gets zero which was previously not zero
      copyHolding[address] = this.makeTheRestHoldingZero(
        copyHolding[address],
        holdingsThatArrived
      );
      this.allHoldings = Object.assign({}, this.allHoldings, copyHolding);
    }
  }

  /**
   * checks if the incoming holding does not have the previous holding then
   * make its holding to zero
   *
   * @param copyAddressHolding TokenHoldings["address"]
   * @param holdingsThatArrived HoldingsThatArrived
   * @returns updated copyAddressHolding
   */
  makeTheRestHoldingZero(
    copyAddressHolding: TokenHoldings["address"],
    holdingsThatArrived: HoldingsThatArrived
  ) {
    for (const arrivedChainId in holdingsThatArrived) {
      const copyHoldingOfthisChain =
        StaticStore.getState().newWallet.tokenHoldings[arrivedChainId];
      for (const tokenAddress in copyHoldingOfthisChain) {
        if (!holdingsThatArrived[arrivedChainId][tokenAddress]) {
          copyAddressHolding[arrivedChainId][tokenAddress] = {
            rawAmount: "0",
            symbol: copyAddressHolding[arrivedChainId][tokenAddress].symbol,
          };
        }
      }
    }
    return { ...copyAddressHolding };
  }

  /**
   * extracts standard TokenInfo from ankr holding and stores inside
   * local tokeninfo state of class
   *
   * @param ankrHolding AnkrResponseAsset
   */
  collectAnkrTokenInfo(ankrHolding: AnkrResponseAsset) {
    const latestWalletState = StaticStore.getState().newWallet;
    const tokenAddress = this.returnTokenAddress(ankrHolding);
    const tokenIdentity = `${tokenAddress}_${ankrHolding.tokenSymbol}`;
    const latestTokenInfo = latestWalletState.tokenInfo;
    // bring latest token active state from redux if it exists else false
    const isTokenActive =
      latestWalletState.tokenInfo[tokenIdentity]?.isActive ?? false;
    if (!latestTokenInfo[tokenIdentity]) {
      const newTokenInfo: TokenInfo = {
        [tokenIdentity]: {
          name: ankrHolding.tokenName,
          symbol: ankrHolding.tokenSymbol,
          image: ankrHolding.thumbnail,
          decimals: ankrHolding.tokenDecimals,
          address: tokenAddress,
          isActive: isTokenActive,
          coingeckoId: "",
          price: 0,
        },
      };
      this.allTokenInfo = Object.assign({}, this.allTokenInfo, newTokenInfo);
      // push its address to fetch it's coingecko id
      this.addInCoinGeckoListToFetch(tokenAddress, tokenIdentity);
    } else {
      // if tokeninfo exist but coingeckoId does not exist then push its address to fetch it's coingecko id
      if (!latestTokenInfo[tokenIdentity].coingeckoId) {
        this.addInCoinGeckoListToFetch(tokenAddress, tokenIdentity);
      }
    }
  }

  /**
   * extracts standard TokenInfo from history holding and stores inside
   * local tokeninfo state of class
   * @param holding type SingleEthHistory
   */
  collectTokenInfo(holding: SingleEthHistory) {
    const latestWalletState = StaticStore.getState().newWallet;
    const latestTokenInfo = latestWalletState.tokenInfo;
    const tokenIdentity = `${holding.tokenAddress}_${holding.tokenSymbol}`;
    // bring latest token active state from redux if it exists else false
    const isTokenActive =
      (latestWalletState.tokenInfo[tokenIdentity]?.isActive ||
        matchAddresses(holding.tokenAddress, NATIVE_TOKEN_ADDRESS)) ??
      false;
    if (!latestTokenInfo[tokenIdentity]) {
      const newTokenInfo: TokenInfo = {
        [tokenIdentity]: {
          name: holding.tokenName,
          symbol: holding.tokenSymbol,
          image: holding.image,
          decimals: holding.tokenDecimal,
          address: holding.tokenAddress,
          isActive: isTokenActive,
          coingeckoId: "",
          price: 0,
        },
      };
      this.allTokenInfo = Object.assign({}, this.allTokenInfo, newTokenInfo);
      // push its address to fetch it's coingecko id
      this.addInCoinGeckoListToFetch(holding.tokenAddress, tokenIdentity);
    } else {
      // if tokeninfo exist but coingeckoId does not exist then push its address to fetch it's coingecko id
      if (!latestTokenInfo[tokenIdentity].coingeckoId) {
        this.addInCoinGeckoListToFetch(holding.tokenAddress, tokenIdentity);
      }
    }
  }

  /**
   * adds custom token to tokenHolding state and tokenInfo state of class
   * @param chainFamily type string
   * @param chainId type number
   * @param customTokenInfo type TokenInfo["tokenAddress_symbol"]
   */
  addCustomToken(
    chainFamily: string,
    chainId: number,
    customTokenInfo: TokenInfo["tokenAddress_symbol"]
  ) {
    const allAccounts = getSortedAccounts();
    const thisChainFamilyAccounts = allAccounts[chainFamily];

    const customTokenIdentity = `${customTokenInfo.address}_${customTokenInfo.symbol}`;
    if (!this.allTokenInfo[customTokenIdentity]) {
      const copyHolding = JSON.parse(JSON.stringify(this.allHoldings));
      thisChainFamilyAccounts.forEach((address) => {
        const thisAddressHolding =
          copyHolding[address] ?? (copyHolding[address] = {});
        const thisChainHolding =
          thisAddressHolding[chainId] ?? (thisAddressHolding[chainId] = {});
        thisChainHolding[customTokenInfo.address] = {
          rawAmount: "0",
          symbol: customTokenInfo.symbol,
        };
        copyHolding[address] = thisAddressHolding;
      });
      this.allHoldings = Object.assign({}, copyHolding);
      this.allTokenInfo = Object.assign({}, this.allTokenInfo, {
        [customTokenIdentity]: {
          ...customTokenInfo,
        },
      });
    }
  }

  /**
   * adds native and non native default tokens to tokenHoldings and tokenInfo of class
   * only works if user is importing wallet through seedphrase
   * @param chainIds type number[]
   * @param newWallet type AllWallets["walletName"]
   * @param nonNatives type INON_NATIVE_DEFAULT
   */
  addDefaultTokens(
    chainIds: number[],
    // additionalTokens: Record<string, unknown>,
    newWallet: AllWallets["walletName"],
    nonNatives: INON_NATIVE_DEFAULT
  ) {
    const copyHolding: TokenHoldings = JSON.parse(
      JSON.stringify(this.allHoldings)
    );
    let copyAllTokenInfo = JSON.parse(JSON.stringify(this.allTokenInfo));

    const NETWORKCHAIN = StaticStore.getState().app.NETWORKCHAIN;
    // adding native tokens
    chainIds.forEach((chainId) => {
      const {
        chain,
        NATIVE_TOKEN_ADDRESS,
        NATIVE_TOKEN_SYMBOL,
        DECIMALS,
        LOGO,
        NATIVE_TOKEN_COINGECKO_ID,
        NATIVE_TOKEN_NAME,
      } = NETWORKCHAIN[chainId];
      const accountsOfThisChainFamily =
        newWallet[chain as keyof typeof newWallet];
      if (typeof accountsOfThisChainFamily === "object") {
        accountsOfThisChainFamily.forEach((address) => {
          copyHolding[address] ?? (copyHolding[address] = {});

          copyHolding[address][chainId] = {
            [NATIVE_TOKEN_ADDRESS]: {
              rawAmount: "0",
              symbol: NATIVE_TOKEN_SYMBOL,
            },
          };
        });
      }

      const tokenPrice =
        this.allTokenInfo[`${NATIVE_TOKEN_ADDRESS}_${NATIVE_TOKEN_SYMBOL}`]
          ?.price;

      const nativeTokenInfo: TokenInfo = {
        [`${NATIVE_TOKEN_ADDRESS}_${NATIVE_TOKEN_SYMBOL}`]: {
          name: NATIVE_TOKEN_NAME,
          symbol: NATIVE_TOKEN_SYMBOL,
          decimals: DECIMALS,
          address: NATIVE_TOKEN_ADDRESS,
          isActive: true,
          image: LOGO,
          coingeckoId: NATIVE_TOKEN_COINGECKO_ID,
          price: tokenPrice ?? 0,
        },
      };
      copyAllTokenInfo = Object.assign({}, copyAllTokenInfo, nativeTokenInfo);
    });

    // adding non native tokens
    nonNatives.forEach((token) => {
      const accountsOfThisChainFamily =
        newWallet[token.chainFamily as keyof typeof newWallet];
      if (typeof accountsOfThisChainFamily === "object") {
        accountsOfThisChainFamily.forEach((address) => {
          copyHolding[address] ?? (copyHolding[address] = {});
          copyHolding[address][token.chainId] ??
            (copyHolding[address][token.chainId] = {});

          copyHolding[address][token.chainId][token.address] = {
            rawAmount: "0",
            symbol: token.symbol,
          };
        });
      }
      const isActive =
        StaticStore.getState().newWallet.tokenInfo?.[
          `${token.address}_${token.symbol}`
        ]?.isActive;

      const nonNativeTokenInfo: TokenInfo = {
        [`${token.address}_${token.symbol}`]: {
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          address: token.address,
          isActive: isActive || token.isActive,
          image: token.image,
          coingeckoId: token.coingeckoId,
          price: 0,
        },
      };
      copyAllTokenInfo = Object.assign(
        {},
        copyAllTokenInfo,
        nonNativeTokenInfo
      );
    });

    this.allTokenInfo = Object.assign({}, this.allTokenInfo, copyAllTokenInfo);
    this.allHoldings = Object.assign({}, this.allHoldings, copyHolding);
  }

  /**
   * fetches coingecko Ids of tokens from the server and populate
   * them into their respective tokenInfo
   */
  async injectCoingeckoIdsInTokenInfo() {
    const CG_ids = await fetchMultipleCoingeckoIds(
      this.tkAddressesForCoinGeckoIds
    );
    if (CG_ids.length > 0) {
      this.tokenIdentitiesForCoinGeckoIds.forEach((tokenIdentity, index) => {
        // if coingecko id is found then add it in the respective tokeninfo
        if (CG_ids[index] !== "") {
          this.allTokenInfo[tokenIdentity].coingeckoId = CG_ids[index];
        }
      });
    }
  }

  /**
   * fetches latest token prices of all the tokens who's coingecko
   * id exists in tokenInfo and update their price in tokenInfo.
   */
  async fetchTokenPrices() {
    try {
      const tokenIdentities: string[] = [];
      const coingeckoIds: string[] = [];
      const latestTokenInfo = StaticStore.getState().newWallet.tokenInfo;
      for (const tokenIdentity in latestTokenInfo) {
        const { coingeckoId } = latestTokenInfo[tokenIdentity];
        if (coingeckoId) {
          tokenIdentities.push(tokenIdentity);
          coingeckoIds.push(latestTokenInfo[tokenIdentity].coingeckoId);
        }
      }
      const tokenPrices = await getMultipleTokenPrices(coingeckoIds);
      const updatedTokenInfos: TokenInfo = {};
      tokenIdentities.forEach((tokenIdentity, index) => {
        const updatedPrice = tokenPrices[coingeckoIds[index]]?.usd ?? 0;
        updatedTokenInfos[tokenIdentity] = {
          ...latestTokenInfo[tokenIdentity],
          price: updatedPrice,
        };
      });
      this.allTokenInfo = Object.assign(
        {},
        this.allTokenInfo,
        updatedTokenInfos
      );
    } catch (error) {
      return this.allTokenInfo;
    }
  }

  calculateRemainingBalanceInUsds(_txHistoryAddresses: AddressWithChainId[]) {
    // txHistoryAddresses.forEach((addressWithChainId) => {
    // const { address, chainId } = addressWithChainId;
    // const holdingsOfThisChain = this.allHoldings[address]?.[chainId] ?? {};
    // for (const tkAddress in holdingsOfThisChain) {
    // const tokenHolding = holdingsOfThisChain[tkAddress];
    // const tokenIdentity = `${tkAddress}_${tokenHolding.symbol}`;
    // const tokenPrice =
    //   this.allTokenInfo[tokenIdentity]?.price ??
    //   StaticStore.getState().newWallet.tokenInfo[tokenIdentity]?.price;
    // this.allHoldings[address][chainId][tkAddress].amountInUsd =
    //   this.allHoldings[address][chainId][tkAddress].amount * tokenPrice;
    //TODO: refactor this
    // }
    // });
  }

  /**
   * converts address to a checksum address and handles
   * native token address and zero address
   * @param singleHolding type AnkrResponseAsset
   * @returns checksum address
   */
  returnTokenAddress(singleHolding: AnkrResponseAsset) {
    return !singleHolding.contractAddress ||
      matchAddresses(singleHolding.contractAddress, ZERO_ADDRESS)
      ? // hot fix when ankr does not return contract address key or contract-address is zero address
        NATIVE_TOKEN_ADDRESS
      : checkSum(singleHolding.contractAddress);
  }

  /**
   * populates the local states for coingecko fetching
   * @param tokenAddress type string
   * @param tokenIdentity type string
   */
  addInCoinGeckoListToFetch(tokenAddress: string, tokenIdentity: string) {
    this.tkAddressesForCoinGeckoIds.push(tokenAddress);
    this.tokenIdentitiesForCoinGeckoIds.push(tokenIdentity);
  }

  /**
   * set local holding state to empty object
   */
  clearAllHoldings() {
    this.allHoldings = {};
  }

  /**
   * set local tokenInfo state to empty object
   */
  clearAllTokenInfo() {
    this.allTokenInfo = {};
  }

  /**
   * set coingecko lists array to empty
   */
  cleartokenAddandIdentitiesCoingeckoIds() {
    this.tkAddressesForCoinGeckoIds = [];
    this.tokenIdentitiesForCoinGeckoIds = [];
  }
}
