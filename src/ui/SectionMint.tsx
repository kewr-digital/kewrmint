import { useState, useEffect } from "react";
import { useKeplrWallet } from "../hooks/useKeplrWallet";
import { setupBankExtension } from "@cosmjs/stargate";
import ModalTxSuccess from "../components/ModalTxSuccess";
import LogoAtone from "../assets/atomone-logo.png";
import LogoPhoton from "../assets/photon-logo.png";
const MSG_MINT_PHOTON_TYPE_URL = "/atomone.photon.v1.MsgMintPhoton";

function SectionMint() {
  const { isConnected, address, client } = useKeplrWallet();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mintedAmount, setMintedAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);
  const [atoneSupply, setAtoneSupply] = useState(0);
  const [photonSupply, setPhotonSupply] = useState(0);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const PHOTON_MAX_SUPPLY = 1_000_000_000;
  const photonAmount =
    amount && conversionRate > 0
      ? (parseFloat(amount) * conversionRate).toFixed(6)
      : "0";

  const fetchUserBalance = async () => {
    if (!client || !address) return;

    try {
      setIsLoadingBalance(true);
      const balance = await client.getBalance(address, "uatone");
      const balanceInAtone = parseFloat(balance.amount) / 1_000_000;
      setUserBalance(balanceInAtone);
    } catch (err) {
      setUserBalance(0);
      setError("Failed to fetch balance. Please try again.");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTotalSupply = async () => {
    if (!client) return;

    try {
      setIsLoadingRate(true);
      const queryClient = client.forceGetQueryClient();
      const bankExtension = setupBankExtension(queryClient);

      const atoneSupplyResult = await bankExtension.bank.supplyOf("uatone");
      const photonSupplyResult = await bankExtension.bank.supplyOf("uphoton");

      const currentAtoneSupply =
        parseFloat(atoneSupplyResult.amount) / 1_000_000;
      const currentPhotonSupply =
        parseFloat(photonSupplyResult.amount) / 1_000_000;

      const rate =
        (PHOTON_MAX_SUPPLY - currentPhotonSupply) / currentAtoneSupply;

      setAtoneSupply(currentAtoneSupply);
      setPhotonSupply(currentPhotonSupply);
      setConversionRate(rate);
    } catch (err) {
      setAtoneSupply(500_000_000);
      setPhotonSupply(100_000_000);
      setConversionRate((PHOTON_MAX_SUPPLY - 100_000_000) / 500_000_000);
      setError("Failed to fetch supply data. Using fallback values.");
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    if (isConnected && client && address) {
      fetchTotalSupply();
      fetchUserBalance();
    }
  }, [isConnected, client, address]);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSuccess("");
    setTxHash("");
    setMintedAmount("");
  };

  // Handle mint transaction
  const handleMint = async () => {
    // Enhanced validation
    if (!isConnected) {
      setError("Wallet is not connected. Please connect your wallet first.");
      return;
    }

    if (!address || address.trim() === "" || address === null) {
      setError(
        "Wallet address is empty. Please disconnect and reconnect your wallet."
      );
      return;
    }

    if (!client) {
      setError("Wallet client is not available. Please reconnect your wallet.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    // Validate address format
    if (!address.startsWith("atone")) {
      setError(
        `Invalid address format: ${address}. Expected address starting with 'atone'.`
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Capture and validate address immediately before transaction
      const currentAddress = address?.trim();

      // Final address validation
      if (
        !currentAddress ||
        currentAddress === "" ||
        !currentAddress.startsWith("atone")
      ) {
        throw new Error(
          `Invalid address at transaction time: '${currentAddress}' (type: ${typeof address})`
        );
      }

      const mintMsg = {
        typeUrl: MSG_MINT_PHOTON_TYPE_URL,
        value: {
          to_address: currentAddress,
          amount: {
            denom: "uatone",
            amount: Math.floor(parseFloat(amount) * 1_000_000).toString(),
          },
        },
      };

      const fee = {
        amount: [{ denom: "uatone", amount: "10000" }],
        gas: "250000",
      };

      const memo = "Mint Photon with KewrMint";

      if (!mintMsg.value.to_address || mintMsg.value.to_address === "") {
        throw new Error(
          `to_address is empty in final message: ${JSON.stringify(mintMsg)}`
        );
      }

      // Sign and broadcast the transaction
      const result = await client.signAndBroadcast(
        currentAddress, // Use captured address
        [mintMsg],
        fee,
        memo
      );

      if (result.code === 0) {
        // Langsung gunakan photonAmount yang sudah dihitung dengan benar
        // Tidak perlu parsing event yang rumit
        const finalMintedAmount = photonAmount;

        // Debug logging untuk memastikan nilai yang benar
        console.log("Calculated photonAmount:", photonAmount);
        console.log("Amount input:", amount);
        console.log("Conversion rate:", conversionRate);

        // Show modal dengan nilai yang benar
        setMintedAmount(finalMintedAmount);
        setTxHash(result.transactionHash);
        setShowSuccessModal(true);
        setAmount("");
        await fetchUserBalance();
        await fetchTotalSupply();
      } else {
        setError(`Transaction failed: ${result.rawLog}`);
      }
    } catch (error: any) {
      if (error.message.includes("account sequence mismatch")) {
        setError(
          "Transaction failed: Account sequence mismatch. Please try again."
        );
      } else if (error.message.includes("insufficient funds")) {
        setError(
          "Transaction failed: Insufficient funds for fee or mint amount."
        );
      } else {
        setError(`Minting failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle max button click
  const handleMaxClick = async () => {
    if (!client || !address) return;

    try {
      const balance = await client.getBalance(address, "uatone");
      const maxAmount = (parseFloat(balance.amount) / 1_000_000 - 0.01).toFixed(
        6
      ); // Reserve for fees
      setAmount(maxAmount);
      setUserBalance(parseFloat(maxAmount));
    } catch (err) {
      setError("Failed to fetch balance. Please try again.");
      setAmount("100"); // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Mint <span className="text-cyan-400">$PHOTON</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Convert your ATONE to PHOTON
          </p>
        </div>

        {/* Wallet Connection Notice */}
        {!isConnected && (
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-medium text-yellow-400">
                  Wallet Not Connected
                </h3>
                <p className="text-xs text-yellow-300">
                  Please connect your wallet using the "Connect Wallet" button
                  in the navigation bar above.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Balance Card */}
        {isConnected && (
          <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-4 mb-4 border border-gray-700">
            <div className="text-center">
              <div className="text-xs text-gray-300 mb-1">
                Your ATONE Balance
              </div>
              <div className="text-xl font-bold text-cyan-400">
                {isLoadingBalance
                  ? "Loading..."
                  : `${userBalance.toFixed(6)} ATONE`}
              </div>
              <div className="text-xs text-gray-400">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ""}
              </div>
            </div>
          </div>
        )}

        {/* Main Mint Card */}
        <div className="bg-gray-800 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl mb-4">
          <div className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Burn ATONE
              </label>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
                      <img src={LogoAtone} />
                    </div>
                    <span className="text-white font-semibold text-sm">
                      ATONE
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isConnected && (
                      <span className="text-gray-400 text-xs">
                        Balance: {userBalance.toFixed(2)}
                      </span>
                    )}
                    <button
                      onClick={handleMaxClick}
                      className="text-cyan-400 hover:text-cyan-300 text-xs font-medium"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-lg text-white placeholder-gray-500 border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  step="0.000001"
                  min="0"
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="bg-cyan-600 rounded-full p-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Mint PHOTON
              </label>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <img src={LogoPhoton} />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    PHOTON
                  </span>
                </div>
                <div className="text-lg text-white">{photonAmount}</div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3">
                <p className="text-green-300 text-xs">{success}</p>
              </div>
            )}

            {/* Transaction Hash Link */}
            {txHash && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3">
                <p className="text-green-300 text-xs">
                  Transaction successful!
                  <a
                    href={`https://www.mintscan.io/atomone/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline ml-1"
                  >
                    View on Explorer
                  </a>
                </p>
              </div>
            )}

            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={
                !isConnected ||
                isLoading ||
                !amount ||
                parseFloat(amount) <= 0 ||
                conversionRate <= 0
              }
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm">Minting PHOTON...</span>
                </div>
              ) : (
                <span className="text-sm">Mint PHOTON</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <ModalTxSuccess
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        mintedAmount={mintedAmount}
        transactionHash={txHash}
      />
      ;
    </div>
  );
}

export default SectionMint;
