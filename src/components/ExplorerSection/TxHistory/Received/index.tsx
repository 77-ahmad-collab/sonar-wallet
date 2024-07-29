import { FC, useState } from "react";
import { Collapse, Divider } from "@mui/material";

import Amount from "../components/Amount";
import Subtitle from "../components/Subtitle";
import Title from "../components/Title";
import { TxHistoryReceivedProps as PROPS } from "interfaces";
import { RenderSendOrReceiveTransactionContent } from "components";

const Received: FC<PROPS> = ({
  item: {
    txType,
    from,
    to,
    token,
    transactionFeeInUsd,

    chainId,
    transactionHash,
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
      <Title TxType={txType} toOrFrom={walletName} chainId={chainId} name="" />

      <Divider sx={{ borderBottomWidth: 2 }} />

      <Collapse in={!expandStatus} timeout={0}>
        <Subtitle
          txType={txType}
          token={token}
          from={from}
          status={status}
          name={senderNameInTheAddressBook}
        />
      </Collapse>

      <Collapse in={expandStatus}>
        <div className="pd-md">
          <Amount TxType={txType} token={token} status={status} />
          <RenderSendOrReceiveTransactionContent
            value={token.amountInUsd}
            fees={transactionFeeInUsd}
            sender={from}
            receiver={to}
            chainId={chainId}
            transactionHash={transactionHash}
            senderNameInTheAddressBook={senderNameInTheAddressBook}
            receiverNameInTheAddressBook={receiverNameInTheAddressBook}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default Received;
