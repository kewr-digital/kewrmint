export const EXPLORER_CONSTANTS = {
  RPC_ENDPOINT: "https://rpc-atomone.22node.xyz",
  TRANSACTIONS_PER_PAGE: 10,
  MAX_TRANSACTIONS: 100,
  REFRESH_INTERVAL: 10000,
  COPY_TIMEOUT: 2000,
  MAX_VISIBLE_PAGES: 5,
  MICRO_UNIT_DIVISOR: 1_000_000,
} as const;

export const ADDRESS_PATTERNS = {
  COSMOS:
    /(atone1[a-z0-9]{38}|atonevaloper1[a-z0-9]{38}|cosmos1[a-z0-9]{38}|cosmosvaloper1[a-z0-9]{38})/g,
} as const;

export const MONTH_NAMES = [
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
] as const;
