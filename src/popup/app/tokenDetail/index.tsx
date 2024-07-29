import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/pro-light-svg-icons";
import {
  faChartLine,
  faCircleInfo,
  faExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { Avatar } from "@mui/material";

import {
  ApexChart,
  FunctionalityNavigators,
  SlideLayoutWrapper,
  TokenInformationModal,
  TxHistory,
} from "components";
import {
  ButtonBoxStyled,
  ButtonDefault,
  ChartWrapper,
  NewBottomLayout,
  PriceChangeStyled,
  Text,
  TokenDetailBoxStyled,
} from "@styled";
import { formatAmount } from "utils/formatters";
import { useAppDispatch, useAppSelector } from "store/store";
import { setRecentSearchedKeywords, setShowGraph } from "@slices/appSlice";
import {
  OnClickType,
  ReceiveLocationState,
  SwapLocationState,
} from "interfaces";
import { APPSCREENS } from "theme/constants";

import { fetchGraphDataApi, getDetailSingleTokenInfo } from "utils/utils.api";
import {
  GRAPH_PERIODS,
  SONAR_STUDIO_SUPPORTED_CHAIN_IDS,
} from "utils/constants";
import { setDefaultTokenSelected } from "@slices/newWalletSlice";
import { SONAR_STUDIO_URL } from "api";
import { truncateName } from "utils";

const TokenDetail = () => {
  /* global-state */
  const { showGraph, NETWORKCHAIN } = useAppSelector((state) => state.app);
  const {
    tokenSelected: { token, from },
  } = useAppSelector((state) => state.newWallet);

  /* local-state */

  const [tokenGraph, setTokenGraph] = useState<number[]>();
  const [tokenInformationModal, setTokenInformationModal] = useState(false);
  const [coingeckoInfo, setCoingeckoInfo] = useState({
    price: 0,
    percentChange: 0,
    desc: "",
  });

  /* hooks */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* functions */
  const goBack = (e: OnClickType) => {
    e.stopPropagation();
    navigate(APPSCREENS.dashboard);
    dispatch(setDefaultTokenSelected());
  };

  const onSendClick = () => {
    dispatch(setRecentSearchedKeywords(token.symbol));
    navigate("/send/selectAddress");
  };

  const onReceiveClick = () => {
    navigate(APPSCREENS.receive, {
      state: {
        tokenDetail: true,
      } as ReceiveLocationState,
    });
  };

  const onSwapClick = () => {
    if (NETWORKCHAIN[token.chainId].isSwap) {
      navigate(APPSCREENS.swap, {
        state: {
          tokenDetail: true,
        } as SwapLocationState,
      });
    }
  };

  const getGraphData = async () => {
    const tokenToFetch = {
      [token.coingeckoId]: from.balance,
    };
    const response = await fetchGraphDataApi(
      tokenToFetch,
      GRAPH_PERIODS.monthly
    );
    if (response?.data) {
      setTokenGraph(response.data.data);
    }
  };

  const getPriceChangePercentage = async () => {
    const {
      market_data: { price_change_percentage_24h, current_price },
      description,
    } = await getDetailSingleTokenInfo(token.coingeckoId);
    price_change_percentage_24h &&
      setCoingeckoInfo({
        price: current_price.usd,
        percentChange: price_change_percentage_24h,
        desc: description.en,
      });
  };

  const onInfoClick = () => {
    setTokenInformationModal(true);
  };

  const onChartClick = () => dispatch(setShowGraph(!showGraph));

  const onNewsClick = () => {
    if (
      SONAR_STUDIO_SUPPORTED_CHAIN_IDS[
        token.chainId as keyof typeof SONAR_STUDIO_SUPPORTED_CHAIN_IDS
      ]
    ) {
      console.log("SONAR STUDIO SUPPORT THIS CHAINID");
      window.open(
        `${SONAR_STUDIO_URL}/${
          SONAR_STUDIO_SUPPORTED_CHAIN_IDS[
            token.chainId as keyof typeof SONAR_STUDIO_SUPPORTED_CHAIN_IDS
          ]
        }/${token.address}`
      );
    }
  };

  /* effects */
  useEffect(() => {
    dispatch(setShowGraph(false));
    getGraphData();
    getPriceChangePercentage();
  }, []);

  /* constants */
  const tabs = [
    {
      title: "Info",
      icon: faCircleInfo,
      onClick: onInfoClick,
    },
    {
      title: "Chart",
      icon: faChartLine,
      onClick: onChartClick,
    },
    {
      title: "News",
      icon: faExclamation,
      onClick: onNewsClick,
    },
  ];

  return (
    <div className="c-c-c full-height">
      <div
        className="c-fs-fs trans-default bezier-in-out dashboard-upper-layout"
        onClick={() => dispatch(setShowGraph(!showGraph))}
      >
        <div className="hud-chart">
          <div className="r-c-fs mgt-sm">
            <ButtonDefault width={37} height={37} onClick={goBack}>
              <FontAwesomeIcon
                className="f-dim-100"
                icon={faChevronUp}
                color="white"
                style={{ fontSize: 16 }}
              />
            </ButtonDefault>
            <div className="r-c-fs">
              <div
                style={{ marginLeft: 15, textAlign: "left", cursor: "pointer" }}
              >
                <div className="r-c-c f-dim-100">
                  <Avatar
                    className="tile-avatar"
                    src={token.image}
                    alt={"icon"}
                  />
                  <Text size={20}>{truncateName(token.name)}</Text>
                </div>
              </div>
            </div>
          </div>
          <ChartWrapper
            className="trans-default bezier-in-out"
            showGraph={showGraph}
          >
            <ApexChart graphData={tokenGraph} />
          </ChartWrapper>
        </div>
        <div
          className="r-c-sb f-title-lg mgt-sm trans-default bezier-in-out"
          style={{
            marginTop: showGraph ? 0 : 15,
            marginBottom: 5,
            width: "100%",
          }}
        >
          <div>
            {formatAmount(from.balance)}
            <span className="f-title-lg f-dim-200">
              {" "}
              {truncateName(token.symbol)}
            </span>
          </div>
          <div className="r-c-c">
            <Text opacity={0.7}>~{formatAmount(from.balanceInUsd)} USD</Text>
          </div>
        </div>
      </div>
      <NewBottomLayout>
        <SlideLayoutWrapper>
          <div>
            <FunctionalityNavigators
              onSendClick={onSendClick}
              onReceiveClick={onReceiveClick}
              onSwapClick={onSwapClick}
            />
            <TokenDetailBoxStyled>
              <Text
                className="f-body-md "
                customStyle={{ marginBottom: "5px" }}
                opacity={0.7}
                weight={500}
              >
                About {token.name}
              </Text>

              <Text style={{ opacity: 0.5 }} className="f-body" weight={500}>
                Price: {coingeckoInfo.price}{" "}
                {coingeckoInfo.percentChange !== 0 && (
                  <PriceChangeStyled
                    success={coingeckoInfo.percentChange > 0 ? true : false}
                  >
                    {coingeckoInfo.percentChange.toFixed(2)}%
                  </PriceChangeStyled>
                )}
              </Text>
            </TokenDetailBoxStyled>
            <div className="r-c-fs">
              {tabs.map((tab, index) => {
                return (
                  <ButtonBoxStyled key={index} onClick={tab.onClick}>
                    <FontAwesomeIcon
                      icon={tab.icon}
                      color="rgba(255,255,255,0.7)"
                      fontSize={16}
                    />
                    <Text size={12} customStyle={{ marginLeft: "10px" }}>
                      {tab.title}
                    </Text>
                  </ButtonBoxStyled>
                );
              })}
            </div>
            <TxHistory height={355} />
          </div>
        </SlideLayoutWrapper>
      </NewBottomLayout>
      <TokenInformationModal
        open={tokenInformationModal}
        text={coingeckoInfo.desc || "Token Detail not available"}
        heading={token.name}
        onClose={() => setTokenInformationModal(false)}
      />
    </div>
  );
};

export default TokenDetail;
