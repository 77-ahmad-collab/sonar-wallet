import axios, { AxiosResponse } from "axios";
import solanaWeb3, { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { BASE_URL } from "../api";
import {
  SingleEthHistory,
  SolanaTokenResponse,
  TokenHoldings,
} from "interfaces";
import { NETWORKS, SupportedChainId } from "utils/constants";
import { getSolanaConnection } from "utils";
import { extractKeypair, getPrivateKeysOfAccounts } from "./utils.wallets";
import { ProcessHoldings } from "classes";
import {
  ChoresAfterHoldingProcess,
  mergeTokenHoldings,
  processNormalTokenHolding,
} from "./utils.holdings";
import { StaticStore } from "store/store";
import { setTokenHoldings } from "@slices/newWalletSlice";
const splToken = require("@solana/spl-token");

/**
 * loops through all the SOLANA accounts and fetch balance
 * @param allSOLANAaccounts string[]
 * @param isTestnet boolean
 */
export const handleSOLANAholdings = async (
  allSOLANAaccounts: string[],
  isTestnet: boolean
) => {
  const solanaAddressWithSecretKeys = await getPrivateKeysOfAccounts(
    NETWORKS.SOLANA
  );

  const solanaMainnetConnection = getSolanaConnection(true);
  const solanaTestnetConnection = getSolanaConnection(false);

  const HoldingsProcessor = new ProcessHoldings();

  const holdingres = await Promise.allSettled(
    [
      isTestnet
        ? SupportedChainId.SOLANA_DEVNET
        : SupportedChainId.SOLANA_MAINNET,
    ].map(async (chainId) => {
      return await Promise.allSettled(
        allSOLANAaccounts.map(async (address) => {
          const secretKey = solanaAddressWithSecretKeys[address];
          const holdings = (await fetchAllHoldingsSolana(
            address,
            secretKey,
            chainId,
            chainId === SupportedChainId.SOLANA_DEVNET
              ? solanaTestnetConnection
              : solanaMainnetConnection
          )) as SingleEthHistory[];
          if (typeof holdings === "object") {
            return { holdings, chainId, address };
          } else {
            return Promise.reject();
          }
        })
      );
    })
  );

  processNormalTokenHolding(holdingres, HoldingsProcessor);

  await ChoresAfterHoldingProcess(HoldingsProcessor);
};

export const fetchAllHoldingsSolana = async (
  address: string,
  secretKey: string,
  chainId: number,
  connection: solanaWeb3.Connection
) => {
  const importedAccount = await extractKeypair(secretKey);

  const SolanaBalanace = await fetchBalanceSolana(
    importedAccount.publicKey,
    connection,
    chainId
  );

  const allTokens: object[] = [];
  if (SolanaBalanace?.tokenName) {
    allTokens.push(SolanaBalanace);
  }

  const SolanaTokens = await showAllHoldingsSolana(address, connection);
  allTokens.push(...SolanaTokens);

  return allTokens;
};

export const fetchBalanceSolana = async (
  publicKey: solanaWeb3.PublicKey,
  connection: solanaWeb3.Connection,
  chainId: number
) => {
  if (!publicKey) return;

  try {
    const { NETWORKCHAIN } = StaticStore.getState().app;
    const balance = await connection.getBalance(publicKey);
    const SolanaBalance = balance / LAMPORTS_PER_SOL;

    if (SolanaBalance) {
      return {
        tokenName: NETWORKCHAIN[+chainId].NATIVE_TOKEN_NAME,
        tokenSymbol: NETWORKCHAIN[+chainId].NATIVE_TOKEN_SYMBOL,
        tokenBalance: SolanaBalance,
        tokenBalanceRawInteger: balance.toString(),
        priceInUSD: 0,
        tokenAddress: NETWORKCHAIN[+chainId].NATIVE_TOKEN_ADDRESS,
        tokenDecimal: NETWORKCHAIN[+chainId].DECIMALS,
        image: NETWORKCHAIN[+chainId].LOGO,
        tokenPrice: 0,
      };
    }
  } catch (error) {
    return {
      tokenName: "",
      tokenSymbol: "",
      tokenBalance: 0,
      tokenBalanceRawInteger: 0,
      priceInUSD: 0,
      tokenAddress: "",
      tokenDecimal: 0,
      image: "",
      tokenPrice: 0,
    };
  }
};

export const showAllHoldingsSolana = async (
  address: string,
  connection: solanaWeb3.Connection
) => {
  try {
    const tokenAccounts = await connection.getParsedProgramAccounts(
      splToken.TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 32, // number of bytes
              bytes: new PublicKey(address).toString(), // base58 encoded string
            },
          },
        ],
      }
    );

    const tokenAddresses = tokenAccounts.map((tkAcc) => {
      const account =
        tkAcc.account as solanaWeb3.AccountInfo<solanaWeb3.ParsedAccountData>;
      return account.data.parsed.info.mint;
    });

    if (tokenAccounts.length > 0) {
      const solanaTokensInfo: AxiosResponse<SolanaTokenResponse, any> =
        await axios.post(`${BASE_URL}/tokens/filter/solanaTokens`, {
          tokenAddresses,
        });

      const aggregatedTokenInfo = tokenAccounts
        .map((singleTkAcc) => {
          const account =
            singleTkAcc.account as solanaWeb3.AccountInfo<solanaWeb3.ParsedAccountData>;
          const aboutToken = account.data.parsed.info;
          const thisTokenInfo = solanaTokensInfo.data[aboutToken.mint];

          if (thisTokenInfo) {
            return {
              tokenName: thisTokenInfo.name,
              tokenSymbol: thisTokenInfo.symbol,
              tokenBalance: aboutToken.tokenAmount.uiAmount,
              tokenBalanceRawInteger: aboutToken.tokenAmount.amount.toString(),
              tokenAddress: thisTokenInfo.address,
              tokenDecimal: thisTokenInfo.decimals,
              priceInUSD: 0,
              image: thisTokenInfo.image,
              tokenPrice: "0",
            } as SingleEthHistory;
          }
        })
        .filter(Boolean) as SingleEthHistory[];
      return aggregatedTokenInfo;
    } else {
      return [];
    }
  } catch (e: any) {
    return [];
  }
};

