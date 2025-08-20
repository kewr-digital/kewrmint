export const CHAIN_CONFIG = {
  chainId: "atomone-1",
  chainName: "AtomOne",
  rpc: "https://rpc-atomone.22node.xyz",
  rest: "https://rest-atomone.22node.xyz",
  slip44: {
    coinType: 118,
  },
  currencies: [
    {
      coinDenom: "ATONE",
      coinMinimalDenom: "uatone",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "ATONE",
      coinMinimalDenom: "uatone",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "ATONE",
    coinMinimalDenom: "uatone",
    coinDecimals: 6,
  },
};
export const getChainConfig = () => {
  const isDevelopment =
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost";

  return {
    ...CHAIN_CONFIG,
    rest: isDevelopment
      ? "http://localhost:3001/api/proxy/atomone"
      : "https://rest-atomone.22node.xyz",
    rpc: isDevelopment
      ? "http://localhost:3001/api/rpc/atomone"
      : "https://rpc-atomone.22node.xyz",
  };
};
