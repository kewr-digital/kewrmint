import React from "react";

interface ModalTxSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  mintedAmount: string;
  transactionHash: string;
}

function ModalTxSuccess({
  isOpen,
  onClose,
  mintedAmount,
  transactionHash,
}: ModalTxSuccessProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: Add toast notification for copy success
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl transform transition-all duration-300 scale-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Mint Successful!
        </h2>

        {/* Success Message */}
        <div className="text-center mb-6">
          <p className="text-gray-300 text-sm mb-4">
            You have successfully minted
          </p>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-white font-semibold">PHOTON</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {mintedAmount}
            </div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="mb-6">
          <label className="text-xs font-medium text-gray-300 block mb-2">
            Transaction Hash
          </label>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-mono break-all">
                {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
              </span>
              <button
                onClick={() => copyToClipboard(transactionHash)}
                className="text-cyan-400 hover:text-cyan-300 ml-2 flex-shrink-0"
                title="Copy transaction hash"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <a
            href={`https://www.mintscan.io/atomone/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm"
          >
            View on Explorer
          </a>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTxSuccess;
