import {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import Accounts from "./Accounts";
import { RenderTokensListProps as PROPS, TokensProps } from "interfaces";
import { TokenHoldingTile } from "components";
import {
  TokensAccordion,
  TokensAccordionDetails,
  TokensAccordionSummary,
} from "@styled";
import { useAppSelector } from "store/store";
import { APPSCREENS } from "theme/constants";

const MyTokens: FC<TokensProps> = ({
  tokens,
  onTokenSelect,
  chainId,
  showAllHoldings,
  showActiveOnly,
  showInactiveOnly,
  fetchMoreTokens,
  chainIndex,
}) => {
  const observer = useRef();

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const lastBookElementRef = useCallback(
    (node: any) => {
      //@ts-ignore
      if (observer.current) observer.current.disconnect();
      //@ts-ignore
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      //@ts-ignore
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    // console.log("Fetching more data...");
    fetchMoreTokens(chainId, pageNumber);
  }, [pageNumber]);

  return (
    <>
      {Object.values(tokens).map((singleToken, key) => {
        let shouldShowToken = false;
        if (showAllHoldings) {
          shouldShowToken = true;
        } else if (showActiveOnly && singleToken.isActive) {
          shouldShowToken = true;
        } else if (showInactiveOnly && !singleToken.isActive) {
          shouldShowToken = true;
        }

        if (!shouldShowToken) return null;

        if (Object.keys(tokens).length === key + 1) {
          return (
            <RenderTokensList
              key={key}
              singleToken={singleToken}
              onTokenSelect={onTokenSelect}
              chainId={chainId}
              myRef={lastBookElementRef}
              chainIndex={chainIndex}
              index={key}
            />
          );
        } else {
          return (
            <RenderTokensList
              key={key}
              singleToken={singleToken}
              onTokenSelect={onTokenSelect}
              chainId={chainId}
              chainIndex={chainIndex}
              index={key}
            />
          );
        }
      })}
    </>
  );
};

const RenderTokensList: FC<PROPS> = ({
  singleToken,
  onTokenSelect,
  chainId,
  index,
  chainIndex,
  myRef,
}) => {
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);
  const { tokenSelected, accounts, allWallets, tokenInfo, secondaryHoldings } =
    useAppSelector((state) => state.newWallet);
  const { pathname } = useLocation();

  const [expanded, setExpanded] = useState(false);

  const accountsList = useMemo(
    () => Object.keys(singleToken.accounts),
    [singleToken]
  );

  const shouldShowAccounts = useMemo(
    () => accountsList.length > 1,
    [accountsList]
  );

  const handleChange = (event: SyntheticEvent, newExpanded: boolean) =>
    shouldShowAccounts && setExpanded(newExpanded);

  const handleAccountSelection = (accAddress: string) => {
    if (expanded) {
      finalTokenSelection(accAddress);
    }
  };

  const handleTokenSelection = (accAddress: string) => {
    finalTokenSelection(accAddress);
  };

  const finalTokenSelection = (accAddress: string) => {
    const tokenIdentity = `${singleToken.address}_${singleToken.symbol}`;

    const tokenId = `${NETWORKCHAIN[chainId].NATIVE_TOKEN_NAME}_${NETWORKCHAIN[chainId].NATIVE_TOKEN_ADDRESS}_${NETWORKCHAIN[chainId].NATIVE_TOKEN_SYMBOL}`;

    const nativeBalance =
      secondaryHoldings[chainId]?.tokens?.[tokenId]?.accounts[accAddress]
        ?.balance || 0;

    const rawNativeBalance =
      secondaryHoldings[chainId]?.tokens?.[tokenId]?.accounts[accAddress]
        ?.rawBalance || "0";

    onTokenSelect({
      ...tokenSelected,
      token: {
        ...tokenSelected.token,
        address: singleToken.address,
        name: singleToken.name,
        symbol: singleToken.symbol,
        decimals: singleToken.decimals,
        image: singleToken.image,
        chainId: chainId,
        multiAccountExist: shouldShowAccounts,
        coingeckoId: tokenInfo[tokenIdentity]?.coingeckoId || "",
        price: tokenInfo[tokenIdentity]?.price || 0,
      },
      from: {
        ...tokenSelected.from,
        address: accAddress,
        name: singleToken.accounts[accAddress].name,
        balance: singleToken.accounts[accAddress].balance,
        rawBalance: singleToken.accounts[accAddress].rawBalance,
        balanceInUsd: singleToken.accounts[accAddress].balanceInUsd,
        chainFamily: NETWORKCHAIN[chainId].chain,
        walletName: allWallets[accounts[accAddress]?.walletId]?.name || "",
        nativeTokenBalance: nativeBalance,
        nativeTokenBalanceInRaw: rawNativeBalance,
      },
    });
  };

  return (
    <TokensAccordion expanded={expanded} onChange={handleChange} myref={myRef}>
      <TokensAccordionSummary
        expandIcon={null}
        id={`RenderTokensList-TokensAccordionSummary-${chainIndex}-${index}`}
      >
        <TokenHoldingTile
          isEditlist={pathname === APPSCREENS.editList}
          singleTokenHolding={singleToken}
          showAccounts={shouldShowAccounts}
          isExpanded={expanded}
          onTokenSelect={() =>
            !shouldShowAccounts &&
            handleTokenSelection(Object.keys(singleToken.accounts)[0])
          }
          index={index}
          chainIndex={chainIndex}
        />
      </TokensAccordionSummary>
      <TokensAccordionDetails
        id={`RenderTokensList-TokensAccordionDetails-${chainIndex}-${index}`}
      >
        <Accounts
          singleTokenHolding={singleToken}
          onAccountSelect={(accAddress) => handleAccountSelection(accAddress)}
          chainIndex={chainIndex}
          tokenIndex={index}
        />
      </TokensAccordionDetails>
    </TokensAccordion>
  );
};

export default MyTokens;
