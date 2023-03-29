import { BigNumber, BigNumberish } from "ethers";
import {
  defaultAbiCoder,
  getAddress,
  hexStripZeros,
  hexZeroPad,
  Interface,
  keccak256,
} from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

import { getCachePath, saveCache } from "./cache";

const balanceOfIfc = new Interface(["function balanceOf(address) external view returns (uint256)"]);

export const deal = async (
  erc20: string,
  recipient: string,
  amount: BigNumberish,
  maxSlot = 256,
  hre?: HardhatRuntimeEnvironment
) => {
  hre ??= require("hardhat");

  if (!hre) throw Error("Could not instanciate Hardhat Runtime Environment");

  erc20 = erc20.toLowerCase();
  recipient = await getAddress(recipient);
  const hexAmount = hexZeroPad(BigNumber.from(amount).toHexString(), 32);

  const dealSlot = hre.config.dealSlots[erc20];

  let balanceOfMappingSlot = dealSlot ?? 0;
  const getBalanceOfSlot = () =>
    hexStripZeros(
      keccak256(defaultAbiCoder.encode(["address", "uint256"], [recipient, balanceOfMappingSlot++]))
    );

  let balanceOfSlot = getBalanceOfSlot();

  let storageBefore =
    typeof dealSlot !== "number"
      ? await hre.network.provider.send("eth_getStorageAt", [erc20, balanceOfSlot])
      : null;

  await hre.network.provider.send("hardhat_setStorageAt", [erc20, balanceOfSlot, hexAmount]);

  if (!storageBefore) return;

  const balanceOfCall = [
    {
      to: erc20,
      data: balanceOfIfc.encodeFunctionData("balanceOf", [recipient]),
    },
  ];

  let balance = await hre.network.provider.send("eth_call", balanceOfCall);

  while (balance !== hexAmount && balanceOfMappingSlot <= maxSlot) {
    await hre.network.provider.send("hardhat_setStorageAt", [erc20, balanceOfSlot, storageBefore]);

    balanceOfSlot = getBalanceOfSlot();

    storageBefore = await hre.network.provider.send("eth_getStorageAt", [erc20, balanceOfSlot]);

    await hre.network.provider.send("hardhat_setStorageAt", [erc20, balanceOfSlot, hexAmount]);

    balance = await hre.network.provider.send("eth_call", balanceOfCall);
  }

  if (balance !== hexAmount)
    throw Error(`Could not brute-force storage slot for ERC20 at: ${erc20}`);

  hre.config.dealSlots[erc20] = balanceOfMappingSlot - 1; // Cache for later.

  saveCache(getCachePath(hre.config.paths.cache), hre.config.dealSlots);
};
