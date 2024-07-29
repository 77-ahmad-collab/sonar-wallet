import { useState } from "react";
import { useNavigate } from "react-router";
import { faAddressBook } from "@fortawesome/pro-light-svg-icons";

import {
  AddressInsertionComponent,
  CommonLayout,
  EmptyAddress,
} from "components";
import AddressTile from "./AddressTile";
import { useAppDispatch, useAppSelector } from "store/store";
import {
  AddressBook as IAddressBook,
  removeContact as deleteContact,
} from "@slices/appSlice";

const AddressBook = () => {
  const navigate = useNavigate();
  const { addressBook } = useAppSelector((state) => state.app);
  const [selectedContact, setSelectedContact] =
    useState<IAddressBook["acc_address"]>();
  const dispatch = useAppDispatch();

  const removeContact = (address: string) => {
    dispatch(deleteContact(address));
  };

  return (
    <CommonLayout onTopImageClick={() => navigate(-1)} title="Address Book">
      <div className="full-width">
        {Object.keys(addressBook).length > 0 ? (
          Object.values(addressBook).map((contact, key) => (
            <AddressTile
              key={key}
              onEditClick={(address) => {
                console.log("Address", address);
                setSelectedContact(addressBook[address]);
              }}
              onRemoveClick={(address) => removeContact(address)}
              addressInfo={contact}
            />
          ))
        ) : (
          <EmptyAddress
            icon={faAddressBook}
            text={"Your address book is empty..."}
          />
        )}

        <AddressInsertionComponent
          open={Boolean(selectedContact)}
          handleClose={() => setSelectedContact(undefined)}
          walletAddress={"0xcE44FFE89556E02fdd784626EA61Def207Faccw1"}
          addressInfo={selectedContact}
          isEdit={true}
          onAddressSelect={() => {}}
        />
      </div>
    </CommonLayout>
  );
};

export default AddressBook;
