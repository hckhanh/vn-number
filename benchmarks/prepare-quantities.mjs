import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  buildComparison,
  headCommit,
  root,
  snapshotBaseline,
} from './baseline.mjs'
import { scenarios } from './cases.ts'

// Generated probes stay out of the regular benchmark suite and published package.
// Each probe runs in a separate Vitest invocation on the same CI runner.
const directory = join(root, 'benchmarks/results/local/quantities')
const baseline = snapshotBaseline('vn-number@2.0.5')
try {
  const entries = await buildComparison(baseline)
  mkdirSync(directory, { recursive: true })
  const quantities = scenarios.find(
    ({ name }) => name === 'read/quantities (50 conversions)',
  )
  assert(quantities)
  const inputs = JSON.stringify(quantities.calls)
  assert.equal(
    createHash('sha256').update(inputs).digest('hex'),
    '3b27dc3e55ac06339290e197985257e16ffc85bf32ee56d4ebb94d666bc800e8',
  )
  const bundles = {}
  for (const variant of ['baseline', 'candidate']) {
    const entry = entries[`${variant}Entry`]
    copyFileSync(entry, join(directory, `${variant}.mjs`))
    bundles[variant] = createHash('sha256')
      .update(readFileSync(entry))
      .digest('hex')
    for (const mode of ['seven', 'settled']) {
      const warmups = mode === 'settled' ? 1000 : 0
      writeFileSync(
        join(directory, `${variant}-${mode}.bench.ts`),
        `import { afterAll, beforeAll, bench, describe, expect } from 'vitest'
import { runScenario, scenarios } from '../../../cases.ts'
import * as library from './${variant}.mjs'

// Match the original reader suite's first three cases, including their order.
const selected = scenarios.slice(0, 3)
describe('controlled ${variant} ${mode}', () => {
  let checksum = 0
  beforeAll(() => {
    // Extra settling, when selected, is outside CodSpeed's measurement window.
    for (let round = 0; round < ${warmups}; round++) {
      for (const scenario of selected) checksum = runScenario(library, scenario.calls)
    }
  })
  afterAll(() => expect(checksum).toBeGreaterThan(0))
  for (const scenario of selected) {
    bench(scenario.name, () => {
      checksum = runScenario(library, scenario.calls)
    })
  }
})
`,
      )
    }
  }
  const metadata = {
    baselineCommit: baseline.commit,
    candidateCommit: headCommit(),
    node: process.version,
    v8: process.versions.v8,
    quantities: quantities.calls,
    inputSha256: createHash('sha256').update(inputs).digest('hex'),
    bundles,
    modes: {
      seven: 'CodSpeed default seven warmups',
      settled:
        '1000 extra rounds outside timing, then CodSpeed default warmups',
    },
  }
  writeFileSync(
    join(directory, 'metadata.json'),
    JSON.stringify(metadata, null, 2) + '\n',
  )
  console.log(JSON.stringify(metadata, null, 2))
} finally {
  baseline.cleanup()
}
