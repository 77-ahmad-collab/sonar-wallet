import { ConnectConfig, keyStores } from "near-api-js";
import { Chain, CustomChain } from "@ethereumjs/common";
import {
  // faArrowDownLeft,
  IconDefinition,
  faArrowDownRight,
  faArrowUpRight,
  faArrowsRepeat,
} from "@fortawesome/pro-regular-svg-icons";

import {
  // auroraLogo,
  avaxLogo,
  bnbLogo,
  croLogo,
  ePingLogo,
  ethLogo,
  ftmLogo,
  maticLogo,
  nearLogo,
  pingLogo,
  solLogo,
} from "assets/images";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { DummyTokenImage } from "assets/Icons";
import { INON_NATIVE_DEFAULT, RpcsList, networkInfoType } from "interfaces";

export const EVM_DERIVATION_PATH = "m/44'/60'/0'/0";
export const RPC_URL =
  "https://speedy-nodes-nyc.moralis.io/93b5e495700257c1f1635d38/eth/mainnet";
export const CURRENTLY_IN_DEVELOPMENT = true;
export const OPEN_IN_WEB = false; // chrome.storage ? false : true;
export const STORAGE = undefined; // OPEN_IN_WEB ? undefined : chrome.storage.sync;
export const baseURL = "https://api.coingecko.com/api/v3";
export const DUMMY_IMAGE_URL = DummyTokenImage;
/////////////////////////////////////
///                               ///
///             COMMON            ///
///                               ///
/////////////////////////////////////
export const HASHEDPASSWORD = "hashedPassword";
export const GRAPH_EXPIRY = 3600000;
// export const LOGIN_EXPIRY = 3600000; // 60 Minutes->3600000
// export const EXTENDED_TIME = LOGIN_EXPIRY / 2;
export const ONE_DAY_TIME = 86400000;
export const PENDING_TRANSACTION_TIMEOUT = 1800000;
export const ETHERSCAN_API_KEY = "M193VGUECIDFKWVWAJA9ZPQNKBANY9613B";
export const BSC_API_KEY = "E4EU36PNSJEURVVB9FZEZ5VEW6VMAM83WS";
export const POLYGON_API_KEY = "9RQBN2EHMAFFZUGTH9IKZK4IHJV7U4MIPU";
export const FANTOM_API_KEY = "GT2TBRWHRDCSJHIPPSRX5J36NJ3K34Q28P";
export const GET_GAS_PRICE = "https://ethgasstation.info/api/ethgasAPI.json";
export const GET_GAS_PRICE_MATIC =
  "https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=9RQBN2EHMAFFZUGTH9IKZK4IHJV7U4MIPU";
export const GET_GAS_PRICE_BSC =
  "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=6MH6338G1KQ1GWS423AICCF3G3DP6EFF1Z";
export const LOCAL_SERVER_URL = "http://localhost:5000";
export const TransactionSuccessMessage = "Transaction has been completed";
export const TransactionCancelMessage = "Transaction has been Cancelled";
export const TransactionFailureMessage = "Transaction has been failed";

const BINANCE_OX_API = "https://bsc.api.0x.org";
const POLYGON_OX_API = "https://polygon.api.0x.org";
const POLYGON_MUMBAI_OX_API = "https://mumbai.api.0x.org";
const ETHEREUM_OX_API = "https://api.0x.org";
// const ETHEREUM_OX_API_ROPSTEN = "https://ropsten.api.0x.org";
const ETHEREUM_OX_API_GOERLI = "https://goerli.api.0x.org";
export const solanaTranserFees = 0.0005;
export const solanaTranserFeesInLamports = 500000;
export const CACHE_TIME = 60000;
export const USD_CACHE_TIME = 30000;
export const ETHEREUM_USDT_ADDRESS =
  "0xdac17f958d2ee523a2206206994597c13d831ec7";
export const BINANCE_USDT_ADDRESS =
  "0xe9e7cea3dedca5984780bafc599bd69add087d56";
export const POLYGON_USDT_ADDRESS =
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
export const WETH_SYMBOL = "weth";
export const WBNB_SYMBOL = "wbnb";
export const WMATIC_SYMBOL = "wmatic";
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const SOLANA_ADDRESS = "So11111111111111111111111111111111111111112";
export const WBNB_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
export const WMATIC_ADDRESS = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
export const ETHEREUM_COINGECKO_ID = "ethereum";
export const BINANCE_COIN_COINGECKO_ID = "binancecoin";
export const MATIC_COINGECKO_ID = "matic-network";
export const SWAP_REFERRER_ADDRESS =
  "0x060846341A648747BC6044c8F4d3bc6bE7f61252";
// "0xE37C4bADb0ccE83AFEAc9b838724c4B31845Ff2d";
export const SWAP_REFERRER_FEE = "0.2";
export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const ETHEREUM_EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff";
export const GOERLI_EXCHANGE_PROXY_ADDRESS_0X =
  "0xf91bb752490473b8342a3e964e855b9f9a2a668e";
export const POLYGON_EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff";
export const POLYGON_MUMBAI_EXCHANGE_PROXY_ADDRESS_0X =
  "0xf471d32cb40837bf24529fcf17418fc1a4807626";
export const BSC_EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff";
export const OPTIMISM_EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef1abe32c034e558cdd535791643c58a13acc10";
export const FANTOM_EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef189deaef76e379df891899eb5a00a94cbc250";
export const AVALANCHE_EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

export const PANCAKE_V2_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
export const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const SWAP_EXPIRATION_TIME = (Date.now() + 600000).toString();
export const ETHEREUM_MAINNET = "ETHEREUM_MAINNET";
// export const ETHEREUM_ROPSTEN = "ETHEREUM_ROPSTEN";
export const POLYGON_MAINNET = "POLYGON_MAINNET";
export const POLYGON_TESTNET = "POLYGON_TESTNET";
export const BINANCE_SMART_CHAIN = "BINANCE_SMART_CHAIN";
export const BSC_TESTNET = "BSC_TESTNET";
export const seedPhraseExpirationTime = new Date().getTime() + 300000;
export const NODE_URL = "NODE_URL";
export const SOCKET_URL = "SOCKET_URL";

export const API = "API";
export const BITQUERY_NETWORK = "BITQUERY_NETWORK";
export const WRAPPED_SYMBOL = "WRAPPED_SYMBOL";
export const WRAPPED_ADDRESS = "WRAPPED_ADDRESS";
export const COINGECKO_ID = "COINGECKO_ID";
export const API_KEY = "API_KEY";
export const NATIVE_TOKEN_NAME = "NATIVE_TOKEN_NAME";
export const NATIVE_TOKEN_SYMBOL = "NATIVE_TOKEN_SYMBOL";
export const NEAR_TESTNET = "NEAR_TESTNET";
export const NEAR_MAINNET = "NEAR";
export const NEAR = "NEAR";
export const SOLANA_DEVNET = "SOLANA_DEVNET";
export const SOLANA_MAINNET = "SOLANA_MAINNET";
export const TESTNET = "TESTNET";
export const SLIPPAGE = "Slip";
export const Custom = "Custom";
// export const ROPSTEN = "ROPSTEN";
// export const RINKEBY = "RINKEBY";
export const SOLANADEVNET = "DEVNET";
// export const SWAP_EXPIRATION_TIME = parseInt(
//   (Date.now() + 900) / 1000
// ).toString();

