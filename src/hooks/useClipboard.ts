import { useEffect, useState } from "react";
import { useAppSelector } from "store/store";
import { getDataFromClipboard } from "utils";

/**
 * a hook to extract the latest copied data every 3 seconds
 */
export const useClipboard = () => {
  const { selectedInputId } = useAppSelector((state) => state.app);
  const [clipboardvalue, setClipboardvalue] = useState("");
  useEffect(() => {
    (async () => {
      const text = getDataFromClipboard(selectedInputId);
      setClipboardvalue(text);
    })();

    const interval = setInterval(() => {
      (async () => {
        const text = getDataFromClipboard(selectedInputId);
        setClipboardvalue(text);
      })();
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedInputId]);

  return clipboardvalue;
};
