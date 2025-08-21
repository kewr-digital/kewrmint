import { useState, useEffect } from "react";
import { Comet38Client } from "@cosmjs/tendermint-rpc";
import { toHex } from "@cosmjs/encoding";
import { sha256 } from "@cosmjs/crypto";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { Link } from "react-router";
import photonLogo from "../assets/photon-logo.png";

interface ChainInfo {
  chainId: string;
  latestBlockHeight: number;
  totalSupply: string;
  bondedTokens: string;
}

interface TransactionMessage {
  type: string;
  value: {
    addresses?: string[];
    amounts?: string[];
    size?: number;
    readableStrings?: string[];
    detectedTypes?: string[];
  };
}

interface TransactionInfo {
  hash: string;
  height: number;
  index: number;
  messages: TransactionMessage[];
  fee: {
    amount: string;
    denom: string;
  };
  gasUsed: string;
  gasWanted: string;
  timestamp: string;
  success: boolean;
}

function SectionExplorer() {
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [allTransactions, setAllTransactions] = useState<TransactionInfo[]>([]);

  const RPC_ENDPOINT = "https://rpc-atomone.22node.xyz";

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(id);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);

      const client = await Comet38Client.connect(RPC_ENDPOINT);
      const status = await client.status();
      const chainId = status.nodeInfo.network;
      const height = status.syncInfo.latestBlockHeight;

      try {
        await client.validators({ height: height });
      } catch (validatorError) {
        // Validators info not critical for main functionality
      }

      await fetchRecentTransactions(client, parseInt(height.toString()));

      setChainInfo({
        chainId,
        latestBlockHeight: parseInt(height.toString()),
        totalSupply: "N/A",
        bondedTokens: "N/A",
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const decodeTransactionData = async (txBytes: Uint8Array) => {
    try {
      const decodedTx = decodeTxRaw(txBytes);
      const detectedMessageTypes: string[] = [];
      const amounts: string[] = [];
      const addresses: string[] = [];

      decodedTx.body.messages.forEach((msg: unknown) => {
        const message = msg as {
          typeUrl?: string;
          value?: {
            amount?: unknown;
            from_address?: string;
            to_address?: string;
            fromAddress?: string;
            toAddress?: string;
            delegatorAddress?: string;
            validatorAddress?: string;
            sender?: string;
            receiver?: string;
            token?: {
              amount?: string;
              denom?: string;
            };
          };
        };

        const typeUrl = message.typeUrl || "Unknown";
        detectedMessageTypes.push(typeUrl);

        if (typeUrl === "/cosmos.bank.v1beta1.MsgSend") {
          // Extract amounts
          const amountData = message.value?.amount;
          if (Array.isArray(amountData)) {
            amountData.forEach((coin: unknown) => {
              const coinData = coin as { amount?: string; denom?: string };
              if (coinData?.amount && coinData?.denom) {
                amounts.push(`${coinData.amount}${coinData.denom}`);
              }
            });
          }

          // Extract addresses
          if (message.value?.from_address)
            addresses.push(message.value.from_address);
          if (message.value?.to_address)
            addresses.push(message.value.to_address);
          if (message.value?.fromAddress)
            addresses.push(message.value.fromAddress);
          if (message.value?.toAddress) addresses.push(message.value.toAddress);
        } else if (
          typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" ||
          typeUrl === "/cosmos.staking.v1beta1.MsgUndelegate"
        ) {
          const amountData = message.value?.amount as
            | {
                amount?: string;
                denom?: string;
              }
            | undefined;
          if (amountData?.amount && amountData?.denom) {
            amounts.push(`${amountData.amount}${amountData.denom}`);
          }
          if (message.value?.delegatorAddress) {
            addresses.push(message.value.delegatorAddress);
          }
          if (message.value?.validatorAddress) {
            addresses.push(message.value.validatorAddress);
          }
        } else if (typeUrl === "/ibc.applications.transfer.v1.MsgTransfer") {
          if (message.value?.token?.amount && message.value?.token?.denom) {
            amounts.push(
              `${message.value.token.amount}${message.value.token.denom}`
            );
          }
          if (message.value?.sender) addresses.push(message.value.sender);
          if (message.value?.receiver) addresses.push(message.value.receiver);
        }
      });

      return {
        detectedMessageTypes,
        amounts,
        addresses,
        success: true,
      };
    } catch (error) {
      console.error("Error decoding transaction:", error);
      return {
        detectedMessageTypes: ["Unknown"],
        amounts: [],
        addresses: [],
        success: false,
      };
    }
  };

  const fetchRecentTransactions = async (
    client: Comet38Client,
    currentHeight: number
  ) => {
    try {
      const recentTxs: TransactionInfo[] = [];

      for (let i = 0; i < 10 && recentTxs.length < 10; i++) {
        const blockHeight = currentHeight - i;
        if (blockHeight <= 0) break;

        try {
          const block = await client.block(blockHeight);

          for (
            let txIndex = 0;
            txIndex < block.block.txs.length && recentTxs.length < 10;
            txIndex++
          ) {
            const tx = block.block.txs[txIndex];
            const txHash = toHex(sha256(tx)).toUpperCase();

            try {
              const txResult = await client.tx({ hash: sha256(tx) });
              const decodedTx = await decodeTransactionData(tx);

              let feeAmount = "0";
              let feeDenom = "uatone";

              if (txResult.result.events) {
                for (const event of txResult.result.events) {
                  if (event.type === "tx" && event.attributes) {
                    for (const attr of event.attributes) {
                      if (attr.key === "fee") {
                        const feeStr = attr.value || "";
                        const feeMatch = feeStr.match(/(\d+)(\w+)/);
                        if (feeMatch) {
                          feeAmount = feeMatch[1];
                          feeDenom = feeMatch[2];
                        }
                      }
                    }
                  }
                }
              }

              const txInfo: TransactionInfo = {
                hash: txHash,
                height: blockHeight,
                index: txIndex,
                messages: [],
                fee: {
                  amount: feeAmount,
                  denom: feeDenom,
                },
                gasUsed: txResult.result.gasUsed?.toString() || "0",
                gasWanted: txResult.result.gasWanted?.toString() || "0",
                timestamp: block.block.header.time.toISOString(),
                success: txResult.result.code === 0,
              };

              const messages: TransactionMessage[] = [];

              if (decodedTx.detectedMessageTypes) {
                for (const msgType of decodedTx.detectedMessageTypes) {
                  messages.push({
                    type: msgType,
                    value: {
                      addresses: decodedTx.addresses || [],
                      amounts: decodedTx.amounts || [],
                    },
                  });
                }
              } else {
                messages.push({
                  type: "Unknown Transaction",
                  value: {
                    addresses: decodedTx.addresses || [],
                    amounts: decodedTx.amounts || [],
                  },
                });
              }

              txInfo.messages = messages;

              recentTxs.push(txInfo);
            } catch (txError) {
              const decodedTx = await decodeTransactionData(tx);
              const basicTxInfo: TransactionInfo = {
                hash: txHash,
                height: blockHeight,
                index: txIndex,
                messages: [
                  {
                    type: "Decoded Transaction",
                    value: {
                      detectedTypes: decodedTx.detectedMessageTypes || [],
                      addresses: decodedTx.addresses || [],
                      amounts: decodedTx.amounts || [],
                    },
                  },
                ],
                fee: { amount: "0", denom: "uatone" },
                gasUsed: "0",
                gasWanted: "0",
                timestamp: block.block.header.time.toISOString(),
                success: true,
              };

              recentTxs.push(basicTxInfo);
            }
          }
        } catch (blockError) {
          // Block fetch error - continue to next block
        }
      }

      // Merge new transactions with existing ones, avoiding duplicates
      setAllTransactions((prevTxs) => {
        const existingHashes = new Set(prevTxs.map((tx) => tx.hash));
        const newTxs = recentTxs.filter((tx) => !existingHashes.has(tx.hash));

        // Combine and sort by height (newest first)
        const combined = [...newTxs, ...prevTxs]
          .sort((a, b) => b.height - a.height || b.index - a.index)
          .slice(0, 100); // Keep only latest 100 transactions

        return combined;
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const formatHash = (hash: string) => {
    if (!hash || hash.length < 8) return hash;
    return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  };

  const formatAmount = (amount: string, denom?: string) => {
    if (!denom) {
      const match = amount.match(/(\d+)(u?\w+)/);
      if (match) {
        const num = parseInt(match[1]);
        const denomination = match[2];
        if (denomination.startsWith("u")) {
          return `${(num / 1_000_000).toFixed(6)} ${denomination
            .slice(1)
            .toUpperCase()}`;
        }
        return `${num.toLocaleString()} ${denomination.toUpperCase()}`;
      }
      return amount;
    }

    const num = parseInt(amount) / 1_000_000;
    return `${num.toFixed(6)} ${denom.replace("u", "").toUpperCase()}`;
  };

  const formatAmountWithIcon = (amount: string, denom?: string) => {
    if (!denom) {
      const match = amount.match(/(\d+)(u?\w+)/);
      if (match) {
        const num = parseInt(match[1]);
        const denomination = match[2];
        if (denomination.startsWith("u")) {
          const cleanDenom = denomination.slice(1).toUpperCase();
          const formattedAmount = (num / 1_000_000).toFixed(6);

          if (cleanDenom === "PHOTON") {
            return (
              <div className="flex items-center gap-1">
                <span>{formattedAmount}</span>
                <img src={photonLogo} alt="PHOTON" className="w-4 h-4" />
              </div>
            );
          }
          return `${formattedAmount} ${cleanDenom}`;
        }
        return `${num.toLocaleString()} ${denomination.toUpperCase()}`;
      }
      return amount;
    }

    const num = parseInt(amount) / 1_000_000;
    const cleanDenom = denom.replace("u", "").toUpperCase();
    const formattedAmount = num.toFixed(6);

    if (cleanDenom === "PHOTON") {
      return (
        <div className="flex items-center gap-1">
          <span>{formattedAmount}</span>
          <img src={photonLogo} alt="PHOTON" className="w-4 h-4" />
        </div>
      );
    }
    return `${formattedAmount} ${cleanDenom}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AtomOne <span className="text-cyan-400">Explorer</span>
          </h1>
          <p className="text-xl text-cyan-400 max-w-2xl mx-auto">
            Real-time blockchain data from 22Node infrastructure
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Chain Info Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Chain Information
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-cyan-400 text-sm mb-1">Chain ID</div>
                <div className="text-white font-mono text-lg">
                  {chainInfo?.chainId || "Loading..."}
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-cyan-400 text-sm mb-1">Latest Height</div>
                <div className="text-white font-mono text-lg font-bold">
                  {chainInfo?.latestBlockHeight?.toLocaleString() ||
                    "Loading..."}
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-cyan-400 text-sm mb-1">RPC Endpoint</div>
                <div className="text-white font-mono text-lg">22node.xyz</div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-cyan-400 text-sm mb-1">Status</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    loading
                      ? "bg-yellow-500/20 text-yellow-400"
                      : error
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {loading ? "Syncing" : error ? "Error" : "Active"}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Recent Transactions
              </h2>
              <div className="text-cyan-400 text-sm">
                {allTransactions.length} transactions found
              </div>
            </div>

            {(() => {
              // Pagination logic
              const indexOfLastTransaction = currentPage * transactionsPerPage;
              const indexOfFirstTransaction =
                indexOfLastTransaction - transactionsPerPage;
              const currentTransactions = allTransactions.slice(
                indexOfFirstTransaction,
                indexOfLastTransaction
              );
              const totalPages = Math.ceil(
                allTransactions.length / transactionsPerPage
              );

              const handlePageChange = (pageNumber: number) => {
                setCurrentPage(pageNumber);
              };

              const handlePrevPage = () => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              };

              const handleNextPage = () => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              };

              return (
                <>
                  {currentTransactions.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Hash
                              </th>
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Height
                              </th>
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Type
                              </th>
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Amount
                              </th>
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Fee
                              </th>
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Time
                              </th>
                              <th className="text-left py-3 px-4 text-cyan-400 font-medium">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentTransactions.map((tx, index) => (
                              <tr
                                key={`${tx.hash}-${index}`}
                                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Link
                                      to={`/tx/${tx.hash}`}
                                      className="text-white font-mono text-sm hover:text-white transition-colors"
                                    >
                                      {formatHash(tx.hash)}
                                    </Link>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        copyToClipboard(tx.hash, tx.hash);
                                      }}
                                      className="text-cyan-400 hover:text-white transition-colors"
                                      title="Copy hash"
                                    >
                                      {copiedHash === tx.hash ? (
                                        <span className="text-white text-xs">
                                          ✓
                                        </span>
                                      ) : (
                                        <span className="text-xs">📋</span>
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-white font-mono">
                                    {tx.height.toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="space-y-1">
                                    {tx.messages.map((msg, msgIndex) => (
                                      <div
                                        key={msgIndex}
                                        className="bg-slate-700 rounded px-2 py-1 text-xs text-white"
                                      >
                                        {msg.type}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="space-y-1">
                                    {tx.messages.map((msg, msgIndex) => (
                                      <div key={msgIndex} className="text-sm">
                                        {msg.value.amounts &&
                                        msg.value.amounts.length > 0 ? (
                                          msg.value.amounts
                                            .filter((amount) => {
                                              const match =
                                                amount.match(/(\d+)(u?\w+)/);
                                              if (match) {
                                                const denomination = match[2];
                                                const cleanDenom =
                                                  denomination.startsWith("u")
                                                    ? denomination
                                                        .slice(1)
                                                        .toUpperCase()
                                                    : denomination.toUpperCase();
                                                return cleanDenom !== "PHOTON";
                                              }
                                              return true;
                                            })
                                            .map((amount, amountIndex) => (
                                              <div
                                                key={amountIndex}
                                                className="text-white"
                                              >
                                                {formatAmount(amount)}
                                              </div>
                                            ))
                                        ) : (
                                          <span className="text-cyan-400">
                                            -
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-white text-sm">
                                    {formatAmountWithIcon(
                                      tx.fee.amount,
                                      tx.fee.denom
                                    )}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-white text-sm">
                                    {formatTime(tx.timestamp)}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      tx.success
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                    }`}
                                  >
                                    {tx.success ? "Success" : "Failed"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                          {/* Page Info */}
                          <div className="text-cyan-400 text-sm">
                            Showing {indexOfFirstTransaction + 1}-
                            {Math.min(
                              indexOfLastTransaction,
                              allTransactions.length
                            )}{" "}
                            of {allTransactions.length} transactions
                          </div>

                          {/* Pagination Buttons */}
                          <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
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
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              <span className="hidden sm:inline">Previous</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-1">
                              {(() => {
                                const maxVisiblePages = 5;
                                let startPage = Math.max(
                                  1,
                                  currentPage - Math.floor(maxVisiblePages / 2)
                                );
                                let endPage = Math.min(
                                  totalPages,
                                  startPage + maxVisiblePages - 1
                                );

                                if (endPage - startPage + 1 < maxVisiblePages) {
                                  startPage = Math.max(
                                    1,
                                    endPage - maxVisiblePages + 1
                                  );
                                }

                                const pages = [];

                                // First page
                                if (startPage > 1) {
                                  pages.push(
                                    <button
                                      key={1}
                                      onClick={() => handlePageChange(1)}
                                      className="w-10 h-10 rounded-lg transition-all duration-200 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105"
                                    >
                                      1
                                    </button>
                                  );
                                  if (startPage > 2) {
                                    pages.push(
                                      <span
                                        key="ellipsis1"
                                        className="px-2 text-slate-400"
                                      >
                                        ...
                                      </span>
                                    );
                                  }
                                }

                                // Visible pages
                                for (let i = startPage; i <= endPage; i++) {
                                  pages.push(
                                    <button
                                      key={i}
                                      onClick={() => handlePageChange(i)}
                                      className={`w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105 ${
                                        currentPage === i
                                          ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                      }`}
                                    >
                                      {i}
                                    </button>
                                  );
                                }

                                // Last page
                                if (endPage < totalPages) {
                                  if (endPage < totalPages - 1) {
                                    pages.push(
                                      <span
                                        key="ellipsis2"
                                        className="px-2 text-slate-400"
                                      >
                                        ...
                                      </span>
                                    );
                                  }
                                  pages.push(
                                    <button
                                      key={totalPages}
                                      onClick={() =>
                                        handlePageChange(totalPages)
                                      }
                                      className="w-10 h-10 rounded-lg transition-all duration-200 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105"
                                    >
                                      {totalPages}
                                    </button>
                                  );
                                }

                                return pages;
                              })()}
                            </div>

                            {/* Next Button */}
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                            >
                              <span className="hidden sm:inline">Next</span>
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
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-cyan-400 text-lg mb-2">
                        {loading
                          ? "Loading transactions..."
                          : "No transactions found"}
                      </div>
                      {loading && (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionExplorer;
