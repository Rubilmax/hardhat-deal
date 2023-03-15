import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-ethers";

import "../src/index";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth.llamarpc.com",
      },
    },
  },
  dealSlots: {
    "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0": 2, // LUSD
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 4, // Override
  },
};

export default config;
