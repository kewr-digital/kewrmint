import { useState } from "react";
import {
  LanguageIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

function SectionDocs() {
  const [language, setLanguage] = useState<"id" | "en">("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  };

  const content = {
    id: {
      title: "Dokumentasi Kewrmint",
      subtitle: "Aplikasi untuk minting token $PHOTON",
      atomOneTitle: "Apa itu AtomOne?",
      atomOneDesc:
        "AtomOne adalah blockchain yang digerakkan oleh komunitas dengan tata kelola konstitusional yang dirancang untuk memprioritaskan keamanan, desentralisasi, dan inovasi dalam ekosistem Cosmos. Sebagai fork minimal dari Cosmos Hub, AtomOne mendukung IBC dan ICS untuk solusi interchain yang scalable.",
      photonTitle: "Apa itu Photon?",
      photonDesc:
        "PHOTON adalah token fee eksklusif untuk transaksi di semua shard, biaya IBC, dan pembayaran ICS/VaaS, sementara ATONE menggerakkan governance dan staking. PHOTON diperkenalkan dengan upgrade AtomOne v2.",
      techStackTitle: "Tech Stack",
      functionsTitle: "Fungsi-fungsi Utama",
      structureTitle: "Struktur Aplikasi",
    },
    en: {
      title: "Kewrmint Documentation",
      subtitle: "Application for minting $PHOTON tokens",
      atomOneTitle: "What is AtomOne?",
      atomOneDesc:
        "AtomOne is a community-driven blockchain with constitutional governance designed to prioritize security, decentralization, and innovation in the Cosmos ecosystem. As a minimal fork of Cosmos Hub, AtomOne supports IBC and ICS for scalable interchain solutions.",
      photonTitle: "What is Photon?",
      photonDesc:
        "PHOTON is the exclusive fee token for transactions across all shards, IBC fees, and ICS/VaaS payments, while ATONE powers governance and staking. PHOTON was introduced with the AtomOne v2 upgrade.",
      techStackTitle: "Tech Stack",
      functionsTitle: "Main Functions",
      structureTitle: "Application Structure",
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Language Toggle */}
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors duration-200"
              title={
                language === "id"
                  ? "Switch to English"
                  : "Ganti ke Bahasa Indonesia"
              }
            >
              <LanguageIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {language === "id" ? "EN" : "ID"}
              </span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {content[language].title}
          </h1>
          <p className="text-xl text-gray-300">{content[language].subtitle}</p>
        </div>

        {/* Apa itu AtomOne */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            {content[language].atomOneTitle}
          </h2>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <p className="text-gray-300 mb-4">
              {content[language].atomOneDesc}
            </p>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-cyan-400">
                {language === "id"
                  ? "Inovasi Utama AtomOne:"
                  : "AtomOne Key Innovations:"}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <BuildingLibraryIcon className="h-5 w-5 text-cyan-400" />
                    {language === "id"
                      ? "Governance & Decision-Making"
                      : "Governance & Decision-Making"}
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {language === "id" ? (
                      <>
                        <li>• Konstitusi on-chain yang hidup</li>
                        <li>• Jaringan DAO untuk transparansi</li>
                        <li>• Voting power terdesentralisasi</li>
                        <li>• Steering dan Oversight DAOs</li>
                      </>
                    ) : (
                      <>
                        <li>• Living on-chain constitution</li>
                        <li>• DAO network for transparency</li>
                        <li>• Decentralized voting power</li>
                        <li>• Steering and Oversight DAOs</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-cyan-400" />
                    {language === "id" ? "Economic Model" : "Economic Model"}
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {language === "id" ? (
                      <>
                        <li>• Dual-Token Model (ATONE + PHOTON)</li>
                        <li>• ATONE untuk staking & governance</li>
                        <li>• PHOTON untuk transaction fees</li>
                        <li>• Dynamic Treasury Management</li>
                      </>
                    ) : (
                      <>
                        <li>• Dual-Token Model (ATONE + PHOTON)</li>
                        <li>• ATONE for staking & governance</li>
                        <li>• PHOTON for transaction fees</li>
                        <li>• Dynamic Treasury Management</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-cyan-400" />
                    {language === "id"
                      ? "Security & Scalability"
                      : "Security & Scalability"}
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {language === "id" ? (
                      <>
                        <li>• Scalable dan minimal design</li>
                        <li>• Enhanced Interchain Security (ICS)</li>
                        <li>• Improved delegation system</li>
                        <li>• Hub minimalism untuk optimasi</li>
                      </>
                    ) : (
                      <>
                        <li>• Scalable and minimal design</li>
                        <li>• Enhanced Interchain Security (ICS)</li>
                        <li>• Improved delegation system</li>
                        <li>• Hub minimalism for optimization</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                    {language === "id"
                      ? "Interchain Features"
                      : "Interchain Features"}
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• IBC (Inter-Blockchain Communication)</li>
                    <li>• ICS (Interchain Security)</li>
                    {language === "id" ? (
                      <>
                        <li>• Containerized shard deployment</li>
                        <li>• Cross-zone governance</li>
                      </>
                    ) : (
                      <>
                        <li>• Containerized shard deployment</li>
                        <li>• Cross-zone governance</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-md">
              <p className="text-blue-300 text-sm">
                <strong>{language === "id" ? "Sumber:" : "Source:"}</strong>{" "}
                {language === "id"
                  ? "Informasi resmi dari"
                  : "Official information from"}{" "}
                <a
                  href="https://atom.one/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  atom.one
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Apa itu Photon */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            {content[language].photonTitle}
          </h2>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <p className="text-gray-300 mb-4">{content[language].photonDesc}</p>

            <div className="mb-4">
              <h4 className="font-semibold mb-3 text-cyan-400">
                {language === "id"
                  ? "Karakteristik PHOTON:"
                  : "PHOTON Characteristics:"}
              </h4>
              <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
                <ul className="text-sm text-gray-300 space-y-2">
                  {language === "id" ? (
                    <>
                      <li>
                        •{" "}
                        <strong className="text-white">Minting Process:</strong>{" "}
                        PHOTON hanya bisa di-mint dengan membakar ATONE
                      </li>
                      <li>
                        • <strong className="text-white">Irreversible:</strong>{" "}
                        Proses minting bersifat irreversible (tidak dapat
                        dibalik)
                      </li>
                      <li>
                        • <strong className="text-white">Supply Impact:</strong>{" "}
                        Minting PHOTON mengurangi circulating supply ATONE
                      </li>
                      <li>
                        •{" "}
                        <strong className="text-white">Maximum Supply:</strong>{" "}
                        Maksimal 1 miliar PHOTON dapat dibuat
                      </li>
                      <li>
                        • <strong className="text-white">Fee Token:</strong>{" "}
                        Token fee eksklusif untuk semua transaksi blockchain
                      </li>
                      <li>
                        • <strong className="text-white">IBC & ICS:</strong>{" "}
                        Digunakan untuk pembayaran Inter-Blockchain
                        Communication dan Interchain Security
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        •{" "}
                        <strong className="text-white">Minting Process:</strong>{" "}
                        PHOTON can only be minted by burning ATONE
                      </li>
                      <li>
                        • <strong className="text-white">Irreversible:</strong>{" "}
                        The minting process is irreversible
                      </li>
                      <li>
                        • <strong className="text-white">Supply Impact:</strong>{" "}
                        Minting PHOTON reduces ATONE circulating supply
                      </li>
                      <li>
                        •{" "}
                        <strong className="text-white">Maximum Supply:</strong>{" "}
                        Maximum of 1 billion PHOTON can be created
                      </li>
                      <li>
                        • <strong className="text-white">Fee Token:</strong>{" "}
                        Exclusive fee token for all blockchain transactions
                      </li>
                      <li>
                        • <strong className="text-white">IBC & ICS:</strong>{" "}
                        Used for Inter-Blockchain Communication and Interchain
                        Security payments
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
              <h4 className="font-semibold mb-2 text-cyan-400">
                {language === "id" ? "Parameter Photon:" : "Photon Parameters:"}
              </h4>
              <div className="bg-gray-800 rounded p-2 sm:p-3 overflow-x-auto">
                <code className="text-xs sm:text-sm text-gray-300 block whitespace-pre-wrap break-all">
                  {`interface Params {
  // Rate Conversion $ATONE to $PHOTON
  conversion_rate: string;
  // Maximum amount of $PHOTON that can be
  // minted (1 billion)
  max_mint_amount: string;
}`}
                </code>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-md">
              <p className="text-yellow-300 text-sm">
                <strong>{language === "id" ? "Catatan:" : "Note:"}</strong>{" "}
                {language === "id"
                  ? "Selama periode transisi AtomOne v2, baik ATONE maupun PHOTON dapat digunakan untuk membayar transaction fees. Proposal governance di masa depan akan diperlukan untuk menyelesaikan transisi sepenuhnya."
                  : "During the AtomOne v2 transition period, both ATONE and PHOTON can be used to pay transaction fees. Future governance proposals will be required to complete the transition fully."}
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-md">
              <p className="text-blue-300 text-sm">
                <strong>{language === "id" ? "Sumber:" : "Source:"}</strong>{" "}
                {language === "id"
                  ? "Informasi resmi dari"
                  : "Official information from"}{" "}
                <a
                  href="https://atom.one/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  atom.one
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            {content[language].techStackTitle}
          </h2>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-cyan-400">
                  {language === "id" ? "Frontend" : "Frontend"}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • <strong className="text-white">React 19.1.0</strong> - UI
                    Framework
                  </li>
                  <li>
                    • <strong className="text-white">TypeScript 5.8.3</strong> -
                    Type Safety
                  </li>
                  <li>
                    • <strong className="text-white">Vite 7.0.4</strong> - Build
                    Tool
                  </li>
                  <li>
                    • <strong className="text-white">TailwindCSS 4.1.11</strong>{" "}
                    - Styling
                  </li>
                  <li>
                    • <strong className="text-white">React Router 7.7.0</strong>{" "}
                    - Navigation
                  </li>
                  <li>
                    • <strong className="text-white">HeadlessUI 2.2.4</strong> -
                    UI Components
                  </li>
                  <li>
                    • <strong className="text-white">Heroicons 2.2.0</strong> -
                    Icons
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3 text-cyan-400">
                  {language === "id" ? "Blockchain" : "Blockchain"}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • <strong className="text-white">CosmJS 0.34.0</strong> -
                    Cosmos SDK Client
                  </li>
                  <li>
                    • <strong className="text-white">Keplr Wallet</strong> -
                    Wallet Integration
                  </li>
                  <li>
                    • <strong className="text-white">Protocol Buffers</strong> -
                    Message Serialization
                  </li>
                  <li>
                    • <strong className="text-white">gRPC</strong> -
                    Communication Protocol
                  </li>
                  <li>
                    • <strong className="text-white">ts-proto 2.7.5</strong> -
                    TypeScript Protobuf
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fungsi-fungsi Utama */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            {content[language].functionsTitle}
          </h2>

          {/* Wallet Connection */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              {language === "id"
                ? "1. Koneksi Wallet (useKeplrWallet)"
                : "1. Wallet Connection (useKeplrWallet)"}
            </h3>
            <p className="text-gray-300 mb-4">
              {language === "id"
                ? "Hook untuk mengelola koneksi dengan Keplr wallet dan membuat signing client."
                : "Hook for managing connection with Keplr wallet and creating signing client."}
            </p>
            <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {language === "id"
                  ? `const useKeplrWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    client: null,
    isConnecting: false,
  });

  const connectWallet = useCallback(async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    await window.keplr.experimentalSuggestChain(CHAIN_CONFIG);
    await window.keplr.enable(CHAIN_ID);
    
    const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    
    // Setup custom registry untuk MsgMintPhoton
    const registry = new Registry([
      ...defaultRegistryTypes,
      ["/atomone.photon.v1.MsgMintPhoton", MsgMintPhoton],
    ]);

    const client = await SigningStargateClient.connectWithSigner(
      RPC_ENDPOINT,
      offlineSigner,
      { registry }
    );
  });
};`
                  : `const useKeplrWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    client: null,
    isConnecting: false,
  });

  const connectWallet = useCallback(async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    await window.keplr.experimentalSuggestChain(CHAIN_CONFIG);
    await window.keplr.enable(CHAIN_ID);
    
    const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    
    // Setup custom registry for MsgMintPhoton
    const registry = new Registry([
      ...defaultRegistryTypes,
      ["/atomone.photon.v1.MsgMintPhoton", MsgMintPhoton],
    ]);

    const client = await SigningStargateClient.connectWithSigner(
      RPC_ENDPOINT,
      offlineSigner,
      { registry }
    );
  });
};`}
              </pre>
            </div>
          </div>

          {/* Mint Function */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              {language === "id"
                ? "2. Fungsi Minting Photon"
                : "2. Photon Minting Function"}
            </h3>
            <p className="text-gray-300 mb-4">
              {language === "id"
                ? "Fungsi untuk melakukan minting token Photon dengan membakar ATONE."
                : "Function for minting Photon tokens by burning ATONE."}
            </p>
            <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {`const handleMint = async () => {
  if (!client || !address) return;

  const amountInMicroAtone = Math.floor(parseFloat(amount) * 1_000_000);
  
  const msg = {
    typeUrl: MSG_MINT_PHOTON_TYPE_URL,
    value: {
      sender: address,
      amount: {
        denom: "uatone",
        amount: amountInMicroAtone.toString(),
      },
    },
  };

  const fee = {
    amount: [{ denom: "uatone", amount: "5000" }],
    gas: "200000",
  };

  const result = await client.signAndBroadcast(
    address,
    [msg],
    fee,
    "Minting Photon tokens"
  );
};`}
              </pre>
            </div>
          </div>

          {/* Data Fetching */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              {language === "id"
                ? "3. Pengambilan Data Blockchain"
                : "3. Blockchain Data Fetching"}
            </h3>
            <p className="text-gray-300 mb-4">
              {language === "id"
                ? "Fungsi untuk mengambil data seperti conversion rate, supply token, dan balance user."
                : "Functions for fetching data such as conversion rate, token supply, and user balance."}
            </p>
            <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {language === "id"
                  ? `// Mengambil conversion rate dari blockchain
const fetchConversionRate = async () => {
  const queryClient = client.forceGetQueryClient();
  const response = await queryClient.queryAbci({
    path: "/atomone.photon.v1.Query/Params",
    data: new Uint8Array(),
  });
  // Parse response untuk mendapatkan conversion_rate
};

// Mengambil balance user
const fetchUserBalance = async () => {
  if (!client || !address) return;
  
  const bankClient = setupBankExtension(client.forceGetQueryClient());
  const balance = await bankClient.bank.balance(address, "uatone");
  setUserBalance(parseInt(balance.amount) / 1_000_000);
};

// Mengambil total supply
const fetchSupply = async () => {
  const bankClient = setupBankExtension(client.forceGetQueryClient());
  const atoneSupply = await bankClient.bank.supplyOf("uatone");
  const photonSupply = await bankClient.bank.supplyOf("uphoton");
};`
                  : `// Fetch conversion rate from blockchain
const fetchConversionRate = async () => {
  const queryClient = client.forceGetQueryClient();
  const response = await queryClient.queryAbci({
    path: "/atomone.photon.v1.Query/Params",
    data: new Uint8Array(),
  });
  // Parse response to get conversion_rate
};

// Fetch user balance
const fetchUserBalance = async () => {
  if (!client || !address) return;
  
  const bankClient = setupBankExtension(client.forceGetQueryClient());
  const balance = await bankClient.bank.balance(address, "uatone");
  setUserBalance(parseInt(balance.amount) / 1_000_000);
};

// Fetch total supply
const fetchSupply = async () => {
  const bankClient = setupBankExtension(client.forceGetQueryClient());
  const atoneSupply = await bankClient.bank.supplyOf("uatone");
  const photonSupply = await bankClient.bank.supplyOf("uphoton");
};`}
              </pre>
            </div>
          </div>

          {/* Protocol Buffers */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              {language === "id"
                ? "4. Protocol Buffers Integration"
                : "4. Protocol Buffers Integration"}
            </h3>
            <p className="text-gray-300 mb-4">
              {language === "id"
                ? "Aplikasi menggunakan Protocol Buffers untuk komunikasi dengan blockchain AtomOne."
                : "The application uses Protocol Buffers for communication with the AtomOne blockchain."}
            </p>
            <div className="bg-gray-900 rounded-md p-4 border border-gray-600">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {language === "id"
                  ? `// Generated types dari protobuf
export interface MsgMintPhoton {
  sender: string;
  amount: Coin | undefined;
}

export interface MsgMintPhotonResponse {
  minted: Coin | undefined;
  conversion_rate: string;
}

// Message type URL untuk transaksi
const MSG_MINT_PHOTON_TYPE_URL = "/atomone.photon.v1.MsgMintPhoton";

// Protobuf definition
message MsgMintPhoton {
  option (cosmos.msg.v1.signer) = "sender";
  option (amino.name) = "atomone/photon/v1/MsgMintPhoton";
  
  string sender = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  cosmos.base.v1beta1.Coin amount = 2;
}`
                  : `// Generated types from protobuf
export interface MsgMintPhoton {
  sender: string;
  amount: Coin | undefined;
}

export interface MsgMintPhotonResponse {
  minted: Coin | undefined;
  conversion_rate: string;
}

// Message type URL for transactions
const MSG_MINT_PHOTON_TYPE_URL = "/atomone.photon.v1.MsgMintPhoton";

// Protobuf definition
message MsgMintPhoton {
  option (cosmos.msg.v1.signer) = "sender";
  option (amino.name) = "atomone/photon/v1/MsgMintPhoton";
  
  string sender = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  cosmos.base.v1beta1.Coin amount = 2;
}`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SectionDocs;
