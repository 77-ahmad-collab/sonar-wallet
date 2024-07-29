import { FC } from "react";

import { AccountHoldingTile } from "components";
import { AccountsProps as PROPS, RenderAccountsListProps } from "interfaces";
import { AccountsAccordion, AccountsAccordionDetails } from "@styled";

const Accounts: FC<PROPS> = ({
  singleTokenHolding,
  onAccountSelect,
  chainIndex,
  tokenIndex,
}) => {
  const { name, symbol, image } = singleTokenHolding;
  return (
    <>
      {Object.keys(singleTokenHolding.accounts).map((accAddress, key) => (
        <RenderAccountsList
          key={key}
          singleAccount={singleTokenHolding.accounts[accAddress]}
          tokenInfo={{ name, symbol, image }}
          onAccountSelect={() => onAccountSelect(accAddress)}
          index={key}
          chainIndex={chainIndex}
          tokenIndex={tokenIndex}
        />
      ))}
    </>
  );
};

const RenderAccountsList: FC<RenderAccountsListProps> = ({
  singleAccount,
  tokenInfo,
  onAccountSelect,
  index,
  chainIndex,
  tokenIndex,
}) => {
  return (
    <AccountsAccordion>
      <AccountsAccordionDetails>
        <AccountHoldingTile
          singleAccount={singleAccount}
          tokenInfo={tokenInfo}
          onAccountSelect={onAccountSelect}
          index={index}
          chainIndex={chainIndex}
          tokenIndex={tokenIndex}
        />
      </AccountsAccordionDetails>
    </AccountsAccordion>
  );
};

export default Accounts;
