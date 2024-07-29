import React, { useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AddressBox, SpanOpacityStyled, Text } from "@styled";
import { useAppDispatch, useAppSelector } from "store/store";
import { setAccountsSelected } from "@slices/newWalletSlice";
import { formatAddress, formatAmount } from "utils/formatters";
import { matchAddresses } from "utils";
import { useHover } from "hooks";
import { Tooltip } from "@mui/material";
import { FilteredAccounts } from "interfaces";
import { ImageContent } from "components";

const checkboxStyle = {
  color: "rgb(0, 214, 125)",
};

export type Account = {
  address: string;
  isSelected: boolean;
  image: string;
  name: string;
  chainFamily: string;
  balanceInUsd: number;
};

export type FilteredWallet = {
  name: string;
  accounts: Account[];
  balanceInUsd: number;
};

type Props = {
  wallet: FilteredWallet;
  index?: number;
};

export default function WalletFilterCheckbox({
  wallet: { name, accounts, balanceInUsd },
  index,
}: Props) {
  const { accounts: allAccounts, filteredAccounts } = useAppSelector(
    (state) => state.newWallet
  );

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleWalletChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAccounts = accounts.map((account) => {
      return {
        address: account.address,
        value: event.target.checked,
      };
    });

    dispatch(setAccountsSelected(newAccounts));
  };

  const handleAccountChange = (isSelected: boolean, address: string) => {
    if (!checkerAllAccounts(filteredAccounts)) {
      dispatch(setAccountsSelected([{ address: address, value: isSelected }]));
    } else {
      const rawAccounts = Object.keys(allAccounts);
      const newAccounts = rawAccounts.map((account) => {
        if (matchAddresses(account, address)) {
          return {
            address: account,
            value: true,
          };
        }
        return {
          address: account,
          value: false,
        };
      });
      dispatch(setAccountsSelected(newAccounts));
    }
  };

  const checker = (arr: Account[]) => arr.every((v) => v.isSelected === true);

  const checkerAllAccounts = (obj: FilteredAccounts) =>
    Object.keys(obj).every((v) => filteredAccounts[v].isSelected === true);

  const LabelWallet = (name: string) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {name.length > 12 ? (
          <Tooltip title={name}>
            <Text className="r-c-fs" size={17} weight={400}>
              {name.slice(0, 6)}...
            </Text>
          </Tooltip>
        ) : (
          <Text className="r-c-fs" size={17} weight={400}>
            {name}
          </Text>
        )}

        <Text size={14} weight={400}>
          {formatAmount(balanceInUsd)}
          <SpanOpacityStyled opacity={0.4}> USD</SpanOpacityStyled>
        </Text>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", pl: "2px" }}>
      <FormControlLabel
        label={LabelWallet(name)}
        componentsProps={{ typography: { style: { width: "100%" } } }}
        control={
          <Checkbox
            id={`WalletFilterCheckbox-handleWalletChange-${index}`}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon sx={checkboxStyle} />}
            checked={checker(accounts)}
            onChange={handleWalletChange}
          />
        }
      />

      <Box sx={{ mt: "10px" }} />

      {accounts.map((account, accountIndex) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              borderRadius: "12px",
              backgroundColor: theme.palette.background.listItem,
              mb: "10px",
              paddingRight: `7px`,
              cursor: "pointer",
            }}
            key={accountIndex}
            onClick={() =>
              handleAccountChange(!account.isSelected, account.address)
            }
            id={`WalletFilterCheckbox-handleAccountChange-${index}-${accountIndex}`}
          >
            <Checkbox
              checked={account.isSelected}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon sx={checkboxStyle} />}
            />
            <LabelAccount
              address={account.address}
              image={account.image}
              name={account.name}
              chainFamily={account.chainFamily}
              balanceInUsd={account.balanceInUsd}
            />
          </Box>
        );
      })}
    </Box>
  );
}

const LabelAccount = ({
  address,
  image,
  name,
  chainFamily,
  balanceInUsd,
}: {
  address: string;
  image: string;
  name: string;
  chainFamily: string;
  balanceInUsd: number;
}) => {
  const [hovering, onHoverProps] = useHover();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <Box
      className="r-c-fs"
      style={{
        width: "100%",
      }}
    >
      <ImageContent
        Size={{ width: "20px", height: "20px", marginRight: "5px" }}
        src={image}
      />

      <TruncateName name={name} chainFamily={chainFamily} />

      <AddressBox
        iscopied={isCopied}
        onClick={(e) => {
          e.stopPropagation();
          handleCopyToClipboard(address);
        }}
        style={{
          marginLeft: "5px",
        }}
        {...(typeof onHoverProps === "object" ? onHoverProps : {})}
      >
        {isCopied
          ? "copied"
          : hovering
          ? "click to copy"
          : formatAddress(address)}
      </AddressBox>

      <Text size={11} weight={400} style={{ marginLeft: "auto" }}>
        {formatAmount(balanceInUsd)}
        <SpanOpacityStyled opacity={0.4}> USD</SpanOpacityStyled>
      </Text>
    </Box>
  );
};

const TruncateName = ({
  name,
  chainFamily,
}: {
  name: string;
  chainFamily: string;
}) => {
  let truncatedName = name;
  if (name.length + chainFamily.length > 10) {
    truncatedName = name.slice(0, 6) + "...";
  }
  if (truncatedName !== name) {
    return (
      <Tooltip title={name}>
        <Text
          weight={400}
          size={12}
          style={{ opacity: 0.7, alignItems: "center" }}
        >
          {truncatedName}
          <SpanOpacityStyled
            opacity={0.5}
            style={{ fontSize: "9px", marginLeft: "1px" }}
          >
            {chainFamily}
          </SpanOpacityStyled>
        </Text>
      </Tooltip>
    );
  } else {
    return (
      <Text
        weight={400}
        size={12}
        style={{ opacity: 0.7, alignItems: "center" }}
      >
        {truncatedName}
        <SpanOpacityStyled
          opacity={0.5}
          style={{ fontSize: "9px", marginLeft: "1px" }}
        >
          {chainFamily}
        </SpanOpacityStyled>
      </Text>
    );
  }
};
