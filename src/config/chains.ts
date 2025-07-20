export const CHAIN_CONFIG = {
  chainId: "atomone-1",
  chainName: "AtomOne",
  rpc: "https://m-atomone.rpc.utsa.tech",
  rest: "https://api.atomone.citizenweb3.com",
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
