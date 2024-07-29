import { FC, useState } from "react";
import { Collapse, Divider } from "@mui/material";

import Amount from "../components/Amount";
import Subtitle from "../components/Subtitle";
import Title from "../components/Title";
import { TxHistorySentProps as PROPS } from "interfaces";
import { TX_TYPES } from "utils/constants";
import { RenderSendOrReceiveTransactionContent } from "components";

const Sent: FC<PROPS> = ({
  item: {
    txType,
    from,
    to,

    transactionFeeInUsd,

    chainId,
    transactionHash,
    token,
    walletName,
    status,
    senderNameInTheAddressBook,
    receiverNameInTheAddressBook,
  },
}) => {
  /* global-state */

  /* local-state */
  const [expandStatus, setExpandStatus] = useState<boolean>(false);

  /* hooks */
  /* functions */

  /* effects */

  return (
    <div onClick={() => setExpandStatus(!expandStatus)}>
      <Title
        TxType={TX_TYPES.Sent}
        toOrFrom={to}
        chainId={chainId}
        name={receiverNameInTheAddressBook}
        isDappTransaction={false}
      />

      <Divider sx={{ borderBottomWidth: 2 }} />
      <Collapse in={!expandStatus}>
        <Subtitle
          txType={txType}
          token={token}
          from={walletName}
          status={status}
          name=""
        />
      </Collapse>

      <Collapse in={expandStatus}>
        <div className="pd-md">
          <Amount
            TxType={TX_TYPES.Sent}
            token={token}
            status={status}
            isDappTransaction={false}
          />
          <RenderSendOrReceiveTransactionContent
            value={token.amountInUsd}
            fees={transactionFeeInUsd}
            sender={from}
            receiver={to}
            chainId={chainId}
            transactionHash={transactionHash}
            receiverNameInTheAddressBook={receiverNameInTheAddressBook}
            senderNameInTheAddressBook={senderNameInTheAddressBook}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default Sent;
