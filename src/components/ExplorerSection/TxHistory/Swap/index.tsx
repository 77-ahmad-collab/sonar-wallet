import { Collapse, Divider } from "@mui/material";
import { FC, useState } from "react";

import Title from "../components/Title";
import { TxHistorySwapProps as PROPS } from "interfaces";
import { RenderSwapTransactionContent } from "components";
import Amount from "../components/Amount";

import SwapingSubTile from "../components/Subtitle/swapingSubTile";

const Swap: FC<PROPS> = ({
  item: {
    txType,
    from,
    to,
    token,
    tokenB,
    transactionFeeInUsd,

    chainId,
    status,

    transactionHash,
    makerBalance,
    makerBalanceInUsd,
    takerBalance,
    takerBalanceInUsd,
    tokenAprice,
    tokenBprice,
    isDappTransaction,
  },
}) => {
  /* global-state */

  /* local-state */
  const [expandStatus, setExpandStatus] = useState<boolean>(false);

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div
      style={{ width: "100%" }}
      onClick={() => setExpandStatus(!expandStatus)}
    >
      <Title
        TxType={txType}
        toOrFrom={from}
        chainId={chainId}
        name=""
        isDappTransaction={isDappTransaction}
      />

      <Divider sx={{ borderBottomWidth: 2 }} />

      <Collapse in={!expandStatus}>
        <SwapingSubTile
          TokenA={token}
          TokenB={tokenB}
          status={status}
          isDappTransaction={isDappTransaction}
        />
      </Collapse>

      <Collapse in={expandStatus}>
        <div className="pd-md">
          <Amount
            TxType={txType}
            token={token}
            token1={tokenB}
            status={status}
            isDappTransaction={isDappTransaction}
          />
          <RenderSwapTransactionContent
            snackbar={false}
            value={token.amountInUsd}
            fees={transactionFeeInUsd}
            sender={from}
            receiver={to}
            chainId={chainId}
            transactionHash={transactionHash}
            makerBalance={makerBalance}
            makerBalanceInUsd={makerBalanceInUsd}
            takerBalance={takerBalance}
            takerBalanceInUsd={takerBalanceInUsd}
            tokenAname={token.symbol}
            tokenBname={tokenB.symbol}
            tokenAprice={tokenAprice}
            tokenBprice={tokenBprice}
            isDappTransaction={isDappTransaction}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default Swap;
