import { FC } from "react";
import { Tooltip, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/pro-solid-svg-icons";

import { Text, TokenBoxWrapper } from "@styled";
import {
  CopyAndExplorerButton,
  TokenBoxContent,
  TokenBoxTitle,
} from "components";

import { RenderOrReceiveTransactionContentProps as PROPS } from "interfaces";
import { truncateAddress, truncateName } from "utils";
import { formatAmount } from "utils/formatters";

const RenderSendOrReceiveTransactionContent: FC<PROPS> = ({
  fees,
  receiver,
  sender,
  value,
  chainId,
  transactionHash,
  receiverNameInTheAddressBook,
  senderNameInTheAddressBook,
}) => {
  const theme = useTheme();

  const content = [
    {
      heading: "Transaction Value",
      subHeading: "",
      rightSideElement: (
        <></>
        // <Text size={14} weight={400} opacity={1}>
        //   USD
        //   <SpanOpacityStyled opacity={0.4}> / ETH</SpanOpacityStyled>
        // </Text>
      ),
      box0: {
        title: "Value",
        leftELement: (
          <>
            <FontAwesomeIcon
              icon={faDollarSign}
              color={theme.palette.background.green}
              fontSize={14}
              className="mgr-xs"
            />
            <Tooltip title={value}>
              <Text weight={500} className="boxContent f-body-md">
                {formatAmount(+value)}
              </Text>
            </Tooltip>
          </>
        ),
        rightElement: (
          <Text dim weight={500} className="boxContent f-body-lg ">
            USD
          </Text>
        ),
      },
      box1: {
        title: "Fees",
        leftELement: (
          <>
            <FontAwesomeIcon
              icon={faDollarSign}
              color={theme.palette.background.green}
              fontSize={14}
              className="mgr-xs"
            />
            <Tooltip title={fees}>
              <Text weight={500} className="boxContent f-body-md">
                {formatAmount(+fees)}
              </Text>
            </Tooltip>
          </>
        ),
        rightElement: (
          <Text dim weight={500} className="boxContent f-body-lg ">
            USD
          </Text>
        ),
      },
    },
    {
      heading: "Route",
      subHeading: "",
      rightSideElement: <></>,
      box0: {
        title: "Sender",
        leftELement: (
          <FontAwesomeIcon
            icon={faUserMinus}
            color={theme.palette.background.pink}
            className="userIcon"
          />
        ),
        rightElement: (
          <Tooltip
            title={
              senderNameInTheAddressBook ? senderNameInTheAddressBook : sender
            }
          >
            <Text
              weight={500}
              className="boxContent f-body-lg c-c-c"
              style={{ overflow: "hidden" }}
            >
              {senderNameInTheAddressBook
                ? truncateName(senderNameInTheAddressBook)
                : truncateAddress(sender)}
            </Text>
          </Tooltip>
        ),
      },
      box1: {
        title: "Receiver",
        leftELement: (
          <FontAwesomeIcon
            icon={faUserPlus}
            color={theme.palette.background.green}
            className="userIcon"
          />
        ),
        rightElement: (
          <Tooltip
            title={
              receiverNameInTheAddressBook
                ? receiverNameInTheAddressBook
                : receiver
            }
          >
            <Text
              weight={500}
              className="boxContent f-body-lg"
              style={{ overflow: "hidden" }}
            >
              {receiverNameInTheAddressBook
                ? truncateName(receiverNameInTheAddressBook)
                : truncateAddress(receiver)}
            </Text>
          </Tooltip>
        ),
      },
    },
  ];

  return (
    <>
      {content.map((value, index) => {
        const { heading, subHeading, rightSideElement, box0, box1 } = value;
        const { leftELement, rightElement, title } = box0;
        const {
          leftELement: leftElement1,
          rightElement: rightElement1,
          title: title1,
        } = box1;
        return (
          <div key={index}>
            <TokenBoxTitle
              heading={heading}
              subHeading={subHeading}
              rightSideElement={rightSideElement}
            />
            <TokenBoxWrapper>
              <TokenBoxContent
                leftElement={leftELement}
                rightElement={rightElement}
                title={title}
              />
              <TokenBoxContent
                leftElement={leftElement1}
                rightElement={rightElement1}
                title={title1}
              />
            </TokenBoxWrapper>
          </div>
        );
      })}
      <CopyAndExplorerButton
        transactionHash={transactionHash}
        chainId={chainId}
      />
    </>
  );
};

export default RenderSendOrReceiveTransactionContent;
