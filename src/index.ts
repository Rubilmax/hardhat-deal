import { extendConfig } from "hardhat/config";
import {
  HardhatConfig,
  HardhatUserConfig,
  HttpNetworkConfig,
  HttpNetworkUserConfig,
} from "hardhat/types";

import { getCachePath, loadCache } from "./cache";
import { defaultSlots } from "./constants";
import "./tasks";
import "./types";

export { deal } from "./helpers";

const defaultRpcEndpoints: HttpNetworkConfig["rpcEndpoints"] = {
  setStorageAt: "hardhat_setStorageAt",
};

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

  for (const [networkName, network] of Object.entries(userConfig.networks ?? {})) {
    const rpcEndpoints =
      (network?.chainId !== 1337 && (network as HttpNetworkUserConfig)?.rpcEndpoints) || {};

    (config.networks[networkName] as HttpNetworkConfig).rpcEndpoints = Object.assign(
      {},
      defaultRpcEndpoints,
      rpcEndpoints
    );
  }
});
