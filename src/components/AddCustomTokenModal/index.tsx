import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { faWallet, faXmark } from "@fortawesome/pro-light-svg-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClipboard } from "@fortawesome/pro-regular-svg-icons";
import { IconButton } from "@mui/material";
import { ethers } from "ethers";
import axios, { AxiosResponse } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "store/store";

import {
  BasicModal,
  GenericBackgroundBoxContent,
  RainbowLoader,
  SearchBar,
  StartAdornment,
  TokenHoldingTile,
} from "components";
import {
  ButtonDefault,
  GenericBackgroundBox,
  ModalParentBoxStyled,
  StartAdornmentStyled,
  Text,
  TokenStatusLabelStyled,
} from "@styled";
import {
  AddCustomTokenModalProps as PROPS,
  SolanaTokenResponse,
  TokenHistoryInfo,
} from "interfaces";
import { formatAddress } from "utils/formatters";
import { DUMMY_IMAGE_URL, EVM, SOLANA } from "utils/constants";
import { BASE_URL } from "../../api";
import { checkSum, getDataFromClipboard } from "utils";
import { ProcessHoldings } from "classes";
import { setTokenHoldings, setTokenInfo } from "@slices/newWalletSlice";
import { useClipboard } from "hooks";
import { validateAddress } from "utils/validateAddresses";
import {
  fetchMultipleCoingeckoIds,
  getMultipleTokenPrices,
} from "utils/utils.api";

const { abi: ERC20Abi } = require("abis/erc20abi.json");

