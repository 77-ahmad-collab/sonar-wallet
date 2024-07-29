import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, useTheme } from "@mui/material";
import {
  faDollarSign,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/pro-solid-svg-icons";

import { Text, TokenBoxWrapper } from "@styled";

import { ResultingBalances } from "utils/constants";
import { RenderSwapTransactionContentProps as PROPS } from "interfaces";
import {
  CopyAndExplorerButton,
  TokenBoxContent,
  TokenBoxTitle,
} from "components";
import { formatAmount } from "utils/formatters";
import { truncateAddress, truncateName } from "utils";

const RenderSwapTransactionContent: FC<PROPS> = ({
  snackbar,
  transactionHash,
  chainId,
  fees,
  makerBalance,
  makerBalanceInUsd,
  receiver,
  sender,
  takerBalance,
  takerBalanceInUsd,
  value,
  tokenAname,
  tokenBname,
  tokenAprice,
  tokenBprice,
  isDappTransaction,
}) => {
  const theme = useTheme();
  const content = [
    {
      heading: "Token Prices",
      subHeading: " (When swapped)",
      rightSideElement: <></>,
      box0: {
        title: tokenAname,
        leftELement:
          tokenAprice > 0 ? (
            <Tooltip title={tokenAprice}>
              <Text weight={500} className="boxContent f-body-md">
                {formatAmount(tokenAprice)}
              </Text>
            </Tooltip>
          ) : (
            <Text weight={400} className=" f-body">
              Price Unavailable
            </Text>
          ),
        rightElement: (
          <Text dim weight={500} className="boxContent f-body-lg ">
            {tokenAprice > 0 ? "USD" : ""}
          </Text>
        ),
      },

      box1: {
        title: tokenBname,
        leftELement:
          tokenBprice > 0 ? (
            <Tooltip title={tokenBprice}>
              <Text weight={500} className="boxContent f-body-md">
                {formatAmount(tokenBprice)}
              </Text>
            </Tooltip>
          ) : (
            <Text weight={400} className=" f-body">
              Price Unavailable
            </Text>
          ),
        rightElement: (
          <Text dim weight={500} className="boxContent f-body-lg ">
            {tokenBprice > 0 ? "USD" : ""}
          </Text>
        ),
      },
    },
    {
      heading: ResultingBalances,
      subHeading: " (after swap)",
      rightSideElement: <></>,
      box0: {
        title: tokenAname,
        leftELement: (
          <div>
            <Tooltip title={makerBalance}>
              <Text weight={500} className="boxContent f-body-md">
                {formatAmount(makerBalance)}
              </Text>
            </Tooltip>
            <Tooltip title={makerBalanceInUsd}>
              <Text
                className="f-body"
                weight={400}
                opacity={0.8}
                style={{ marginTop: "5px" }}
              >
                {makerBalanceInUsd > 0
                  ? `~ ${formatAmount(makerBalanceInUsd)}  USD`
                  : "~ Not available"}
              </Text>
            </Tooltip>
          </div>
        ),
        rightElement: <></>,
      },

      box1: {
        title: tokenBname,
        leftELement: (
          <div>
            <Tooltip title={takerBalance}>
              <Text weight={500} className="boxContent f-body-md">
                {formatAmount(takerBalance)}
              </Text>
            </Tooltip>
            <Tooltip title={takerBalanceInUsd}>
              <Text
                className="f-body"
                weight={400}
                opacity={0.8}
                style={{ marginTop: "5px" }}
              >
                {takerBalanceInUsd > 0
                  ? `~ ${formatAmount(takerBalanceInUsd)}  USD`
                  : "~ Not available"}
              </Text>
            </Tooltip>
          </div>
        ),
        rightElement: <></>,
      },
    },
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
          <Text dim weight={500} className="boxContent f-body-lg">
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
            className="userIcon "
          />
        ),
        rightElement: (
          <Text weight={500} className="boxContent f-body">
            {truncateName(sender)}
          </Text>
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
          <Text weight={500} className="boxContent f-body-lg">
            {truncateAddress(receiver)}
          </Text>
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

        if (
          ((snackbar || isDappTransaction) && heading === ResultingBalances) ||
          (isDappTransaction && heading === "Token Prices")
        )
          return;
        else
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

export default RenderSwapTransactionContent;
