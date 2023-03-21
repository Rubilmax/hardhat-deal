import fs from "fs";
import path from "path";

export const getCachePath = (cacheRoot: string) =>
  path.join(cacheRoot, "hardhat-deal-cache", `data.json`);

export const loadCache = (cachePath: string): { [address: string]: number } => {
  if (!fs.existsSync(cachePath)) return {};

  return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
};

export const saveCache = (cachePath: string, slots: { [address: string]: number | undefined }) => {
  if (!fs.existsSync(cachePath)) fs.mkdirSync(path.dirname(cachePath), { recursive: true });

  fs.writeFileSync(cachePath, JSON.stringify(slots, undefined, 2));
};