export const updateBalanceOfSingleSolanaToken = async (
  walletAddresses: string[],
  tokenMintAddress: string,
  symbol: string,
  chainId: number,
  prevBalance: string[]
) => {
  let balances = await getBalancesOfSingleSolanaToken(
    walletAddresses,
    tokenMintAddress,
    chainId
  );

  while (
    prevBalance[0] === balances[0] &&
    (prevBalance[1]
      ? prevBalance[1] === "0"
        ? balances[1] === "0"
        : prevBalance[1] === balances[1]
      : true)
  ) {
    await new Promise((r) => setTimeout(r, 2000));
    balances = await getBalancesOfSingleSolanaToken(
      walletAddresses,
      tokenMintAddress,
      chainId
    );
  }

  let newHoldings: TokenHoldings = {};
  balances.forEach((rawAmount, index) => {
    newHoldings = {
      ...newHoldings,
      [walletAddresses[index]]: {
        [chainId]: {
          [tokenMintAddress]: {
            symbol,
            rawAmount,
          },
        },
      },
    };
  });

  balances.length &&
    (await StaticStore.dispatch(
      setTokenHoldings(
        mergeTokenHoldings(
          newHoldings,
          StaticStore.getState().newWallet.tokenHoldings
        )
      )
    ));
};

export const getBalancesOfSingleSolanaToken = async (
  walletAddress: string[],
  tokenMintAddress: string,
  chainId: number
) => {
  const { NETWORKCHAIN } = StaticStore.getState().app;
  const res = await Promise.all(
    walletAddress.map((accAddress) => {
      return axios.post(NETWORKCHAIN[chainId].NODE_URL, {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          accAddress,
          {
            mint: tokenMintAddress,
          },
          {
            encoding: "jsonParsed",
          },
        ],
      });
    })
  );
  const rawBalances: string[] = [];
  res.forEach((response) => {
    // check axios response status
    // check if solana returned error
    // check if response has value array
    if (
      response.status === 200 &&
      !response.data?.error &&
      response.data.result.value.length
    ) {
      rawBalances.push(
        response.data.result.value[0].account.data.parsed.info.tokenAmount
          .amount
      );
    }
  });
  return rawBalances;
};
