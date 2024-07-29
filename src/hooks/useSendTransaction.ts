import { useMemo } from "react";
import Common from "@ethereumjs/common";
import { ethers } from "ethers";
import { useNavigate } from "react-router";
import solanaweb3, {
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { KeyPair, connect, keyStores } from "near-api-js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import BN from "bn.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer as solanaSplTransfer,
} from "@solana/spl-token";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import BigNumber from "bignumber.js";

import { StaticStore, useAppDispatch, useAppSelector } from "store/store";
import {
  convertBalanceToBaseUnit,
  decryptMessage,
  getNameFromAddressBook,
  getSolanaConnectionForTransaction,
  isStringIncludesTheValue,
  matchAddresses,
} from "utils";
import {
  ACTIVITY_STATUS_TYPES,
  CHAIN_TX,
  COINGECKO_ID,
  CONFIG,
  DUMMY_IMAGE_URL,
  FT_TRANSFER_DEPOSIT,
  FT_TRANSFER_GAS,
  NATIVE_TOKEN_ADDRESS,
  NEAR_ADDRESS,
  NETWORK_ID,
  NODE_URL,
  SOLANA_ADDRESS,
  SupportedChainId,
  TX_TYPES,
  Tx_METHODS,
  ZERO_ADDRESS,
} from "utils/constants";
import { getPopulatedTxDetail } from "utils/utils.activity";
import {
  addInProgressTransactionHash,
  setAlert,
  setIsHoldFinish,
  setPendingTransactionStates,
  setSlideAnimation,
  setSlideAnimationCompletionStatus,
  setTransactionTrigerredMessage,
} from "@slices/appSlice";
import {
  setDefaultTokenSelected,
  setTokenSelected,
} from "@slices/newWalletSlice";
import { extractKeypair } from "utils/utils.wallets";
import { APPSCREENS } from "theme/constants";
import {
  dynamicBalanceUpdater,
  getHoldings,
  introduceNewToken,
} from "utils/utils.holdings";
import { storeTransactionActivityData } from "utils/utils.activity";
import CachedService from "classes/cachedService";
import { getSendTransactionRawData } from "utils/utils.send";
import { TransactionRequest } from "@ethersproject/providers";
import { initializeContractAndFetchAmount } from "utils/utils.web3";
import { fetchTransactionCostInEther } from "utils/utils.gas";
import { fromReadableAmount, toFixed } from "utils/formatters";
import { updateBalanceOfSingleSolanaToken } from "utils/utils.holdingsSOLANA";
import { signAndSendTransaction } from "utils/utils.1inch";

