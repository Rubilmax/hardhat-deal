import { task, types } from "hardhat/config";

import { defaultSymbols } from "./constants";
import { deal } from "./helpers";

task("deal", `Deals any amount of ERC20 tokens to a given address`)
  .addPositionalParam("to", "Target address", undefined, types.string)
  .addOptionalPositionalParam(
    "erc20",
    `The ERC20 symbol or address [supported symbols: ${Object.keys(defaultSymbols).join(", ")}]`,
    "WETH",
    types.string
  )
  .addOptionalPositionalParam(
    "amount",
    "Token amount, with decimals",
    "1000000000000000000",
    types.string
  )
  .addOptionalParam(
    "maxSlot",
    "The maximum storage slot index to brute-force",
    undefined,
    types.int
  )
  .setAction(async function (
    {
      erc20,
      to,
      amount,
      maxSlot,
    }: {
      erc20: string;
      to: string;
      amount: string;
      maxSlot: number;
    },
    hre
  ) {
    const symbol = defaultSymbols[erc20];
    const erc20Address = symbol || erc20;

    await deal(erc20Address, to, amount, maxSlot, hre);

    console.log(`Dealt ${amount} ${symbol ? erc20 : "ERC20(" + erc20Address + ")"} to ${to}`);
  });
