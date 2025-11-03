# vn-number 🇻🇳

🛠 A bunch of utility functions that work with number in 🇻🇳 Vietnamese language

[![Publish](https://github.com/hckhanh/vn-number/actions/workflows/publish.yml/badge.svg)](https://github.com/hckhanh/vn-number/actions/workflows/publish.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hckhanh_vn-number&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hckhanh_vn-number)
[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/hckhanh/vn-number?utm_source=badge)
[![NPM Downloads](https://img.shields.io/npm/dw/vn-number)](https://www.npmjs.com/package/vn-number)
[![JSR](https://jsr.io/badges/@hckhanh/vn-number/weekly-downloads)](https://jsr.io/@hckhanh/vn-number)

## Features

- Zero dependencies
- Built-in support for Edge runtime
- Typesafe with TypeScript
- Fully documented

## Functions

### Read Vietnamese number

```ts
import { readVnNumber } from '@hckhanh/vn-number'

const result = readVnNumber(1250000)
console.log(result) // một triệu hai trăm năm mươi nghìn
```

### Format number in Vietnamese format

```ts
import { formatVnNumber } from '@hckhanh/vn-number'

const result = formatVnNumber(1250000)
console.log(result) // 1.250.000
```

### Format VN currency (VND - ₫)

```ts
import { formatVnCurrency } from '@hckhanh/vn-number'

const result = formatVnCurrency(1250000)
console.log(result) // 1.250.000 ₫
```

### Format percentage in Vietnamese format

```ts
import { formatVnPercent } from '@hckhanh/vn-number'

const result = formatVnPercent(0.991)
console.log(result) // 99,1%
```

## Release Notes

You can go to [the Releases](https://github.com/hckhanh/vn-number/releases) page to see the release notes.
