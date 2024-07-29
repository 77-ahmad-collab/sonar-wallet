import { FC } from "react";

import { WalletWrapperStyled } from "@styled";
import { WalletFilterCheckbox } from "components";
import { useWalletFilter } from "hooks";

const WalletAccordian: FC = () => {
  const { filteredWallets } = useWalletFilter();

  return (
    <>
      {Object.keys(filteredWallets).map((value, index) => {
        const wallet = filteredWallets[value];
        return (
          <WalletWrapperStyled key={index}>
            <WalletFilterCheckbox wallet={wallet} index={index} />
          </WalletWrapperStyled>
        );
      })}
    </>
  );
};

export default WalletAccordian;
