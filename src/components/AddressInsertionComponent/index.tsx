import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  faCheck,
  faNoteSticky,
  faTag,
  faUserPlus,
  faWallet,
  faXmark,
} from "@fortawesome/pro-light-svg-icons";

import {
  AddressBookFormType,
  AddressInsertionProps as PROPS,
} from "interfaces";
import {
  BottomBasicModal,
  ButtonWithIcon,
  SearchBar,
  StartAdornment,
} from "components";
import { Text } from "@styled";
import { setAddressBook } from "@slices/appSlice";
import { useAppDispatch, useAppSelector } from "store/store";
import { EVM } from "utils/constants";
import { checkSum } from "utils";
import { validateAddress } from "utils/validateAddresses";

const AddressInsertionComponent: FC<PROPS> = ({
  open,
  handleClose,
  walletAddress,
  isEdit = false,
  addressInfo,
  onAddressSelect,
  ens = "",
}) => {
  const dispatch = useAppDispatch();
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);
  const { tokenSelected } = useAppSelector((state) => state.newWallet);

  const [value, setValue] = useState({
    NAME: "",
    ADDRESS: "",
    ENS: "",
    NOTE: "",
  });

  const [error, setError] = useState({
    name: "",
    text: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [event.target.name]: event.target.value });
    setError({ name: "", text: "" });
  };

  const isFormValid = () => {
    //While saving the address, the name cant be blank
    // if (!isTouched) {
    //   return true;
    // }
    if (value.ADDRESS.trim().length === 0) {
      setError({ name: "ADDRESS", text: "Invalid Address!" });
      return false;
    }
    if (value.NAME.trim().length === 0) {
      setError({ name: "NAME", text: "The name cannot be empty!" });
      return false;
    }
    if (value.NAME.trim().length > 22) {
      setError({ name: "NAME", text: "Name too long!" });
      return false;
    }
    setError({ name: "", text: "" });
    return true;
  };

  const handleSave = () => {
    if (isFormValid()) {
      const chainFamily = addressInfo
        ? addressInfo.chainFamily
        : NETWORKCHAIN[tokenSelected.token.chainId].chain;
      if (!validateAddress(value.ADDRESS.trim(), chainFamily)) {
        setError({ name: "ADDRESS", text: "Invalid Address!" });
        return;
      }
      const address =
        chainFamily === EVM
          ? checkSum(value.ADDRESS.trim())
          : value.ADDRESS.trim();
      dispatch(
        setAddressBook({
          [address]: {
            name: value.NAME.trim(),
            address,
            note: value.NOTE.trim(),
            chainFamily,
            ens: ens,
          },
        })
      );
      handleClose();
      onAddressSelect(address);
    }
  };

  /* effects */
  useEffect(() => {
    setValue({
      NAME: addressInfo ? addressInfo.name : "",
      ADDRESS: !isEdit ? walletAddress : addressInfo ? addressInfo.address : "",
      ENS: ens,
      NOTE: addressInfo ? addressInfo.note : "",
    });
    setError({
      name: "",
      text: "",
    });
  }, [open]);

  /* constants */
  const Content: AddressBookFormType = [
    {
      title: "ADDRESS",
      placeholder: "Type address or ENS...",
      icon: faWallet,
    },
    {
      title: "ENS",
      placeholder: "",
      icon: faWallet,
    },
    {
      title: "NAME",
      placeholder: "Enter nickname",
      icon: faTag,
    },
    {
      title: "NOTE",
      placeholder: "Write any note",
      icon: faNoteSticky,
    },
  ];

  return (
    <BottomBasicModal open={open} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faUserPlus}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            iconSize={16}
            style={{ width: 40 }}
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black" }}>
            {isEdit ? "Edit Contact" : "Add to your address book"}
          </Text>
        </div>
        {Content.map((item, index) => {
          const isError = item.title === error.name;

          if (!ens && item.title === "ENS") {
            return;
          }
          return (
            <div key={index}>
              <div className="r-c-sb input-header">
                <Text
                  size={13}
                  weight={500}
                  customColor={isError ? "rgba(255, 55, 94, 1)" : "#5E5E64"}
                >
                  {item.title}
                </Text>
                {isError && (
                  <Text
                    size={13}
                    weight={500}
                    customColor="rgba(255, 55, 94, 1)"
                  >
                    {error.text}
                  </Text>
                )}
              </div>
              <SearchBar
                lightMode
                id={`add-address-input-${index}`}
                onChange={handleChange}
                name={item.title.toString()}
                placeholder={item.placeholder}
                value={value[item.title as keyof typeof value]}
                StartAdornment={
                  <StartAdornment
                    Icon={item.icon}
                    iconColor={"rgba(0,0,0,0.4)"}
                  />
                }
                customPadding={6}
                disable={
                  (item.title === "ADDRESS" || item.title === "ENS") && !isEdit
                    ? true
                    : false
                }
                containerStyle={{
                  width: "100%",
                }}
              />
            </div>
          );
        })}
        <div className="r-c-fs mgt-lg">
          <ButtonWithIcon
            id="AddressInsertionComponent-handleClose"
            icon={faXmark}
            lightMode={true}
            contained
            onClick={handleClose}
            text="Cancel"
            iconColor="rgba(0,0,0,0.4)"
            style={{ marginTop: 10 }}
          />
          <ButtonWithIcon
            id="AddressInsertionComponent-handleSave"
            icon={faCheck}
            lightMode={true}
            onClick={handleSave}
            text={isEdit ? "Save Edit" : "Save"}
            iconColor="rgba(0,0,0,0.4)"
            style={{ marginTop: 10 }}
          />
        </div>
      </>
    </BottomBasicModal>
  );
};

export default AddressInsertionComponent;
