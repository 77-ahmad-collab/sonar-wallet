import { useMemo } from "react";
import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import validator from "validator";
import { useNavigate } from "react-router";
import BigNumber from "bignumber.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";

import {
  BalanceBoxStyled,
  SpanOpacityStyled,
  StyledAmountInput,
  SwapTokenBoxStyled,
  Text,
  TokenSelectionBoxStyled,
} from "@styled";
import { AmountPercentageBtn, ImageContent } from "components";
import { formatAmount, toFixed, toReadableAmount } from "utils/formatters";
import {
  AmountTokenA,
  SelectTokenLocationState,
  SetAmountTokenA,
} from "interfaces";
import { useAppDispatch, useAppSelector } from "store/store";
import { setSwapSelectedTokens } from "@slices/newWalletSlice";
import { matchAddresses, truncateName } from "utils";
import {
  AMOUNT_25_PERCENT,
  AMOUNT_50_PERCENT,
  AMOUNT_MAX_PERCENT,
  NATIVE_TOKEN_ADDRESS,
} from "utils/constants";

type Props = {
  amountTokenA: AmountTokenA;
  setAmountTokenA: SetAmountTokenA;
  currentRatio: number;
  setCurrentRatio: React.Dispatch<React.SetStateAction<number>>;
  setIsMaxAmountDeducted: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

const TokenA = ({
  amountTokenA,
  setAmountTokenA,
  currentRatio,
  setCurrentRatio,
  // setIsMaxAmountDeducted,
  // setRefreshKey,
  progress,
  setProgress,
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    swapSelectedTokens: { tokenA, tokenB },
  } = useAppSelector((state) => state.newWallet);

  const { isHoldFinish } = useAppSelector((state) => state.app);

  /**
   * @description open select token screen and pass state to navigation
   *
   */
  const navigateTokenASelection = () =>
    navigate("/send/selecttoken", {
      state: {
        isSwap: {
          forTokenA: true,
          forTokenB: false,
        },
      } as SelectTokenLocationState,
    });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value.trim();
    if (amount === "" || validator.isFloat(amount)) {
      setCurrentRatio(0);
      setInputAmount(amount);
    }
  };

  const setInputAmount = (amount: string) => {
    setAmountTokenA({
      amount: amount,
      amountInUsd: (tokenA.price * parseFloat(amount)).toString(),
    });

    setCurrentRatio(0);

    dispatch(
      setSwapSelectedTokens({
        error: {
          message: "Fetching...",
          open: true,
        },
        warning: "",
      })
    );
  };

  /**
   * @description set MAX amount of token
   * @param ratio 25% or 50% or 100%
   */
  const onRatioClick = (ratio: number) => {
    if (
      !new BigNumber(tokenA.rawBalance).isZero() &&
      tokenA.address &&
      tokenB.address
    ) {
      const newAmountInRaw = new BigNumber(tokenA.rawBalance)
        .times(ratio)
        .toFixed(0);
      const newAmount = toReadableAmount(newAmountInRaw, tokenA.decimals);

      setInputAmount(toFixed(newAmount.toString()));
      setCurrentRatio(ratio);
    }
  };

  const ButtonsInfo = useMemo(() => {
    return [
      {
        text: "MAX",
        onClick: () => onRatioClick(AMOUNT_MAX_PERCENT),
        ratio: AMOUNT_MAX_PERCENT,
        disabled:
          Boolean(!(tokenA.address && tokenB.address)) ||
          matchAddresses(tokenA.address, NATIVE_TOKEN_ADDRESS) ||
          isHoldFinish,
      },
      {
        text: "50%",
        onClick: () => onRatioClick(AMOUNT_50_PERCENT),
        ratio: AMOUNT_50_PERCENT,
        disabled: Boolean(!(tokenA.address && tokenB.address)) || isHoldFinish,
      },
      {
        text: "25%",
        onClick: () => onRatioClick(AMOUNT_25_PERCENT),
        ratio: AMOUNT_25_PERCENT,
        disabled: Boolean(!(tokenA.address && tokenB.address)) || isHoldFinish,
      },
    ];
  }, [tokenA.address, tokenB.address, isHoldFinish]);

  return (
    <div>
      <SwapTokenBoxStyled
        marginTop={12}
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          className="r-c-sb full-width  mgb-sm"
          style={{ alignSelf: "flex-start" }}
        >
          <div className="r-c-c">
            <Text weight={500} style={{ opacity: 0.3 }} className="f-body-sm">
              Spend
            </Text>

            <AmountPercentageBtn
              currentRatio={currentRatio}
              ButtonsInfo={ButtonsInfo}
            />
          </div>

          <motion.div
            variants={{
              rotate: {
                rotate: 360,
              },
            }}
            animate={progress >= 100 ? "rotate" : "exit"}
            transition={{ duration: 1 }}
          >
            <IconButton
              aria-label="refresh"
              onClick={() => {
                setProgress(100);
              }}
              style={{
                pointerEvents: isHoldFinish ? "none" : "auto",
                opacity: isHoldFinish ? 0.4 : 1,
              }}
            >
              <RefreshIcon sx={{ color: "#37FE87" }} fontSize="medium" />
            </IconButton>
          </motion.div>
        </div>

        <div className="r-fe-sb">
          <Text size={28}>
            <StyledAmountInput
              id="swap-tokenA-input"
              placeholder="0"
              onChange={handleChange}
              value={amountTokenA.amount}
              style={{
                width: "100%",
                textAlign: "start",
                textDecoration: "none",
              }}
              disabled={
                tokenA.address && tokenB.address && !isHoldFinish ? false : true
              }
              autoComplete="off"
            />
          </Text>

          <TokenSelectionBoxStyled
            id="swap-tokenA-navigateTokenASelection"
            onClick={navigateTokenASelection}
            disabled={isHoldFinish}
          >
            {tokenA.address && (
              <ImageContent
                src={tokenA.image}
                Size={{ borderRadius: "50%", width: "30px", height: "30px" }}
              />
            )}
            <Text
              id="swap-tokenA-text"
              className="f-body-lg scrollHost"
              customStyle={{
                marginLeft: "6px",
                display: "inline",
                width: "max-content",
                textAlign: "center",
              }}
            >
              {tokenA.address ? truncateName(tokenA.symbol) : "Select Token"}
            </Text>
            <FontAwesomeIcon icon={faSortDown} className="sortDownIcon" />
          </TokenSelectionBoxStyled>
        </div>
      </SwapTokenBoxStyled>

      {tokenA.address && (
        <BalanceBoxStyled>
          <Text className="f-body" weight={400}>
            <SpanOpacityStyled id="swap-tokenA-usd-amount" opacity={0.7}>
              {" "}
              {`~ ${formatAmount(+amountTokenA.amountInUsd)} `}
            </SpanOpacityStyled>
            <SpanOpacityStyled opacity={0.4}> USD</SpanOpacityStyled>
          </Text>
          <Text className="f-body" weight={400}>
            <SpanOpacityStyled opacity={0.4}>Balance: </SpanOpacityStyled>
            <SpanOpacityStyled opacity={0.7} id="swap-tokenA-balance">
              {formatAmount(tokenA.balance)} {truncateName(tokenA.symbol)}
            </SpanOpacityStyled>
          </Text>
        </BalanceBoxStyled>
      )}
    </div>
  );
};

export default TokenA;
