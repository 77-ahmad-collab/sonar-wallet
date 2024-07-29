import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusLarge } from "@fortawesome/pro-light-svg-icons";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import CancelIcon from "@mui/icons-material/Cancel";
import _ from "lodash";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons";

import {
  AddCustomTokenModal,
  CommonLayout,
  NetworkModal,
  SearchBar,
  StartAdornment,
  Tokens,
} from "components";
import { SecondaryHoldings, SimpleTileinfoProps } from "interfaces";
import { useAppSelector } from "store/store";
import { ButtonDefault, Text, TokenStatusLabelStyled } from "@styled";
import { getFilteredTokensList } from "utils/utils.holdings";
import { DUMMY_IMAGE_URL } from "utils/constants";
import { convertDefaultTokensInToSecondaryHoldings } from "utils";

const EditList = () => {
  /* global-state */
  const { secondaryHoldings, numOfTokens } = useAppSelector(
    (state) => state.newWallet
  );
  const { isTestnet, NETWORKCHAIN } = useAppSelector((state) => state.app);

  /* local-state */
  const [searchValue, setSearchValue] = useState("");
  const [isCustomTokenModalOpen, setIsCustomTokenModalOpen] = useState(false);
  const [filteredList, setFilteredList] = useState(secondaryHoldings);
  const [defaultTokens, setDefaultTokens] =
    useState<SecondaryHoldings>(secondaryHoldings);
  const [network, setNetwork] = useState<SimpleTileinfoProps | string>();
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  /* hooks */
  const navigate = useNavigate();

  /* functions */

  const EndAdornment = () => (
    <IconButton
      id="edit-list-clear-input"
      disableRipple
      onClick={() => {
        setSearchValue("");
      }}
      style={{ padding: "4px" }}
    >
      <CancelIcon
        fontSize="small"
        style={{ color: "rgba(255, 255, 255, 0.4)" }}
      />
    </IconButton>
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value);

  const handleAddCustomToken = () => {
    // setIsCustomTokenModalOpen(true);
    setIsNetworkModalOpen(true);
  };

  const renderTokensHeading = useCallback(
    (heading: string) =>
      !_.isEmpty(filteredList) && (
        <TokenStatusLabelStyled>
          <Text size={14} weight={500} align="left" opacity={0.5}>
            {heading} <span style={{ opacity: "0.3" }}>Tokens</span>
          </Text>
        </TokenStatusLabelStyled>
      ),
    [filteredList]
  );

  const renderTokensList = (isActiveList: boolean) => {
    return (
      <div className="editlist-tokenslist-box">
        <Tokens
          style={{ height: "unset" }}
          onTokenSelect={() => {}}
          customHolding={filteredList}
          showAllHoldings={false}
          showActiveOnly={isActiveList}
          showInactiveOnly={!isActiveList}
          defaultExpanded
        />
      </div>
    );
  };

  const handleNetworkModalClose = () => {
    setIsNetworkModalOpen(false);
  };

  const onNetworkClick = (chainId: number) => {
    const selectedChain = NETWORKCHAIN[chainId];
    setNetwork({
      NAME: selectedChain.NAME,
      LOGO: selectedChain.LOGO,
      chain: selectedChain.chain,
      //@ts-ignore  this is an exception and it's working fine
      id: `${selectedChain.CHAIN_ID}`,
    });
    setIsCustomTokenModalOpen(true);
    setIsNetworkModalOpen(false);
  };

  const goback = () => {
    navigate("/index.html");
  };

  // /* effects */
  useEffect(() => {
    const filterObject = getFilteredTokensList(
      searchValue,
      defaultTokens,
      true,
      true
    );
    setFilteredList(filterObject);
  }, [searchValue]);

  useEffect(() => {
    setFilteredList(defaultTokens);
    setSearchValue("");
  }, [defaultTokens]);

  useEffect(() => {
    const defaultTokens = convertDefaultTokensInToSecondaryHoldings();

    setDefaultTokens(defaultTokens);
  }, [secondaryHoldings]);

  return (
    <CommonLayout onTopImageClick={goback} title="Edit Tokens">
      <SearchBar
        id="edit-list-search"
        StartAdornment={<StartAdornment Icon={faMagnifyingGlass} />}
        placeholder="Search or paste address..."
        onChange={handleChange}
        value={searchValue}
        EndAdornment={searchValue.length > 0 ? <EndAdornment /> : <></>}
        containerStyle={{ marginTop: 15 }}
      />
      <div style={{ width: "100%", overflowY: "auto" }}>
        {searchValue && (
          <Text
            size={14}
            weight={500}
            align="left"
            style={{
              marginLeft: 18,
              color: "rgba(255,255,255,0.3)",
              marginTop: 12,
              marginBottom: -12,
              // opacity: 0
            }}
          >
            {_.isEmpty(filteredList) ? (
              <>{"Nothing found"}</>
            ) : (
              <>
                {"Results for "}
                <span
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >{`"${searchValue}"`}</span>
              </>
            )}
          </Text>
        )}

        {renderTokensHeading("Active")}
        {numOfTokens.active === 0 && searchValue === "" ? (
          <Text align="center" style={{ marginTop: 12 }}>
            no active token
          </Text>
        ) : (
          renderTokensList(true)
        )}
        {renderTokensHeading("Inactive")}
        {numOfTokens.inActive === 0 && searchValue === "" ? (
          <Text align="center" style={{ marginTop: 12 }}>
            no inactive token
          </Text>
        ) : (
          renderTokensList(false)
        )}
        <div className="r-c-fs">
          <ButtonDefault
            style={{ fontSize: 14 }}
            onDarkBack
            width="unset"
            margin="10px 0px"
            padding="8px 12px 8px 12px"
            onClick={handleAddCustomToken}
          >
            <FontAwesomeIcon
              icon={faPlusLarge}
              color={"rgba(255,255,255,0.4)"}
              style={{ fontSize: 16, marginRight: 8 }}
            />
            Add Custom Token
          </ButtonDefault>
        </div>
        <NetworkModal
          isOpen={isNetworkModalOpen}
          handleClose={handleNetworkModalClose}
          onNetworkClick={onNetworkClick}
          currentNetwork={network}
          showAllChains
          isTestnet={isTestnet}
          disabledChainIds={[102, 101]}
        />
        <AddCustomTokenModal
          isOpen={isCustomTokenModalOpen}
          handleClose={() => {
            setIsCustomTokenModalOpen(false);
          }}
          network={
            typeof network === "string" || !network
              ? { NAME: "Ethereum", LOGO: DUMMY_IMAGE_URL }
              : network
          }
        />
      </div>
    </CommonLayout>
  );
};

export default memo(EditList);
