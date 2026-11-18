# 🇻🇳 vn-number

<p align="center">
  <img src="docs/images/logo.svg" alt="vn-number" width="128" />
</p>

**Read and format numbers in Vietnamese.**

Turn numbers into Vietnamese words, display VND prices, and format totals and
percentages for invoices, storefronts, and dashboards. Four functions, TypeScript
types included, and zero runtime dependencies.

[![NPM Downloads](https://img.shields.io/npm/dw/vn-number)](https://www.npmjs.com/package/vn-number)
[![JSR](https://jsr.io/badges/@hckhanh/vn-number/weekly-downloads)](https://jsr.io/@hckhanh/vn-number)
[![Publish](https://github.com/hckhanh/vn-number/actions/workflows/publish.yml/badge.svg)](https://github.com/hckhanh/vn-number/actions/workflows/publish.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hckhanh_vn-number&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hckhanh_vn-number)
[![codecov](https://codecov.io/gh/hckhanh/vn-number/graph/badge.svg?token=UG10IM2LLW)](https://codecov.io/gh/hckhanh/vn-number)
[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://app.codspeed.io/hckhanh/vn-number)

[Documentation](https://docs.khanh.id/vn-number) ·
[Upgrade to v3](docs/migration-v3.md) ·
[Releases](https://github.com/hckhanh/vn-number/releases)

## Features

- **Vietnamese number reading**, including “lăm”, “mốt”, and “lẻ”.
- **Localized formatting** for numbers, VND currency, and percentages using `Intl.NumberFormat`.
- **Flexible inputs**: `number`, `string`, and `bigint`, with custom fallbacks for formatting.
- **Ready for JavaScript and TypeScript**: ESM exports, included types, and no runtime dependencies.

## Installation

Install from npm with pnpm:

```sh
pnpm add vn-number
```

Or from JSR with Deno:

```sh
deno add jsr:@hckhanh/vn-number
```

For the Deno installation, use `'@hckhanh/vn-number'` as the import specifier in
the examples below.

## Quick start

```ts
import {
  formatVnCurrency,
  formatVnNumber,
  formatVnPercent,
  readVnNumber,
} from 'vn-number'

readVnNumber(1250000)
// 'một triệu hai trăm năm mươi nghìn'

formatVnNumber(1234567.89)
// '1.234.567,89'

formatVnCurrency(1250000)
// '1.250.000 ₫'

formatVnPercent(0.157)
// '15,7%'
```

Percentages take a fraction: `0.157` means 15.7%. Currency output includes a
non-breaking space (`\u00A0`) before `₫`; locale details and rounding depend on
the runtime's `Intl.NumberFormat` implementation.

## API at a glance

| Function | Returns | Default fallback |
| --- | --- | --- |
| `readVnNumber(value)` | A non-negative integer in Vietnamese words | — |
| `formatVnNumber(value, fallback?)` | A number with Vietnamese separators | `'0'` |
| `formatVnCurrency(value, fallback?)` | A VND amount | `'0 ₫'` |
| `formatVnPercent(value, fallback?)` | A percentage with up to two decimal places | `'0%'` |

### Exact large integers

Use a decimal integer string or `bigint` with `readVnNumber` to avoid losing
precision before conversion. For formatting integers beyond
`Number.MAX_SAFE_INTEGER`, pass a `bigint`: the formatting functions convert
string inputs to JavaScript numbers.

```ts
import { formatVnNumber } from 'vn-number'

formatVnNumber(9999999999999999n)
// '9.999.999.999.999.999'
```

Use non-negative decimal integers with `readVnNumber`. See the
[v3 compatibility notes](docs/migration-v3.md) for the preserved legacy behavior
of negative, fractional, exponential, and malformed reader inputs.

### Missing values and fallbacks

The three formatting functions return their fallback for `null`, `undefined`,
`NaN`, or strings that convert to `NaN`. Pass a second argument to choose the
text shown in your UI.

```ts
import { formatVnCurrency, formatVnPercent } from 'vn-number'

formatVnCurrency(null, 'Chưa có giá')
// 'Chưa có giá'

formatVnPercent('not-a-number', '—')
// '—'
```

### Vietnamese spelling

```ts
import { readVnNumber } from 'vn-number'

readVnNumber(15)
// 'mười lăm'

readVnNumber(21)
// 'hai mươi mốt'

readVnNumber(101)
// 'một trăm lẻ một'

readVnNumber(1001)
// 'một nghìn không trăm lẻ một'
```

## Faster number reading in v3

[v3.0.0](https://github.com/hckhanh/vn-number/releases/tag/vn-number%403.0.0)
speeds up `readVnNumber` while preserving all four public functions and their
signatures. Existing calls require no code changes.

In a [matched CodSpeed comparison](https://app.codspeed.io/hckhanh/vn-number/runs/compare/6ac0836c4dc8300af8602dca..6ac083654dc8300af8602dc7),
the deterministic `read/quantities` workload (**50 conversions**) improved from **25.628 µs to
9.858 µs** in minimum walltime (**2.60×**); modeled CPU time improved **2.12×**.
Both runs used Node 24.16.0, Vitest 4.1.11, CodSpeed SDK 6.0.0-beta.2, and runner
5.4.0 with matching hardware metadata. Results depend on the workload and runtime;
shared-runner walltime can vary. Formatting controls were classified unchanged.

See the [benchmark guide](benchmarks/README.md) for the fixtures and repeatable
commands, and the [upgrade notes](docs/migration-v3.md) for compatibility details.

## Runtime support

The package uses ESM and has no Node.js-specific runtime dependencies. Use it in
Node.js, Bun, Deno, browsers, and edge runtimes with `Intl.NumberFormat` support
for the `vi-VN` locale. The bigint examples require `BigInt` support.

## Contributing

Contributions are welcome! Open an
[issue](https://github.com/hckhanh/vn-number/issues) or a pull request.
See the [development tooling guide](TOOLING.md) for the pinned toolchain and
validation commands. Please run the tests and `pnpm format` before submitting.

## License

[MIT](LICENSE) © [Khánh Hoàng](https://www.khanh.id)
