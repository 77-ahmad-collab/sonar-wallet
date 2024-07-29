import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "store/store";
import { CHAIN, NODE_URL, SupportedChainId } from "utils/constants";
import { getDataFromClipboard, matchAddresses } from "utils";
import { validateAddress, validateEVMAddress } from "utils/validateAddresses";
import {
  setDefaultTokenSelected,
  setTokenSelected,
} from "@slices/newWalletSlice";
import { useClipboard } from "./useClipboard";
import { Address } from "bnc-sdk";
import { ethers } from "ethers";
import { filterAccounts } from "utils/utils.wallets";

export const useSelectAddress = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { addressBook, selectedInputId, NETWORKCHAIN } = useAppSelector(
    (state) => state.app
  );
  const clipboardvalue = useClipboard();

  const {
    tokenSelected: { token, to, from },
    activity,
    accounts,
  } = useAppSelector((state) => state.newWallet);
  const { chainFamily } = from;

  const [value, setValue] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [showModalAddressBook, setShowModalAddressBook] = useState(false);
  const [isSwitchAddressBook, setSwitchAddressBook] = useState(false);
  const [ensAddress, setEnsAddress] = useState("");

  const [
    showModalTransferBetweenAccounts,
    setShowModalTransferBetweenAccounts,
  ] = useState(false);

  /**
   * This function is used on an onClick event on the icon used in the top header of the select address page.
   * It simply navigate to select token screen
   */
  const onTopImageClick = () => {
    dispatch(setDefaultTokenSelected());
    navigate("/send/selecttoken");
  };

  /**
   *
   * In this case, this method is used to filter the activity object and store the recent recipients data in the data array.
   * The data array is sorted by timeStamp and the addresses are filtered to ensure no repeat values. The filtered array is then
   * sliced to only return the most recent two elements.
   *
   * @returns data -> recent recipients list
   */
  const recentRecipients = useMemo(() => {
    let data: {
      name: string;
      address: Address;
      timeStamp: number;
    }[] = [];

    //get recent recipients from activity
    Object.keys(activity).forEach((address) => {
      Object.keys(activity[address]).forEach((chainId) => {
        if (NETWORKCHAIN[+chainId].chain === chainFamily) {
          Object.keys(activity[address][+chainId]).forEach((hash) => {
            data.push({
              address: activity[address][+chainId][hash].to,
              name: `${NETWORKCHAIN[+chainId].chain} Address`,
              timeStamp: activity[address][+chainId][hash].timeStamp,
            });
          });
        }
      });
    });

    //sort by timestamp
    data = data.sort((a, b) => b.timeStamp - a.timeStamp);

    //remove duplicates addresses
    return data
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => matchAddresses(t.address, value.address))
      )
      .slice(0, 2);
  }, [activity, chainFamily]);

  /**
   * Filters accounts according to the specified parameters.
   *
   * @param {Object} options - The filtering options.
   * @param {Array} options.excludeAccounts - Array of accounts to exclude from the results.
   * @param {Array} options.chainFamily - Array of chain families to include in the results.
   */
  const filteredAccounts = useMemo(() => {
    return filterAccounts({
      excludeAccounts: [from.address],
      chainFamily: [from.chainFamily],
    });
  }, [accounts, from.address]);

  /**
   * Handles the change of the switch to show/hide the address book
   */
  const handleSwitchChange = () => {
    setSwitchAddressBook(!isSwitchAddressBook);
  };

  /**
   *This function is used to close the address book modal
   */
  const handleCloseModalAddressBook = () => {
    setShowModalAddressBook(false);
    // onAddressSelect(value);
  };

  /**
   * Handles the change event of the search field in the select address screen
   * @param {ChangeEvent<HTMLInputElement>} event - The change event of the input element
   */
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  /**
   *Handler for when text is pasted into the input
   *Gets the text from the clipboard, then sets the value
   *of the input element to that text
   */
  const onPasteHandler = async () => {
    const text = getDataFromClipboard(selectedInputId);
    setValue(text);
  };

  /** This useEffect is used to check the validation of the web3 address or the ens entered in the search field */
  useEffect(() => {
    (async () => {
      if (value.toLowerCase().includes(".eth")) {
        const isValidEns = await validateENSAddress(value);
        setIsAddressValid(isValidEns.isValid);
        setEnsAddress(isValidEns.address);
      } else {
        const isValid = validateAddress(
          value,
          NETWORKCHAIN[token.chainId][CHAIN]
        );
        setIsAddressValid(isValid);
      }
    })();
  }, [value]);

  /**
   * This function Validates an ENS address
   * @param {string} addr - The ENS address to be validated
   * @returns {Object} - An object containing a boolean value (isValid -> indicating the address is valid or not) and a string value (address)
   */

  const validateENSAddress = async (addr: string) => {
    try {
      const nodeURL = NETWORKCHAIN[SupportedChainId.ETHEREUM_MAINNET][NODE_URL];
      const web3 = new ethers.providers.JsonRpcProvider(nodeURL);

      const address = await web3.resolveName(addr);
      if (address && validateEVMAddress(address)) {
        return { isValid: true, address: address };
      } else {
        return { isValid: false, address: "" };
      }
    } catch (error) {
      return { isValid: false, address: "" };
    }
  };

  /**
   * This function is triggered when click event is performed on send button
   * If save to address book modal switch is on, then the address book modal will be opened.
   * if that is not the case then the onAddressSelect function will be called.
   */

  const handleSend = () => {
    if (isSwitchAddressBook) setShowModalAddressBook(true);
    if (!isSwitchAddressBook) {
      onAddressSelect(value);
    }
  };

  /**
   *
   *This function to set the  address and navigate to confirm page
   *
   * @param {string} toAddress - The address thats need to be selected
   *
   *  Dispatch the address value along with its ens, if it is, and navigate to the confirm screen
   */
  const onAddressSelect = async (toAddress: string) => {
    await dispatch(
      setTokenSelected({
        to: {
          ...to,
          address: ensAddress ? ensAddress : toAddress,
          ens: ensAddress ? toAddress : "",
        },
      })
    );
    navigate("/send/confirm");
  };

  return {
    showModalAddressBook,
    handleCloseModalAddressBook,
    value,
    handleChange,
    isSwitchAddressBook,
    handleSwitchChange,
    onPasteHandler,
    addressBook,
    isAddressValid,
    onAddressSelect,
    onTopImageClick,
    handleSend,
    chainFamily,
    clipboardvalue,
    recentRecipients,
    showModalTransferBetweenAccounts,
    setShowModalTransferBetweenAccounts,
    from,
    ensAddress,
    filteredAccounts,
    token,
    validateENSAddress,
  };
};
