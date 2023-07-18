import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

import { getCachePath, saveCache } from "./cache";
import { StorageLayoutType } from "./types";
import {
  AbiCoder,
  BigNumberish,
  Interface,
  getAddress,
  keccak256,
  stripZerosLeft,
  toBeHex,
} from "ethers";

const balanceOfIfc = new Interface(["function balanceOf(address) external view returns (uint256)"]);

const getBalanceOfSlot = (type: StorageLayoutType, slot: number, recipient: string) => {
  if (type === StorageLayoutType.VYPER)
    return stripZerosLeft(
      keccak256(AbiCoder.defaultAbiCoder().encode(["uint256", "address"], [slot, recipient]))
    );

  return stripZerosLeft(
    keccak256(AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [recipient, slot]))
  );
};

export const deal = async (
  erc20: string,
  recipient: string,
  amount: BigNumberish,
  maxSlot = 256,
  hre?: HardhatRuntimeEnvironment
) => {
  if (!hre) hre = require("hardhat");
  if (!hre) throw Error("Could not instanciate Hardhat Runtime Environment");

  erc20 = erc20.toLowerCase();
  recipient = getAddress(recipient);
  const hexAmount = toBeHex(amount, 32);

  const balanceOfCall = [
    {
      to: erc20,
      data: balanceOfIfc.encodeFunctionData("balanceOf", [recipient]),
    },
  ];

  const configDealSlot = hre.config.dealSlots[erc20];
  const cached = configDealSlot != null;

  let dealSlot =
    typeof configDealSlot === "object" && "type" in configDealSlot
      ? { ...configDealSlot }
      : { type: StorageLayoutType.SOLIDITY, slot: configDealSlot ?? 0 };

  const trySlot = async () => {
    let balanceOfSlot = getBalanceOfSlot(dealSlot.type, dealSlot.slot, recipient);

    const storageBefore = !cached
      ? await hre!.network.provider.send("eth_getStorageAt", [erc20, balanceOfSlot])
      : null;

    await hre!.network.provider.send(hre!.network.config.rpcEndpoints.setStorageAt, [
      erc20,
      balanceOfSlot,
      hexAmount,
    ]);

    if (cached) return true;

    const balance = await hre!.network.provider.send("eth_call", balanceOfCall);

    if (balance === hexAmount) return true;

    await hre!.network.provider.send(hre!.network.config.rpcEndpoints.setStorageAt, [
      erc20,
      balanceOfSlot,
      storageBefore,
    ]);

    return false;
  };

  const getNextDealSlot = () => {
    const { slot } = dealSlot;

    if (dealSlot.type === StorageLayoutType.SOLIDITY)
      return { type: StorageLayoutType.VYPER, slot };

    return { type: StorageLayoutType.SOLIDITY, slot: slot + 1 };
  };

  let success = await trySlot();

  while (!success && dealSlot.slot <= maxSlot) {
    dealSlot = getNextDealSlot();

    success = await trySlot();
  }

  if (!success) throw Error(`Could not brute-force storage slot for ERC20 at: ${erc20}`);

  if (cached) return;

  hre.config.dealSlots[erc20] = dealSlot;

  saveCache(getCachePath(hre.config.paths.cache), hre.config.dealSlots);
};
