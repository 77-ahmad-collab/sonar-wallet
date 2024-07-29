//@ts-nocheck

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { AccountSigner } from "background-related/services/signing";
import { HexString } from "background-related/types";

export const selectAccountSignersByAddress = createSelector(
  (state: RootState) => state.ledger.devices,

  keyringsByAddress => {
    const keyringEntries = Object.entries(keyringsByAddress)
      .map(([address, keyring]): [HexString, AccountSigner] | undefined =>
        keyring.id === null
          ? undefined
          : [
              address,
              {
                type: "keyring",
                keyringID: keyring.id,
              },
            ]
      )
      .filter(isDefined);

    return Object.fromEntries([
      // Give priority to keyring over Ledger, if an address is signable by
      // both.
      ...keyringEntries,
    ]);
  }
);
