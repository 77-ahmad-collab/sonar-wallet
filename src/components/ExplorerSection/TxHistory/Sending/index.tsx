import { FC } from "react";
import { Divider } from "@mui/material";

import { TxHistorySendingProps as PROPS } from "interfaces";
import { ACTIVITY_STATUS_TYPES, TX_TYPES } from "utils/constants";
import { MarginWrapper } from "@styled";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import { SpeedUpCancelButton } from "components";

const Sending: FC<PROPS> = ({ item }) => {
  /* global-state */

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div>
      <Title
        TxType={"Sent"}
        toOrFrom={item.to}
        chainId={1}
        status={ACTIVITY_STATUS_TYPES.pending}
        name={item.receiverNameInTheAddressBook}
        isDappTransaction={item.isDappTransaction}
      />

      <Divider sx={{ borderBottomWidth: 2 }} />

      <Subtitle
        txType={TX_TYPES.Sent}
        token={item.token}
        from={item.walletName}
        status={item.status}
        name=""
      />
      <MarginWrapper>
        <SpeedUpCancelButton
          isSpeedUpCancelBlinking={item.isSpeedUpCancelBlinking}
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

export default Sending;
