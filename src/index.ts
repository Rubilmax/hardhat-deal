import { extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import defaultSlots from "./defaultSlots";
import "./types";

export { deal } from "./helpers";

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  config.dealSlots = Object.assign(
    { ...defaultSlots },
    Object.fromEntries(
      Object.entries(userConfig.dealSlots ?? {}).map(([address, slot]) => [
        address.toLowerCase(),
        slot,
      ])
    )
  );
});