/////////////////////////////////////
///                               ///
///             DEVELOPMENT       ///
///                               ///
/////////////////////////////////////
export const BINANCE_API = "https://api-testnet.bscscan.com/api";
export const POLYGON_API = "https://api-testnet.polygonscan.com/api";
export const FANTOM_API = "https://api-testnet.ftmscan.com/api";
export const BSC_NODE_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
export const POLYGON_NODE_URL = "https://rpc-mumbai.maticvigil.com/";
export const POLYGON_CHAIN_TX = CustomChain.PolygonMumbai;
export const BINANCE_CHAIN_TX = {
  name: "bnb",
  networkId: 97,
  chainId: 97,
};
export const BITQUERY_ETHEREUM_NETWORK = "ethereum";
export const BITQUERY_BNB_NETWORK = "bsc_testnet";
export const BITQUERY_POLYGON_NETWORK = "matic";
// export const ETHEREUM_RINKEBY = "ETHEREUM_RINKEBY";
export const CHAIN_TX = "CHAIN_TX";
export const NATIVE_TOKEN_COINGECKO_ID = "NATIVE_TOKEN_COINGECKO_ID";
export const GET_SWAP_TOKEN_API = "GET_SWAP_TOKEN_API";
export const OX_API = "OX_API";
export const SCAN_LINK = "SCAN_LINK";
export const LOGO = "LOGO";
export const COMMITMENT = "confirmed";
export const EVM = "EVM";
export const SOLANA = "SOLANA";

export const ACCOUNTS = "accounts";
export const secretKey = "secretKey";
export const DEVNET = "devnet";
export const MAINNET = "mainnet-beta";

export const MAX_WALLETS_LIMIT = 3;
export const MAX_WALLETS_LIMIT_WITH_PING = 5;
export const MAX_ACCOUNTS_LIMIT = 6;
export const MAX_ACCOUNTS_LIMIT_WITH_PING = 9;
export const MIN_PING_HOLDING_LIMIT = 500;

export const CURRENT_NETWORK = "devnet";
export const ACCOUNT_ADDRESS = "0x8b1c8Fd6B72D5707eC99a87BcE016DD899890e30";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const PRIVATE_KEY =
  "0xb1ec69f6728f5c9acf666850438d9d2f4221c31a3dd1db9b0d12d0f5d6af6315";
/////////////////////////////////////
///                               ///
///          PRODUTION            ///
///                               ///
/////////////////////////////////////
export const TEST_NETWORK = "testnet";
export const MAIN_NETWORK = "default";
export const NETWORK_ID = "networkId";
export const NEAR_MAINNET_HEX_ADDRESS_LENGTH = 64;
export const FT_TRANSFER_GAS = parseNearAmount("0.00000000003");
export const MAX_GAS_PRICE = 713252;
export const RESERVE_NEAR_TRANSACTION_COST = 0.05;

export const APPROVE_AMOUNT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"; //(2^256 - 1 )

export const FT_TRANSFER_DEPOSIT = "1";
const NEAR_BASE_URL = "https://api.kitwallet.app";
// const NEAR_TESTNET_BASE_URL = "https://testnet-api.kitwallet.app";
export const ResultingBalances = "Resulting Balances";
export const NETWORKS = {
  EVM: "EVM",
  // NEAR_TESTNET: "NEAR_TESTNET",
  SOLANA: "SOLANA",
  NEAR,
};

export const ACCOUNT1 = "ACCOUNT1";
export const CHAINS = "chains";
export const CHAIN = "chain";
export const PASSWORD = "password";
export const SEEDPHRASE = "seedphrase";
export const STATIC_WALLET_NUMBER = 1;
export const SECRET = "secret";
export const FAST = "Fast";
export const SLOW = "Slow";
export const AVERAGE = "Average";
export const Spend = "Spend";
export const FROM = "FROM";
export const RECEIVE = "Receive";
export const NEAR_ADDRESS = "near";
export const NEVER_BEEN_ON_THIS_SYSTEM_MESSAGE =
  "I've never been on this system";
export const WELCOME_MESSAGE_ON_RESET_PASSWORD =
  "Please enter the password to continue...";

////=========================CHAINMAP=====================================
export enum SupportedChainId {
  ETHEREUM_MAINNET = 1,
  // ETHEREUM_ROPSTEN = 3,
  // ETHEREUM_RINKEBY = 4,

  ETHEREUM_GOERLI = 5,
  POLYGON_MAINNET = 137,
  POLYGON_TESTNET = 80001,
  BINANCE_SMART_CHAIN = 56,
  BSC_TESTNET = 97,
  FANTOM_MAINNET = 250,
  FANTOM_TESTNET = 4002,
  CRONOS_MAINNET = 25,
  CRONOS_TESTNET = 338,
  AVALANCHE_MAINNET = 43114,
  AVALANCHE_TESTNET = 43113,
  AURORA_MAINNET = 1313161554,
  // AURORA_TESTNET = 1313161555,
  // NEAR_TESTNET = 100,
  NEAR = 101,
  SOLANA_DEVNET = 102,
  SOLANA_MAINNET = 103,
}

export const CONFIG: { [key: number]: ConnectConfig } = {
  // [SupportedChainId.NEAR_TESTNET]: {
  //   networkId: TEST_NETWORK,
  //   keyStore: new keyStores.InMemoryKeyStore(),
  //   nodeUrl: `https://rpc.${TEST_NETWORK}.near.org`,
  //   walletUrl: `https://wallet.${TEST_NETWORK}.near.org`,
  //   helperUrl: NEAR_TESTNET_BASE_URL,
  //   headers: {},
  //   // explorerUrl: `https://explorer.${TEST_NETWORK}.near.org`,
  // },
  [SupportedChainId.NEAR]: {
    networkId: "mainnet", //MAIN_NETWORK,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl: "https://rpc.mainnet.near.org", //`https://rpc.ankr.com/near/${process.env.REACT_APP_ANKR_API_KEY}`,
    walletUrl: `https://wallet.mainnet.near.org`,
    helperUrl: NEAR_BASE_URL,
    headers: {},
    // explorerUrl: `https://explorer.mainnet.near.org`,
  },
};

