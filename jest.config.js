/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["<rootDir>/setup-test.ts"],
  // setupFilesAfterEnv: ["./src/hooks/__test__/mochaTest.test.tsx"],
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "jsdom",

  // collectCoverage: true,
  // collectCoverageFrom: ["<rootDir>/src/hooks/*.ts","<rootDir>/src/utils/*.ts","!<rootDir>/src/utils/utils.storage.ts","!<rootDir>/src/utils/utils.holdingsNEAR.ts","!<rootDir>/src/utils/utils.holdingsEVM.ts","!<rootDir>/src/utils/utils.holdingsSOLANA.ts","!<rootDir>/src/utils/chains.ts","!<rootDir>/src/utils/common.ts","!<rootDir>/src/utils/constants.ts","!<rootDir>/src/utils/utils.web3.ts"  ],
  modulePathIgnorePatterns: ["<rootDir>/dist/utils/utils.holdingsEVM.ts","<rootDir>/dist/utils/utils.holdingsNEAR.ts","<rootDir>/dist/utils/utils.holdingsSOLANA.ts"],
  testPathIgnorePatterns: ["<rootDir>/dist/utils/utils.holdingsEVM.ts","<rootDir>/dist/utils/utils.holdingsNEAR.ts","<rootDir>/dist/utils/utils.holdingsSOLANA.ts"],
  // testEnvironment:"jsdom",

  // transformIgnorePatterns:[
  //   // "<rootDir>/node_modules/(?!@solana/web3.js)",
  //   // "<rootDir>/node_modules/(?!rpc-websockets/)"
  // // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
  // '`<rootDir>/node_modules/'
  // ],
  transformIgnorePatterns: ["!node_modules/"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // moduleDirectories: ["node_modules", "src"],
  modulePaths: ["<rootdir>/src"],

  moduleNameMapper: {
    "^uuid$": require.resolve("uuid"),
    "^axios$": require.resolve("axios"),
    "^@wojtekmaj/enzyme-adapter-react-17$": require.resolve(
      "@wojtekmaj/enzyme-adapter-react-17"
    ),
    // "setupFiles" : "<rootDir>/setup-test.ts",
    // ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$": "identity-obj-proxy",
    "^abis/(.*)$": "<rootDir>/src/abis/$1",

    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/mocks/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/mocks/styleMock.ts",

    // ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$":
    // "jest-transform-stub",

    "^assets/(.*)$": "<rootDir>/src/assets/$1",
    "^api(.*)$": "<rootDir>/src/api.ts",
    "^assets/images$": "<rootDir>/src/assets/images/index.ts",
    "^components$": "<rootDir>/src/components/index.ts",
    "^hoc/(.*)$": "<rootDir>/src/hoc/$1",
    "^hooks$": "<rootDir>/src/hooks/index.ts",
    "^popup/(.*)$": "<rootDir>/src/popup/$1",
    "^routes/(.*)$": "<rootDir>/src/routes/$1",
    "^store/(.*)$": "<rootDir>/src/store/$1",
    "^scripts/(.*)$": "<rootDir>/src/scri$1pts/$1",
    "^theme/(.*)$": "<rootDir>/src/theme/$1",
    // '^utils/':"<rootDir>/src/utils/indext.tsx",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^utils$": "<rootDir>/src/utils/index.ts",
    "^interfaces$": "<rootDir>/src/interfaces/index.ts",
    "^mock":"<rootDir>/src/mock/index.ts",
    "^utils/constants": "<rootDir>/src/utils/constants.ts",
    "^utils/formatters": "<rootDir>/src/utils/formatters.ts",
    "^utils/utils.api": "<rootDir>/src/utils/utils.api.ts",
    "^utils/utils.holdings": "<rootDir>/src/utils/utils.holdings.ts",
    "^utils/utils.prices": "<rootDir>/src/utils/utils.prices.ts",
    "^utils/utils.wallets": "<rootDir>/src/utils/utils.wallets.ts",
    "^utils/utils.seedPhrase": "<rootDir>/src/utils/utils.seedPhrase.ts",
    "^utils/validateAddresses": "<rootDir>/src/utils/validateAddresses.ts",
    "^utils/utils.gas": "<rootDir>/src/utils/utils.gas.ts",
    "^utils/utils.notifications": "<rootDir>/src/utils/utils.notifications.ts",
    "^utils/utils.storage": "<rootDir>/src/utils/utils.storage.ts",
    "^@styled$": "<rootDir>/src/components/styled/index.tsx",

    "^api/(.*)$": "<rootDir>/src/api.ts$1",
    "^classes$": "<rootDir>/src/classes/index.ts",
    "classes/cachedService" :"<rootDir>/src/classes/cachedService.ts",
    "^interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^redux-hook$": "<rootDir>/src/redux-hook.ts",
    "^@slices/(.*)$": "<rootDir>/src/store/slices/$1",
    "^background-related/(.*)$": "<rootDir>/src/background-related/$1",
    "^window-provider/(.*)$": "<rootDir>/src/window-provider/$1",
    "^provider-bridge-shared/(.*)$": "<rootDir>/src/provider-bridge-shared/",
    "^__test-utils__/(.*)$": "<rootDir>/src/__test-utils__/$1",
  },
};
