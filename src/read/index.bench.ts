import { expect, test } from 'vitest'
import { runScenario, scenarios } from '../../benchmarks/cases.ts'
import * as library from '../index.ts'

test(
  'deterministic read workloads',
  { timeout: 120_000 },
  async ({ bench }) => {
    let checksum = 0

    for (const scenario of scenarios.filter(({ name }) =>
      name.startsWith('read/'),
    )) {
      await bench(scenario.name, () => {
        checksum = runScenario(library, scenario.calls)
      }).run()
    }
    expect(checksum).toBeGreaterThan(0)
  },
)