export const useSendTransaction = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    tokenSelected: { token, from, to },
    accounts,
    allWallets,
  } = useAppSelector((state) => state.newWallet);

  const { networkFeeSettings, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );

  const hashedPassword = useMemo(() => CachedService.getHashedPassword(), []);

  const { gasInfo, feeType } = networkFeeSettings;

  const totalInUsd = useMemo(() => {
    if (to.amount > 0) {
      return gasInfo[feeType].usd + to.amountInUsd;
    }
    return gasInfo[feeType].usd;
  }, [to.amount, feeType, gasInfo]);

  const handleResetButton = () => {
    dispatch(setSlideAnimationCompletionStatus(false));
    dispatch(setSlideAnimation("contract"));
    dispatch(setIsHoldFinish(false));
  };

  /**
   * Sends EVM transaction to the EVM chain and update the states accordingly
   */
  const sendEVMTransaction = async () => {
    try {
      if (gasInfo[feeType].gwei > 0) {
        const allAccountsState = StaticStore.getState().newWallet.accounts;

        dispatch(setIsHoldFinish(true));

        const chainTx =
          NETWORKCHAIN[token.chainId as keyof typeof NETWORKCHAIN][CHAIN_TX];
        const coingeckoID =
          NETWORKCHAIN[token.chainId as keyof typeof NETWORKCHAIN][
            COINGECKO_ID
          ];
        const nodeURL =
          NETWORKCHAIN[token.chainId as keyof typeof NETWORKCHAIN][NODE_URL];

        const provider = new ethers.providers.JsonRpcProvider(nodeURL);

        const senderAddress = from.address;
        const receiverAddress = to.address;
        const tokenAddress = token.address;
        const amount = to.amount;
        const amountInUsd = to.amountInUsd;
        const chainId = token.chainId;

        let transactionObject: TransactionRequest = {};

        const nonce = await provider.getTransactionCount(senderAddress);

        //-----new code
        let contract;
        let estimateGas = 0;

        if (
          !matchAddresses(tokenAddress, NATIVE_TOKEN_ADDRESS) &&
          !matchAddresses(tokenAddress, ZERO_ADDRESS)
        ) {
          ({ contract, estimateGas } = await initializeContractAndFetchAmount(
            amount,
            senderAddress,
            tokenAddress,
            provider
          ));
        } else {
          estimateGas = await (
            await provider.estimateGas({ from: senderAddress })
          ).toNumber();
        }
        let makeTransaction = false;

        const testnetProperty =
          NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN].isTestnet;

        const weiValue = ethers.utils.parseUnits(
          gasInfo[feeType].gwei.toString(),
          "gwei"
        );

        const gasLimit = (
          testnetProperty
            ? matchAddresses(tokenAddress, NATIVE_TOKEN_ADDRESS)
              ? 21000
              : 91000
            : matchAddresses(tokenAddress, NATIVE_TOKEN_ADDRESS)
            ? 21000
            : estimateGas * 2.5
        ).toFixed();

        const gasLimitWithMargin = (parseInt(gasLimit) * 1.1).toFixed();

        console.log("weiValue", weiValue.toString());
        console.log("gasInfo[feeType].gwei", gasInfo[feeType].gwei);

        console.log("gasLimit", gasLimit);
        console.log("gasLimitWithMargin", gasLimitWithMargin);

        transactionObject = {
          from: senderAddress,
          nonce: ethers.utils.hexlify(nonce),
          gasLimit: ethers.utils.hexlify(Number(gasLimit)),
          gasPrice: ethers.utils.hexlify(weiValue),
          to: receiverAddress,
        };

        const transactionCostInEther = await fetchTransactionCostInEther(
          Number(gasLimitWithMargin), //Number(gasLimit),
          Number(gasInfo[feeType].gwei)
        );
        const transactionCostInRaw = fromReadableAmount(
          transactionCostInEther.toString()
        );

        const userNativeBalance = from.nativeTokenBalance;
        const userNativeBalanceInRaw = new BigNumber(
          from.nativeTokenBalanceInRaw
        );

        // if native
        if (
          matchAddresses(tokenAddress, NATIVE_TOKEN_ADDRESS) ||
          matchAddresses(tokenAddress, ZERO_ADDRESS)
        ) {
          const totalAmount = +amount + Number(transactionCostInEther);

          if (userNativeBalance <= totalAmount) {
            const deductedAmount =
              userNativeBalance - Number(transactionCostInEther);
            // const deductedAmount = userNativeBalanceInRaw.minus(
            //   new BigNumber(transactionCostInRaw.toString())
            // );

            console.log("deductedAmount", deductedAmount.toString());

            if (deductedAmount < 0) {
              dispatch(
                setTokenSelected({
                  error: {
                    message: "Insufficient funds for gas",
                    open: true,
                  },
                })
              );
              handleResetButton();
              return;
            } else {
              transactionObject = {
                ...transactionObject,
                value: ethers.utils
                  .parseEther(deductedAmount.toString())
                  .toHexString(),
                // value: ethers.utils.hexlify(
                //   ethers.utils.toUtf8Bytes(deductedAmount.toString())
                // ),
              };
              makeTransaction = true;
            }
          } else {
            makeTransaction = true;
            transactionObject = {
              ...transactionObject,
              value: ethers.utils.parseEther(amount.toString()).toHexString(),
            };
          }
        } else {
          console.log("userNativeBalance", userNativeBalance);
          console.log("transactionCostInEther", transactionCostInEther);

          if (userNativeBalance < Number(transactionCostInEther)) {
            makeTransaction = false;
            dispatch(
              setTokenSelected({
                error: {
                  message: "Insufficient funds for gas",
                  open: true,
                },
              })
            );
            handleResetButton();
            return;
          } else {
            makeTransaction = true;
          }

          if (contract) {
            const amountConverted = await convertBalanceToBaseUnit(
              contract,
              amount
            );
            console.log("amountConverted", amountConverted);

            transactionObject = {
              ...transactionObject,
              data: contract.interface.encodeFunctionData("transfer", [
                receiverAddress,
                amountConverted,
              ]),
              to: tokenAddress,
            };
          }
        }
        //--new code ends here

        //everythings good then send transaction
        if (makeTransaction) {
          let common: any;
          if (coingeckoID === "ethereum") {
            common = new Common({ chain: chainTx });
          } else {
            //@ts-ignore
            common = Common.custom(chainTx);
          }

          const raw = await getSendTransactionRawData(
            transactionObject,
            common,
            senderAddress,
            hashedPassword
          );

          const { decimals, image, name, symbol } = token;
          const item = getPopulatedTxDetail({
            address: senderAddress,
            amount,
            amountInUsd,
            chainId: token.chainId,
            decimal: decimals,
            from: senderAddress,
            hash: "",
            image,
            name,
            symbol,
            timeStamp: new Date().getTime(),
            to: to.address,
            tokenAddress: token.address,
            transactionFeeInUsd: gasInfo[feeType].usd,
            txType: TX_TYPES.Sent,
            isSpeedUpEnabled: true,
            isCancelEnabled: true,
            rawData: {
              transactionObject,
              chainId,
            },
            status: ACTIVITY_STATUS_TYPES.pending,
            walletName: allWallets[accounts[senderAddress].walletId].name,
            senderNameInTheAddressBook: getNameFromAddressBook(senderAddress),
            receiverNameInTheAddressBook: getNameFromAddressBook(to.address),
            txMethod: Tx_METHODS.normal,
            isDappTransaction: false,
          });

          const dynamicBalanceChecker = {
            [chainId]: {
              web3Instance: provider,
              addresses: [from.address, to.address],
              tokens: [token.address],
              contractAddress: NETWORKCHAIN[+chainId].BALANCE_CHECKER,
            },
          };

          // ethers.js way
          // const { hash: transactionHash } = await provider.sendTransaction(raw);
          const transactionHash = await signAndSendTransaction(
            chainId,
            provider,
            senderAddress,
            transactionObject
          );

          console.log("transactionHash=========", transactionHash);

          dispatch(
            setPendingTransactionStates({
              isTransactionCompleted: false,
              isHoldFinish: false,
              isSlideAnimationCompleted: false,
              slideAnimation: "contract",
              txType: TX_TYPES.Sent,
            })
          );

          dispatch(
            addInProgressTransactionHash({
              chainId,
              nonce: nonce,
              transactionHash,
            })
          );

          await storeTransactionActivityData({
            transactionData: {
              ...item,
              transactionHash,
              nonce: nonce,
            },
          });

          dispatch(setDefaultTokenSelected());

          navigate("/index.html");

          await provider.waitForTransaction(transactionHash);

          // check if the receiver address is internal address
          // if yes then introduce that token
          if (allAccountsState[to.address]) {
            console.log("andrrrrr ayaaaa");
            await introduceNewToken({
              accAddress: to.address,
              chainId,
              tokenInfo: {
                address: token.address,
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals,
                image: token.image,
                coingeckoId: "",
                isActive: true,
                price: 0,
              },
            });
          }

          console.log(
            StaticStore.getState().newWallet.tokenHoldings,
            "THEEEE NEW HOLDING"
          );
          //update balance of that token after tx complete
          dynamicBalanceUpdater(dynamicBalanceChecker);
        }
      } else {
        dispatch(
          setTokenSelected({
            error: {
              message: "Oops, unable to get gas price",
              open: true,
            },
          })
        );
        handleResetButton();
      }
    } catch (error) {
      console.log("sendEVMTransaction", error);
      dispatch(
        setTokenSelected({
          error: {
            message: "Oops, something went wrong. Please try again later.",
            open: true,
          },
        })
      );
      handleResetButton();
    }
  };

  /**
   * Sends NEAR transactions to the NEAR chain and waits for confirmation
   */
  const sendNEARTransaction = async () => {
    try {
      dispatch(setIsHoldFinish(true));

      const accountID = from.address;

      const secret = decryptMessage(
        accounts[from.address].secret,
        hashedPassword
      );

      dispatch(
        setTransactionTrigerredMessage(
          "Your Near transaction might be confirmed or terminated"
        )
      );

      // initialize keyStore
      const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      const keyPair = KeyPair.fromString(secret);
      await keyStore.setKey(
        CONFIG[token.chainId as keyof typeof CONFIG][NETWORK_ID],
        accountID,
        keyPair
      );

      // intialize near connection with near configuration
      const configuration = CONFIG[token.chainId as keyof typeof CONFIG];
      const near = await connect({ ...configuration, keyStore });

      // initialize near sender account
      const senderAccount = await near.account(accountID);

      // convert near amount into it's lowest unit (yocto)
      const yoctoAmount = parseNearAmount(to.amount.toString()) as string;
      const convertedAmount = new BN(yoctoAmount);

      let transfer: FinalExecutionOutcome;

      // incase user is sending non-native token on NEAR chain
      if (!matchAddresses(token.address, NEAR_ADDRESS)) {
        transfer = await senderAccount.functionCall(
          token.address,
          "ft_transfer",
          {
            amount: fromReadableAmount(
              to.amount.toString(),
              token.decimals
            ).toString(),
            receiver_id: to.address,
          },
          // @ts-ignore
          FT_TRANSFER_GAS,
          FT_TRANSFER_DEPOSIT
        );
      } else {
        // incase user is sending NEAR on NEAR chain
        transfer = await senderAccount.sendMoney(to.address, convertedAmount);
      }

      // wait for near transaction status
      const response = await near.connection.provider.txStatus(
        transfer.transaction.hash,
        from.address
      );
      const status = response.transaction_outcome.outcome.status as {
        SuccessReceiptId: string;
      };

      // if a success status received
      if (status.SuccessReceiptId) {
        dispatch(setTransactionTrigerredMessage(""));
        await storeTransactionActivityData({
          transactionData: {
            address: accountID,
            chainId: token.chainId,
            from: accountID,
            nonce: 0,
            timeStamp: Date.now(),
            to: to.address,
            token: {
              address: token.address,
              amount: to.amount,
              amountInUsd: to.amountInUsd,
              decimal: token.decimals,
              image: token.image,
              name: token.name,
              symbol: token.symbol,
            },
            transactionHash: transfer.transaction.hash,
            rawData: {},
            txType: TX_TYPES.Sent,
            status: ACTIVITY_STATUS_TYPES.success,
            transactionFeeInUsd: totalInUsd,
            walletName: allWallets[accounts[accountID].walletId].name,
            senderNameInTheAddressBook: getNameFromAddressBook(accountID),
            receiverNameInTheAddressBook: getNameFromAddressBook(to.address),
            txMethod: Tx_METHODS.normal,
            isDappTransaction: false,
          },
        });
        navigate(APPSCREENS.dashboard);
      } else {
        // if transaction fails
        dispatch(setTransactionTrigerredMessage(""));
        console.log("near tx failed", transfer);
      }

      handleResetButton();
      dispatch(
        setAlert({
          open: true,
          body: "Transaction Successful",
          heading: "Success!",
        })
      );

      // call this function to get the fresh holding
      getHoldings(["NEAR"]);
    } catch (error: any) {
      // if any steps throws error it will stop the transaction and
      // show error alert to user
      console.log("error in NEAR transaction", error.message);
      handleResetButton();
      if (isStringIncludesTheValue(error.message, "enough balance")) {
        dispatch(
          setAlert({
            open: true,
            body: error.message,
            heading: "Error",
          })
        );

        navigate("/index.html");
      } else {
        dispatch(
          setAlert({
            open: true,
            body: error.message,
            heading: "Error",
          })
        );
      }
    }

    // navigate to dashboard after the transaction
    // irrespective of the result
    navigate("/index.html");
  };

  /**
   * Sends SOLANA transaction to the SOLANA chain and waits for confirmation
   */
  const sendSOLANATransaction = async () => {
    try {
      dispatch(setIsHoldFinish(true));

      dispatch(
        setTransactionTrigerredMessage(
          "Your Solana transaction might be confirmed or terminated"
        )
      );

      // initialize the connection
      let connection: solanaweb3.Connection;
      if (token.chainId === SupportedChainId.SOLANA_DEVNET) {
        connection = getSolanaConnectionForTransaction(false);
      } else {
        connection = getSolanaConnectionForTransaction(true);
      }

      // intialize the keypair of from account
      const fromAccountKeypair = extractKeypair(
        decryptMessage(accounts[from.address].secret, hashedPassword)
      );
      let hash = "";

      // incase user is sending SOLANA token on SOLANA chain
      if (matchAddresses(token.address, SOLANA_ADDRESS)) {
        const { publicKey, secretKey } = fromAccountKeypair;

        // prepare sending instruction manifest
        const instructions = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(to.address),
          // lamports: to.amount * 1000000000,
          lamports: toFixed(
            fromReadableAmount(to.amount.toString(), token.decimals).toString()
          ),
        });

        // add instructions to the transaction object
        const transaction = await new Transaction().add(instructions);

        // specify the signers, in this case only the user is signing
        const signers = [
          {
            publicKey,
            secretKey,
          },
        ];

        // send the solana transaction and wait for confirmation
        const Signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          signers
        );
        console.log("Signature=======", Signature);
        // navigate to the dashboard
        navigate(APPSCREENS.dashboard);
        hash = Signature;
        dispatch(setTransactionTrigerredMessage(""));
        await storeTransactionActivityData({
          transactionData: {
            address: from.address,
            chainId: token.chainId,
            from: from.address,
            nonce: 0,
            timeStamp: Date.now(),
            to: to.address,
            token: {
              address: token.address,
              amount: to.amount,
              amountInUsd: to.amountInUsd,
              decimal: token.decimals,
              image: token.image || DUMMY_IMAGE_URL,
              name: token.name,
              symbol: token.symbol,
            },
            transactionHash: Signature,
            rawData: {},
            txType: TX_TYPES.Sent,
            status: ACTIVITY_STATUS_TYPES.success,
            transactionFeeInUsd: totalInUsd,
            walletName: allWallets[accounts[from.address].walletId].name,
            senderNameInTheAddressBook: getNameFromAddressBook(from.address),
            receiverNameInTheAddressBook: getNameFromAddressBook(to.address),
            txMethod: Tx_METHODS.normal,
            isDappTransaction: false,
          },
        });

        dispatch(
          setAlert({
            open: true,
            body: "Transaction confirmed",
            heading: "Success",
          })
        );
      } else {
        // incase user is sending non-native token on SOLANA chain

        const mint = new PublicKey(token.address);

        // prepare the non native token account for the user who is sending this token
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          fromAccountKeypair,
          mint,
          fromAccountKeypair.publicKey
        );
        console.log("fromTokenAccount", fromTokenAccount);

        // prepare the non native token account for the user who will receive this token
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          fromAccountKeypair,
          mint,
          new PublicKey(to.address)
        );
        console.log("toTokenAccount", toTokenAccount);

        console.log(
          "real here",
          fromReadableAmount(to.amount.toString(), token.decimals).toNumber()
        );

        // function to call when sending non native token and wait for confirmation
        const signature = await solanaSplTransfer(
          connection,
          fromAccountKeypair,
          fromTokenAccount.address,
          toTokenAccount.address,
          fromAccountKeypair.publicKey,
          fromReadableAmount(to.amount.toString(), token.decimals).toNumber() // to.amount * 10 ** token.decimals
        );

        console.log("SOLANA SUCCESSFUL ALT TRANSACTION", signature);
        // navigate to dashboard on success
        navigate(APPSCREENS.dashboard);
        dispatch(setTransactionTrigerredMessage(""));
        await storeTransactionActivityData({
          transactionData: {
            address: from.address,
            chainId: token.chainId,
            from: from.address,
            nonce: 0,
            timeStamp: Date.now(),
            to: to.address,
            token: {
              address: token.address,
              amount: to.amount,
              amountInUsd: to.amountInUsd,
              decimal: token.decimals,
              image: token.image || DUMMY_IMAGE_URL,
              name: token.name,
              symbol: token.symbol,
            },
            transactionHash: signature,
            rawData: {},
            txType: TX_TYPES.Sent,
            status: ACTIVITY_STATUS_TYPES.success,
            transactionFeeInUsd: totalInUsd,
            walletName: allWallets[accounts[from.address].walletId].name,
            senderNameInTheAddressBook: getNameFromAddressBook(from.address),
            receiverNameInTheAddressBook: getNameFromAddressBook(to.address),
            txMethod: Tx_METHODS.normal,
            isDappTransaction: false,
          },
        });

        hash = signature;

        dispatch(
          setAlert({
            open: true,
            body: "Transaction confirmed",
            heading: "Success",
          })
        );
      }

      handleResetButton();
      // navigate("/index.html");
      const addresses = [from.address];
      const balances = [from.rawBalance];
      if (accounts[to.address]) {
        addresses.push(to.address);
        balances.push(
          StaticStore.getState().newWallet.tokenHoldings?.[to.address]?.[
            token.chainId
          ]?.[token.address]?.rawAmount ?? "0"
        );
      }
      // fetch latest holding after the transaction
      setTimeout(() => {
        updateBalanceOfSingleSolanaToken(
          addresses,
          token.address,
          token.symbol,
          token.chainId,
          balances
        );
      }, 3000);
    } catch (error: any) {
      // in case of any error in solana transaction steps, the transaction
      // will not proceed and user will be shown error
      console.log("error in SOLANA transaction", error);
      dispatch(setTransactionTrigerredMessage(""));

      dispatch(
        setAlert({
          open: true,
          body: error.message,
          heading: "Error",
        })
      );
      navigate("/index.html");
      handleResetButton();
    }
  };

  return {
    sendEVMTransaction,
    sendNEARTransaction,
    sendSOLANATransaction,
  };
};
