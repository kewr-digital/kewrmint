import { useState, useEffect, useCallback } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import { MsgMintPhoton } from "../types/atomone/photon/v1/tx";
import type { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {}
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  client: SigningStargateClient | null;
  isConnecting: boolean;
}

const CHAIN_ID = "atomone-1";
const RPC_ENDPOINT = "https://m-atomone.rpc.utsa.tech";

// Konfigurasi chain lengkap untuk Keplr
const CHAIN_CONFIG = {
  chainId: "atomone-1",
  chainName: "AtomOne",
  rpc: "https://m-atomone.rpc.utsa.tech",
  rest: "https://m-atomone.api.utsa.tech",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "atone",
    bech32PrefixAccPub: "atonepub",
    bech32PrefixValAddr: "atonevaloper",
    bech32PrefixValPub: "atonevaloperpub",
    bech32PrefixConsAddr: "atonevalcons",
    bech32PrefixConsPub: "atonevalconspub",
  },
  currencies: [
    {
      coinDenom: "ATONE",
      coinMinimalDenom: "uatone",
      coinDecimals: 6,
      coinGeckoId: "atomone",
    },
    {
      coinDenom: "PHOTON",
      coinMinimalDenom: "uphoton",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "ATONE",
      coinMinimalDenom: "uatone",
      coinDecimals: 6,
      coinGeckoId: "atomone",
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "ATONE",
    coinMinimalDenom: "uatone",
    coinDecimals: 6,
    coinGeckoId: "atomone",
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
};

// Custom event untuk sinkronisasi state antar komponen
const WALLET_STATE_CHANGE_EVENT = "wallet-state-change";

// Global state untuk memastikan konsistensi
let globalWalletState: WalletState = {
  isConnected: false,
  address: null,
  client: null,
  isConnecting: false,
};

// Fungsi untuk broadcast perubahan state
const broadcastWalletStateChange = (newState: WalletState) => {
  globalWalletState = newState;
  window.dispatchEvent(
    new CustomEvent(WALLET_STATE_CHANGE_EVENT, {
      detail: newState,
    })
  );
};

// Create custom registry with MsgMintPhoton
// Untuk memperbaiki error registry, tambahkan type assertion:
const createCustomRegistry = (): Registry => {
  const registry = new Registry(defaultRegistryTypes);
  registry.register(MSG_MINT_PHOTON_TYPE_URL, MsgMintPhoton as any);
  return registry;
};

// Fungsi untuk suggest chain ke Keplr
const suggestChainToKeplr = async (): Promise<void> => {
  if (!window.keplr) {
    throw new Error("Keplr extension not found");
  }

  try {
    await window.keplr.experimentalSuggestChain(CHAIN_CONFIG);
  } catch (error) {
    console.log("Chain already exists in Keplr or user rejected:", error);
  }
};

export const useKeplrWallet = () => {
  const [walletState, setWalletState] =
    useState<WalletState>(globalWalletState);

  // Listen untuk perubahan state dari komponen lain
  useEffect(() => {
    const handleWalletStateChange = (event: CustomEvent) => {
      const newState = event.detail as WalletState;
      setWalletState(newState);
    };

    window.addEventListener(
      WALLET_STATE_CHANGE_EVENT,
      handleWalletStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        WALLET_STATE_CHANGE_EVENT,
        handleWalletStateChange as EventListener
      );
    };
  }, []);

  // Auto-reconnect on page load if wallet was previously connected
  useEffect(() => {
    const autoReconnect = async () => {
      const savedState = localStorage.getItem("keplr-wallet-state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.isConnected && window.keplr) {
          try {
            const connectingState = {
              ...globalWalletState,
              isConnecting: true,
            };
            broadcastWalletStateChange(connectingState);

            // Suggest chain terlebih dahulu
            await suggestChainToKeplr();

            await window.keplr.enable(CHAIN_ID);
            const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);

            // ✅ Get fresh address from Keplr
            const accounts = await offlineSigner.getAccounts();
            const freshAddress = accounts[0].address;

            // Use custom registry
            const customRegistry = createCustomRegistry();
            const client = await SigningStargateClient.connectWithSigner(
              RPC_ENDPOINT,
              offlineSigner,
              {
                registry: customRegistry,
              }
            );

            const connectedState = {
              isConnected: true,
              address: freshAddress, // ✅ Use fresh address from Keplr
              client,
              isConnecting: false,
            };

            // ✅ Update localStorage with fresh address
            localStorage.setItem(
              "keplr-wallet-state",
              JSON.stringify({
                isConnected: true,
                address: freshAddress,
              })
            );

            broadcastWalletStateChange(connectedState);
          } catch (error) {
            console.error("Auto-reconnect failed:", error);
            localStorage.removeItem("keplr-wallet-state");
            const disconnectedState = {
              isConnected: false,
              address: null,
              client: null,
              isConnecting: false,
            };
            broadcastWalletStateChange(disconnectedState);
          }
        }
      }
    };

    autoReconnect();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.keplr) {
        throw new Error(
          "Keplr extension not found. Please install Keplr extension."
        );
      }

      const connectingState = {
        ...globalWalletState,
        isConnecting: true,
      };
      broadcastWalletStateChange(connectingState);

      // Suggest chain ke Keplr terlebih dahulu
      await suggestChainToKeplr();

      // Enable chain
      await window.keplr.enable(CHAIN_ID);

      // Get offline signer
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);

      // Use custom registry
      const customRegistry = createCustomRegistry();
      const client = await SigningStargateClient.connectWithSigner(
        RPC_ENDPOINT,
        offlineSigner,
        {
          registry: customRegistry,
        }
      );

      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;

      const newState = {
        isConnected: true,
        address,
        client,
        isConnecting: false,
      };

      // Save to localStorage
      localStorage.setItem(
        "keplr-wallet-state",
        JSON.stringify({
          isConnected: true,
          address,
        })
      );

      broadcastWalletStateChange(newState);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      const errorState = {
        ...globalWalletState,
        isConnecting: false,
      };
      broadcastWalletStateChange(errorState);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    const disconnectedState = {
      isConnected: false,
      address: null,
      client: null,
      isConnecting: false,
    };

    // Remove from localStorage
    localStorage.removeItem("keplr-wallet-state");

    // Broadcast perubahan state
    broadcastWalletStateChange(disconnectedState);
  }, []);

  const getShortAddress = useCallback((address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }, []);

  const getAccount = useCallback(async () => {
    if (!window.keplr) return null;

    try {
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      return accounts[0];
    } catch (error) {
      console.error("Failed to get account:", error);
      return null;
    }
  }, []);

  const getAllBalances = useCallback(async () => {
    if (!walletState.client || !walletState.address) return [];

    try {
      const balances = await walletState.client.getAllBalances(
        walletState.address
      );
      return balances;
    } catch (error) {
      console.error("Failed to get all balances:", error);
      return [];
    }
  }, [walletState.client, walletState.address]);

  // Fungsi untuk mendapatkan balance spesifik denom
  const getBalance = useCallback(
    async (denom: string) => {
      if (!walletState.client || !walletState.address) return null;

      try {
        const balance = await walletState.client.getBalance(
          walletState.address,
          denom
        );
        return balance;
      } catch (error) {
        console.error(`Failed to get balance for ${denom}:`, error);
        return null;
      }
    },
    [walletState.client, walletState.address]
  );

  // Fungsi untuk check apakah Keplr tersedia
  const isKeplrAvailable = useCallback(() => {
    return !!window.keplr;
  }, []);

  // Fungsi untuk refresh connection
  const refreshConnection = useCallback(async () => {
    if (walletState.isConnected && walletState.address) {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Failed to refresh connection:", error);
        disconnectWallet();
      }
    }
  }, [
    walletState.isConnected,
    walletState.address,
    connectWallet,
    disconnectWallet,
  ]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    getShortAddress,
    getAccount,
    getAllBalances,
    getBalance,
    isKeplrAvailable,
    refreshConnection,
    chainConfig: CHAIN_CONFIG,
  };
};

// Define the type URL manually
const MSG_MINT_PHOTON_TYPE_URL = "/atomone.photon.v1.MsgMintPhoton";
