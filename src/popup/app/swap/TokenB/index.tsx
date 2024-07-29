import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import validator from "validator";

import {
  BalanceBoxStyled,
  SpanOpacityStyled,
  StyledAmountInput,
  SwapTokenBoxStyled,
  Text,
  TokenSelectionBoxStyled,
} from "@styled";
import { useAppDispatch, useAppSelector } from "store/store";
import {
  AmountTokenB,
  SelectTokenLocationState,
  SetAmountTokenB,
} from "interfaces";
import { setSwapSelectedTokens } from "@slices/newWalletSlice";
import { truncateName } from "utils";
import { formatAmount, toFixed } from "utils/formatters";
import { ImageContent } from "components";

type Props = {
  amountTokenB: AmountTokenB;
  setAmountTokenB: SetAmountTokenB;

  setCurrentRatio: React.Dispatch<React.SetStateAction<number>>;
};

const TokenB = ({ amountTokenB, setAmountTokenB, setCurrentRatio }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isHoldFinish } = useAppSelector((state) => state.app);

  const {
    swapSelectedTokens: { tokenA, tokenB },
  } = useAppSelector((state) => state.newWallet);

  /**
   * @description open select token screen and pass state to navigation
   *
   */
  const navigateTokenBSelection = () =>
    tokenA.address &&
    navigate("/send/selecttoken", {
      state: {
        isSwap: {
          forTokenA: false,
          forTokenB: true,
        },
      } as SelectTokenLocationState,
    });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value.trim();
    if (amount === "" || validator.isFloat(amount)) {
      setInputAmount(amount);
      setCurrentRatio(0);
    }
  };

  const setInputAmount = (amount: string) => {
    setAmountTokenB({
      amount: amount,
      amountInUsd: (tokenB.price * Number(amount)).toString(),
    });

    dispatch(
      setSwapSelectedTokens({
        error: {
          message: "Fetching....",
          open: true,
        },
        warning: "",
      })
    );
  };

  return (
    <div>
      <SwapTokenBoxStyled
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "12px",
        }}
      >
        <Text
          weight={500}
          style={{ opacity: 0.3, alignSelf: "flex-start" }}
          className="f-body-sm  mgb-sm"
        >
          Receive
        </Text>
        <div className="r-fe-sb" style={{ width: "100%" }}>
          <Text size={28}>
            <StyledAmountInput
              id="swap-tokenB-input"
              placeholder="0"
              onChange={handleChange}
              value={toFixed(amountTokenB.amount)}
              style={{
                width: "100%",
                textAlign: "start",
                textDecoration: "none",
              }}
              disabled={true}
            />
          </Text>

          <TokenSelectionBoxStyled
            id="swap-tokenB-navigateTokenASelection"
            onClick={navigateTokenBSelection}
            disabled={isHoldFinish}
          >
            {tokenB.address && (
              <ImageContent
                src={tokenB.image}
                Size={{ borderRadius: "50%", width: "30px", height: "30px" }}
              />
            )}
            <Text
              id="swap-tokenB-text"
              className="f-body-lg scrollHost"
              customStyle={{
                marginLeft: "6px",
                display: "inline",
                width: "max-content",
                textAlign: "center",
              }}
            >
              {tokenB.address ? truncateName(tokenB.symbol) : "Select Token"}
            </Text>
            <FontAwesomeIcon icon={faSortDown} className="sortDownIcon" />
          </TokenSelectionBoxStyled>
        </div>
      </SwapTokenBoxStyled>

      {tokenB.address && (
        <BalanceBoxStyled>
          <Text className="f-body" weight={400}>
            <SpanOpacityStyled id="swap-tokenB-usd-amount" opacity={0.7}>
              {" "}
              {`~ ${formatAmount(+amountTokenB.amountInUsd)} `}
            </SpanOpacityStyled>
            <SpanOpacityStyled opacity={0.4}> USD</SpanOpacityStyled>
          </Text>
          <Text className="f-body" weight={400}>
            <SpanOpacityStyled opacity={0.4}>Balance: </SpanOpacityStyled>
            <SpanOpacityStyled opacity={0.7} id="swap-tokenB-balance">
              {formatAmount(tokenB.balance)} {truncateName(tokenB.symbol)}
            </SpanOpacityStyled>
          </Text>
        </BalanceBoxStyled>
      )}
    </div>
  );
};

export default TokenB;
