import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons";

import {
  RainbowLoader,
  SearchBar,
  SimpleTile,
  StartAdornment,
} from "components";
import {
  AvalancheLogo,
  bnbLogo,
  ethLogo,
  nearLogo,
  solLogo,
} from "assets/Icons";
import { croLogo, ftmLogo, pingLogo } from "assets/images";
import { BASE_URL } from "../../api";
import { CHAIN_CATEGORIES } from "utils/constants";
import {
  AnyTokensSearch as PROPS,
  SimpleTileinfoProps,
  openOceanInfo,
} from "interfaces";
import { StartAdornmentStyled, Text } from "@styled";

const AnyTokensSearch: FC<PROPS> = ({
  onTokenClick = () => {},
  onDefaultTokenClick = () => {},
  listcontainerStyle = {},
  network,
}) => {
  /* global-state */

  /* local-state */
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [tokensList, setTokensList] = useState<openOceanInfo[]>([]);
  const [defaultList, setDefaultList] = useState<openOceanInfo[]>([]);

  /* functions */
  const searchTokens = async (text: string) => {
    try {
      let thisNetwork = network;
      if (typeof network !== "string") {
        thisNetwork = `${network.chain}`;
      }
      const result = await axios.get(
        `${BASE_URL}/tokens/search/${
          thisNetwork === CHAIN_CATEGORIES.EVM?.chain ? "evm" : "nonevm"
        }/${text}`
      );
      handleResult(result.data);
      setIsSearching(false);
    } catch (error) {
      console.log("token search result not found", error);
    }
  };

  const handleResult = (result: openOceanInfo[] | string) => {
    if (typeof result === "string") {
      setTokensList([]);
    } else {
      if (result.length <= 10) {
        setTokensList(result);
      } else {
        setTokensList(result.slice(0, 10));
      }
    }
  };

  const renderTokens = useCallback(() => {
    if (tokensList) {
      return (tokensList.length > 0 ? tokensList : defaultList).map(
        (token, i) => (
          <SimpleTile
            key={i}
            tileInfo={{
              NAME: token.symbol.toUpperCase(),
              LOGO: token.image,
              chain:
                typeof token.chain !== "string"
                  ? token.chain
                  : `${token.chain}`.toUpperCase(),
            }}
            onClick={handleTokenClick}
          />
        )
      );
    }
  }, [tokensList, defaultList]);

  const handleTokenClick = (tokenInfo: SimpleTileinfoProps) => {
    if (tokensList.length > 0) {
      onTokenClick(tokenInfo);
    } else {
      onDefaultTokenClick(tokenInfo);
    }
  };

  const renderNotFound = () => (
    <div className="r-c-c" style={{ color: "white", height: "100%" }}>
      <Text weight={600} size={20}>
        No Tokens Found
      </Text>
    </div>
  );

  const filterDefaultList = useCallback(() => {
    const chainFamily = typeof network !== "string" ? network.chain : network;
    return AlldefaultList.filter((token) => {
      const tokenChainFamily =
        typeof token.chain !== "string" ? token.chain.chain : token.chain;
      return tokenChainFamily === chainFamily;
    });
  }, [network]);

  /* effects */
  useEffect(() => {
    let delayDebounceFn: NodeJS.Timeout;
    if (search !== "") {
      delayDebounceFn = setTimeout(() => {
        searchTokens(search);
      }, 1000);
    } else {
      setTokensList([]);
      setIsSearching(false);
    }

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    setDefaultList(filterDefaultList());
    setSearch("");
  }, [network]);

  /* constants */
  const AlldefaultList: openOceanInfo[] = [
    {
      id: "PING",
      name: "Sonar Ping",
      symbol: "PING",
      image: pingLogo,
      chain: CHAIN_CATEGORIES.EVM,
    },
    {
      id: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      image: ethLogo,
      chain: CHAIN_CATEGORIES.EVM,
    },
    {
      id: "SOL",
      name: "Solana",
      symbol: "SOL",
      image: solLogo,
      chain: CHAIN_CATEGORIES.SOLANA,
    },
    {
      id: "NEAR",
      name: "Near",
      symbol: "NEAR",
      image: nearLogo,
      chain: CHAIN_CATEGORIES.NEAR,
    },
    {
      id: "BNB",
      name: "Binance",
      symbol: "BNB",
      image: bnbLogo,
      chain: CHAIN_CATEGORIES.EVM,
    },
    {
      id: "AVAX",
      name: "Avalanche",
      symbol: "AVAX",
      image: AvalancheLogo,
      chain: CHAIN_CATEGORIES.EVM,
    },
    {
      id: "CRO",
      name: "Cronos",
      symbol: "CRO",
      image: croLogo,
      chain: CHAIN_CATEGORIES.EVM,
    },
    {
      id: "FTM",
      name: "Fantom",
      symbol: "FTM",
      image: ftmLogo,
      chain: CHAIN_CATEGORIES.EVM,
    },
  ];

  return (
    <>
      <div>
        <SearchBar
          StartAdornment={
            isSearching ? (
              <StartAdornmentStyled>
                <RainbowLoader size={22} />
              </StartAdornmentStyled>
            ) : (
              <StartAdornment Icon={faMagnifyingGlass} />
            )
          }
          placeholder="Search symbol or address ..."
          onChange={(e) => {
            setSearch(e.target.value);
            setIsSearching(true);
          }}
          value={search}
          containerStyle={{ margin: "0px", width: "100%" }}
        />
      </div>
      <div className="tokenSearch-list" style={listcontainerStyle}>
        {search !== "" && tokensList.length === 0 && !isSearching
          ? renderNotFound()
          : renderTokens()}
      </div>
    </>
  );
};

export default AnyTokensSearch;
