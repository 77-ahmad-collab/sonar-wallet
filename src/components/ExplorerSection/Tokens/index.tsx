import { FC, memo, useEffect } from "react";
import _ from "lodash";

import { ITokensProps } from "interfaces";
import Chains from "./Chains";

const Tokens: FC<ITokensProps> = ({
  style,
  onTokenSelect,
  customHolding,
  defaultExpanded = false,
  showAllHoldings = true,
  showActiveOnly = true,
  showInactiveOnly = false,
  fetchMoreTokens = () => {},
}) => {
  useEffect(() => {
    const tokenList = document.querySelector(".my-tokens-list");
    if (tokenList) {
      tokenList.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      {!_.isEmpty(customHolding) && (
        <div
          className="my-tokens-list trans-default bezier-in-out"
          style={{ ...style }}
        >
          <Chains
            filteredHoldings={customHolding}
            onTokenSelect={onTokenSelect}
            defaultExpanded={defaultExpanded}
            showAllHoldings={showAllHoldings}
            showActiveOnly={showActiveOnly}
            showInactiveOnly={showInactiveOnly}
            fetchMoreTokens={fetchMoreTokens}
          />
        </div>
      )}
    </>
  );
};

export default memo(Tokens);
