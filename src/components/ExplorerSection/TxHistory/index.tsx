import { FC, useEffect, useState } from "react";
import { faClockRotateLeft } from "@fortawesome/pro-regular-svg-icons";

import { ActivityBoxWrapper, Text, TxHistoryWrapper } from "@styled";
import Received from "./Received";
import Sent from "./Sent";
import Swap from "./Swap";
import moment from "moment";
import Sending from "./Sending";
import Swapping from "./Swapping";
import {
  TxHistoryProps as PROPS,
  SwapTransactionData,
  TransactionData,
} from "interfaces";
import { ACTIVITY_STATUS_TYPES, TX_TYPES } from "utils/constants";
import { useTxActivity } from "hooks";
import { EmptyAddress } from "components";

const TxHistory: FC<PROPS> = ({ height }) => {
  /* global-state */

  /* local-state */

  const [message, setMessage] = useState("Loading...");
  /* hooks */

  const { filteredActivity } = useTxActivity();
  /* functions */
  const renderSwitch = (item: TransactionData | SwapTransactionData) => {
    if (item.txType === TX_TYPES.Received) return <Received item={item} />;
    else if (
      item.txType === TX_TYPES.Sent &&
      item.status !== ACTIVITY_STATUS_TYPES.pending
    )
      return <Sent item={item} />;
    else if (
      item.txType === TX_TYPES.Swap &&
      item.status !== ACTIVITY_STATUS_TYPES.pending &&
      "tokenB" in item
    )
      return <Swap item={item} />;
    else if (
      item.txType === TX_TYPES.Sent &&
      item.status === ACTIVITY_STATUS_TYPES.pending
    )
      return <Sending item={item} />;
    else if (
      item.txType === TX_TYPES.Swap &&
      item.status === ACTIVITY_STATUS_TYPES.pending &&
      "tokenB" in item
    )
      return <Swapping item={item} />;
    else return null;
  };

  const checkSameDate = (ts: string | number, i: number) => {
    if (i === 0) {
      return true;
    }
    const prevTs = filteredActivity[i - 1].timeStamp;
    const currTs = ts;
    const prevDate = new Date(prevTs).getDate();
    const currDate = new Date(currTs).getDate();
    const diff = prevDate - currDate;
    return diff !== 0;
  };

  /* effects */

  useEffect(() => {
    const tokenList = document.querySelector(".tx-history-list");
    if (tokenList) {
      tokenList.scrollTo(0, 0);
    }

    const timeOut = setTimeout(() => {
      setMessage("No Activity found");
    }, 1000);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <TxHistoryWrapper
      className="tx-history-list trans-default bezier-in-out"
      height={height}
    >
      {filteredActivity && filteredActivity.length > 0 ? (
        filteredActivity?.map(
          (item: TransactionData | SwapTransactionData, index: number) => {
            return (
              <div style={{ padding: "3px 0px" }} key={index}>
                <Text
                  className="activity-date"
                  weight={400}
                  opacity={0.3}
                  size={14}
                >
                  {checkSameDate(item.timeStamp, index)
                    ? moment(item.timeStamp).format("DD MMMM")
                    : null}
                </Text>
                <ActivityBoxWrapper>{renderSwitch(item)}</ActivityBoxWrapper>
              </div>
            );
          }
        )
      ) : (
        <>
          <EmptyAddress text={message} icon={faClockRotateLeft} />
        </>
      )}
    </TxHistoryWrapper>
  );
};

export default TxHistory;
