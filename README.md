# vn-number

A bunch of utility functions that work with number in Vietnamese language

## Installation

```bash
npx jsr add @luca/flag

# pnpm
pnpm dlx jsr add @luca/flag

# yarn
yarn dlx jsr add @luca/flag
```

> [!NOTE]
> This package is built with [jsr](https://jsr.io/docs). If you are using deno,
> please follow the [jsr official guide](https://jsr.io/docs/using-packages#native-jsr-imports) to use this package.

## Modules

### read

#### Read Vietnamese Number

### Features

- Zero dependencies
- Support edge runtimes
- Unlimited number (use string for big number)

```ts
import { readVietnameseNumber } from '@hckhanh/vn-number/read'

readVietnameseNumber('19990000') // or readNumber(19990000)
// output: mười chín triệu chín trăm chín mươi nghìn
```
