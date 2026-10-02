import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { cpus, platform, release } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import {
  buildComparison,
  headCommit,
  root,
  snapshotBaseline,
} from './baseline.mjs'
import { scenarios } from './cases.ts'

const { values } = parseArgs({
  options: {
    rounds: { type: 'string', default: '30' },
    output: { type: 'string' },
  },
})
const rounds = Number(values.rounds)
assert(
  Number.isInteger(rounds) && rounds >= 5 && rounds <= 100,
  'Use 5–100 paired rounds',
)
const quantityScenario = scenarios.find(
  (scenario) => scenario.name === 'read/quantities (50 conversions)',
)
assert(quantityScenario, 'The fixed quantities fixture must exist')
const quantities = quantityScenario.calls.map((call) => call.value)
const cases = [
  { name: 'empty process', count: 0, inputs: [], control: true },
  { name: 'root import only', count: 0, inputs: [] },
  { name: 'first quantity 5', count: 1, inputs: [5] },
  { name: 'first quantity 89', count: 1, inputs: [89] },
  { name: 'first quantity 100', count: 1, inputs: [100] },
  ...[10, 50, 400, 1000].map((count) => ({
    name: `quantities burst ${count}`,
    count,
    inputs: quantities,
  })),
]
const columns = [
  'spawnToExitNs',
  'entryUptimeNs',
  'importNs',
  'firstCallNs',
  'conversionNs',
  'completeOperationNs',
]
const worker = join(root, 'benchmarks/cold-worker.mjs')
const snapshot = snapshotBaseline('vn-number@2.0.5')
try {
  const entries = await buildComparison(snapshot)
  const baseline = await import(pathToFileURL(entries.baselineEntry).href)
  const candidate = await import(pathToFileURL(entries.candidateEntry).href)
  // Validate full results in this parent. These module instances are never used
  // in the independent measurement processes.
  const expected = new Map()
  for (const scenario of cases) {
    const output = Array.from({ length: scenario.count }, (_, i) =>
      baseline.readVnNumber(scenario.inputs[i % scenario.inputs.length]),
    )
    assert.deepEqual(
      output,
      Array.from({ length: scenario.count }, (_, i) =>
        candidate.readVnNumber(scenario.inputs[i % scenario.inputs.length]),
      ),
    )
    expected.set(scenario.name, output)
  }
  const results = cases.map((scenario) => ({
    ...scenario,
    samples: scenario.control
      ? { control: [] }
      : { baseline: [], candidate: [] },
  }))
  const run = (scenario, label) => {
    const entry =
      label === 'control'
        ? 'none'
        : pathToFileURL(entries[`${label}Entry`]).href
    const start = process.hrtime.bigint()
    const stdout = execFileSync(
      process.execPath,
      [worker, entry, String(scenario.count), JSON.stringify(scenario.inputs)],
      {
        encoding: 'utf8',
        timeout: 30000,
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          NODE_OPTIONS: '',
          NODE_DISABLE_COMPILE_CACHE: '1',
        },
      },
    )
    const spawnToExitNs = Number(process.hrtime.bigint() - start)
    const data = JSON.parse(stdout)
    assert.equal(data.node, process.version)
    assert.equal(data.v8, process.versions.v8)
    assert.deepEqual(data.outputs, expected.get(scenario.name))
    scenario.samples[label].push(
      columns.map((key) =>
        key === 'spawnToExitNs' ? spawnToExitNs : data[key],
      ),
    )
  }
  for (let round = 0; round < rounds; round++) {
    // Rotate case order and alternate variant order to spread time-related bias.
    for (let offset = 0; offset < results.length; offset++) {
      const scenario = results[(round + offset) % results.length]
      if (scenario.control) {
        run(scenario, 'control')
        continue
      }
      const order =
        round % 2 ? ['candidate', 'baseline'] : ['baseline', 'candidate']
      for (const label of order) run(scenario, label)
    }
  }
  const summary = (samples) => {
    const sorted = [...samples].sort((a, b) => a - b)
    const percentile = (p) => sorted[Math.ceil(p * sorted.length) - 1]
    const middle = sorted.length / 2
    return {
      min: sorted[0],
      p10: percentile(0.1),
      median:
        (sorted[Math.floor((sorted.length - 1) / 2)] +
          sorted[Math.floor(middle)]) /
        2,
      p90: percentile(0.9),
      max: sorted.at(-1),
    }
  }
  for (const scenario of results) {
    scenario.summary = {}
    for (const [label, samples] of Object.entries(scenario.samples)) {
      scenario.summary[label] = Object.fromEntries(
        columns.map((column, index) => [
          column,
          summary(samples.map((sample) => sample[index])),
        ]),
      )
    }
    if (!scenario.control) {
      scenario.pairedMedianDeltaNs = Object.fromEntries(
        columns.map((column, index) => [
          column,
          summary(
            scenario.samples.candidate.map(
              (sample, round) =>
                sample[index] - scenario.samples.baseline[round][index],
            ),
          ).median,
        ]),
      )
      console.log(
        `${scenario.name}: import ${(scenario.summary.baseline.importNs.median / 1e6).toFixed(3)} -> ${(scenario.summary.candidate.importNs.median / 1e6).toFixed(3)} ms; conversions ${(scenario.summary.baseline.conversionNs.median / 1000).toFixed(3)} -> ${(scenario.summary.candidate.conversionNs.median / 1000).toFixed(3)} us; spawn-to-exit ${(scenario.summary.baseline.spawnToExitNs.median / 1e6).toFixed(3)} -> ${(scenario.summary.candidate.spawnToExitNs.median / 1e6).toFixed(3)} ms`,
      )
    }
  }
  const report = {
    timestamp: new Date().toISOString(),
    baselineCommit: snapshot.commit,
    candidateHead: headCommit(),
    runtime: {
      node: process.version,
      v8: process.versions.v8,
      icu: process.versions.icu,
    },
    machine: {
      cpu: cpus()[0].model,
      arch: process.arch,
      platform: platform(),
      release: release(),
    },
    bundleSha256: Object.fromEntries(
      Object.entries(entries).map(([label, path]) => [
        label,
        createHash('sha256').update(readFileSync(path)).digest('hex'),
      ]),
    ),
    methodology: {
      rounds,
      freshProcesses: rounds * (cases.length * 2 - 1),
      alternatingOrder: true,
      rotatingCaseOrder: true,
      unit: 'nanoseconds',
      columns,
      nativeWallClock: true,
      jitWarmup: false,
      nodeCompileCacheDisabled: true,
      filesystemCache:
        'Not flushed; fresh JavaScript processes, warm OS/filesystem cache',
      spawnToExit:
        'Parent-observed process creation, Node startup, fixture setup, import, conversions, result serialization/pipe transfer and exit',
      entryUptime: 'Child process uptime at its first user-code statement',
      import:
        'Dynamic root import including module loading, parsing, evaluation and eager Intl initializers',
      conversions:
        'First call plus the remaining burst, including output-array accumulation and first-call timer; no import or output serialization',
      completeOperation:
        'Dynamic import through completion of the requested conversions, excluding child startup, output serialization and process exit',
    },
    results,
  }
  if (values.output)
    writeFileSync(values.output, JSON.stringify(report, null, 2) + '\n')
  console.log(
    `${report.methodology.freshProcesses} fresh processes completed with byte-for-byte output validation.`,
  )
} finally {
  snapshot.cleanup()
}
