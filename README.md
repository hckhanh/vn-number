# 🇻🇳 vn-number [![NPM Downloads](https://img.shields.io/npm/dw/vn-number)](https://www.npmjs.com/package/vn-number) [![JSR](https://jsr.io/badges/@hckhanh/vn-number/weekly-downloads)](https://jsr.io/@hckhanh/vn-number)

🛠 A bunch of utility functions that work with number in 🇻🇳 Vietnamese language

[![Publish](https://github.com/hckhanh/vn-number/actions/workflows/publish.yml/badge.svg)](https://github.com/hckhanh/vn-number/actions/workflows/publish.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hckhanh_vn-number&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hckhanh_vn-number)
[![codecov](https://codecov.io/gh/hckhanh/vn-number/graph/badge.svg?token=UG10IM2LLW)](https://codecov.io/gh/hckhanh/vn-number)
[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/hckhanh/vn-number?utm_source=badge)

## Features

- Zero dependencies
- Built-in support for Edge runtime
- Typesafe with TypeScript
- Fully documented
- Works with `number`, `string`, and `bigint` types
- Handles very large numbers (up to quintillions)

## Installation

```bash
npm install vn-number
```

```bash
deno add jsr:@hckhanh/vn-number
```

## Quick Start

### Read Vietnamese Numbers

Convert numbers to Vietnamese text:

```ts
import { readVnNumber } from 'vn-number'

readVnNumber(1250000)
// Output: "một triệu hai trăm năm mươi nghìn"

readVnNumber(15)
// Output: "mười lăm"

readVnNumber(21)
// Output: "hai mươi mốt"
```

### Format Numbers in Vietnamese Style

Format numbers with Vietnamese thousand separators (dots):

```ts
import { formatVnNumber } from 'vn-number'

formatVnNumber(1250000)
// Output: "1.250.000"

formatVnNumber(BigInt('9999999999999999'))
// Output: "9.999.999.999.999.999"
```

### Format Vietnamese Currency (VND)

Format numbers as Vietnamese Dong currency:

```ts
import { formatVnCurrency } from 'vn-number'

formatVnCurrency(1250000)
// Output: "1.250.000 ₫"

formatVnCurrency(null, 'Không giới hạn')
// Output: "Không giới hạn"
```

### Format Percentages

Format numbers as Vietnamese-style percentages:

```ts
import { formatVnPercent } from 'vn-number'

formatVnPercent(0.991)
// Output: "99,1%"

formatVnPercent(0.5)
// Output: "50%"
```

## Documentation

For detailed documentation, examples, and API reference, visit:

**[https://vn-number.khanh.id](https://vn-number.khanh.id)**

## Common Use Cases

### E-commerce

```ts
import { formatVnCurrency, readVnNumber } from 'vn-number'

const price = 1500000

console.log(formatVnCurrency(price))
// Output: "1.500.000 ₫"

console.log(readVnNumber(price))
// Output: "một triệu năm trăm nghìn"
```

### Banking and Financial Documents

```ts
import { readVnNumber, formatVnCurrency } from 'vn-number'

const amount = 2450000

console.log(`Số tiền: ${formatVnCurrency(amount)}`)
// Output: "Số tiền: 2.450.000 ₫"

console.log(`Bằng chữ: ${readVnNumber(amount)} đồng`)
// Output: "Bằng chữ: hai triệu bốn trăm năm mươi nghìn đồng"
```

### Data Visualization

```ts
import { formatVnNumber, formatVnPercent } from 'vn-number'

const totalUsers = 1234567
const growthRate = 0.157

console.log(`Tổng người dùng: ${formatVnNumber(totalUsers)}`)
// Output: "Tổng người dùng: 1.234.567"

console.log(`Tăng trưởng: ${formatVnPercent(growthRate)}`)
// Output: "Tăng trưởng: 15,7%"
```

## Vietnamese Language Rules

The `readVnNumber` function follows Vietnamese language conventions:

- **"lăm" rule**: 15 → "mười lăm", 25 → "hai mươi lăm"
- **"mốt" rule**: 21 → "hai mươi mốt", 31 → "ba mươi mốt"
- **"lẻ" rule**: 101 → "một trăm lẻ một", 305 → "ba trăm lẻ năm"
- **Zero handling**: 1001 → "một nghìn không trăm lẻ một"

## API Functions

| Function | Description | Example |
|----------|-------------|---------|
| `readVnNumber(number)` | Convert number to Vietnamese text | `readVnNumber(1250000)` → `"một triệu hai trăm năm mươi nghìn"` |
| `formatVnNumber(number, fallback?)` | Format number in Vietnamese style | `formatVnNumber(1250000)` → `"1.250.000"` |
| `formatVnCurrency(money, fallback?)` | Format as VND currency | `formatVnCurrency(1250000)` → `"1.250.000 ₫"` |
| `formatVnPercent(value, fallback?)` | Format as percentage | `formatVnPercent(0.991)` → `"99,1%"` |

## Browser and Runtime Compatibility

- ✅ Node.js 14+
- ✅ Bun
- ✅ Deno
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ React Native
- ✅ Electron
- ✅ Edge Runtime (Vercel, Cloudflare Workers, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Khánh Hoàng](https://www.khanh.id)

## Release Notes

See [Releases](https://github.com/hckhanh/vn-number/releases) for changelog and release notes.
