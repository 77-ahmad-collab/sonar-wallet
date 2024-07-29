import { FC, useEffect, useState } from "react";

import { SimpleTile } from "components";
import { ReceiveAccountProps as PROPS, SimpleAccountsList } from "interfaces";
import { NETWORK_LOGOS } from "utils/constants";
import { matchAddresses } from "utils";
import { useAppSelector } from "store/store";
import { getSimpleAccountsList } from "utils/utils.wallets";

const AccountsList: FC<PROPS> = ({
  onAccountClick = () => {},
  network,
  ListStyle = {},
  selectedAccount,

}) => {
  /* global-state */
  const { allWallets } = useAppSelector((state) => state.newWallet);
  /* local-state */
  const [accounts, setAccounts] = useState<SimpleAccountsList>();

  /* hooks */

  /* functions */
  const getAccountsList = async () => {
    const accounts = await getSimpleAccountsList(network);
    setAccounts(accounts as SimpleAccountsList);
  };

  const renderAccounts = () =>
    accounts?.map((account, i) => (
      <SimpleTile
        key={i}
        tileInfo={{
          NAME: account.name,
          LOGO: NETWORK_LOGOS[account.chain],
          ADDRESS: account.address,
          chain: account.chain,
          walletName: allWallets[account.walletId].name,
        }}
        onClick={onAccountClick}
        isSelected={matchAddresses(
          `${selectedAccount?.ADDRESS}`,
          account.address
        )}
        enableToggle
      />
    ));

  /* effects */
  useEffect(() => {
    getAccountsList();
  }, [network]);

  return (
    <div style={{ ...ListStyle }}>
      {renderAccounts()}
      {/* <div className="r-c-c">
        <ButtonDefault
          bright
          onDarkBack
          width={150}
          style={{ marginTop: 10 }}
          onClick={() => {
            if (setIsChainFamilyModalOpen) setIsChainFamilyModalOpen(true);
          }}
        >
          Select Network
        </ButtonDefault> */}
      {/* </div> */}
    </div>
  );
};

export default AccountsList;
