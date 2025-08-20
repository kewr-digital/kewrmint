import { useState } from "react";
import { EXPLORER_CONSTANTS } from "../constants/explorer";

export const useClipboard = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(id);
      setTimeout(() => setCopiedHash(null), EXPLORER_CONSTANTS.COPY_TIMEOUT);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return { copiedHash, copyToClipboard };
};
