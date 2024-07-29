import { getSwapTokens } from "./../utils/utils.swap";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useLocation, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "store/store";
import {
  setDefaultSwapSelectedTokens,
  setDefaultTokenSelected,
  setTokenSelected,
} from "@slices/newWalletSlice";
import { getFilteredTokensList } from "utils/utils.holdings";
import { setRecentSearchedKeywords } from "@slices/appSlice";
// import { NETWORKCHAIN } from "utils/constants";
import {
  dispatchSwapTokenA,
  dispatchSwapTokenB,
  filterSwapTokens,
} from "utils/utils.swap";
import {
  IAccount,
  ITokenA,
  Location,
  SecondaryHoldings,
  SelectTokenLocationState,
  TokenSelected,
} from "interfaces";

export const useSelectToken = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation() as Location<SelectTokenLocationState>;

  const isSwap = useMemo(
    () => state?.isSwap as { forTokenA: boolean; forTokenB: boolean },
    [state]
  );

  const { recentSearchedKeywords, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );
  const {
    filteredHoldings: Holdings,
    swapSelectedTokens: { tokenA, account },
  } = useAppSelector((state) => state.newWallet);

  const [filteredHoldings, setFilteredHoldings] = useState<SecondaryHoldings>(
    {}
  );
  const [value, setValue] = useState("");
  const [hasMorePages, sethasMorePages] = useState(false);
  const [hasPreviousPages, sethasPreviousPages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * This function is used on an onClick event on the icon used in the top header.
   * If it is used in swap page simply navigate backwards.
   * Else move to dashboard.
   */
  const onTopImageClick = () => {
    if (isSwap) {
      navigate(-1);
    } else {
      navigate("/index.html");
      dispatch(setDefaultTokenSelected());
    }
  };

  /**
   * This function dispatches the token selection events for Token A in the Swap.
   *
   * @param {TokenSelected} tokenSelected  The Token Selection object
   */

  const onTokenASelect = async (tokenSelected: TokenSelected) => {
    // console.log("tokenSelected", tokenSelected);

    await dispatch(setDefaultSwapSelectedTokens());
    await dispatchSwapTokenA(tokenSelected);
  };

  /**
   * This function is used to dispatch a token selection event when a tokenB is selected in the Swap.
   *
   * @param {TokenSelected} tokenSelected The Token Selection object
   */
  const onTokenBSelect = async (tokenSelected: TokenSelected) => {
    await dispatchSwapTokenB(tokenSelected);
  };

  /**
   *  handleChange is a function which takes a ChangeEvent as an argument
   * and sets the value of the event target to the setValue function.
   *
   * @param event - ChangeEvent which contains the target value
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setIsLoading(true);
  };

  /**
   * swapTokenAHoldings is a function that filters a given "Holdings" object and returns a new "filteredList" object.
   * This function includes Holdings and  isSwap?.forTokenA in its dependencies.
   * The filtered object will only contain holdings of those chainIds in which the swap is enabled, and will be assigned to the filteredList object.
   * If the "isSwap" object is not provided or does not contain a "forTokenA" property, the original "filteredList" object will be returned.
   *
   * @returns {Object} A "filteredList" object containing the filtered holdings on which the swap is enabled.
   */

  // when showing select token screen to select swap token A
  const swapTokenAHoldings = useMemo(() => {
    const filteredList: SecondaryHoldings = {};
    if (isSwap && isSwap.forTokenA) {
      for (const chainId in Holdings) {
        if (NETWORKCHAIN[+chainId].isSwap) {
          Object.assign(filteredList, {
            [chainId]: Holdings[chainId],
          });
        }
      }
    }
    return filteredList;
  }, [Holdings, isSwap?.forTokenA]);

  /**
   * Checks if send is enabled, gets the filter holdings with the given value and Holdings
   *
   * @param {bool} isSwap - Flag to check if swap is enabled
   * @param {string} value - value to filter the holdings
   * @param {Array} Holdings - Array of holdings to filter
   */
  useEffect(() => {
    // incase it's send flow
    if (!isSwap) {
      getFilterHoldings(value, Holdings);
    }
  }, [value, Holdings]);

  /**
   * It is in the case of swapTokenA flow.
   * The condition in the useEffect checks if `isSwap` is true and then checks if `isSwap?.forTokenA` is true.
   * If both conditions are true, the function `getFilterHoldings` is called with `value` and `swapTokenAHoldings` as parameters.
   * In order to get the filter holding for selecting tokenA.
   */
  useEffect(() => {
    if (isSwap) {
      if (isSwap?.forTokenA) {
        getFilterHoldings(value, swapTokenAHoldings);
      }
    }
  }, [value, swapTokenAHoldings]);

  /**
   * Checks if isSwap is true and if isSwap?.forTokenB is true
   * and then calls the fetchSwapTokenBHoldings function with
   * the parameters value, through which we want to filter the holding for tokenB
   */
  useEffect(() => {
    // incase it's swap token B flow
    if (isSwap) {
      if (isSwap?.forTokenB) {
        fetchSwapTokenBHoldings(value.trim(), tokenA, account);
      }
    }
  }, [value, tokenA, account]);

  /**
   * This function is used when showing select token screen to select swap token B
   */
  const fetchSwapTokenBHoldings = useCallback(
    debounce(async (value: string, tokenA: ITokenA, account: IAccount) => {
      const { tokens, hasMorePages } = await getSwapTokens(
        tokenA.chainId,
        1,
        value
      );

      const { toTokens } = filterSwapTokens(
        tokens,
        tokenA.chainId,
        account,
        tokenA
      );

      setIsLoading(false);
      getFilterHoldings("", toTokens);
      sethasMorePages(hasMorePages);
    }, 200),
    []
  );

  /*
   * This function gets a filtered tokens based on a value, a  holdings, a boolean value for a showing zero holdings and another boolean value for sorting the
   * holdings .
   * It then sets the filtered holdings.
   */
  const getFilterHoldings = useCallback(
    debounce((value: string, Holdings: SecondaryHoldings) => {
      const holding = getFilteredTokensList(
        value,
        Holdings,
        isSwap && isSwap?.forTokenB,
        !(isSwap && isSwap?.forTokenB)
      );

      setFilteredHoldings(holding);
      setIsLoading(false);
    }, 500),
    []
  );

  /**
   * This function is used in case of tokenB. As we have used pagination because of the larger token list.
   * @param chainId number
   * @param pageNumber number
   * This method checks if all the tokens fetched or if there are more pages. If there is, then it will fetch the next page token
   */
  const fetchMoreTokens = (chainId: number, pageNumber: number) => {
    if (isSwap) {
      if (isSwap?.forTokenB) {
        // incase it's swap token B flow
        console.log("fetchMoreTokens", chainId, pageNumber);

        if (!hasMorePages || value.length > 0) {
          return;
        }

        setTimeout(async () => {
          const { tokens, hasMorePages } = await getSwapTokens(
            tokenA.chainId,
            pageNumber,
            ""
          );

          const { toTokens } = filterSwapTokens(
            tokens,
            tokenA.chainId,
            account,
            tokenA
          );

          let reduceTokenList = {};
          reduceTokenList = {
            ...reduceTokenList,
            [+tokenA.chainId]: {
              ...filteredHoldings[chainId],
              tokens: {
                ...filteredHoldings[chainId].tokens,
                ...toTokens[chainId].tokens,
              },
            },
          };

          getFilterHoldings("", reduceTokenList); //while scrolling dont search
          sethasMorePages(hasMorePages);
        }, 100);
      }
    }
  };

  /**
   * This method is responsible, whenever token Selection event is being performed
   * This function is used to set the recent searched keywords, select tokens and navigate to the swap screen
   * @param {TokenSelected} tokenSelected The token selected by the user
   *
   * In case of swap, it will be differentiated for tokenA selection and tokenB selection
   */

  const onTokenSelection = async (tokenSelected: TokenSelected) => {
    dispatch(setRecentSearchedKeywords(tokenSelected.token.symbol));

    // in case of swap token selection
    if (isSwap) {
      if (isSwap?.forTokenA) {
        await onTokenASelect(tokenSelected);
      } else if (isSwap?.forTokenB) {
        await onTokenBSelect(tokenSelected);
      }
    } else {
      // in case of send token selection
      await dispatch(setTokenSelected(tokenSelected));
      navigate("/send/selectAddress");
    }
  };

  return {
    handleChange,
    value,
    onTokenSelection,
    filteredHoldings,
    onTopImageClick,
    setValue,
    recentSearchedKeywords,
    isSwap,
    fetchMoreTokens,
    isLoading,
  };
};
