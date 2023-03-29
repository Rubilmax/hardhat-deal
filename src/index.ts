import { extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import { getCachePath, loadCache } from "./cache";
import { defaultSlots } from "./constants";
import "./tasks";
import "./types";

export { deal } from "./helpers";

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  config.dealSlots = Object.assign(
    { ...defaultSlots },
    loadCache(getCachePath(userConfig.paths?.cache ?? config.paths.cache)),
    Object.fromEntries(
      Object.entries(userConfig.dealSlots ?? {}).map(([address, slot]) => [
        address.toLowerCase(),
        slot,
      ])
    )
  );
});
