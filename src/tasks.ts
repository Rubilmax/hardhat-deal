import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

import { deal } from "./helpers";
import { Token } from "./types";

// I actually have no idea how to structure all this stuff
const TOKENS: Token[] = [
  {
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
  },
  {
    symbol: "BUSD",
    address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
    decimals: 18,
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
  },
];

task(
  "deal",
  `Deals any amount of tokens from list ${TOKENS.map((token) => token.symbol).join(", ")} to address 🎩✨`
  )
  .addOptionalParam("to", "Destination", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
  .addOptionalParam("amount", "Token amount, with decimals", "1")
  .addOptionalParam("symbol", "Token symbol", "WETH")
  .addFlag("nodec", "Disable internal decimals calculation")
  // .addOptionalParam("nodec", "Disable internal decimals calculation", false, types.boolean)
  .setAction(async function (
    { to, amount, symbol, nodec }: { to: string; amount: string; symbol: string; nodec: string }
  ) {
    const token = TOKENS.find((token) => {
      return token.symbol === symbol;
    });
    if (!token) {
      throw new Error(`Token with symbol '${symbol}' not found. 🔍⛔`);
    }
    // If nodec is false, apply the token decimals to the amount
    const realAmount = !nodec ? BigInt(amount) * BigInt(10 ** token.decimals) : BigInt(amount);

    await deal(token.address, to, realAmount);
    console.log(
      `Deal ${Number(realAmount / BigInt(10 ** token.decimals)).toFixed(4)} ${
        token.symbol
      } to ${to} 🤝💰`
    );
  });
