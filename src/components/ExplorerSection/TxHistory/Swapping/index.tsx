import { FC } from "react";
import { Divider } from "@mui/material";

import { MarginWrapper } from "@styled";
import Title from "../components/Title";
import { TxHistorySwappingProps as PROPS } from "interfaces";
import SwapingSubTile from "../components/Subtitle/swapingSubTile";
import { SpeedUpCancelButton } from "components";
import { ACTIVITY_STATUS_TYPES } from "utils/constants";

const Swapping: FC<PROPS> = ({ item }) => {
  /* global-state */

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div>
      <Title
        TxType={item.txType}
        toOrFrom={item.from}
        chainId={item.chainId}
        status={ACTIVITY_STATUS_TYPES.pending}
        name={""}
        isDappTransaction={item.isDappTransaction}
      />

      <Divider sx={{ borderBottomWidth: 2 }} />
      <SwapingSubTile
        TokenA={item.token}
        TokenB={item.tokenB}
        status={item.status}
        isDappTransaction={item.isDappTransaction}
      />
      <MarginWrapper>
        <SpeedUpCancelButton
          isSpeedUpEnabled={item.isSpeedUpEnabled}
          isCancelEnabled={item.isCancelEnabled}
          rawData={item.rawData}
          transactionHash={item.transactionHash}
          txType={item.txType}
          tokenAddress={item.token.address}
        />
      </MarginWrapper>
    </div>
  );
};
export default Swapping;
