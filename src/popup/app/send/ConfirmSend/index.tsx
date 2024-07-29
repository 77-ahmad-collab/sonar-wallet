import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import { faArrowDownRight } from "@fortawesome/pro-light-svg-icons";

import {
  GenericBackgroundBox,
  SearchLayout,
  StyledAmountInput,
  Text,
} from "@styled";
import {
  AmountPercentageBtn,
  CommonLayout,
  ImageContent,
  RainbowLoader,
  TransactionFee,
} from "components";
import { truncateAddress, truncateName } from "utils";
import { useConfirmSend } from "hooks";
import { formatAmount } from "utils/formatters";
import { useAppSelector } from "store/store";
import {
  AMOUNT_25_PERCENT,
  AMOUNT_50_PERCENT,
  AMOUNT_MAX_PERCENT,
  NETWORKS,
} from "utils/constants";
import { useMemo } from "react";

const ConfirmSend = () => {
  const {
    tokenSelected: { token, from, to, error, hexData, loading },
  } = useAppSelector((state) => state.newWallet);
  const { isHoldFinish, NETWORKCHAIN } = useAppSelector((state) => state.app);

  const {
    handleChange,
    handleTransaction,
    handleReject,
    onTopImageClick,
    showTransactionFeeComponent,
    setShowTransactionFeeComponent,
    inputWidth,
    currentRatio,
    onRatioClick,
    totalInUsd,
  } = useConfirmSend();

  const Title = () => (
    <div className="c-fs-sa transactionFeeBoxTitle">
      <Text className="f-body-sm " weight={500} opacity={0.4}>
        Send
      </Text>
      <Tooltip title={to.amount}>
        <Text className="f-body" weight={500} opacity={0.7}>
          {formatAmount(to.amount)} {truncateName(token.symbol)}
        </Text>
      </Tooltip>

      <Text className="f-body-sm" weight={500} opacity={0.4}>
        to
      </Text>

      <Text className="f-body" weight={500} opacity={0.7}>
        {truncateAddress(to.address)}
      </Text>
    </div>
  );

  const ButtonTitle = () => {
    if (isHoldFinish && NETWORKCHAIN[+token.chainId]?.chain === NETWORKS.EVM) {
      return <span>Confirmed</span>;
    } else if (isHoldFinish) return <span>Confirming...</span>;

    if (loading) {
      return (
        <RainbowLoader
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
          size={25}
        />
      );
    } else {
      return (
        <>
          <span style={{ opacity: 0.7 }}>Hold to</span> Confirm
        </>
      );
    }
  };

  const ButtonsInfo = useMemo(() => {
    return [
      {
        text: "MAX",
        onClick: () => onRatioClick(AMOUNT_MAX_PERCENT),
        ratio: AMOUNT_MAX_PERCENT,
        disabled: false,
      },
      {
        text: "50%",
        onClick: () => onRatioClick(AMOUNT_50_PERCENT),
        ratio: AMOUNT_50_PERCENT,
        disabled: false,
      },
      {
        text: "25%",
        onClick: () => onRatioClick(AMOUNT_25_PERCENT),
        ratio: AMOUNT_25_PERCENT,
        disabled: false,
      },
    ];
  }, []);

  return (
    <CommonLayout
      onTopImageClick={onTopImageClick}
      title="Send Tokens"
      bottomLayoutStyle={{ overflowY: "hidden" }}
    >
      <motion.div
        animate={{ y: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
        initial={{ y: 100 }}
        style={{ overflowY: "hidden", outline: "none", width: "100%" }}
      >
        <div className="r-c-fs width" style={{ marginTop: "15px" }}>
          <Text weight={500} className="f-body-lg">
            Send {token.symbol}
          </Text>
          <FontAwesomeIcon
            id="ConfirmSend-handleReject-1"
            icon={faSortDown}
            className="step3Icon"
            onClick={handleReject}
            fontSize={18}
          />
        </div>

        <div className="r-c-fs width" style={{ margin: "auto" }}>
          <Text
            weight={400}
            customStyle={{ marginTop: "5px" }}
            className="f-body-sm"
          >
            {formatAmount(from.balance)}{" "}
            <span style={{ opacity: 0.7 }}>{token.name}</span>{" "}
            <span style={{ color: "#7B7A7F" }}>Available</span>
          </Text>
          <AmountPercentageBtn
            currentRatio={currentRatio}
            ButtonsInfo={ButtonsInfo}
          />
        </div>

        <div className="r-c-fs width" style={{ marginTop: "0px" }}>
          <SearchLayout
            className="alignContent"
            style={{
              width: inputWidth,
            }}
          >
            <StyledAmountInput
              id="ConfirmSend-handleChange"
              placeholder="0"
              onChange={handleChange}
              value={to.amount === 0 ? "" : to.amount}
              style={{ textAlign: "start", width: "95%", fontSize: "50px" }}
              autoComplete="off"
            />
          </SearchLayout>
          <div
            className="c-fs-c"
            style={{
              marginTop: "20px",
              minWidth: "60px",
              maxWidth: "90px",
              overflow: "hidden",
            }}
          >
            <Text className="f-title-md" weight={500}>
              {token.symbol}
            </Text>
            <Text dim={true} className="f-body-sm" weight={500}>
              ~{formatAmount(to.amountInUsd)}
              USD
            </Text>
          </div>
        </div>

        <Text
          id="ConfirmSend-error-text"
          style={{
            color: "#FF0000",
            textAlign: "center",
            marginTop: "5px",
          }}
        >
          <span>&nbsp;&nbsp;</span>
          {error.open && error.message}
        </Text>

        <Text weight={500} dim={true} className="width f-body-sm">
          To
        </Text>

        <GenericBackgroundBox
          margintop={10}
          // className="genericBox"
          style={{
            marginBottom: token.multiAccountExist ? "0px" : "100px",
            paddingLeft: "15px",
          }}
        >
          <FontAwesomeIcon
            icon={faArrowDownRight}
            color="rgba(0, 214, 125, 1)"
            style={{ fontSize: 20, width: "15px" }}
          />
          <Text
            className="f-body-lg"
            weight={500}
            style={{ marginLeft: "15px" }}
          >
            {truncateAddress(to.address)}
          </Text>
        </GenericBackgroundBox>

        {token.multiAccountExist && (
          <>
            <Text weight={500} dim={true} className="width f-body-sm">
              From
            </Text>
            <GenericBackgroundBox margintop={10} className="pdl-sm">
              <ImageContent
                src={token.image}
                Size={{ width: "20px", height: "20px", borderRadius: "50%" }}
              />
              <div className="walletHeading">
                <Text
                  className="f-body-lg"
                  weight={500}
                  style={{ opacity: 0.7 }}
                >
                  {truncateName(from.name)}{" "}
                </Text>
                <Text className="f-body-sm" weight={400} dim={true}>
                  {from.walletName}
                </Text>
              </div>
              <div
                className="r-c-c"
                style={{ marginLeft: "auto", marginRight: 15 }}
              >
                <Text className="f-body-sm" weight={500}>
                  {formatAmount(from.balance)} {token.symbol}
                </Text>
                <Text className="f-body-sm mgl-xs" weight={500} dim={true}>
                  {" "}
                  Available
                </Text>
              </div>
            </GenericBackgroundBox>
          </>
        )}

        <br />
      </motion.div>

      <TransactionFee
        handleClick={handleTransaction}
        show={showTransactionFeeComponent}
        hideTransactionFeeComponent={() =>
          setShowTransactionFeeComponent(false)
        }
        Title={<Title />}
        handleReject={handleReject}
        hexData={hexData}
        ButtonTitle={<ButtonTitle />}
        loading={loading}
        chainFamily={from.chainFamily}
        totalInUsd={totalInUsd}
      />
    </CommonLayout>
  );
};
export default ConfirmSend;
