import { FC } from "react";
import { faMessageExclamation } from "@fortawesome/pro-light-svg-icons";

import { ITokensProps } from "interfaces";
import { useAppSelector } from "store/store";
import { EmptyAddress, Tokens } from "components";
import { useCommon } from "hooks";

const TokenslistWithMessage: FC<ITokensProps> = ({
  onTokenSelect,
  customHolding,
  fetchMoreTokens,
  defaultExpanded = false,
  style,
  showAllHoldings,
}) => {
  const {
    numOfTokens: { inActive, total },
  } = useAppSelector((state) => state.newWallet);

  const { checkIfAllAccountsDisabled } = useCommon();

  return (
    <>
      {inActive === total || checkIfAllAccountsDisabled ? (
        <EmptyAddress
          text={
            inActive === total
              ? "Please enable tokens from edit list"
              : "Select Account from wallet filter"
          }
          icon={faMessageExclamation}
        />
      ) : (
        <Tokens
          style={style}
          onTokenSelect={onTokenSelect}
          customHolding={customHolding}
          defaultExpanded={defaultExpanded}
          showAllHoldings={showAllHoldings}
          fetchMoreTokens={fetchMoreTokens}
        />
      )}
    </>
  );
};

export default TokenslistWithMessage;
