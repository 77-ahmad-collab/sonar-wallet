import {
  CommonLayout,
  RainbowLoader,
  RecentSearchedTokens,
  SearchBar,
  StartAdornment,
  TitleComponent,
  TokenslistWithMessage,
} from "components";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons";
import { useSelectToken } from "hooks";
import { StartAdornmentStyled } from "@styled";

const SelectToken = () => {
  const {
    handleChange,
    value,
    onTokenSelection,
    filteredHoldings,
    onTopImageClick,
    setValue,
    recentSearchedKeywords,
    isSwap,
    fetchMoreTokens,
    isLoading,
  } = useSelectToken();

  return (
    <CommonLayout
      onTopImageClick={onTopImageClick}
      title={`${isSwap ? "Swap" : "Send"} Tokens`}
    >
      <>
        <TitleComponent
          text={
            isSwap
              ? `Select Token to ${isSwap.forTokenA ? "sell" : "buy"} `
              : "Select Token to send"
          }
        />
        <SearchBar
          // StartAdornment={<StartAdornment Icon={faMagnifyingGlass} />}
          StartAdornment={
            !isLoading ? (
              <StartAdornment Icon={faMagnifyingGlass} />
            ) : (
              <StartAdornmentStyled>
                <RainbowLoader size={22} />
              </StartAdornmentStyled>
            )
          }
          placeholder="Search..."
          onChange={handleChange}
          value={value}
          id="select-token-search"
        />

        {recentSearchedKeywords.length > 0 && (
          <RecentSearchedTokens setValue={setValue} />
        )}

        <TokenslistWithMessage
          style={{ flex: 1, paddingBottom: 15 }}
          onTokenSelect={onTokenSelection}
          customHolding={filteredHoldings}
          defaultExpanded={true}
          showAllHoldings
          fetchMoreTokens={fetchMoreTokens}
        />
      </>
    </CommonLayout>
  );
};

export default SelectToken;
