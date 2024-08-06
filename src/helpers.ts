import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

import { getCachePath, saveCache } from "./cache";
import { StorageLayoutType } from "./types";
import {
  AbiCoder,
  AddressLike,
  BigNumberish,
  Interface,
  keccak256,
  toBeHex,
  toQuantity,
} from "ethers";

const balanceOfIfc = new Interface(["function balanceOf(address) external view returns (uint256)"]);

const getBalanceOfSlot = (type: StorageLayoutType, slot: number, recipient: string) => {
  if (type === StorageLayoutType.VYPER)
    return toQuantity(
      keccak256(AbiCoder.defaultAbiCoder().encode(["uint256", "address"], [slot, recipient]))
    );

  return toQuantity(
    keccak256(AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [recipient, slot]))
  );
};

const getAddress = async (address: AddressLike) => {
  const awaited = await address;
  if (typeof awaited === "string") return awaited.toLowerCase();

  return awaited.getAddress();
};

export const deal = async (
  erc20: AddressLike,
  recipient: AddressLike,
  amount: BigNumberish,
  maxSlot = 256,
  hre?: HardhatRuntimeEnvironment
) => {
  if (!hre) hre = require("hardhat");
  if (!hre) throw Error("Could not instanciate Hardhat Runtime Environment");

  const [erc20Address, recipientAddress] = await Promise.all([
    getAddress(erc20),
    getAddress(recipient),
  ]);
  const hexAmount = toBeHex(amount, 32);

  const balanceOfCall = [
    {
      to: erc20Address,
      data: balanceOfIfc.encodeFunctionData("balanceOf", [recipientAddress]),
    },
  ];

  const configDealSlot = hre.config.dealSlots[erc20Address];
  const cached = configDealSlot != null;

  let dealSlot =
    typeof configDealSlot === "object" && "type" in configDealSlot
      ? { ...configDealSlot }
      : { type: StorageLayoutType.SOLIDITY, slot: configDealSlot ?? 0 };

  const trySlot = async () => {
    let balanceOfSlot = getBalanceOfSlot(dealSlot.type, dealSlot.slot, recipientAddress);

    const storageBefore = !cached
      ? await hre!.network.provider.send("eth_getStorageAt", [erc20Address, balanceOfSlot])
      : null;

    await hre!.network.provider.send(
      hre!.network.config.rpcEndpoints?.setStorageAt ?? "hardhat_setStorageAt",
      [erc20Address, balanceOfSlot, hexAmount]
    );

    if (cached) return true;

    const balance = await hre!.network.provider.send("eth_call", balanceOfCall);

    if (balance === hexAmount) return true;

    await hre!.network.provider.send(
      hre!.network.config.rpcEndpoints?.setStorageAt ?? "hardhat_setStorageAt",
      [erc20Address, balanceOfSlot, storageBefore]
    );

    return false;
  };

  const getNextDealSlot = () => {
    const { slot } = dealSlot;

    if (dealSlot.type === StorageLayoutType.SOLIDITY)
      return { type: StorageLayoutType.VYPER, slot };

    return { type: StorageLayoutType.SOLIDITY, slot: slot + 1 };
  };

  // Hotfix: warm up EDR account storage
  // https://github.com/NomicFoundation/edr/issues/503#issuecomment-2165233608
  await hre!.network.provider.send("eth_getCode", [erc20Address]);

  let success = await trySlot();

  while (!success && dealSlot.slot <= maxSlot) {
    dealSlot = getNextDealSlot();

    success = await trySlot();
  }

  if (!success) throw Error(`Could not brute-force storage slot for ERC20 at: ${erc20Address}`);

  if (cached) return;

  hre.config.dealSlots[erc20Address] = dealSlot;

  saveCache(getCachePath(hre.config.paths.cache), hre.config.dealSlots);
};
