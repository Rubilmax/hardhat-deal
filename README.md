# hardhat-deal

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

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

Plugin also provides a task `deal` callable from hardhat:

``` 
npx hardhat deal --to <recepient addr> --symbol WETH --amount 1 [--nodec]
```

Add the `--nodec` flag to supply raw numbers without decimals applied

Run `npx hardhat` to see list of tokens supported by task

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

[build-img]: https://github.com/rubilmax/hardhat-deal/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/rubilmax/hardhat-deal/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/hardhat-deal
[downloads-url]: https://www.npmtrends.com/hardhat-deal
[npm-img]: https://img.shields.io/npm/v/hardhat-deal
[npm-url]: https://www.npmjs.com/package/hardhat-deal
[issues-img]: https://img.shields.io/github/issues/rubilmax/hardhat-deal
[issues-url]: https://github.com/rubilmax/hardhat-deal/issues
[codecov-img]: https://codecov.io/gh/rubilmax/hardhat-deal/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/rubilmax/hardhat-deal
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
