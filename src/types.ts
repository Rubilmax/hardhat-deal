import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    dealSlots?: {
      [address: string]: number;
    };
  }

  export interface HttpNetworkUserConfig {
    rpcEndpoints?: {
      setStorageAt?: string;
    };
  }

  export interface HardhatConfig {
    dealSlots: {
      [address: string]: number | undefined;
    };
  }

  export interface HardhatNetworkConfig {
    rpcEndpoints: {
      setStorageAt: "hardhat_setStorageAt";
    };
  }

  export interface HttpNetworkConfig {
    rpcEndpoints: {
      setStorageAt: string;
    };
  }
}
