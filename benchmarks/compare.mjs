import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { cpus, platform, release } from 'node:os'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { git, root, snapshotBaseline } from './baseline.mjs'
import { runScenario, scenarios } from './cases.ts'

const { values } = parseArgs({
  options: {
    baseline: { type: 'string', default: 'vn-number@2.0.5' },
    output: { type: 'string' },
    filter: { type: 'string', default: '' },
    rounds: { type: 'string', default: '9' },
    'sample-ms': { type: 'string', default: '75' },
    profile: { type: 'string' },
    'profile-ms': { type: 'string', default: '5000' },
    mode: { type: 'string', default: 'bundle' },
  },
})
assert(
  ['source', 'bundle'].includes(values.mode),
  'mode must be source or bundle',
)
const snapshot = snapshotBaseline(values.baseline)
const { directory: temp, commit: baselineCommit } = snapshot

try {
  let baselineEntry = join(temp, 'src/index.ts')
  let candidateEntry = join(root, 'src/index.ts')
  if (values.mode === 'bundle') {
    const { build } = await import('tsdown')
    // Match the published ESM build; use one installed toolchain for both refs.
    // Disable export rewriting so benchmarking never changes package.json.
    const previousDirectory = process.cwd()
    try {
      // Rolldown's region comments use the process directory. Build from each
      // source root so temporary absolute paths cannot inflate baseline size.
      for (const [label, sourceRoot] of [
        ['baseline', temp],
        ['candidate', root],
      ]) {
        process.chdir(sourceRoot)
        await build({
          config: false,
          tsconfig: join(root, 'tsconfig.json'),
          entry: ['src/index.ts'],
          outDir: join(temp, label),
          platform: 'neutral',
          format: 'esm',
          dts: false,
          exports: false,
          logLevel: 'silent',
        })
      }
    } finally {
      process.chdir(previousDirectory)
    }
    baselineEntry = join(temp, 'baseline/index.js')
    candidateEntry = join(temp, 'candidate/index.js')
  }
  const baseline = await import(pathToFileURL(baselineEntry).href)
  const candidate = await import(pathToFileURL(candidateEntry).href)
  const selected = scenarios.filter(({ name }) => name.includes(values.filter))
  assert(selected.length > 0, 'No matching scenarios')
  for (const scenario of selected) {
    for (const { operation, value } of scenario.calls) {
      assert.equal(
        candidate[operation](value),
        baseline[operation](value),
        scenario.name,
      )
    }
  }

  let checksum = 0
  function measure(api, scenario, iterations) {
    let sum = 0
    const start = performance.now()
    for (let i = 0; i < iterations; i++) sum += runScenario(api, scenario.calls)
    const elapsed = performance.now() - start
    checksum = (checksum + sum) % Number.MAX_SAFE_INTEGER
    return elapsed
  }

  if (values.profile) {
    assert(
      ['baseline', 'candidate'].includes(values.profile),
      'profile must be baseline or candidate',
    )
    const api = values.profile === 'baseline' ? baseline : candidate
    const end = performance.now() + Number(values['profile-ms'])
    while (performance.now() < end) {
      for (const scenario of selected) measure(api, scenario, 10)
    }
    console.log(
      `Profiled ${values.profile}: ${selected.map((s) => s.name).join(', ')}; checksum=${checksum}`,
    )
  } else {
    const rounds = Number(values.rounds)
    const sampleMs = Number(values['sample-ms'])
    assert(Number.isInteger(rounds) && rounds >= 3, 'Use at least three rounds')
    assert(sampleMs >= 10, 'Use at least 10 ms per sample')
    const median = (samples) =>
      [...samples].sort((a, b) => a - b)[Math.floor(samples.length / 2)]
    const results = []
    for (const scenario of selected) {
      const implementations = { baseline, candidate }
      const iterations = {}
      const samples = { baseline: [], candidate: [] }
      for (const [label, api] of Object.entries(implementations)) {
        let count = 1
        let elapsed
        do {
          elapsed = measure(api, scenario, count)
          if (elapsed < 20) count *= 2
        } while (elapsed < 20)
        iterations[label] = Math.max(1, Math.ceil((count * sampleMs) / elapsed))
      }
      for (let round = 0; round < rounds; round++) {
        // Alternating order limits systematic warm-up/thermal ordering bias.
        const order =
          round % 2 === 0
            ? ['baseline', 'candidate']
            : ['candidate', 'baseline']
        for (const label of order) {
          samples[label].push(
            (measure(implementations[label], scenario, iterations[label]) *
              1e6) /
              iterations[label],
          )
        }
      }
      const baselineNs = median(samples.baseline)
      const candidateNs = median(samples.candidate)
      const row = {
        name: scenario.name,
        conversions: scenario.calls.length,
        baselineNs,
        candidateNs,
        speedup: baselineNs / candidateNs,
        baselineNsPerConversion: baselineNs / scenario.calls.length,
        candidateNsPerConversion: candidateNs / scenario.calls.length,
        iterations,
        samples,
      }
      results.push(row)
      console.log(
        `${row.name}: ${(baselineNs / 1000).toFixed(3)} -> ${(candidateNs / 1000).toFixed(3)} us/batch (${row.speedup.toFixed(2)}x)`,
      )
    }
    const sourceHash = createHash('sha256')
    const candidateFiles = readdirSync(join(root, 'src'), { recursive: true })
      .filter(
        (path) => path.endsWith('.ts') && !/\.(test|bench)\.ts$/.test(path),
      )
      .map((path) => 'src/' + path)
      .sort()
    for (const path of candidateFiles) {
      sourceHash.update(path).update(readFileSync(join(root, path)))
    }
    const report = {
      timestamp: new Date().toISOString(),
      baselineRef: values.baseline,
      baselineCommit,
      candidateHead: git('rev-parse', 'HEAD').trim(),
      candidateSourceSha256: sourceHash.digest('hex'),
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
      methodology: {
        rounds,
        sampleMs,
        statistic: 'median',
        alternatingOrder: true,
        seed: '0x564e2026',
        unit: 'ns/batch',
        mode: values.mode,
      },
      bundleBytes:
        values.mode === 'bundle'
          ? {
              baseline: readFileSync(baselineEntry).length,
              candidate: readFileSync(candidateEntry).length,
            }
          : undefined,
      checksum,
      results,
    }
    if (values.output)
      writeFileSync(values.output, `${JSON.stringify(report, null, 2)}\n`)
  }
} finally {
  snapshot.cleanup()
}
