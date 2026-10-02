import assert from 'node:assert/strict'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { root, snapshotBaseline } from './baseline.mjs'

const { values } = parseArgs({
  options: { baseline: { type: 'string', default: 'vn-number@2.0.5' } },
})
const snapshot = snapshotBaseline(values.baseline)
try {
  const previous = await import(
    pathToFileURL(join(snapshot.directory, 'src/index.ts')).href
  )
  const current = await import(pathToFileURL(join(root, 'src/index.ts')).href)
  assert.deepEqual(
    new Set(Object.keys(current)),
    new Set(Object.keys(previous)),
  )
  let comparisons = 0
  function check(operation, value) {
    assert.equal(
      current[operation](value),
      previous[operation](value),
      `${operation}(${String(value).slice(0, 100)})`,
    )
    comparisons++
  }

  // Exhaustive common integer range, including all 000–999 group spellings.
  for (let value = 0; value <= 100000; value++) {
    check('readVnNumber', value)
    check('readVnNumber', String(value))
    check('readVnNumber', BigInt(value))
  }
  let seed = 0x564e2026
  function random(limit) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed % limit
  }
  // Independent fixed corpus: group boundaries, leading zeros, sparse values,
  // powers of ten, dense arbitrary-length integers, and bigint conversions.
  for (let i = 0; i < 3000; i++) {
    let decimal = String(random(10))
    const length = i < 1000 ? i + 1 : 1 + random(3000)
    for (let j = 1; j < length; j++) decimal += String(random(i % 2 ? 10 : 2))
    check('readVnNumber', decimal)
    check('readVnNumber', BigInt(decimal))
    check('readVnNumber', '0'.repeat(i % 7) + decimal)
  }
  for (let zeros = 0; zeros < 1000; zeros++) {
    check('readVnNumber', '1' + '0'.repeat(zeros))
    check('readVnNumber', '0'.repeat(zeros))
    check('readVnNumber', '123' + '0'.repeat(zeros) + '001')
  }
  // These are compatibility checks, not newly documented reader semantics.
  const alphabet = '0129-+.eExX ,\t\nNaIé'
  for (let i = 0; i < 10000; i++) {
    let value = ''
    const length = random(40)
    for (let j = 0; j < length; j++) value += alphabet[random(alphabet.length)]
    check('readVnNumber', value)
  }
  for (const value of [
    Number.NaN,
    Infinity,
    -Infinity,
    -0,
    -1,
    -12345,
    1.2345,
    1e21,
    1e-7,
    -12345678901234567890n,
  ]) {
    check('readVnNumber', value)
  }
  for (let i = 0; i < 10000; i++) {
    const value = (random(0x100000000) - 0x80000000) / 1000
    for (const operation of [
      'formatVnNumber',
      'formatVnCurrency',
      'formatVnPercent',
    ]) {
      check(operation, value)
      check(operation, String(value))
      check(operation, BigInt(Math.trunc(value)))
    }
  }
  for (const value of [
    null,
    undefined,
    '',
    ' ',
    '0x10',
    Number.NaN,
    Infinity,
    -Infinity,
    -0,
    'invalid',
    '9007199254740993',
  ]) {
    for (const operation of [
      'formatVnNumber',
      'formatVnCurrency',
      'formatVnPercent',
    ])
      check(operation, value)
  }
  console.log(
    `${comparisons} byte-for-byte comparisons passed against ${values.baseline} (${snapshot.commit}). Public exports match.`,
  )
} finally {
  snapshot.cleanup()
}
