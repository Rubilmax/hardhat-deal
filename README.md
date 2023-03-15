# hardhat-deal

This plugin allows the developer to deal arbitrary amount of ERC20 tokens to any account on the hardhat network, to ease test development. The storage value of the mapping `balanceOf` is manipulated in order to manipulate the balance of the given user.

The plugin is shipped with a list of storage slots, which enable faster deals. Additionnally, the developer can provide a mapping of storage slots on custom ERC20s or edit the hardhat configuration on-the-fly (for example when deploying custom ERC20s during tests). If the ERC20 is not found in the configuration, the plugin automatically tries to brute-force the storage slot of the mapping `balanceOf`, and throws an error if it cannot.

## Installation

```bash
npm install hardhat-deal
```

```bash
yarn add hardhat-deal
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-deal");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-deal";
```

## Usage

```typescript
import { deal } from "hardhat-deal";

const lusd = "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0";
const user = "0x7Ef4174aFdF4514F556439fa2822212278151Db6";
const amount = "10000000000000000000"; // 10 LUSD

// Deal 10 LUSD to the user
await deal(lusd, user, amount);

// Optionnally provide a last parameter specifying how far to brute-force the storage slot (default: 12)
await deal(lusd, user, amount, 15);
```

## Configuration

This plugin extends `HardhatUserConfig` object with an optional `dealSlots` field, allowing one to customize the default storage slots used to deal ERC20 tokens, for faster usage (because the plugin no longer needs to brute-force the ERC20 storage slot).

This is an example of how to set it:

```js
module.exports = {
  dealSlots: {
    "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0": 2, // LUSD
  },
};
```
