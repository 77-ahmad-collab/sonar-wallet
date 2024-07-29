import { BottomBasicModal, ButtonWithIcon, ImageContent } from "components";
import { DefaultButton, Text } from "@styled";
import { useAppSelector } from "store/store";
import { faWallet, faXmark } from "@fortawesome/pro-light-svg-icons";
import { faTriangleExclamation } from "@fortawesome/pro-regular-svg-icons";

import { formatAddress, formatAmount } from "utils/formatters";
import { Accounts, HandleCLose, SimpleTileinfoProps } from "interfaces";
import { DUMMY_IMAGE_URL, NETWORK_LOGOS } from "utils/constants";
import { matchAddresses, truncateName } from "utils";

type Props = {
  open: boolean;
  handleClose: HandleCLose;
  onAddressSelect: (address: string) => void;
  accountsList: Accounts["accAddress"][];
  image?: string;
  selectedAddress?: string;
  showIcon?: boolean;
  onAccountClick?: (account: SimpleTileinfoProps) => void;
};

const SelectAccountModal = ({
  open,
  handleClose,
  onAddressSelect,
  accountsList,
  image,
  selectedAddress = "",
  showIcon = true,
  onAccountClick,
}: Props) => {
  return (
    <BottomBasicModal open={open} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          {showIcon && (
            <ButtonWithIcon
              icon={
                accountsList?.length === 0 ? faTriangleExclamation : faWallet
              }
              lightMode={true}
              onClick={() => {}}
              text=""
              iconColor="rgba(0,0,0,0.7)"
              isHover={false}
            />
          )}

          <Text className="f-title-sm " style={{ color: "black" }}>
            {accountsList?.length === 0
              ? "No Accounts available"
              : "Select Account"}
          </Text>
        </div>

        <div style={{ maxHeight: 300, overflowY: "scroll" }}>
          {accountsList?.map((account, index) => {
            return (
              <AccountListItem
                key={index}
                account={account}
                image={image ?? DUMMY_IMAGE_URL}
                onAddressSelect={onAddressSelect}
                selectedAddress={selectedAddress}
                accountIndex={index}
                onAccountClick={onAccountClick}
              />
            );
          })}
        </div>
        <ButtonWithIcon
          id="SelectAccountModal-onCancel"
          icon={faXmark}
          lightMode={true}
          contained
          onClick={handleClose}
          text="Cancel"
          iconColor="rgba(0,0,0,0.4)"
          style={{ marginTop: 10 }}
        />
      </>
    </BottomBasicModal>
  );
};

const AccountListItem = ({
  account,
  image,
  onAddressSelect,
  selectedAddress = "",
  accountIndex,
  onAccountClick,
}: {
  account: Accounts["accAddress"];
  image: string;
  onAddressSelect: (address: string) => void;
  selectedAddress?: string;
  accountIndex?: number;
  onAccountClick?: (account: SimpleTileinfoProps) => void;
}) => {
  const { allWallets, accountsSum } = useAppSelector(
    (state) => state.newWallet
  );

  const onSelect = () => {
    onAddressSelect(account.address);
    if (onAccountClick)
      onAccountClick({
        LOGO: NETWORK_LOGOS[account.chainFamily],
        NAME: account.name,
        ADDRESS: account.address,
        chain: account.chainFamily,
        id: account.walletId,
        walletName: allWallets[account.walletId].name,
      });
  };

  return (
    <DefaultButton
      id={`accountList-${accountIndex}`}
      style={{
        height: "unset",
        width: "100%",
        padding: "10px 10px",
        marginBottom: 10,
        border:
          matchAddresses(selectedAddress, account.address) === true
            ? "2px solid black"
            : "none",
      }}
      lightMode
      contained={false}
      onClick={onSelect}
    >
      <div className="r-c-fs" style={{ flex: 1 }}>
        <ImageContent
          src={image}
          Size={{
            width: "30px",
            height: "30px",
            marginRight: "10px",
            borderRadius: "50%",
          }}
        />
        <div>
          <Text className="f-body-lg mgr-sm" style={{ color: "black" }}>
            {truncateName(account.name)}
          </Text>
          <Text className="f-label" opacity={0.4} style={{ color: "black" }}>
            {truncateName(allWallets[account.walletId].name)}
          </Text>
        </div>
        <DefaultButton
          style={{ height: "unset", padding: "3px 6px" }}
          lightMode
          contained={false}
        >
          <Text className="f-body-sm " opacity={0.7} style={{ color: "black" }}>
            {formatAddress(account.address)}
          </Text>
        </DefaultButton>
      </div>
      <Text style={{ color: "black" }}>
        {formatAmount(accountsSum[account.address].balanceInUsd)} USD
      </Text>
    </DefaultButton>
  );
};

export default SelectAccountModal;
