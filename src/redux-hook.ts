/* eslint-disable @typescript-eslint/no-restricted-imports */
import { BackgroundDispatch, RootState } from "background-related";

import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { noopAction } from "store/utils";

export const useBackgroundDispatch = (): BackgroundDispatch =>
  useDispatch<BackgroundDispatch>();
export const useBackgroundSelector: TypedUseSelectorHook<RootState> =
  useSelector;

/**
 * Returns true once all pending redux updates scheduled before the first render
 * (if any) have been applied, and false otherwise.
 */
export function useIsBackgroundSettled(): boolean {
  const [settled, setSettled] = useState(false);
  const dispatch = useBackgroundDispatch();
  useEffect(() => {
    Promise.resolve(dispatch(noopAction())).then(() => {
      setSettled(true);
    });
  });
  return settled;
}