export const NETWORKCHAIN: { [key: number]: networkInfoType } = {
  [SupportedChainId.ETHEREUM_MAINNET]: {
    NAME: "Ethereum Chain",
    API: "https://api.etherscan.io/api",
    NODE_URL: "https://rpc.ankr.com/eth", //`https://rpc.ankr.com/eth/${process.env.REACT_APP_ANKR_API_KEY}`, //"https://dev-wallet.sonar.studio/rpc/eth",
    SOCKET_URL:
      "wss://eth-mainnet.blastapi.io/0ec2df36-2b3a-4686-bae2-6372a48fee82", // `wss://rpc.ankr.com/eth/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //    "wss://eth-mainnet.blastapi.io/0ec2df36-2b3a-4686-bae2-6372a48fee82",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_ADDRESS: WETH_ADDRESS,
    COINGECKO_ID: ETHEREUM_COINGECKO_ID,
    API_KEY: ETHERSCAN_API_KEY,
    NATIVE_TOKEN_NAME: "Ethereum",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "https://tokens.coingecko.com/uniswap/all.json", //"https://api.0x.org/swap/v1/tokens",
    OX_API: ETHEREUM_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://etherscan.io/tx",
    GET_GAS_PRICE:
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=1S8PAHI5XRKC21K7IX3UCR43KCFGB195D5",
    LOGO: ethLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "0x1",
    CHAIN_ID: SupportedChainId.ETHEREUM_MAINNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: ETHEREUM_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.ETHEREUM_GOERLI]: {
    NAME: "Ethereum Görli Chain",
    API: "https://api-goerli.etherscan.io/api",
    NODE_URL: "https://rpc.ankr.com/eth_goerli", //`https://rpc.ankr.com/eth_goerli/${process.env.REACT_APP_ANKR_API_KEY}`,
    SOCKET_URL:
      "wss://eth-goerli.blastapi.io/94f1ff5e-2691-4264-ac10-6a8252a22baa", //`wss://rpc.ankr.com/eth_goerli/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //  "wss://eth-goerli.blastapi.io/94f1ff5e-2691-4264-ac10-6a8252a22baa",
    CHAIN_TX: Chain.Goerli,
    SUPPORTED_NETWORKS: [{ value: "goerli", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_ADDRESS: WETH_ADDRESS,
    COINGECKO_ID: ETHEREUM_COINGECKO_ID,
    API_KEY: ETHERSCAN_API_KEY,
    NATIVE_TOKEN_NAME: "Ethereum",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "https://goerli.api.0x.org/swap/v1/tokens",
    OX_API: ETHEREUM_OX_API_GOERLI,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://goerli.etherscan.io/tx",
    GET_GAS_PRICE:
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=1S8PAHI5XRKC21K7IX3UCR43KCFGB195D5",
    LOGO: ethLogo,
    isTestnet: true,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.ETHEREUM_GOERLI,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: GOERLI_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0x9788C4E93f9002a7ad8e72633b11E8d1ecd51f9b",
    SECONDARY_RPC: "",
  },

  [SupportedChainId.POLYGON_MAINNET]: {
    NAME: "Polygon Chain",
    API: "https://api.polygonscan.com/api",
    NODE_URL: "https://rpc.ankr.com/polygon", //`https://rpc.ankr.com/polygon/${process.env.REACT_APP_ANKR_API_KEY}`,
    SOCKET_URL:
      "wss://polygon-mainnet.blastapi.io/566f5dab-20f2-4ce9-9225-374a70da3722", //`wss://rpc.ankr.com/polygon/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //      "wss://polygon-mainnet.blastapi.io/566f5dab-20f2-4ce9-9225-374a70da3722",
    CHAIN_TX: CustomChain.PolygonMainnet,
    SUPPORTED_NETWORKS: [{ value: "Polygon", name: "Polygon" }],
    BITQUERY_NETWORK: "matic",
    WRAPPED_ADDRESS: WMATIC_ADDRESS,
    COINGECKO_ID: MATIC_COINGECKO_ID,
    API_KEY: POLYGON_API_KEY,
    NATIVE_TOKEN_NAME: "Polygon",
    NATIVE_TOKEN_SYMBOL: "MATIC",
    NATIVE_TOKEN_COINGECKO_ID: "matic-network",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/137.json",
    OX_API: POLYGON_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://polygonscan.com/tx",
    GET_GAS_PRICE: GET_GAS_PRICE_MATIC,
    LOGO: maticLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "0x89",
    CHAIN_ID: SupportedChainId.POLYGON_MAINNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: POLYGON_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.POLYGON_TESTNET]: {
    NAME: "Polygon Mumbai Chain",
    API: "https://api-testnet.polygonscan.com/api",
    NODE_URL: "https://rpc.ankr.com/polygon_mumbai", //`https://rpc.ankr.com/polygon_mumbai/${process.env.REACT_APP_ANKR_API_KEY}`, // "https://rpc-mumbai.maticvigil.com"
    SOCKET_URL:
      "wss://polygon-testnet.blastapi.io/dbc467db-0b70-42cd-a1c9-151c066dc45c", //`wss://rpc.ankr.com/polygon_mumbai/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //  "wss://polygon-testnet.blastapi.io/dbc467db-0b70-42cd-a1c9-151c066dc45c"
    CHAIN_TX: CustomChain.PolygonMumbai,
    SUPPORTED_NETWORKS: [{ value: "Polygon", name: "Polygon" }],
    BITQUERY_NETWORK: "matic",
    WRAPPED_ADDRESS: WMATIC_ADDRESS,
    COINGECKO_ID: MATIC_COINGECKO_ID,
    API_KEY: POLYGON_API_KEY,
    NATIVE_TOKEN_NAME: "Polygon",
    NATIVE_TOKEN_SYMBOL: "MATIC",
    NATIVE_TOKEN_COINGECKO_ID: "matic-network",
    GET_SWAP_TOKEN_API: "",
    OX_API: POLYGON_MUMBAI_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://mumbai.polygonscan.com/tx",
    GET_GAS_PRICE:
      "https://api-testnet.polygonscan.com/api?module=proxy&action=eth_gasPrice&apikey=9RQBN2EHMAFFZUGTH9IKZK4IHJV7U4MIPU",
    LOGO: maticLogo,
    isTestnet: true,
    isSwap: false,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.POLYGON_TESTNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: POLYGON_MUMBAI_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    NAME: "Binance Smart Chain",
    API: "https://api.bscscan.com/api",
    NODE_URL: "https://rpc.ankr.com/bsc/", // `https://rpc.ankr.com/bsc/${process.env.REACT_APP_ANKR_API_KEY}`, //"https://dev-wallet.sonar.studio/rpc/bsc",
    SOCKET_URL:
      "wss://bsc-mainnet.blastapi.io/01f541c5-85b4-429d-b548-0f6db7dac0f0", //`wss://rpc.ankr.com/bsc/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //     "wss://bsc-mainnet.blastapi.io/01f541c5-85b4-429d-b548-0f6db7dac0f0",
    CHAIN_TX: {
      name: "bnb",
      networkId: 56,
      chainId: 56,
    },
    SUPPORTED_NETWORKS: [
      { value: "Binance Smart Chain", name: "Binance Smart Chain" },
    ],
    BITQUERY_NETWORK: "bsc",
    WRAPPED_ADDRESS: WBNB_ADDRESS,
    COINGECKO_ID: BINANCE_COIN_COINGECKO_ID,
    API_KEY: BSC_API_KEY,
    NATIVE_TOKEN_NAME: "BNB",
    NATIVE_TOKEN_SYMBOL: "BNB",
    NATIVE_TOKEN_COINGECKO_ID: "binancecoin",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/56.json",
    OX_API: BINANCE_OX_API,
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://bscscan.com/tx",
    GET_GAS_PRICE:
      "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=6MH6338G1KQ1GWS423AICCF3G3DP6EFF1Z",
    LOGO: bnbLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "0x38",
    CHAIN_ID: SupportedChainId.BINANCE_SMART_CHAIN,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: BSC_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.BSC_TESTNET]: {
    NAME: "Binance Smart Chain",
    API: "https://api-testnet.bscscan.com/api",
    // NODE_URL: "https://bsc-dataseed1.binance.org/",
    NODE_URL: "https://rpc.ankr.com/bsc_testnet_chapel", //`https://rpc.ankr.com/bsc_testnet_chapel/${process.env.REACT_APP_ANKR_API_KEY}`, //"https://bsc-dataseed1.binance.org/"
    SOCKET_URL:
      "wss://bsc-testnet.blastapi.io/248404e3-b804-43b8-909d-63c7c3194273", // `wss://rpc.ankr.com/bsc_testnet_chapel/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //  "wss://bsc-testnet.blastapi.io/248404e3-b804-43b8-909d-63c7c3194273",
    CHAIN_TX: {
      name: "bnb",
      networkId: 97,
      chainId: 97,
    },
    SUPPORTED_NETWORKS: [
      { value: "Binance Smart Chain", name: "Binance Smart Chain" },
    ],
    BITQUERY_NETWORK: "bsc_testnet",
    WRAPPED_ADDRESS: WBNB_ADDRESS,
    COINGECKO_ID: BINANCE_COIN_COINGECKO_ID,
    API_KEY: BSC_API_KEY,
    NATIVE_TOKEN_NAME: "BNB",
    NATIVE_TOKEN_SYMBOL: "BNB",
    NATIVE_TOKEN_COINGECKO_ID: "binancecoin",
    GET_SWAP_TOKEN_API: "",
    OX_API: BINANCE_OX_API,
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://testnet.bscscan.com/tx",
    GET_GAS_PRICE:
      "https://api-testnet.bscscan.com/api?module=proxy&action=eth_gasPrice&apikey=6MH6338G1KQ1GWS423AICCF3G3DP6EFF1Z",
    LOGO: bnbLogo,
    isTestnet: true,
    isSwap: false,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.BSC_TESTNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.FANTOM_MAINNET]: {
    NAME: "Fantom Chain",
    API: "https://api.ftmscan.com/api",
    NODE_URL: "https://rpc.ankr.com/fantom", // `https://rpc.ankr.com/fantom/${process.env.REACT_APP_ANKR_API_KEY}`, //"https://dev-wallet.sonar.studio/rpc/ftm",
    SOCKET_URL:
      "wss://fantom-mainnet.blastapi.io/3d7e4ca8-2386-4d29-97e5-4f5ba5c6437e", // `wss://rpc.ankr.com/fantom/ws/${process.env.REACT_APP_ANKR_API_KEY}`, // "wss://fantom-mainnet.blastapi.io/3d7e4ca8-2386-4d29-97e5-4f5ba5c6437e", //
    CHAIN_TX: {
      name: "ftm",
      networkId: 250,
      chainId: 250,
    },
    SUPPORTED_NETWORKS: [{ value: "fantom", name: "fantom" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    COINGECKO_ID: "fantom",
    API_KEY: "9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    NATIVE_TOKEN_NAME: "Fantom",
    NATIVE_TOKEN_SYMBOL: "FTM",
    NATIVE_TOKEN_COINGECKO_ID: "fantom",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/250.json",
    OX_API: "https://fantom.api.0x.org",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://ftmscan.com/tx",
    GET_GAS_PRICE:
      "https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    LOGO: ftmLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "0xfa",
    CHAIN_ID: SupportedChainId.FANTOM_MAINNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: FANTOM_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0x07f697424ABe762bB808c109860c04eA488ff92B",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.FANTOM_TESTNET]: {
    NAME: "Fantom Chain",
    API: "https://api-testnet.ftmscan.com/api",
    NODE_URL: "https://rpc.ankr.com/fantom_testnet/", //`https://rpc.ankr.com/fantom_testnet/${process.env.REACT_APP_ANKR_API_KEY}`,
    SOCKET_URL:
      "wss://fantom-testnet.blastapi.io/21ef96f5-9a58-4cef-92bd-93fd27186159", //`wss://rpc.ankr.com/fantom_testnet/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //  "wss://fantom-testnet.blastapi.io/21ef96f5-9a58-4cef-92bd-93fd27186159", //
    CHAIN_TX: {
      name: "ftm",
      networkId: 4002,
      chainId: 4002,
    },
    SUPPORTED_NETWORKS: [{ value: "fantom", name: "fantom" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    COINGECKO_ID: "fantom",
    API_KEY: "9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    NATIVE_TOKEN_NAME: "Fantom",
    NATIVE_TOKEN_SYMBOL: "FTM",
    NATIVE_TOKEN_COINGECKO_ID: "fantom",
    GET_SWAP_TOKEN_API: "",
    OX_API: "https://fantom.api.0x.org",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://testnet.ftmscan.com/tx",
    GET_GAS_PRICE:
      "https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    LOGO: ftmLogo,
    isTestnet: true,
    HEX_CHAIN_ADDRESS: "",
    isSwap: false,
    chain: NETWORKS.EVM,
    CHAIN_ID: SupportedChainId.FANTOM_TESTNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "0x8B14C79f24986B127EC7208cE4e93E8e45125F8f",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.AVALANCHE_MAINNET]: {
    NAME: "Avalanche Chain",
    API: "https://api.snowtrace.io/api",
    NODE_URL: "https://rpc.ankr.com/avalanche", //`https://rpc.ankr.com/avalanche/${process.env.REACT_APP_ANKR_API_KEY}`,
    SOCKET_URL:
      "wss://ava-mainnet.blastapi.io/3806c41f-e8ea-470d-8778-dff9aaa286a9/ext/bc/C/ws", //`wss://rpc.ankr.com/avalanche/ws/${process.env.REACT_APP_ANKR_API_KEY}`, //  "wss://ava-mainnet.blastapi.io/3806c41f-e8ea-470d-8778-dff9aaa286a9/ext/bc/C/ws", //
    CHAIN_TX: {
      name: "avax",
      networkId: 43114,
      chainId: 43114,
    },
    SUPPORTED_NETWORKS: [{ value: "avax", name: "avax" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    COINGECKO_ID: "avalanche-2",
    API_KEY: "4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    NATIVE_TOKEN_NAME: "Avalanche",
    NATIVE_TOKEN_SYMBOL: "AVAX",
    NATIVE_TOKEN_COINGECKO_ID: "avalanche-2",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/43114.json",
    OX_API: "https://avalanche.api.0x.org",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://snowtrace.io/tx",
    GET_GAS_PRICE:
      "https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice&apikey=4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    LOGO: avaxLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.AVALANCHE_MAINNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: AVALANCHE_EXCHANGE_PROXY_ADDRESS_0X,
    BALANCE_CHECKER: "0xD023D153a0DFa485130ECFdE2FAA7e612EF94818",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.AVALANCHE_TESTNET]: {
    NAME: "Avalanche Testnet Chain",
    API: "https://api-testnet.snowtrace.io/api",
    NODE_URL: "https://rpc.ankr.com/avalanche_fuji", //`https://rpc.ankr.com/avalanche_fuji/${process.env.REACT_APP_ANKR_API_KEY}`,
    SOCKET_URL:
      "wss://ava-testnet.blastapi.io/e92f61b7-d343-49bc-b66d-b2313aa175ba/ext/bc/C/ws", //`wss://rpc.ankr.com/avalanche_fuji/ws/${process.env.REACT_APP_ANKR_API_KEY}`, // "wss://ava-testnet.blastapi.io/e92f61b7-d343-49bc-b66d-b2313aa175ba/ext/bc/C/ws", //
    CHAIN_TX: {
      name: "avax",
      networkId: 43113,
      chainId: 43113,
    },
    SUPPORTED_NETWORKS: [{ value: "avax", name: "avax" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    COINGECKO_ID: "avalanche-2",
    API_KEY: "4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    NATIVE_TOKEN_NAME: "Avalanche",
    NATIVE_TOKEN_SYMBOL: "AVAX",
    NATIVE_TOKEN_COINGECKO_ID: "avalanche-2",
    GET_SWAP_TOKEN_API: "",
    OX_API: "https://avalanche.api.0x.org",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://testnet.snowtrace.io/tx",
    GET_GAS_PRICE:
      "https://api-testnet.snowtrace.io/api?module=proxy&action=eth_gasPrice&apikey=4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    LOGO: avaxLogo,
    isTestnet: true,
    isSwap: false,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.AVALANCHE_TESTNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "0x100665685d533F65bdD0BD1d65ca6387FC4F4FDB",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.CRONOS_MAINNET]: {
    NAME: "Cronos Chain",
    API: "https://api.cronoscan.com/api",
    NODE_URL: "https://cronos-evm.publicnode.com",

    SOCKET_URL:
      "wss://ws-nd-607-255-942.p2pify.com/9de389b88edc1d4a7d95d460d6677efd",
    CHAIN_TX: {
      name: "cro",
      networkId: 25,
      chainId: 25,
    },
    SUPPORTED_NETWORKS: [{ value: "CRONOS", name: "CRONOS" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
    COINGECKO_ID: "crypto-com-chain",
    API_KEY: "CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    NATIVE_TOKEN_NAME: "CRONOS",
    NATIVE_TOKEN_SYMBOL: "CRO",
    NATIVE_TOKEN_COINGECKO_ID: "crypto-com-chain",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://cronoscan.com/tx",
    GET_GAS_PRICE:
      "https://api.cronoscan.com/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    LOGO: croLogo,
    isTestnet: false,
    isSwap: false,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.CRONOS_MAINNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "0x8B14C79f24986B127EC7208cE4e93E8e45125F8f",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.CRONOS_TESTNET]: {
    NAME: "Cronos Chain",
    API: "https://api-testnet.cronoscan.com/api",
    NODE_URL: "https://evm-t3.cronos.org",
    SOCKET_URL: "",
    CHAIN_TX: {
      name: "tcro",
      networkId: 338,
      chainId: 338,
    },
    SUPPORTED_NETWORKS: [{ value: "CRONOS", name: "CRONOS" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
    COINGECKO_ID: "crypto-com-chain",
    API_KEY: "CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    NATIVE_TOKEN_NAME: "CRONOS",
    NATIVE_TOKEN_SYMBOL: "CRO",
    NATIVE_TOKEN_COINGECKO_ID: "crypto-com-chain",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://testnet.cronoscan.com/tx",
    GET_GAS_PRICE:
      "https://api.cronoscan.com/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    LOGO: croLogo,
    isTestnet: true,
    isSwap: false,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.CRONOS_TESTNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "0x8B14C79f24986B127EC7208cE4e93E8e45125F8f",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.AURORA_MAINNET]: {
    NAME: "Aurora Chain",
    API: "https://explorer.mainnet.aurora.dev/api",
    NODE_URL: "https://mainnet.aurora.dev",
    SOCKET_URL: "wss://mainnet.aurora.dev",
    CHAIN_TX: {
      name: "eth",
      networkId: 1313161554,
      chainId: 1313161554,
    },
    SUPPORTED_NETWORKS: [{ value: "AURORA", name: "AURORA" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "",
    COINGECKO_ID: "aurora",
    API_KEY: "8I7G791V4ITU4NJ3JNDZWU74AEBI7JAASB",
    NATIVE_TOKEN_NAME: "Ethereum",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.mainnet.aurora.dev/tx",
    GET_GAS_PRICE:
      "https://api.owlracle.info/v3/aurora/gas?apikey=0d14eeedfc8e4f629143bf12ae777b0e&blocks=200&percentile=0.3&feeinusd=true&eip1559=true&reportwei=false",
    LOGO: ethLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.EVM,
    HEX_CHAIN_ADDRESS: "",
    CHAIN_ID: SupportedChainId.AURORA_MAINNET,
    NATIVE_TOKEN_ADDRESS,
    DECIMALS: 18,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "0x100665685d533F65bdD0BD1d65ca6387FC4F4FDB",
    SECONDARY_RPC: "",
  },
  // [SupportedChainId.AURORA_TESTNET]: {
  //   NAME: "AURORA TESTNET",
  //   API: "https://api-testnet.aurorascan.dev/api",
  //   NODE_URL: "https://testnet.aurora.dev",
  //   SOCKET_URL: "",
  //   CHAIN_TX: {
  //     name: "eth",
  //     networkId: 1313161555,
  //     chainId: 1313161555,
  //   },
  //   SUPPORTED_NETWORKS: [{ value: "AURORA", name: "AURORA" }],
  //   BITQUERY_NETWORK: "",
  //   WRAPPED_ADDRESS: "",
  //   COINGECKO_ID: "aurora",
  //   API_KEY: "8I7G791V4ITU4NJ3JNDZWU74AEBI7JAASB",
  //   NATIVE_TOKEN_NAME: "Ethereum",
  //   NATIVE_TOKEN_SYMBOL: "ETH",
  //   NATIVE_TOKEN_COINGECKO_ID: "ethereum",
  //   GET_SWAP_TOKEN_API: "",
  //   OX_API: "",
  //   ROUTER: "",
  //   SCAN_LINK: "https://testnet.aurorascan.dev/tx",
  //   GET_GAS_PRICE:
  //     "https://api.aurorascan.dev/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
  //   LOGO: auroraLogo,
  //   isTestnet: true,
  //   isSwap: false,
  //   chain: NETWORKS.EVM,
  //   HEX_CHAIN_ADDRESS: "",
  //   CHAIN_ID: SupportedChainId.AURORA_TESTNET,
  //   BALANCE_CHECKER: "0x60d2714e1a9Fd5e9580A66f6aF6b259C77A87b09",
  // },
  // [SupportedChainId.NEAR_TESTNET]: {
  //   NAME: "Near",
  //   API: NEAR_TESTNET_BASE_URL,
  //   NODE_URL: "https://rpc.testnet.near.org",
  //   SOCKET_URL: "",
  //   CHAIN_TX: Chain.Mainnet,
  //   SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
  //   BITQUERY_NETWORK: "",
  //   WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
  //   COINGECKO_ID: "near",
  //   API_KEY: "",
  //   NATIVE_TOKEN_NAME: NEAR,
  //   NATIVE_TOKEN_SYMBOL: NEAR,
  //   NATIVE_TOKEN_COINGECKO_ID: "near",
  //   GET_SWAP_TOKEN_API: "https://api.0x.org/swap/v1/tokens",
  //   OX_API: "",
  //   ROUTER: "",
  //   SCAN_LINK: "https://explorer.testnet.near.org/transactions",
  //   LOGO: nearLogo,
  //   isTestnet: true,
  //   isSwap: false,
  //   chain: NETWORKS.NEAR_TESTNET,
  //   HEX_CHAIN_ADDRESS: "",
  //   GET_GAS_PRICE: "",
  //   CHAIN_ID: SupportedChainId.NEAR_TESTNET,
  //   BALANCE_CHECKER:""
  // },
  [SupportedChainId.NEAR]: {
    NAME: "Near Chain",
    API: NEAR_BASE_URL,
    NODE_URL: "https://rpc.mainnet.near.org", //"https://rpc.ankr.com/near", //`https://rpc.ankr.com/near/${process.env.REACT_APP_ANKR_API_KEY}`,
    SOCKET_URL: "",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "near",
    API_KEY: "",
    NATIVE_TOKEN_NAME: NEAR,
    NATIVE_TOKEN_SYMBOL: NEAR,
    NATIVE_TOKEN_COINGECKO_ID: "near",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.near.org/transactions",
    LOGO: nearLogo,
    isTestnet: false,
    isSwap: true,
    chain: NETWORKS.NEAR,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
    CHAIN_ID: SupportedChainId.NEAR,
    NATIVE_TOKEN_ADDRESS: "near",
    DECIMALS: 24,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "",
    SECONDARY_RPC: "",
  },
  [SupportedChainId.SOLANA_DEVNET]: {
    NAME: "Solana Chain Devnet",
    API: `https://rpc.ankr.com/solana_devnet/${process.env.REACT_APP_ANKR_API_KEY}`,
    // NODE_URL: `https://rpc.ankr.com/solana_devnet/${process.env.REACT_APP_ANKR_API_KEY}`,  // ankr rpc
    // SOCKET_URL: `wss://rpc.ankr.com/solana_devnet/ws/${process.env.REACT_APP_ANKR_API_KEY}`, // ankr socket rpc
    NODE_URL:
      "https://solana-devnet.g.alchemy.com/v2/m7KKwrjR3gEYZjxhHNkVx1wPUjVgINj", // alchemy rpc
    SOCKET_URL:
      "wss://solana-devnet.g.alchemy.com/v2/m7KKwrjR3gEYZjxhHNkVx1wPUjVgINj_", // alchemy socket rpc
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "solana",
    API_KEY: "",
    NATIVE_TOKEN_NAME: "Solana",
    NATIVE_TOKEN_SYMBOL: "SOL",
    NATIVE_TOKEN_COINGECKO_ID: "solana",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.solana.com/tx/",
    LOGO: solLogo,
    isTestnet: true,
    isSwap: false,
    chain: NETWORKS.SOLANA,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
    CHAIN_ID: SupportedChainId.SOLANA_DEVNET,
    NATIVE_TOKEN_ADDRESS: "So11111111111111111111111111111111111111112",
    DECIMALS: 9,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "",
    SECONDARY_RPC:
      "https://solana-devnet.g.alchemy.com/v2/m7KKwrjR3gEYZjxhHNkVx1wPUjVgINj",
  },
  [SupportedChainId.SOLANA_MAINNET]: {
    NAME: "Solana Chain",
    API: "https://public-api.solscan.io",
    NODE_URL:
      "https://delicate-clean-owl.solana-mainnet.discover.quiknode.pro/1714f8de26e79e6c4dc95671b8d8ff6051e6ba7e/", //`https://rpc.ankr.com/solana/${process.env.REACT_APP_ANKR_API_KEY}`, // ankr rpc
    SOCKET_URL:
      "wss://solana-mainnet.g.alchemy.com/v2/g_-3dSAgOQR5lsllu46AIM8-i40K3qRb", //`wss://rpc.ankr.com/solana/ws/${process.env.REACT_APP_ANKR_API_KEY}`,
    // "wss://delicate-clean-owl.solana-mainnet.discover.quiknode.pro/1714f8de26e79e6c4dc95671b8d8ff6051e6ba7e/", //`wss://rpc.ankr.com/solana/ws/${process.env.REACT_APP_ANKR_API_KEY}`, // ankr socket rpc
    // NODE_URL:
    //   "https://solana-mainnet.g.alchemy.com/v2/pYf2QG8csaK1QER0Wa3fps2j9WmyBC-w", // alchemy rpc
    // SOCKET_URL:
    //   "wss://solana-mainnet.g.alchemy.com/v2/pYf2QG8csaK1QER0Wa3fps2j9WmyBC-w", //alchemy socket rpc
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "solana",
    API_KEY: "",
    NATIVE_TOKEN_NAME: "Solana",
    NATIVE_TOKEN_SYMBOL: "SOL",
    NATIVE_TOKEN_COINGECKO_ID: "solana",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.solana.com/tx/",
    LOGO: solLogo,
    isTestnet: false,
    isSwap: false,
    chain: NETWORKS.SOLANA,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
    CHAIN_ID: SupportedChainId.SOLANA_MAINNET,
    NATIVE_TOKEN_ADDRESS: "So11111111111111111111111111111111111111112",
    DECIMALS: 9,
    EXCHANGE_PROXY_ADDRESS_0X: "",
    BALANCE_CHECKER: "",
    SECONDARY_RPC:
      "https://solana-mainnet.g.alchemy.com/v2/g_-3dSAgOQR5lsllu46AIM8-i40K3qRb", // "https://fittest-proud-layer.solana-mainnet.discover.quiknode.pro/98276c65be35af6e01938f3ce538184bcf7023bd/", //"https://delicate-clean-owl.solana-mainnet.discover.quiknode.pro/1714f8de26e79e6c4dc95671b8d8ff6051e6ba7e/",// `https://rpc.ankr.com/solana/${process.env.REACT_APP_ANKR_API_KEY}`, ////https://fittest-proud-layer.solana-mainnet.discover.quiknode.pro/98276c65be35af6e01938f3ce538184bcf7023bd/
  },
};

export const rpcsList: RpcsList = {
  [SupportedChainId.ETHEREUM_MAINNET]: {
    rpcUrl: ["https://rpc.ankr.com/eth"],
    socketRpcUrl: [
      "wss://eth-mainnet.blastapi.io/0ec2df36-2b3a-4686-bae2-6372a48fee82",
    ],
  },

  [SupportedChainId.ETHEREUM_GOERLI]: {
    rpcUrl: ["https://rpc.ankr.com/eth_goerli"],
    socketRpcUrl: [
      "wss://eth-goerli.blastapi.io/94f1ff5e-2691-4264-ac10-6a8252a22baa",
    ],
  },
  [SupportedChainId.POLYGON_MAINNET]: {
    rpcUrl: ["https://rpc.ankr.com/polygon"],
    socketRpcUrl: [
      "wss://polygon-mainnet.blastapi.io/566f5dab-20f2-4ce9-9225-374a70da3722",
    ],
  },

  [SupportedChainId.POLYGON_TESTNET]: {
    rpcUrl: ["https://rpc.ankr.com/polygon_mumbai"],
    socketRpcUrl: [
      "wss://polygon-testnet.blastapi.io/dbc467db-0b70-42cd-a1c9-151c066dc45c",
    ],
  },
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    rpcUrl: ["https://rpc.ankr.com/bsc/"],
    socketRpcUrl: [
      "wss://bsc-mainnet.blastapi.io/01f541c5-85b4-429d-b548-0f6db7dac0f0",
    ],
  },
  [SupportedChainId.BSC_TESTNET]: {
    rpcUrl: ["https://rpc.ankr.com/bsc_testnet_chapel"],
    socketRpcUrl: [
      "wss://bsc-testnet.blastapi.io/248404e3-b804-43b8-909d-63c7c3194273",
    ],
  },

  [SupportedChainId.FANTOM_MAINNET]: {
    rpcUrl: ["https://rpc.ankr.com/fantom"],
    socketRpcUrl: [
      "wss://fantom-mainnet.blastapi.io/3d7e4ca8-2386-4d29-97e5-4f5ba5c6437e",
    ],
  },
  [SupportedChainId.FANTOM_TESTNET]: {
    rpcUrl: ["https://rpc.ankr.com/fantom_testnet/"],
    socketRpcUrl: [
      "wss://fantom-testnet.blastapi.io/21ef96f5-9a58-4cef-92bd-93fd27186159",
    ],
  },
  [SupportedChainId.AVALANCHE_MAINNET]: {
    rpcUrl: ["https://rpc.ankr.com/avalanche"],
    socketRpcUrl: [
      "wss://ava-mainnet.blastapi.io/3806c41f-e8ea-470d-8778-dff9aaa286a9/ext/bc/C/ws",
    ],
  },
  [SupportedChainId.AVALANCHE_TESTNET]: {
    rpcUrl: ["https://rpc.ankr.com/avalanche_fuji"],
    socketRpcUrl: [
      "wss://ava-testnet.blastapi.io/e92f61b7-d343-49bc-b66d-b2313aa175ba/ext/bc/C/ws",
    ],
  },
};

export const MAINNET_CHAINS = {
  [SupportedChainId.ETHEREUM_MAINNET]:
    NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET],
  [SupportedChainId.POLYGON_MAINNET]:
    NETWORKCHAIN[SupportedChainId.POLYGON_MAINNET],
  [SupportedChainId.BINANCE_SMART_CHAIN]:
    NETWORKCHAIN[SupportedChainId.BINANCE_SMART_CHAIN],
  [SupportedChainId.FANTOM_MAINNET]:
    NETWORKCHAIN[SupportedChainId.FANTOM_MAINNET],
  [SupportedChainId.AURORA_MAINNET]:
    NETWORKCHAIN[SupportedChainId.AURORA_MAINNET],
  [SupportedChainId.AVALANCHE_MAINNET]:
    NETWORKCHAIN[SupportedChainId.AVALANCHE_MAINNET],
  [SupportedChainId.CRONOS_MAINNET]:
    NETWORKCHAIN[SupportedChainId.CRONOS_MAINNET],
  [SupportedChainId.SOLANA_MAINNET]:
    NETWORKCHAIN[SupportedChainId.SOLANA_MAINNET],
  [SupportedChainId.NEAR]: NETWORKCHAIN[SupportedChainId.NEAR],
};

export const TESTNET_CHAINS = {
  // [SupportedChainId.ETHEREUM_RINKEBY]:
  //   NETWORKCHAIN[SupportedChainId.ETHEREUM_RINKEBY],
  // [SupportedChainId.ETHEREUM_ROPSTEN]:
  //   NETWORKCHAIN[SupportedChainId.ETHEREUM_ROPSTEN],
  [SupportedChainId.ETHEREUM_GOERLI]:
    NETWORKCHAIN[SupportedChainId.ETHEREUM_GOERLI],

  [SupportedChainId.POLYGON_TESTNET]:
    NETWORKCHAIN[SupportedChainId.POLYGON_TESTNET],
  [SupportedChainId.BSC_TESTNET]: NETWORKCHAIN[SupportedChainId.BSC_TESTNET],
  [SupportedChainId.FANTOM_TESTNET]:
    NETWORKCHAIN[SupportedChainId.FANTOM_TESTNET],
  // [SupportedChainId.AURORA_TESTNET]:
  //   NETWORKCHAIN[SupportedChainId.AURORA_TESTNET],
  [SupportedChainId.AVALANCHE_TESTNET]:
    NETWORKCHAIN[SupportedChainId.AVALANCHE_TESTNET],
  [SupportedChainId.CRONOS_TESTNET]:
    NETWORKCHAIN[SupportedChainId.CRONOS_TESTNET],
  [SupportedChainId.SOLANA_DEVNET]:
    NETWORKCHAIN[SupportedChainId.SOLANA_DEVNET],
  // [SupportedChainId.NEAR_TESTNET]: NETWORKCHAIN[SupportedChainId.NEAR_TESTNET],
};

export const NETWORK_LOGOS = {
  [NETWORKS.EVM]: ethLogo,
  [NETWORKS.SOLANA]: solLogo,
  [NETWORKS.NEAR]: nearLogo,
  // [NETWORKS.NEAR_TESTNET]: nearLogo,
};

export const CHAIN_CATEGORIES = {
  [NETWORKS.EVM]: {
    LOGO: ethLogo,
    NAME: "EVM Compatible",
    ADDRESS: "",
    chain: NETWORKS.EVM,
  },
  [NETWORKS.SOLANA]: {
    LOGO: solLogo,
    NAME: NETWORKS.SOLANA,
    ADDRESS: "",
    chain: NETWORKS.SOLANA,
  },
  [NETWORKS.NEAR]: {
    LOGO: nearLogo,
    NAME: NETWORKS.NEAR,
    ADDRESS: "",
    chain: NETWORKS.NEAR,
  },
  // [NETWORKS.NEAR_TESTNET]: {
  //   LOGO: nearLogo,
  //   NAME: NETWORKS.NEAR_TESTNET,
  //   ADDRESS: "",
  //   chain: NETWORKS.NEAR,
  // },
};

export enum TX_TYPES {
  Received = "Received",
  Sent = "Sent",
  Swap = "Swap",
}

//- will tell us about in which state the transaction is
export enum ACTIVITY_STATUS_TYPES {
  pending = "Pending", //->> currently showing to user
  success = "Success", //->> Transaction succesfull
  cancel = "Cancel", //->> Canceled transaction sucessfull
  speedup = "Speedup", //->> method of speedup
  failed = "Failed", //->> transaction that become failed
  inProgress = "inprogress", //->> previous hash who responses not yet received, for tracking
  invalid = "invalid", //->> indicating those transactions whose hashes become valid
}

export enum Tx_METHODS {
  normal = "normal",
  cancel = "cancel",
}

export const TxHistoryTitle: {
  [TxType in TX_TYPES]: {
    icon: IconDefinition;
    title: string;
    subtitle: string;
  };
} = {
  [TX_TYPES.Received]: {
    icon: faArrowDownRight,
    title: "Received",
    subtitle: "in",
  },
  [TX_TYPES.Sent]: {
    icon: faArrowUpRight,
    title: "Sent",
    subtitle: "to",
  },
  [TX_TYPES.Swap]: {
    icon: faArrowsRepeat,
    title: "Swap",
    subtitle: "",
  },
};

/**
 * list of all the ankr supported chain Ids that sonar wallet supports
 */
export enum AnkerChainIds {
  bsc = SupportedChainId.BINANCE_SMART_CHAIN,
  eth = SupportedChainId.ETHEREUM_MAINNET,
  fantom = SupportedChainId.FANTOM_MAINNET,
  avalanche = SupportedChainId.AVALANCHE_MAINNET,
  polygon = SupportedChainId.POLYGON_MAINNET,
}

export const AnkerChainNames = {
  bsc: "bsc",
  eth: "eth",
  fantom: "fantom",
  avalanche: "avalanche",
  polygon: "polygon",
};

/**
 * list of all the dapp events that sonar wallet listens
 */
export const DAPPEVENTS = {
  sendTransaction: "eth_sendTransaction",
  requestAccounts: "eth_requestAccounts",
  signMessage: "personal_sign",
  switchNetwork: "wallet_switchEthereumChain",
  approval: "eth_signTypedData_v4",
  estimateGas: "eth_estimateGas",
};

export const GAS_UNITS = {
  [NETWORKS.EVM]: 1000000000,
  [NETWORKS.NEAR]: Number(FT_TRANSFER_GAS) || 30000000000000,
  [NETWORKS.SOLANA]: 1000000000,
};

export const AVG_GAS_FEE = {
  [SupportedChainId.SOLANA_MAINNET]: 0.000005,
  [SupportedChainId.SOLANA_DEVNET]: 0.000005,
  [SupportedChainId.NEAR]: 0.0001,
};

export const NON_NATIVE_DEFAULT: INON_NATIVE_DEFAULT = [
  {
    name: "PING",
    symbol: "PING",
    image: pingLogo,
    decimals: 9,
    isActive: true,
    chainFamily: "EVM",
    chainId: 56,
    address: "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
    coingeckoId: "sonar",
  },

  {
    name: "ePING",
    symbol: "ePING",
    image: ePingLogo,
    decimals: 9,
    isActive: true,
    chainFamily: "EVM",
    chainId: 1,
    address: "0xC7B89491Bb148551547837ea6ccB4Bb5144d8E47",
    coingeckoId: "",
  },
  {
    name: "Tether",
    symbol: "USDT",
    image:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    decimals: 6,
    isActive: true,
    chainFamily: "EVM",
    chainId: 1,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    coingeckoId: "tether",
  },
  {
    name: "Binance USD",
    symbol: "BUSD",
    image:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
    decimals: 18,
    isActive: true,
    chainFamily: "EVM",
    chainId: 56,
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    coingeckoId: "binance-usd",
  },
  {
    chainId: SupportedChainId.ETHEREUM_MAINNET,
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    image:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    coingeckoId: "usd-coin",
    isActive: true,
    chainFamily: "EVM",
  },
];

export enum GRAPH_PERIODS {
  monthly = 30,
  weekly = 7,
  daily = 1,
}

export enum TX_DATA_METHOD_IDs {
  approve = "0x095ea7b3",
  transfer = "0xa9059cbb",
  multicall = "0x5ae401dc",
  exactInputSingle = "0x04e45aaf",
}

export const SONAR_STUDIO_SUPPORTED_CHAIN_IDS = {
  1: "ethereum",
  56: "bsc",
};

export const LOGIN_PERIODS: {
  [period: string]: { name: string; time: number };
} = {
  "60000": {
    name: "1 minute",
    time: 60000,
  },
  "900000": {
    name: "15 minutes",
    time: 900000,
  },
  "1800000": {
    name: "30 minutes",
    time: 1800000,
  },
  "3600000": {
    name: "60 minutes",
    time: 3600000,
  },
};

export const GAS_PRIORITY_FEE: {
  [chainId: number]: {
    slow: number;
    medium: number;
    fast: number;
  };
} = {
  [SupportedChainId.ETHEREUM_MAINNET]: {
    slow: 0,
    medium: 5,
    fast: 10,
  },
  [SupportedChainId.POLYGON_MAINNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    slow: 0,
    medium: 4,
    fast: 8,
  },
  [SupportedChainId.FANTOM_MAINNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.AURORA_MAINNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.AVALANCHE_MAINNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.CRONOS_MAINNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.ETHEREUM_GOERLI]: {
    slow: 0,
    medium: 5,
    fast: 10,
  },
  [SupportedChainId.POLYGON_TESTNET]: {
    slow: 0,
    medium: 6,
    fast: 10,
  },
  [SupportedChainId.BSC_TESTNET]: {
    slow: 2,
    medium: 4,
    fast: 8,
  },
  [SupportedChainId.FANTOM_TESTNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.AVALANCHE_TESTNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
  [SupportedChainId.CRONOS_TESTNET]: {
    slow: 0,
    medium: 3,
    fast: 8,
  },
};

export const AMOUNT_MAX_PERCENT = 1; //0.98;
export const AMOUNT_50_PERCENT = 0.5;
export const AMOUNT_25_PERCENT = 0.25;
