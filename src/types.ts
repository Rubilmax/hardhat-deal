import "hardhat/types/config";

export enum StorageLayoutType {
  SOLIDITY = "solidity",
  VYPER = "vyper",
}

export type DealSlot =
  | {
      type: StorageLayoutType;
      slot: number;
    }
  | number;

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    dealSlots?: {
      [address: string]: DealSlot;
    };
  }

  export interface HttpNetworkUserConfig {
    rpcEndpoints?: {
      setStorageAt?: string;
    };
  }

  export interface HardhatConfig {
    dealSlots: {
      [address: string]: DealSlot | undefined;
    };
  }

  export interface HardhatNetworkConfig {
    rpcEndpoints?: Partial<{
      setStorageAt: "hardhat_setStorageAt";
    }>;
  }

  export interface HttpNetworkConfig {
    rpcEndpoints?: Partial<{
      setStorageAt: string;
    }>;
  }
}
