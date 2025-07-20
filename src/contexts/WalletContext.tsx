import React, { createContext, useContext } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { useKeplrWallet } from "../hooks/useKeplrWallet";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  client: SigningStargateClient | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const walletState = useKeplrWallet();

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};
