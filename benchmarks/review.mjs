import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { buildComparison, root, snapshotBaseline } from './baseline.mjs'

// Supplemental controls: variable inputs, output growing with input length,
// and consumption of every output character, not only the output length.
const snapshot = snapshotBaseline('vn-number@2.0.5')
try {
  await buildComparison(snapshot)
  const baseline = await import(
    pathToFileURL(join(snapshot.directory, 'baseline/index.js')).href
  )
  const candidate = await import(
    pathToFileURL(join(snapshot.directory, 'candidate/index.js')).href
  )
  assert.deepEqual(Object.keys(candidate), Object.keys(baseline))
  const words = ['một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
  const cases = [999, 1998, 2997].map((zeros) => ({
    name: `varying powers of a billion, ${zeros + 1} digits`,
    inputs: words.map((_, index) => String(index + 1) + '0'.repeat(zeros)),
    expected: words.map((word) => word + ' tỷ'.repeat(zeros / 9)),
  }))
  cases.push({
    name: 'varying sparse integers with a terminal nonzero, 3001 digits',
    inputs: words.map(
      (_, index) => String(index + 1) + '0'.repeat(2999) + String(9 - index),
    ),
  })
  for (const scenario of cases) {
    for (const [index, input] of scenario.inputs.entries()) {
      const expected = baseline.readVnNumber(input)
      assert.equal(candidate.readVnNumber(input), expected)
      if (scenario.expected) assert.equal(expected, scenario.expected[index])
    }
  }
  // Exhaust all strings up to three UTF-16 code units from this alphabet,
  // including whitespace, non-ASCII digits and unpaired surrogates.
  const alphabet = [
    ...'0123456789 +-ex.',
    '\t',
    '\n',
    '\0',
    '\u00a0',
    '\u200b',
    '\uff11',
    '\u0661',
    '\ud800',
    '\udc00',
  ]
  let compatibilityChecks = 0
  function check(value) {
    assert.equal(candidate.readVnNumber(value), baseline.readVnNumber(value))
    compatibilityChecks++
  }
  check('')
  for (const first of alphabet) {
    check(first)
    for (const second of alphabet) {
      check(first + second)
      for (const third of alphabet) check(first + second + third)
    }
  }
  for (const value of [
    null,
    undefined,
    Number.NaN,
    Infinity,
    -Infinity,
    -0,
    -1,
    -1.5,
    1e21,
    1e-7,
    -123456789012345678901234567890n,
  ])
    check(value)
  for (const operation of [
    'formatVnNumber',
    'formatVnCurrency',
    'formatVnPercent',
  ]) {
    for (const value of [
      null,
      undefined,
      Number.NaN,
      Infinity,
      -Infinity,
      -0,
      '',
      ' ',
      'invalid',
      '0x10',
      '9007199254740993',
      9007199254740993n,
    ]) {
      for (const fallback of ['', 'Không xác định', 'CUSTOM']) {
        assert.equal(
          candidate[operation](value, fallback),
          baseline[operation](value, fallback),
        )
        compatibilityChecks++
      }
    }
  }

  let sink = 0
  function measure(api, inputs, iterations) {
    let checksum = 0
    const start = performance.now()
    for (let iteration = 0; iteration < iterations; iteration++) {
      for (const input of inputs) {
        const output = api.readVnNumber(input)
        for (let index = 0; index < output.length; index++) {
          // Math.imul wraps the previous sum to 32 bits on the next step.
          checksum = Math.imul(checksum, 31) + output.codePointAt(index)
        }
      }
    }
    const elapsed = performance.now() - start
    sink ^= checksum
    return elapsed
  }
  const results = []
  const median = (samples) => [...samples].sort((a, b) => a - b)[4]
  for (const scenario of cases) {
    const apis = { baseline, candidate }
    const iterations = {}
    const samples = { baseline: [], candidate: [] }
    for (const label of ['baseline', 'candidate']) {
      let count = 1
      let elapsed
      do {
        elapsed = measure(apis[label], scenario.inputs, count)
        if (elapsed < 20) count *= 2
      } while (elapsed < 20)
      iterations[label] = Math.max(1, Math.ceil((count * 30) / elapsed))
    }
    for (let round = 0; round < 9; round++) {
      const order =
        round % 2 ? ['candidate', 'baseline'] : ['baseline', 'candidate']
      for (const label of order)
        samples[label].push(
          (measure(apis[label], scenario.inputs, iterations[label]) * 1000) /
            (iterations[label] * scenario.inputs.length),
        )
    }
    const lengths = scenario.inputs.map(
      (input) => candidate.readVnNumber(input).length,
    )
    const result = {
      name: scenario.name,
      distinctInputs: new Set(scenario.inputs).size,
      outputLengthRange: [Math.min(...lengths), Math.max(...lengths)],
      baselineMedianUs: median(samples.baseline),
      candidateMedianUs: median(samples.candidate),
      speedup: median(samples.baseline) / median(samples.candidate),
      iterations,
      samples,
    }
    results.push(result)
    console.log(
      `${result.name}: ${result.baselineMedianUs.toFixed(3)} -> ${result.candidateMedianUs.toFixed(3)} us/conversion + full output hash (${result.speedup.toFixed(2)}x)`,
    )
  }
  const report = {
    timestamp: new Date().toISOString(),
    runtime: { node: process.version, v8: process.versions.v8 },
    baselineCommit: snapshot.commit,
    compatibilityChecks,
    methodology: {
      rounds: 9,
      sampleMs: 30,
      alternatingOrder: true,
      unit: 'us/conversion including full character hash',
    },
    primaryCase: {
      input: "'1' + '0'.repeat(3000)",
      digits: 3001,
      groups: 1001,
      oldTrailingGroupChecks: 500500,
      newTrailingDigitChecks: 3000,
      output: baseline.readVnNumber('1' + '0'.repeat(3000)),
      note: 'This short output is an existing magnitude-wording defect; the scaling controls above use correctly repeated billion suffixes.',
    },
    bundleBytes: {
      baseline: readFileSync(join(snapshot.directory, 'baseline/index.js'))
        .length,
      candidate: readFileSync(join(snapshot.directory, 'candidate/index.js'))
        .length,
    },
    sink,
    results,
  }
  writeFileSync(
    join(root, 'benchmarks/results/skeptical-review.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
  console.log(`${compatibilityChecks} additional edge/fallback checks passed.`)
} finally {
  snapshot.cleanup()
}
