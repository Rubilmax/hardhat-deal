export const defaultSymbols: {
  [symbol: string]: string;
} = {
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  BUSD: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
  WBTC: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  UNI: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  AAVE: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
  LINK: "0x514910771af9ca656af840dff83e8264ecf986ca",
};

export const defaultSlots: {
  [address: string]: number;
} = {
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 3, // WETH
  "0xdac17f958d2ee523a2206206994597c13d831ec7": 2, // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f": 2, // DAI
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 9, // USDC
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": 0, // WBTC
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": 4, // UNI
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": 0, // AAVE
  "0xae78736cd615f374d3085123a210448e74fc6393": 1, // rETH
  "0x514910771af9ca656af840dff83e8264ecf986ca": 1, // LINK
};
