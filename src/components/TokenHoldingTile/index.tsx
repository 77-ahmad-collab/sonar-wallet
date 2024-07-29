import { FC, useMemo, useState } from "react";
import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  ArrowStyled,
  LeftBox,
  RightBox,
  Text,
  TokenTileWrapper,
} from "@styled";
import { ImageContent, Switch } from "components";
import { formatAmount } from "utils/formatters";
import { TokenHoldingTileProps as PROPS, TokenHistoryInfo } from "interfaces";
import { useAppDispatch, useAppSelector } from "store/store";
import {
  setTokenActiveness,
  setTokenHoldings,
  setTokenInfo,
} from "@slices/newWalletSlice";
import common from "utils/common";
import { fetchImageAndUpdateTokenPrice } from "utils/utils.wallets";

import { ProcessHoldings } from "classes";
import { setNewDefaultToken, setNonNativeDefault } from "@slices/appSlice";

const TokenHoldingTile: FC<PROPS> = ({
  isEditlist,
  singleTokenHolding,
  showAccounts,
  isExpanded,
  onTokenSelect,
  index,
  chainIndex,
}) => {
  const {
    image,
    symbol,
    name,
    balance,
    balanceInUsd,
    isActive,
    address,
    decimals,
  } = singleTokenHolding;

  const { nonNativeDefaultAndTopTokens } = useAppSelector((state) => state.app);
  const { tokenHoldings } = useAppSelector((state) => state.newWallet);

  const {
    nonNativeDefaultAndTopTokens: { tokens },
  } = useAppSelector((state) => state.app);
  const { tokenInfo } = useAppSelector((state) => state.newWallet);

  const [isSwitch, setSwitch] = useState(isActive);

  const dispatch = useAppDispatch();

  const onSwitchClick = () => {
    if (!tokenInfo?.[`${address}_${symbol}`]) {
      addCustomTokenInHoldings({
        accounts: {},

        image,
        isActive: true,
        priceInUSD: tokens[address]?.usdPrice || 0,
        tokenAddress: address,
        tokenBalance: balance,
        tokenDecimal: decimals,
        tokenName: name,
        tokenSymbol: symbol,
      });
    }
    handleSwitchChange();
  };

  const handleSwitchChange = async () => {
    setSwitch(!isSwitch);

    const switchState = !isSwitch;
    const singleTokenInfo = tokenInfo?.[`${address}_${symbol}`];
    setTimeout(() => {
      dispatch(
        setTokenActiveness({
          tokenAddress: singleTokenHolding.address,
          tokenSymbol: singleTokenHolding.symbol,
          state: switchState,
        })
      );
    }, 100);

    setTimeout(() => {
      setSwitch(false);
    }, 1300);
    if (singleTokenInfo)
      fetchImageAndUpdateTokenPrice({
        isActive: switchState,
        singleTokenInfo,
        address: singleTokenHolding.address,
        symbol,
      });
  };

  const addCustomTokenInHoldings = async (
    TokenHistoryInfo: TokenHistoryInfo
  ) => {
    if (!TokenHistoryInfo) {
      return;
    }

    const tokenData = tokens[TokenHistoryInfo.tokenAddress];
    const { chainFamily, chainId, coingeckoId } = tokenData;

    const Processor = new ProcessHoldings(tokenHoldings, tokenInfo);

    const {
      tokenName,
      tokenSymbol,
      image,
      tokenDecimal,
      tokenAddress,
      isActive,
    } = TokenHistoryInfo;

    Processor.addCustomToken(`${chainFamily}`, chainId, {
      name: tokenName,
      symbol: tokenSymbol,
      image,
      decimals: tokenDecimal,
      address: tokenAddress,
      isActive,
      coingeckoId,
      price: 0,
    });

    const defaultTokensCopy = { ...nonNativeDefaultAndTopTokens.tokens };
    delete defaultTokensCopy[tokenAddress];

    dispatch(setTokenInfo(Processor.allTokenInfo));
    dispatch(setTokenHoldings(Processor.allHoldings));
    dispatch(
      setNewDefaultToken({
        name: tokenName,
        symbol: tokenSymbol,
        image,
        decimals: tokenDecimal,
        address: tokenAddress,
        isActive,
        chainFamily,
        chainId,
        coingeckoId,
      })
    );
    dispatch(setNonNativeDefault(defaultTokensCopy));
  };

  const ActiveTokenInEditList = useMemo(
    () => isEditlist && singleTokenHolding.isActive,
    [singleTokenHolding.isActive, isEditlist]
  );

  const colorCode = useMemo(
    () => (ActiveTokenInEditList ? "1,1,1" : "255,255,255"),
    [ActiveTokenInEditList]
  );

  return (
    <TokenTileWrapper
      id={`TokenHoldingTile-${chainIndex}-${index}`}
      ActiveTokenInEditList={ActiveTokenInEditList}
      onClick={() => onTokenSelect(singleTokenHolding)}
    >
      <ImageContent
        src={image}
        Size={{
          width: "30px",
          height: "30px",
          marginRight: "10px",
          borderRadius: "50%",
        }}
      />
      <LeftBox>
        <Text
          className="f-body-md"
          weight={500}
          style={{
            color: `rgba(${colorCode},1)`,
            ...common.r_c_c,
          }}
        >
          {symbol}
          {showAccounts && (
            <ArrowStyled isExpanded={isExpanded}>
              <FontAwesomeIcon
                icon={faSortDown}
                style={{
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              />
            </ArrowStyled>
          )}
        </Text>
        <Text
          className="f-label"
          weight={400}
          customStyle={{
            marginTop: "4px",
            opacity: "0.4",
            color: `rgba(${colorCode},1)`,
          }}
        >
          {name}
        </Text>
      </LeftBox>
      <RightBox>
        {isEditlist ? (
          <Switch
            checked={isSwitch}
            handleSwitchChange={onSwitchClick}
            isEditlist={true}
            tokenIndex={index}
            chainIndex={chainIndex}
          />
        ) : (
          <Text className="f-body-md" weight={500}>
            {formatAmount(balance)}
          </Text>
        )}
        <Text
          className="f-label"
          weight={400}
          customColor={`rgba(${colorCode},0.7)`}
          customStyle={{ marginTop: "4px" }}
        >
          {isEditlist ? (
            <>
              Token price:{" "}
              {formatAmount(
                tokenInfo[`${address}_${symbol}`]?.price ||
                  tokens[address]?.usdPrice ||
                  0
              )}
            </>
          ) : (
            formatAmount(balanceInUsd)
          )}
          <span style={{ color: `rgba(${colorCode},0.4)` }}>USD</span>
        </Text>
      </RightBox>
    </TokenTileWrapper>
  );
};

export default TokenHoldingTile;
