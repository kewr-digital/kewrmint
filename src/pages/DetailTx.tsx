import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Comet38Client } from "@cosmjs/tendermint-rpc";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import Navbar from "../components/Navbar";

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

interface TransactionDetail {
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
  rawLog?: string;
  memo?: string;
  events?: any[];
}

function DetailTx() {
  const { hash } = useParams<{ hash: string }>();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const RPC_ENDPOINT = "https://rpc-atomone.22node.xyz";

  useEffect(() => {
    if (hash) {
      fetchTransactionDetail(hash);
    }
  }, [hash]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatAmount = (amount: string) => {
    if (!amount) return "-";

    // Parse amount if it contains denom
    const match = amount.match(/^(\d+)(.*)$/);
    if (match) {
      const [, value, denom] = match;
      const formattedValue = (parseInt(value) / 1000000).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        }
      );
      return `${formattedValue} ${denom.toUpperCase()}`;
    }
    return amount;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const decodeTransactionData = async (
    txBytes: Uint8Array,
    txEvents: any[]
  ) => {
    try {
      const decodedTx = decodeTxRaw(txBytes);
      console.log("Decoded transaction:", decodedTx);

      const detectedMessageTypes: string[] = [];
      const amounts: string[] = [];
      const addresses: string[] = [];

      decodedTx.body.messages.forEach((msg: any) => {
        const typeUrl = msg.typeUrl || "Unknown";
        detectedMessageTypes.push(typeUrl);

        console.log(`Processing message type: ${typeUrl}`);
        console.log("Message value:", msg.value);

        // Extract amounts based on message type
        if (typeUrl === "/cosmos.bank.v1beta1.MsgSend") {
          // Handle MsgSend - multiple patterns for amount extraction
          const patterns = [
            () => msg.value.amount, // Standard array
            () => msg.value.coins, // Alternative field name
            () => msg.value.value, // Nested value
            () => [msg.value], // Single object as array
          ];

          for (const pattern of patterns) {
            try {
              const amountData = pattern();
              if (Array.isArray(amountData) && amountData.length > 0) {
                amountData.forEach((coin: any) => {
                  if (coin && coin.amount && coin.denom) {
                    amounts.push(`${coin.amount}${coin.denom}`);
                  }
                });
                break;
              }
            } catch (e) {
              continue;
            }
          }

          // Extract addresses (from_address, to_address)
          if (msg.value.fromAddress || msg.value.from_address) {
            addresses.push(msg.value.fromAddress || msg.value.from_address);
          }
          if (msg.value.toAddress || msg.value.to_address) {
            addresses.push(msg.value.toAddress || msg.value.to_address);
          }
        } else if (
          typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" ||
          typeUrl === "/cosmos.staking.v1beta1.MsgUndelegate"
        ) {
          if (
            msg.value.amount &&
            msg.value.amount.amount &&
            msg.value.amount.denom
          ) {
            amounts.push(`${msg.value.amount.amount}${msg.value.amount.denom}`);
          }
          if (msg.value.delegatorAddress || msg.value.delegator_address) {
            addresses.push(
              msg.value.delegatorAddress || msg.value.delegator_address
            );
          }
          if (msg.value.validatorAddress || msg.value.validator_address) {
            addresses.push(
              msg.value.validatorAddress || msg.value.validator_address
            );
          }
        } else if (
          typeUrl === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        ) {
          // For withdraw rewards, amounts are in transaction events
          if (msg.value.delegatorAddress || msg.value.delegator_address) {
            addresses.push(
              msg.value.delegatorAddress || msg.value.delegator_address
            );
          }
          if (msg.value.validatorAddress || msg.value.validator_address) {
            addresses.push(
              msg.value.validatorAddress || msg.value.validator_address
            );
          }
        } else if (typeUrl === "/ibc.applications.transfer.v1.MsgTransfer") {
          if (
            msg.value.token &&
            msg.value.token.amount &&
            msg.value.token.denom
          ) {
            amounts.push(`${msg.value.token.amount}${msg.value.token.denom}`);
          }
          if (msg.value.sender) addresses.push(msg.value.sender);
          if (msg.value.receiver) addresses.push(msg.value.receiver);
        }
      });

      // Extract fee information
      let fee = { amount: "0", denom: "photon" };
      if (
        decodedTx.authInfo?.fee?.amount &&
        decodedTx.authInfo.fee.amount.length > 0
      ) {
        const feeAmount = decodedTx.authInfo.fee.amount[0];
        fee = {
          amount: feeAmount.amount || "0",
          denom: feeAmount.denom || "photon",
        };
      }

      return {
        detectedMessageTypes,
        amounts,
        addresses,
        fee,
        memo: decodedTx.body.memo || "",
        success: true,
      };
    } catch (error) {
      console.error("Error decoding transaction:", error);
      return {
        detectedMessageTypes: ["Unknown"],
        amounts: [],
        addresses: [],
        fee: { amount: "0", denom: "photon" },
        memo: "",
        success: false,
      };
    }
  };

  const fetchTransactionDetail = async (txHash: string) => {
    try {
      setLoading(true);
      setError(null);

      const client = await Comet38Client.connect(RPC_ENDPOINT);

      // Search for transaction by hash
      const searchResult = await client.txSearch({
        query: `tx.hash='${txHash.toUpperCase()}'`,
        prove: false,
        page: 1,
        per_page: 1,
      });

      if (searchResult.txs.length === 0) {
        throw new Error("Transaction not found");
      }

      const txResult = searchResult.txs[0];
      const decodedData = await decodeTransactionData(
        txResult.tx,
        txResult.result.events || []
      );

      // Extract fee from transaction events if available
      let extractedFee = decodedData.fee;
      if (txResult.result.events) {
        for (const event of txResult.result.events) {
          if (event.type === "tx" && event.attributes) {
            for (const attr of event.attributes) {
              if (attr.key === "fee") {
                const feeValue = attr.value;
                const match = feeValue.match(/^(\d+)(\w+)$/);
                if (match) {
                  extractedFee = {
                    amount: match[1],
                    denom: match[2],
                  };
                }
              }
            }
          }
        }
      }

      const messages: TransactionMessage[] =
        decodedData.detectedMessageTypes.map((type, index) => ({
          type,
          value: {
            addresses: decodedData.addresses,
            amounts: decodedData.amounts,
            size: decodedData.amounts.length,
          },
        }));

      const transactionDetail: TransactionDetail = {
        hash: txHash,
        height: txResult.height,
        index: txResult.index,
        messages,
        fee: extractedFee,
        gasUsed: txResult.result.gasUsed?.toString() || "0",
        gasWanted: txResult.result.gasWanted?.toString() || "0",
        timestamp: new Date(
          txResult.result.events?.[0]?.attributes?.find(
            (attr) => attr.key === "timestamp"
          )?.value || Date.now()
        ).toISOString(),
        success: txResult.result.code === 0,
        rawLog: txResult.result.log || "",
        memo: decodedData.memo,
        events: txResult.result.events || [],
      };

      setTransaction(transactionDetail);
    } catch (err) {
      console.error("Error fetching transaction detail:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch transaction details"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">Error</div>
            <div className="text-gray-300 mb-6">{error}</div>
            <Link
              to="/explorer"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Explorer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-gray-300 text-xl">Transaction not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/explorer"
            className="text-cyan-400 hover:text-white transition-colors mb-4 inline-flex items-center gap-2"
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
            Back to Explorer
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            Transaction Details
          </h1>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.success
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {transaction.success ? "Success" : "Failed"}
            </span>
            <span className="text-gray-400">
              Block #{transaction.height.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Transaction Overview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Transaction Hash
              </label>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-mono text-sm break-all">
                  {transaction.hash}
                </span>
                <button
                  onClick={() => copyToClipboard(transaction.hash, "hash")}
                  className="text-cyan-400 hover:text-white transition-colors"
                  title="Copy hash"
                >
                  {copiedText === "hash" ? (
                    <span className="text-white text-xs">✓</span>
                  ) : (
                    <span className="text-xs">📋</span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Block Height
              </label>
              <span className="text-white font-mono">
                {transaction.height.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Transaction Index
              </label>
              <span className="text-white font-mono">{transaction.index}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Timestamp
              </label>
              <span className="text-white">
                {formatTime(transaction.timestamp)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Gas Used / Wanted
              </label>
              <span className="text-white font-mono">
                {parseInt(transaction.gasUsed).toLocaleString()} /{" "}
                {parseInt(transaction.gasWanted).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fee
              </label>
              <span className="text-cyan-400">
                {formatAmount(
                  `${transaction.fee.amount}${transaction.fee.denom}`
                )}
              </span>
            </div>
          </div>

          {transaction.memo && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Memo
              </label>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <span className="text-white text-sm">{transaction.memo}</span>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Messages ({transaction.messages.length})
          </h2>

          <div className="space-y-4">
            {transaction.messages.map((message, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                    {message.type}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Message #{index + 1}
                  </span>
                </div>

                {message.value.amounts && message.value.amounts.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Amounts
                    </label>
                    <div className="space-y-1">
                      {message.value.amounts.map((amount, amountIndex) => (
                        <div
                          key={amountIndex}
                          className="text-cyan-400 font-mono text-sm"
                        >
                          {formatAmount(amount)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {message.value.addresses &&
                  message.value.addresses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Addresses
                      </label>
                      <div className="space-y-1">
                        {message.value.addresses.map(
                          (address, addressIndex) => (
                            <div
                              key={addressIndex}
                              className="flex items-center gap-2"
                            >
                              <span className="text-white font-mono text-sm break-all">
                                {address}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    address,
                                    `address-${addressIndex}`
                                  )
                                }
                                className="text-cyan-400 hover:text-white transition-colors"
                                title="Copy address"
                              >
                                {copiedText === `address-${addressIndex}` ? (
                                  <span className="text-white text-xs">✓</span>
                                ) : (
                                  <span className="text-xs">📋</span>
                                )}
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Raw Log */}
        {transaction.rawLog && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Raw Log</h2>
            <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {JSON.stringify(
                  JSON.parse(transaction.rawLog || "{}"),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailTx;
