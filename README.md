# Sonar Wallet

Sonar wallet is a multichain wallet that supports NEAR, SOLANA and EVM (Ethereum, BSC & many more) chains, built as browser extension.

![Screenshot from 2023-01-27 16-27-14](https://user-images.githubusercontent.com/42214791/221540623-d179be2a-1b4f-4a96-913f-85216fd7c2fb.png)

## Quickstart

Try this.

```sh
$ npm install -g yarn # if you don't have yarn globally installed
$ yarn install # install all dependencies; rerun with --ignore-scripts if
               # scrypt node-gyp failures prevent the install from completing
$ yarn start # start a continuous webpack build that will auto-update with changes
```

Once the server is running, you can visit the extension in your browser: `localhost:3000`

## How to make a build?

First make sure, these lines must be commented in the index.tsx file and store.ts in order to make a build.
While in case you want to run it locally as an webView, undo these changes and simply run the **Quickstart** section commands

**FilePath index.tsx**

```
$ src/index.tsx
```
File should look like this

![Screenshot from 2023-04-15 13-49-25](https://user-images.githubusercontent.com/63909388/232202377-ac1bdf4f-c2c0-4b00-b2cd-bd76092965f5.png)

**FilePath store.ts**

```
$ src/store/store.ts
```
File should look like this

![image](https://user-images.githubusercontent.com/63909388/232202495-4d5fa8e2-3aa9-47f8-beb7-795f52b5efbf.png)

### Now you can run the command

```sh
$ npm install -g yarn # if you don't have yarn globally installed
$ yarn install # install all dependencies; rerun with --ignore-scripts if
               # scrypt node-gyp failures prevent the install from completing
$ yarn build   # start making a build and build will be ready in 2-5 minutes.
```


## Unit Testing

Unit testing includes hooks and utils folder in the code.

If you want to run the test cases on all the **test-files**, simply run 

```
$ yarn test 
```
If you want to run the test cases on all the **utils files**, simply run 

```
$ yarn test:utils
```
If you want to run the test cases on all the **hooks files**, simply run 

```
$ yarn test:hooks
```

If you want to see an individual file, you can download the extension 
**_Jest Runner_**

**NOTE** Utils.storage file has less coverage as its don't run in the development version.

## Updating RPCs

In order to update the rpcs, it can be changed from the constant file, it's file path is given below

```
$ src/utils/constants.ts
```

# Configuration File

```
$ webpack.config.js
```
A file of custom configuration to react webpack.
All the custom configurations are mentioned this file for the bundle of code.

# ESLint Results

In order generate an es-lint report, run the following command

```
npx eslint -f node_modules/eslint-html-reporter/reporter.js "src/**/*.{ts,tsx}" > report.html
```
your outfile path is, in the root folder of the project, just run that file in the browser

```
$  projectDirectory/report.html
```

## SonarQube

In order to run SonarQube, add these settings in to SonarQube for the report generation.

```
src/hooks/__test__/**
src/utils/__test__/**
src/mock/**
src/store/slices/newWalletSlice/newWalletSliceTemp.ts
src/store/slices/appSlice/appSlice.ts
```
![image (1)](https://user-images.githubusercontent.com/63909388/229767495-9a1aa0c6-de16-4122-adb0-f2f5b6552c68.png)


## File Structure

```sh
.
├── babel.config.js
├── contracts
│   └── Lock.sol
├── coverage
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov.info
│   └── lcov-report
│       ├── base.css
│       ├── block-navigation.js
│       ├── favicon.png
│       ├── index.html
│       ├── prettify.css
│       ├── prettify.js
│       ├── sort-arrow-sprite.png
│       ├── sorter.js
│       ├── utils.api.ts.html
│       ├── utils.holdings.ts.html
│       ├── utils.notifications.ts.html
│       ├── utils.prices.ts.html
│       ├── utils.storage.ts.html
│       └── utils.wallets.ts.html
├── dist
├── firebase.json
├── hardhat.config.ts
├── jest.config.js
├── mocks
│   ├── fileMock.ts
│   └── styleMock.ts
├── package.json
├── package-lock.json
├── public
│   ├── 16.ico
│   ├── 404.html
│   ├── 48.ico
│   ├── index.html
│   └── manifest.json
├── README.md
├── remoteconfig.template.json
├── scripts
│   └── deploy.ts
├── setup-test.ts
├── sonar-project.properties
├── src
│   ├── abis
│   │   ├── bep20abi.json
│   │   ├── erc20abi.json
│   │   ├── erc721abi.json
│   │   ├── pancakeswapV2.json
│   │   ├── reflectabi.json
│   │   ├── SwapRouter02.json
│   │   └── UniswapV2Router02.json
│   ├── api.ts
│   ├── App.tsx
│   ├── assets
│   │   ├── fonts
│   │   │   └── PPMori-Variable.woff2
│   │   ├── Icons
│   │   │   ├── AvalancheLogo.svg
│   │   │   ├── avatar.svg
│   │   │   ├── avax-logo.svg
│   │   │   ├── Backdrop-fx.svg
│   │   │   ├── Background.svg
│   │   │   ├── backIcon.svg
│   │   │   ├── BannerImageBackground.svg
│   │   │   ├── bars.png
│   │   │   ├── binanceRainbow.png
│   │   │   ├── bnb-logo.svg
│   │   │   ├── Cancel.svg
│   │   │   ├── caret-down.svg
│   │   │   ├── check-circle.svg
│   │   │   ├── Circle.svg
│   │   │   ├── colors.svg
│   │   │   ├── copy-clipboard.svg
│   │   │   ├── copy-white.svg
│   │   │   ├── dollar.svg
│   │   │   ├── dummy-token-image.svg
│   │   │   ├── Ellipse.svg
│   │   │   ├── ethereumLogo.svg
│   │   │   ├── eth-logo.svg
│   │   │   ├── gear.svg
│   │   │   ├── History.svg
│   │   │   ├── ic_clipboard.svg
│   │   │   ├── Icon.svg
│   │   │   ├── index.ts
│   │   │   ├── info-circle-round.svg
│   │   │   ├── Label.svg
│   │   │   ├── LeftArrow.svg
│   │   │   ├── Line.svg
│   │   │   ├── matic-logo.svg
│   │   │   ├── microscop.svg
│   │   │   ├── near-logo.svg
│   │   │   ├── NegeativeTrend.svg
│   │   │   ├── Notes.svg
│   │   │   ├── Person.svg
│   │   │   ├── plus.png
│   │   │   ├── plus.svg
│   │   │   ├── question-circle.svg
│   │   │   ├── RectangleReverse.svg
│   │   │   ├── Rectangle.svg
│   │   │   ├── Search.svg
│   │   │   ├── sol-logo.svg
│   │   │   ├── SpeedUp.svg
│   │   │   ├── Step-Background.svg
│   │   │   ├── three-lines.svg
│   │   │   ├── Title.svg
│   │   │   ├── UpArrow.svg
│   │   │   ├── Wallet.svg
│   │   │   └── Web3.svg
│   │   └── images
│   │       ├── aurora.png
│   │       ├── avax.png
│   │       ├── blob-blurred.png
│   │       ├── bnb.png
│   │       ├── colored-back-btn.png
│   │       ├── cro.png
│   │       ├── eping.png
│   │       ├── eth.png
│   │       ├── eth.svg
│   │       ├── fantom.png
│   │       ├── ftm.png
│   │       ├── index.ts
│   │       ├── LeftUnit.svg
│   │       ├── matic.png
│   │       ├── near.png
│   │       ├── password-backdrop.png
│   │       ├── ping.png
│   │       ├── purple-backdrop.png
│   │       ├── rainbow-2.svg
│   │       ├── Rainbow_BG_HD.png
│   │       ├── rainbowBlur.png
│   │       ├── rainbowPlane.svg
│   │       ├── sol.png
│   │       ├── sonar-wallet-logo.png
│   │       ├── three-dots.png
│   │       └── verify.svg
│   ├── background.js
│   ├── background-related
│   │   ├── accounts.ts
│   │   ├── assets.ts
│   │   ├── constants
│   │   │   ├── balances.ts
│   │   │   ├── coin-types.ts
│   │   │   ├── currencies.ts
│   │   │   ├── errors.ts
│   │   │   ├── index.ts
│   │   │   ├── network-fees.ts
│   │   │   ├── networks.ts
│   │   │   └── website.ts
│   │   ├── features.ts
│   │   ├── generate-validators.ts
│   │   ├── index.ts
│   │   ├── lib
│   │   │   ├── alchemy.ts
│   │   │   ├── approvalTarget.ts
│   │   │   ├── asset-similarity.ts
│   │   │   ├── erc20.ts
│   │   │   ├── erc721.ts
│   │   │   ├── fixed-point.ts
│   │   │   ├── gas.ts
│   │   │   ├── logger.ts
│   │   │   ├── prices.ts
│   │   │   ├── storage-gateway.ts
│   │   │   ├── token-lists.ts
│   │   │   ├── utils
│   │   │   │   ├── index.ts
│   │   │   │   └── type-guards.ts
│   │   │   ├── validate
│   │   │   │   ├── 0x-swap.ts
│   │   │   │   ├── alchemy.ts
│   │   │   │   ├── erc721.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── json-validators.d.ts
│   │   │   │   ├── json-validators.js
│   │   │   │   ├── jtd-validators.d.ts
│   │   │   │   ├── jtd-validators.js
│   │   │   │   └── prices.ts
│   │   │   └── wrappedAsset.ts
│   │   ├── main.ts
│   │   ├── networks.ts
│   │   ├── README.md
│   │   ├── services
│   │   │   ├── base.ts
│   │   │   ├── chain
│   │   │   │   ├── asset-data-helper.ts
│   │   │   │   ├── db.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── serial-fallback-provider.ts
│   │   │   │   └── utils.ts
│   │   │   ├── enrichment
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── indexing
│   │   │   │   ├── db.ts
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── internal-ethereum-provider
│   │   │   │   ├── constants.ts
│   │   │   │   ├── db.ts
│   │   │   │   └── index.ts
│   │   │   ├── keyring
│   │   │   │   ├── encryption.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── storage.ts
│   │   │   ├── name
│   │   │   │   ├── index.ts
│   │   │   │   ├── name-resolver.ts
│   │   │   │   └── resolvers
│   │   │   │       ├── address-book.ts
│   │   │   │       ├── ens.ts
│   │   │   │       ├── index.ts
│   │   │   │       ├── known-contracts.ts
│   │   │   │       ├── rns.ts
│   │   │   │       └── uns.ts
│   │   │   ├── preferences
│   │   │   │   ├── db.ts
│   │   │   │   ├── defaults.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── provider-bridge
│   │   │   │   ├── authorization.ts
│   │   │   │   ├── db.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── show-popup.ts
│   │   │   │   └── utils.ts
│   │   │   ├── README.md
│   │   │   ├── signing
│   │   │   │   └── index.ts
│   │   │   └── types.ts
│   │   ├── tally-provider.ts
│   │   ├── third-party-data
│   │   │   └── blocknative
│   │   │       ├── index.ts
│   │   │       └── types.ts
│   │   ├── types.ts
│   │   └── utils
│   │       └── signing.ts
│   ├── classes
│   │   ├── cachedService.ts
│   │   ├── calculateSums.ts
│   │   ├── holdingsConvertor.ts
│   │   ├── index.ts
│   │   └── processHolding.ts
│   ├── components
│   │   ├── AccountHoldingTile
│   │   │   └── index.tsx
│   │   ├── AccountsList
│   │   │   └── index.tsx
│   │   ├── AddCustomTokenModal
│   │   │   └── index.tsx
│   │   ├── AddressInsertionComponent
│   │   │   └── index.tsx
│   │   ├── Adornment
│   │   │   └── index.tsx
│   │   ├── AdvanceOptionModal
│   │   │   ├── CustomGweiSettings.tsx
│   │   │   ├── index.tsx
│   │   │   ├── SlippageToleranceSettings.tsx
│   │   │   └── Step1
│   │   │       ├── GasFees.tsx
│   │   │       ├── index.tsx
│   │   │       └── Slippages.tsx
│   │   ├── AlertModal
│   │   │   └── index.tsx
│   │   ├── AmountPercentageBtn
│   │   │   └── index.tsx
│   │   ├── AnyTokensSearch
│   │   │   └── index.tsx
│   │   ├── ApexChart
│   │   │   ├── index.tsx
│   │   │   └── mock.ts
│   │   ├── ApproveButton
│   │   │   └── index.tsx
│   │   ├── Background.tsx
│   │   ├── BasicModal
│   │   │   └── index.tsx
│   │   ├── BottomBasicModal
│   │   │   └── index.tsx
│   │   ├── BottomModalLayout
│   │   │   └── index.tsx
│   │   ├── ButtonBox
│   │   │   └── index.tsx
│   │   ├── ButtonWithIcon
│   │   │   └── index.tsx
│   │   ├── ChainComponent
│   │   │   └── index.tsx
│   │   ├── ChainFamilyModal
│   │   │   └── index.tsx
│   │   ├── ChartDataBar
│   │   │   ├── ChangeBox
│   │   │   │   └── index.tsx
│   │   │   ├── ChartBalance
│   │   │   │   └── index.tsx
│   │   │   └── index.tsx
│   │   ├── common
│   │   ├── CommonLayout
│   │   │   └── index.tsx
│   │   ├── Components.css
│   │   ├── CopyAndExplorerButton
│   │   │   └── CopyAndExplorerButton.tsx
│   │   ├── CreateNewWalletOrAccountModal
│   │   │   └── index.tsx
│   │   ├── CustomAmountSettingModal
│   │   │   └── index.tsx
│   │   ├── DappLayout
│   │   │   └── index.tsx
│   │   ├── DerivationPathModal
│   │   │   └── index.tsx
│   │   ├── EditAccountModal
│   │   │   └── index.tsx
│   │   ├── EditSingleEntityModal
│   │   │   └── index.tsx
│   │   ├── EmptyAddressMessage
│   │   │   └── index.tsx
│   │   ├── ExplorerSection
│   │   │   ├── index.tsx
│   │   │   ├── Nfts
│   │   │   │   └── index.tsx
│   │   │   ├── SwitchTabs
│   │   │   │   └── index.tsx
│   │   │   ├── TabPanel
│   │   │   │   └── index.tsx
│   │   │   ├── Tokens
│   │   │   │   ├── Accounts.tsx
│   │   │   │   ├── Chains.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── MyTokens.tsx
│   │   │   │   └── TokenslistWithMessage.tsx
│   │   │   └── TxHistory
│   │   │       ├── components
│   │   │       │   ├── Amount
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── ResultingBalance
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── SpeedupCancelBtn
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── Subtitle
│   │   │       │   │   ├── index.tsx
│   │   │       │   │   └── swapingSubTile.tsx
│   │   │       │   └── Title
│   │   │       │       └── index.tsx
│   │   │       ├── index.tsx
│   │   │       ├── Received
│   │   │       │   └── index.tsx
│   │   │       ├── Sending
│   │   │       │   └── index.tsx
│   │   │       ├── Sent
│   │   │       │   └── index.tsx
│   │   │       ├── Swap
│   │   │       │   └── index.tsx
│   │   │       └── Swapping
│   │   │           └── index.tsx
│   │   ├── FunctionalityNavigators
│   │   │   └── index.tsx
│   │   ├── GenericBackgroundBoxContent
│   │   │   └── index.tsx
│   │   ├── index.ts
│   │   ├── ListItem
│   │   │   └── index.tsx
│   │   ├── ListItemValueBox
│   │   │   └── index.tsx
│   │   ├── ListItemWithAddress
│   │   │   └── index.tsx
│   │   ├── LoadingScreen
│   │   │   └── index.tsx
│   │   ├── LoginExpiryPeriodsModal
│   │   │   └── index.tsx
│   │   ├── NetworkModal
│   │   │   └── index.tsx
│   │   ├── Passwords
│   │   │   ├── animator.tsx
│   │   │   ├── index.tsx
│   │   │   ├── input.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── main.tsx
│   │   │   ├── passwords.test.tsx
│   │   │   ├── Step1.tsx
│   │   │   ├── Step2.tsx
│   │   │   ├── Step3.tsx
│   │   │   └── Step4.tsx
│   │   ├── QrModal
│   │   │   └── index.tsx
│   │   ├── RainbowBox
│   │   │   ├── index.tsx
│   │   │   └── style.css
│   │   ├── RainbowButton
│   │   │   └── index.tsx
│   │   ├── RainbowHoldButton
│   │   │   └── index.tsx
│   │   ├── RainbowLine
│   │   │   └── index.tsx
│   │   ├── RainbowLoader
│   │   │   └── index.tsx
│   │   ├── RecentSearchedTokens
│   │   │   └── index.tsx
│   │   ├── RecentTabComponent
│   │   │   └── index.tsx
│   │   ├── RenderListContent
│   │   │   └── index.tsx
│   │   ├── RenderSendOrReceiveTransactionContent
│   │   │   └── RenderSendOrReceiveTransactionContent.tsx
│   │   ├── RenderSwapTransactionContent
│   │   │   └── RenderSwapTransactionContent.tsx
│   │   ├── ResetWalletModal
│   │   │   └── index.tsx
│   │   ├── RestoreAccessModal
│   │   │   └── index.tsx
│   │   ├── RevealModal
│   │   │   └── index.tsx
│   │   ├── SaveAndResetButton
│   │   │   └── SaveAndResetButon.tsx
│   │   ├── SearchBox
│   │   │   └── index.tsx
│   │   ├── SecretViewComponent
│   │   │   └── index.tsx
│   │   ├── SeedphraseSaveAlert
│   │   │   └── index.tsx
│   │   ├── SeedphraseView
│   │   │   └── index.tsx
│   │   ├── SelectAccountModal
│   │   │   └── index.tsx
│   │   ├── SelectAction
│   │   │   ├── components
│   │   │   │   ├── actionAlert.tsx
│   │   │   │   └── actionList.tsx
│   │   │   ├── index.tsx
│   │   │   └── selectAction.test.tsx
│   │   ├── SelectionBox
│   │   │   ├── GasFeeSelectionBox.tsx
│   │   │   └── SlippageSelectionBox.tsx
│   │   ├── SimpleTile
│   │   │   └── index.tsx
│   │   ├── SingleOptionBox
│   │   │   └── index.tsx
│   │   ├── SlideLayoutWrapper
│   │   │   └── index.tsx
│   │   ├── SnackBar
│   │   │   ├── components
│   │   │   │   ├── SendSnackBar.tsx
│   │   │   │   ├── SnackBarHeaderCompletedState.tsx
│   │   │   │   ├── SnackBarHeaderPendingState.tsx
│   │   │   │   └── SwapSnackBar.tsx
│   │   │   ├── index.tsx
│   │   │   └── SnackBar.tsx
│   │   ├── SpeedUpCancel
│   │   │   └── SpeedUpCancel.tsx
│   │   ├── styled
│   │   │   └── index.tsx
│   │   ├── Switch
│   │   │   └── index.tsx
│   │   ├── TitleComponent
│   │   │   └── index.tsx
│   │   ├── TokenBoxContent
│   │   │   └── index.tsx
│   │   ├── TokenBoxTitle
│   │   │   └── index.tsx
│   │   ├── TokenHoldingTile
│   │   │   └── index.tsx
│   │   ├── TokenInformationModal
│   │   │   └── index.tsx
│   │   ├── TokenPanelModal
│   │   │   └── index.tsx
│   │   ├── TooltipButton
│   │   │   └── index.tsx
│   │   ├── TopLayoutComponent
│   │   │   └── index.tsx
│   │   ├── TransactionFailModal
│   │   │   └── index.tsx
│   │   ├── TransactionFeesComponent
│   │   │   ├── Components
│   │   │   │   ├── gasFee.tsx
│   │   │   │   └── hexData.tsx
│   │   │   └── index.tsx
│   │   ├── TransactionLoader
│   │   │   └── index.tsx
│   │   ├── WalletFilterCheckbox
│   │   │   └── index.tsx
│   │   ├── WalletSelectionModal
│   │   │   └── index.tsx
│   │   ├── WalletsFilterModal
│   │   │   ├── index.tsx
│   │   │   └── WalletAccordian
│   │   │       └── index.tsx
│   │   ├── WalletsList
│   │   │   └── index.tsx
│   │   └── WrapperBackground.tsx
│   ├── content.js
│   ├── declaration.d.ts
│   ├── env.d.ts
│   ├── hoc
│   │   └── withRouter.tsx
│   ├── hooks
│   │   ├── index.ts
│   │   ├── __test__
│   │   │   ├── apiMock.tsx
│   │   │   ├── hook.test.ts
│   │   │   ├── payloads
│   │   │   │   ├── NEARSwapPayload.ts
│   │   │   │   ├── useAccountsPayload.ts
│   │   │   │   ├── useAfterTransactionPayload.ts
│   │   │   │   ├── useAllWallets.ts
│   │   │   │   ├── useCommon.ts
│   │   │   │   ├── useSelectToken.ts
│   │   │   │   ├── useSendTransaction.ts
│   │   │   │   └── useSwap1Inch.ts
│   │   │   ├── reduxMock.ts
│   │   │   ├── useAccountsSort.test.tsx
│   │   │   ├── useAccounts.test.tsx
│   │   │   ├── useAfterTransaction.test.tsx
│   │   │   ├── useAllWallets.test.tsx
│   │   │   ├── useApp.test.tsx
│   │   │   ├── useClipboard.test.tsx
│   │   │   ├── useCommon.test.tsx
│   │   │   ├── useDashboard.test.tsx
│   │   │   ├── useGraphData.test.tsx
│   │   │   ├── useHover.test.tsx
│   │   │   ├── useInterval.test.tsx
│   │   │   ├── useLogin.test.tsx
│   │   │   ├── useLongPress.test.tsx
│   │   │   ├── useNetwork.test.tsx
│   │   │   ├── useSeedphrase.test.tsx
│   │   │   ├── useSelectAddress.test.tsx
│   │   │   ├── useSelectToken.test.tsx
│   │   │   ├── useSendTransaction.test.tsx
│   │   │   ├── useStep2.test.tsx
│   │   │   ├── useStep3.test.tsx
│   │   │   ├── useStep4.test.tsx
│   │   │   ├── useSwap1Inch.test.tsx
│   │   │   ├── useSwapNEAR.test.tsx
│   │   │   ├── useTxActivity.test.tsx
│   │   │   └── useWalletFilter.test.tsx
│   │   ├── useAccountsSort.ts
│   │   ├── useAccounts.ts
│   │   ├── useAfterTransaction.ts
│   │   ├── useAllWallets.ts
│   │   ├── useApp.ts
│   │   ├── useClipboard.ts
│   │   ├── useCommon.ts
│   │   ├── useConfirmSend.ts
│   │   ├── useDashboard.ts
│   │   ├── useGraphData.ts
│   │   ├── useHover.ts
│   │   ├── useInterval.ts
│   │   ├── useLogin.ts
│   │   ├── useLongPress.ts
│   │   ├── useNetwork.ts
│   │   ├── useSeedPhrase.ts
│   │   ├── useSelectAddress.ts
│   │   ├── useSelectToken.ts
│   │   ├── useSendTransaction.ts
│   │   ├── useStep2.ts
│   │   ├── useStep3.ts
│   │   ├── useStep4.ts
│   │   ├── useSwap1Inch.ts
│   │   ├── useSwapEVM.ts
│   │   ├── useSwapNEAR.ts
│   │   ├── useSwapTransaction.ts
│   │   ├── useSwap.ts
│   │   ├── useTxActivity.ts
│   │   └── useWalletFilter.ts
│   ├── index.css
│   ├── index.tsx
│   ├── interfaces
│   │   └── index.ts
│   ├── mock
│   │   └── index.ts
│   ├── mockIndex.tsx
│   ├── notification-manager.js
│   ├── page.js
│   ├── popup
│   │   ├── app
│   │   │   ├── dapp
│   │   │   │   ├── approve
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── terms.tsx
│   │   │   │   ├── changeNetwork
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── invalidNetwork.tsx
│   │   │   │   ├── connect
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── noWallet.tsx
│   │   │   │   │   └── terms.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── signTransaction
│   │   │   │   │   └── index.tsx
│   │   │   │   └── transaction
│   │   │   │       ├── dappTxError.tsx
│   │   │   │       └── index.tsx
│   │   │   ├── dashboard
│   │   │   │   └── index.tsx
│   │   │   ├── editList
│   │   │   │   └── index.tsx
│   │   │   ├── import
│   │   │   │   └── index.tsx
│   │   │   ├── index.ts
│   │   │   ├── Near
│   │   │   │   └── index.tsx
│   │   │   ├── receive
│   │   │   │   └── token
│   │   │   │       └── index.tsx
│   │   │   ├── send
│   │   │   │   ├── ConfirmSend
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── SelectAddress
│   │   │   │   │   └── index.tsx
│   │   │   │   └── SelectToken
│   │   │   │       └── index.tsx
│   │   │   ├── Settings
│   │   │   │   ├── AccountInfo.tsx
│   │   │   │   ├── AddressBook
│   │   │   │   │   ├── AddressTile.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Authentication.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ManageWallets.tsx
│   │   │   │   ├── WalletInfo.tsx
│   │   │   │   └── WalletList.tsx
│   │   │   ├── swap
│   │   │   │   ├── Account
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── TokenA
│   │   │   │   │   └── index.tsx
│   │   │   │   └── TokenB
│   │   │   │       └── index.tsx
│   │   │   └── tokenDetail
│   │   │       └── index.tsx
│   │   └── auth
│   │       ├── authScreen
│   │       │   ├── index.tsx
│   │       │   └── landing.test.tsx
│   │       ├── defaultWallet
│   │       │   └── index.tsx
│   │       ├── disclaimer
│   │       │   └── index.tsx
│   │       ├── importWallet
│   │       │   └── index.tsx
│   │       ├── index.ts
│   │       └── SeedPhrase
│   │           ├── components
│   │           │   ├── Gonext.tsx
│   │           │   └── shuffledMnemonic.tsx
│   │           ├── index.tsx
│   │           ├── seedphrase.test.tsx
│   │           ├── Step1.tsx
│   │           └── Step2.tsx
│   ├── provider-bridge-shared
│   │   ├── constants.ts
│   │   ├── eip-1193.ts
│   │   ├── index.ts
│   │   ├── runtime-typechecks.ts
│   │   └── types.ts
│   ├── redux-hook.ts
│   ├── routes
│   │   ├── app
│   │   │   └── index.tsx
│   │   ├── auth
│   │   │   └── index.tsx
│   │   ├── dappRoutes.tsx
│   │   ├── index2.tsx
│   │   └── index.tsx
│   ├── store
│   │   ├── accounts.ts
│   │   ├── apis
│   │   │   └── CoinGecko.ts
│   │   ├── assets.ts
│   │   ├── dapp.ts
│   │   ├── index.ts
│   │   ├── keyrings.ts
│   │   ├── migrations
│   │   │   ├── index.ts
│   │   │   ├── to-10.ts
│   │   │   ├── to-11.ts
│   │   │   ├── to-2.ts
│   │   │   ├── to-3.ts
│   │   │   ├── to-4.ts
│   │   │   ├── to-5.ts
│   │   │   ├── to-7.ts
│   │   │   ├── to-8.ts
│   │   │   └── to-9.ts
│   │   ├── networks.ts
│   │   ├── reducers
│   │   │   └── index.ts
│   │   ├── selectors
│   │   │   ├── dappSelectors.ts
│   │   │   ├── index.ts
│   │   │   ├── signingSelectors.ts
│   │   │   ├── transactionConstructionSelectors.ts
│   │   │   └── uiSelectors.ts
│   │   ├── signing.ts
│   │   ├── slices
│   │   │   ├── appSlice
│   │   │   │   ├── appSlice.ts
│   │   │   │   └── index.ts
│   │   │   ├── dappInfoSlice
│   │   │   │   └── index.ts
│   │   │   ├── dapp-permission.ts
│   │   │   ├── newWalletSlice
│   │   │   │   ├── index.ts
│   │   │   │   └── newWalletSliceTemp.ts
│   │   │   └── utils.ts
│   │   ├── store.ts
│   │   ├── transaction-construction.ts
│   │   ├── ui.ts
│   │   ├── utils
│   │   │   ├── activity-utils.ts
│   │   │   ├── asset-utils.ts
│   │   │   └── contract-utils.ts
│   │   └── utils.ts
│   ├── theme
│   │   ├── constants.ts
│   │   └── index.tsx
│   ├── utils
│   │   ├── chains.ts
│   │   ├── common.css
│   │   ├── common.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── index.test.ts
│   │   ├── index.ts
│   │   ├── Queries
│   │   │   └── index.ts
│   │   ├── __test__
│   │   │   ├── formatters.test.ts
│   │   │   ├── index.test.ts
│   │   │   ├── payload
│   │   │   │   ├── index.ts
│   │   │   │   ├── utils.1Inch.ts
│   │   │   │   ├── utils.activity.ts
│   │   │   │   ├── utils.api.ts
│   │   │   │   ├── utils.dapp.ts
│   │   │   │   ├── utils.gas.ts
│   │   │   │   ├── utils.holding.ts
│   │   │   │   ├── utils.near.ts
│   │   │   │   ├── utils.prices.ts
│   │   │   │   ├── utils.swap.ts
│   │   │   │   └── utils.wallet.ts
│   │   │   ├── utils.1inch.test.ts
│   │   │   ├── utils.activity.test.ts
│   │   │   ├── utils.api.test.ts
│   │   │   ├── utils.dapp.test.ts
│   │   │   ├── utils.gas.test.ts
│   │   │   ├── utils.holdings.test.ts
│   │   │   ├── utils.near.test.ts
│   │   │   ├── utils.notifications.test.ts
│   │   │   ├── utils.prices.test.ts
│   │   │   ├── utils.seedphrase.test.ts
│   │   │   ├── utils.storage.test.ts
│   │   │   ├── utils.swap.test.ts
│   │   │   ├── utils.wallet.test.ts
│   │   │   └── validAddresses.test.ts
│   │   ├── utils.1inch.ts
│   │   ├── utils.activity.ts
│   │   ├── utils.api.ts
│   │   ├── utils.dapp.ts
│   │   ├── utils.gas.ts
│   │   ├── utils.holdings.ts
│   │   ├── utils.near.ts
│   │   ├── utils.notifications.ts
│   │   ├── utils.prices.ts
│   │   ├── utils.seedPhrase.ts
│   │   ├── utils.storage.ts
│   │   ├── utils.swap.ts
│   │   ├── utils.wallets.ts
│   │   ├── utils.web3.ts
│   │   └── validateAddresses.ts
│   └── window-provider
│       └── index.ts
├── test
│   └── Lock.ts
├── tsconfig.json
├── webpack.config.js
├── yarn-error.log
└── yarn.lock
```
