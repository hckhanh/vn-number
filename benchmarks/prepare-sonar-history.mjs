import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'tsdown'
import { root, snapshotBaseline } from './baseline.mjs'
import { scenarios } from './cases.ts'

// Opt-in diagnostic branch only. Every variant uses one runner, the same built
// entry shape and fixtures, and an independent Vitest process.
const variants = [
  ['before', '368885ca1823da25ab5a5739ff9f6ac0d09b440b'],
  ['first', '7b931d70b9f3bb5a513f7a05832d63b059ecbdd1'],
  ['second', '418c0e918fb5499733eaa3ad0501596cbf153ef0'],
  ['v3', '8c763e85fdb5a43a33e49d8a0b9cd589bc64cec7'],
  ['candidate', 'HEAD'],
]
const names = [
  'read/quantities (50 conversions)',
  'read/dashboard (21 conversions)',
  'read/dense 3000 digits (1 conversion)',
  'read/trailing zeros 3001 digits (1 conversion)',
  'format/numbers (50 conversions)',
]
const selected = scenarios.filter(({ name }) => names.includes(name))
const expected = new Map()
const hash = (value) => createHash('sha256').update(value).digest('hex')
const fixtureHash = hash(
  JSON.stringify(
    selected.map(({ name, calls }) => [
      name,
      calls.map(({ operation, value }) => [
        operation,
        typeof value,
        String(value),
      ]),
    ]),
  ),
)
const priorDirectory = process.cwd()
for (const [label, ref] of variants) {
  const snapshot = snapshotBaseline(ref)
  const directory = join(root, 'benchmarks/results/local/sonar-history', label)
  mkdirSync(directory, { recursive: true })
  try {
    // Hold formatting and public entry wrappers fixed across historical readers.
    for (const file of [
      'src/index.ts',
      'src/format/index.ts',
      'src/format/number.ts',
    ]) {
      writeFileSync(
        join(snapshot.directory, file),
        readFileSync(join(root, file)),
      )
    }
    process.chdir(snapshot.directory)
    await build({
      config: false,
      tsconfig: join(root, 'tsconfig.json'),
      entry: ['src/index.ts'],
      outDir: directory,
      platform: 'neutral',
      format: 'esm',
      dts: false,
      exports: false,
      logLevel: 'silent',
    })
    process.chdir(priorDirectory)
    const api = await import(pathToFileURL(join(directory, 'index.js')).href)
    for (const scenario of selected) {
      const outputs = scenario.calls.map(({ operation, value }) =>
        api[operation](value),
      )
      if (expected.has(scenario.name))
        assert.deepEqual(outputs, expected.get(scenario.name))
      else expected.set(scenario.name, outputs)
    }
    const benchmark = `import { afterAll, bench, describe, expect } from 'vitest'
import * as api from './index.js'
import { runScenario, scenarios } from '../../../../cases.ts'
const names = ${JSON.stringify(names)}
describe('historical Sonar control: ${label}', () => {
  let checksum = 0
  afterAll(() => expect(checksum).toBeGreaterThan(0))
  for (const scenario of scenarios.filter(({ name }) => names.includes(name))) {
    bench(scenario.name, () => { checksum = runScenario(api, scenario.calls) })
  }
})
`
    writeFileSync(join(directory, 'index.bench.ts'), benchmark)
    console.log(
      JSON.stringify({
        label,
        commit: snapshot.commit,
        fixtureHash,
        bundleHash: hash(readFileSync(join(directory, 'index.js'))),
        node: process.version,
      }),
    )
  } finally {
    process.chdir(priorDirectory)
    snapshot.cleanup()
  }
}
console.log(
  'All five variants produce identical outputs for every measured input.',
)
