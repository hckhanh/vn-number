import type * as library from '../src/index.ts'

export type Library = typeof library
export type Operation = keyof Library
export type Input = string | number | bigint | null | undefined
export interface Call {
  operation: Operation
  value: Input
}
export interface Scenario {
  name: string
  calls: Call[]
}

// Fixed seed and all input construction happen before any timed callback.
let seed = 0x564e2026
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  return seed / 0x100000000
}
function integers(count: number, min: number, max: number) {
  return Array.from({ length: count }, () =>
    Math.floor(random() * (max - min + 1) + min),
  )
}
function scenario(
  name: string,
  operation: Operation,
  values: Input[],
): Scenario {
  return { name, calls: values.map((value) => ({ operation, value })) }
}

const quantities = integers(50, 1, 100)
const prices = integers(50, 10000, 50000000)
const totals = integers(50, 100000, 100000000)
const amounts = integers(50, 1000000, 10000000000)
const mixed = integers(30, 0, 100000000).map((value, i) =>
  i % 3 === 0 ? value : i % 3 === 1 ? String(value) : BigInt(value),
)
const largeIntegers = amounts.map((value) => BigInt(value) * 100000001n)
const decimals = prices.map((value) => value / 1000 - 25000)
const rates = Array.from({ length: 50 }, () => random() * 2 - 0.5)
const dashboard = [
  ...integers(7, 1000000, 51000000),
  ...integers(7, 10, 510),
  ...integers(7, 100000, 2100000),
]
const rows = Array.from({ length: 50 }, (_, i) => [
  { operation: 'formatVnNumber', value: i + 10000 },
  { operation: 'formatVnNumber', value: quantities[i] },
  { operation: 'formatVnCurrency', value: prices[i] },
  { operation: 'formatVnCurrency', value: prices[i] * quantities[i] },
  { operation: 'formatVnPercent', value: rates[i] },
  { operation: 'formatVnPercent', value: rates[49 - i] },
]) as Call[][]

export const scenarios: Scenario[] = [
  scenario('read/quantity (1 conversion)', 'readVnNumber', [5]),
  scenario('read/price (1 conversion)', 'readVnNumber', [199000]),
  scenario('read/quantities (50 conversions)', 'readVnNumber', quantities),
  scenario('read/prices (50 conversions)', 'readVnNumber', prices),
  scenario('read/invoices (50 conversions)', 'readVnNumber', totals),
  scenario('read/financial (50 conversions)', 'readVnNumber', amounts),
  scenario('read/dashboard (21 conversions)', 'readVnNumber', dashboard),
  scenario('read/mixed types (30 conversions)', 'readVnNumber', mixed),
  scenario('read/large bigint (50 conversions)', 'readVnNumber', largeIntegers),
  scenario('read/dense 300 digits (1 conversion)', 'readVnNumber', [
    '123456789'.repeat(33) + '123',
  ]),
  scenario('read/dense 3000 digits (1 conversion)', 'readVnNumber', [
    '123456789'.repeat(333) + '123',
  ]),
  scenario('read/trailing zeros 3001 digits (1 conversion)', 'readVnNumber', [
    '1' + '0'.repeat(3000),
  ]),
  scenario('read/all zeros 3000 digits (1 conversion)', 'readVnNumber', [
    '0'.repeat(3000),
  ]),
  scenario('format/numbers (50 conversions)', 'formatVnNumber', prices),
  scenario('format/decimals (50 conversions)', 'formatVnNumber', decimals),
  scenario('format/currency (50 conversions)', 'formatVnCurrency', prices),
  scenario(
    'format/currency decimals (50 conversions)',
    'formatVnCurrency',
    decimals,
  ),
  scenario('format/percent (50 conversions)', 'formatVnPercent', rates),
  scenario(
    'format/large bigint (50 conversions)',
    'formatVnCurrency',
    largeIntegers,
  ),
  scenario('format/mixed types (30 conversions)', 'formatVnCurrency', mixed),
  scenario('format/fallbacks (5 conversions)', 'formatVnNumber', [
    null,
    undefined,
    Number.NaN,
    'invalid',
    '100,0,0.000',
  ]),
  { name: 'format/data table (300 conversions)', calls: rows.flat() },
]

/** Consume output lengths so every conversion contributes to the result. */
export function runScenario(api: Library, calls: Call[]): number {
  let checksum = 0
  for (const { operation, value } of calls) {
    // Reader fixtures deliberately contain only its supported input types.
    checksum += api[operation](value as string | number | bigint).length
  }
  return checksum
}