const AddCustomTokenModal: FC<PROPS> = ({ handleClose, isOpen, network }) => {
  /* global-state */

  /* local-state */
  const [value, setValue] = useState("");
  const [isTokenAdded, setIsTokenAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedToken, setSearchedToken] = useState<TokenHistoryInfo>();
  const [coingeckoId, setCoingeckoId] = useState("");
  const [error, setError] = useState("");

  const placeholder = useMemo(
    () =>
      network.chain === EVM
        ? "0x..."
        : network.chain === SOLANA
        ? "1A..."
        : "0x...",
    [network.chain]
  );

  /* hooks */
  const { tokenHoldings, tokenInfo } = useAppSelector(
    (state) => state.newWallet
  );
  const {
    selectedInputId,
    NETWORKCHAIN,
    nonNativeDefaultAndTopTokens: { tokens },
  } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const selectedChain = useMemo(() => {
    return Object.values(NETWORKCHAIN).filter(
      (chain) => chain.NAME === network.NAME
    )[0];
  }, [network]);
  const clipboardvalue = useClipboard();

  /* functions */
  const isValidAddress = (value: string) =>
    validateAddress(value, `${network.chain}`);

  const EndAdornment = () => {
    return (
      <IconButton
        id="custom-token-clear-input"
        disableRipple
        onClick={() => setValue("")}
        style={{ padding: "4px" }}
      >
        <CancelIcon
          fontSize="small"
          style={{ color: "rgba(255, 255, 255, 0.4)" }}
        />
      </IconButton>
    );
  };

  const onPasteHandler = () => setValue(getDataFromClipboard(selectedInputId));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const checkIfERC20 = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      selectedChain.NODE_URL
    );

    try {
      setIsLoading(true);
      const checkSumAddress = checkSum(value);
      const contract = new ethers.Contract(checkSumAddress, ERC20Abi, provider);

      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimal = await contract.decimals();
      if (
        tokenInfo[`${checkSumAddress}_${symbol}`] ||
        tokens[checkSumAddress]
      ) {
        setError("Token already existssss");
        setIsLoading(false);
        return;
      }
      setSearchedToken({
        tokenBalance: 0,
        tokenDecimal: decimal,
        tokenName: name,
        tokenAddress: checkSumAddress,
        priceInUSD: 0,
        tokenSymbol: symbol,
        image: DUMMY_IMAGE_URL,
        isActive: true,
        accounts: {},
      });
      const { data } = await axios.get(
        `${BASE_URL}/tokens/search/evm/${symbol}`
      );
      await getCoingeckoId(checkSumAddress);
      setSearchedToken({
        tokenBalance: 0,
        tokenDecimal: decimal,
        tokenName: name,
        tokenAddress: checkSumAddress,
        priceInUSD: 0,
        tokenSymbol: symbol,
        isActive: true,
        accounts: {},
        image: typeof data !== "string" ? data[0].image : DUMMY_IMAGE_URL,
      });
    } catch (error) {
      setError("Token not found");
      // console.log(error);
    }
    setIsLoading(false);
  };

  const checkIfValidSolanaToken = async () => {
    try {
      setIsLoading(true);
      const {
        data: solanaTokensInfo,
      }: AxiosResponse<SolanaTokenResponse, any> = await axios.post(
        `${BASE_URL}/tokens/filter/solanaTokens`,
        {
          tokenAddresses: [value],
        }
      );

      if (solanaTokensInfo[value]) {
        const { decimals, name, symbol, image, address } =
          solanaTokensInfo[value];
        if (tokenInfo[`${address}_${symbol}`]) {
          setError("Token already exists");
          setIsLoading(false);
          return;
        }
        await getCoingeckoId(address);
        setSearchedToken({
          tokenBalance: 0,
          tokenDecimal: decimals,
          tokenName: name,
          tokenAddress: address,
          priceInUSD: 0,
          tokenSymbol: symbol,
          image: image,
          isActive: true,
          accounts: {},
        });
      } else {
        setError("Token not found");
      }
    } catch (error) {
      // console.log(error);
    }
    setIsLoading(false);
  };

  const onClose = () => {
    handleClose();
    setSearchedToken(undefined);
    setValue("");
  };

  const onTokenAdded = () => {
    addCustomTokenInHoldings();
    setIsTokenAdded(true);
    setTimeout(() => {
      handleClose();
      setSearchedToken(undefined);
      setValue("");
    }, 2000);
    setTimeout(() => {
      setIsTokenAdded(false);
    }, 4000);
  };

  const addCustomTokenInHoldings = async () => {
    let tokenPrices: {
      [id: string]: {
        usd: number;
      };
    } = {};
    if (coingeckoId) {
      tokenPrices = await getMultipleTokenPrices([coingeckoId]);
    }

    const Processor = new ProcessHoldings(tokenHoldings, tokenInfo);
    if (searchedToken && network.id) {
      Processor.addCustomToken(`${network.chain}`, selectedChain.CHAIN_ID, {
        name: searchedToken.tokenName,
        symbol: searchedToken.tokenSymbol,
        image: searchedToken.image,
        decimals: searchedToken.tokenDecimal,
        address: searchedToken.tokenAddress,
        isActive: searchedToken.isActive,
        coingeckoId,
        price: tokenPrices?.[coingeckoId]?.usd || 1,
      });
      dispatch(setTokenInfo(Processor.allTokenInfo));
      dispatch(setTokenHoldings(Processor.allHoldings));
    }
  };

  const getCoingeckoId = async (address: string) => {
    const Id = await fetchMultipleCoingeckoIds([address]);

    if (Id.length > 0) {
      setCoingeckoId(Id[0]);
    }
  };

  /* effects */
  useEffect(() => {
    if (value === "") {
      setSearchedToken(undefined);
      error && setError("");
    } else if (network.chain === EVM && ethers.utils.isAddress(value)) {
      checkIfERC20();
    } else if (network.chain === SOLANA && validateAddress(value, SOLANA)) {
      checkIfValidSolanaToken();
    } else {
      setError("invalid address");
    }
  }, [value]);

  return (
    <BasicModal open={isOpen} handleClose={onClose}>
      <ModalParentBoxStyled
        layout="position"
        transition={{ ease: "linear" }}
        width="90%"
        style={{ padding: "15px" }}
      >
        {!isTokenAdded && (
          <>
            {" "}
            <div
              className="r-c-fs"
              style={{
                borderBottom: "2px solid rgba(255,255,255,0.1)",
                paddingBottom: "12px",
              }}
            >
              <ButtonDefault
                onClick={onClose}
                onDarkBack
                width={35}
                height={35}
                margin={"0 16px 0 0"}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  color="white"
                  style={{ fontSize: 14 }}
                />
              </ButtonDefault>

              <Text size={20} align="center">
                Add Custom Token
              </Text>
            </div>
            <div className="r-c-sb input-header">
              <Text
                size={15}
                weight={500}
                customColor={error ? "rgba(255, 55, 94, 1)" : "white"}
              >
                Token Address
              </Text>
              {error && (
                <Text size={13} weight={600} customColor="rgba(255, 55, 94, 1)">
                  {error}
                </Text>
              )}
            </div>
            <SearchBar
              id="token-address-input"
              onChange={handleChange}
              placeholder={placeholder}
              value={value}
              containerStyle={{
                width: "100%",
                marginTop: "12px",
              }}
              StartAdornment={
                !isLoading ? (
                  <StartAdornment Icon={faWallet} />
                ) : (
                  <StartAdornmentStyled>
                    <RainbowLoader size={22} />
                  </StartAdornmentStyled>
                )
              }
              EndAdornment={value.length > 0 ? <EndAdornment /> : <></>}
            />
            <GenericBackgroundBox margintop={12} onClick={onPasteHandler}>
              <GenericBackgroundBoxContent
                imageSrc={faClipboard}
                title=" Paste from clipboard"
                isAddress={isValidAddress(clipboardvalue)}
                address={formatAddress(clipboardvalue)}
              />
            </GenericBackgroundBox>
          </>
        )}
        <AnimatePresence>
          {searchedToken && (
            <motion.div
              initial={{ y: 10, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: "unset" }}
              exit={{ y: -10, opacity: 0, height: 0 }}
              key="search"
            >
              <TokenStatusLabelStyled isModal key="1">
                <Text size={14} weight={500} align="left" opacity={0.5}>
                  Result
                </Text>
              </TokenStatusLabelStyled>
              <Text
                key="2"
                weight={400}
                size={14}
                opacity={0.5}
                customStyle={{
                  marginTop: isTokenAdded ? "0px" : "12px",
                }}
              >
                {network.NAME}
              </Text>
              <div key="3" style={{ marginTop: "12px" }}>
                <TokenHoldingTile
                  isEditlist={false}
                  singleTokenHolding={{
                    address: searchedToken?.tokenAddress,
                    name: searchedToken?.tokenName ?? "",
                    symbol: searchedToken?.tokenSymbol,
                    decimals: searchedToken?.tokenDecimal,
                    image: searchedToken?.image ?? DUMMY_IMAGE_URL,
                    balance: searchedToken?.tokenBalance ?? 0,
                    rawBalance: "0",
                    balanceInUsd: 0,
                    isActive: searchedToken?.isActive ?? false,
                    accounts: {
                      "0x0001": {
                        name: "",
                        balance: 0,
                        balanceInUsd: 0,
                        walletName: "",
                        rawBalance: "0",
                      },
                    },
                  }}
                  showAccounts={false}
                  isExpanded={false}
                  onTokenSelect={() => {}}
                />
              </div>
              <ButtonDefault
                key="4"
                style={{
                  fontSize: 14,
                  marginTop: 25,
                  backgroundColor: isTokenAdded
                    ? "#3DF2BC"
                    : "rgba(255, 255, 255, 0.08)",
                  color: isTokenAdded ? "#000000" : "rgba(255,255,255,1)",
                }}
                onDarkBack
                width={isTokenAdded ? 137 : 121}
                padding="8px 12px 8px 12px"
                onClick={onTokenAdded}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  color={isTokenAdded ? "#000000" : "rgba(255,255,255,0.4)"}
                  style={{ fontSize: 16, marginRight: 8 }}
                />
                {isTokenAdded ? "Added to List" : "Add to List"}
              </ButtonDefault>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalParentBoxStyled>
    </BasicModal>
  );
};

export default AddCustomTokenModal;
