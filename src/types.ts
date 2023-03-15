import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    dealSlots?: {
      [address: string]: number;
    };
  }

  export interface HardhatConfig {
    dealSlots: {
      [address: string]: number | undefined;
    };
  }
}
