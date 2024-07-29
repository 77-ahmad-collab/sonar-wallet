import { FC, SyntheticEvent, useMemo, useState } from "react";

import { ChainsProps, RenderChainsListProps as PROPS } from "interfaces";
import MyTokens from "./MyTokens";
import { ChainComponent } from "components";
import {
  ChainAccordion,
  ChainAccordionDetails,
  ChainAccordionSummary,
} from "@styled";
import { useAppSelector } from "store/store";

const MainnetsortedChainIds = [
  56, 1, 137, 101, 1313161554, 43114, 25, 250, 103,
];
const TestnetsortedChainIds = [97, 5, 80001, 43113, 338, 4002, 102];

const Chains: FC<ChainsProps> = ({
  filteredHoldings,
  onTokenSelect,
  defaultExpanded,
  showAllHoldings,
  showActiveOnly,
  showInactiveOnly,
  fetchMoreTokens,
}) => {
  const { isTestnet } = useAppSelector((state) => state.app);

  const sortedChainIds = useMemo(
    () => (isTestnet ? TestnetsortedChainIds : MainnetsortedChainIds),
    [isTestnet]
  );

  return (
    <>
      {sortedChainIds.map((chainId, i) => {
        return (
          filteredHoldings[chainId] && (
            <RenderChainsList
              key={i}
              singleChainHolding={filteredHoldings[chainId]}
              onTokenSelect={onTokenSelect}
              defaultExpanded={defaultExpanded}
              chainId={+chainId}
              showAllHoldings={showAllHoldings}
              showActiveOnly={showActiveOnly}
              showInactiveOnly={showInactiveOnly}
              index={i}
              fetchMoreTokens={fetchMoreTokens}
            />
          )
        );
      })}
    </>
  );
};

const RenderChainsList: FC<PROPS> = ({
  singleChainHolding,
  onTokenSelect,
  defaultExpanded,
  chainId,
  showAllHoldings,
  showActiveOnly,
  showInactiveOnly,
  index,
  fetchMoreTokens,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleChange = (event: SyntheticEvent, isExpanded: boolean) =>
    setIsExpanded(isExpanded);
  const thisHoldings = Object.values(singleChainHolding.tokens);

  const shouldRenderChainList = useMemo(() => {
    if (showAllHoldings) return true;
    let flag = false;
    // checks if at least one token is active in that active token or inactive in inactive token
    // then we have to show the component
    for (let i = 0; i < thisHoldings.length; i++) {
      const thisToken = thisHoldings[i];
      if (
        (showActiveOnly && thisToken.isActive) ||
        (showInactiveOnly && !thisToken.isActive)
      ) {
        flag = true;
        break;
      }
    }
    return flag;
  }, [thisHoldings, showAllHoldings]);

  return (
    <>
      {shouldRenderChainList && (
        <ChainAccordion expanded={isExpanded} onChange={handleChange}>
          <ChainAccordionSummary
            id={`RenderChainsList-ChainAccordionSummary-${index}`}
          >
            <ChainComponent
              isExpanded={isExpanded}
              singleChainHolding={singleChainHolding}
              onClick={() => {}}
            />
          </ChainAccordionSummary>
          <ChainAccordionDetails
            id={`RenderChainsList-ChainAccordionDetails-${index}`}
          >
            <MyTokens
              tokens={singleChainHolding.tokens}
              onTokenSelect={onTokenSelect}
              chainId={chainId}
              showAllHoldings={showAllHoldings}
              showActiveOnly={showActiveOnly}
              showInactiveOnly={showInactiveOnly}
              chainIndex={index}
              fetchMoreTokens={fetchMoreTokens}
            />
          </ChainAccordionDetails>
        </ChainAccordion>
      )}
    </>
  );
};

export default Chains;
