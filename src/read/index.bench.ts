import { afterAll, bench, describe, expect } from 'vitest'
import { runScenario, scenarios } from '../../benchmarks/cases.ts'
import * as library from '../index.ts'

describe('deterministic read workloads', () => {
  let checksum = 0
  afterAll(() => {
    expect(checksum).toBeGreaterThan(0)
  })
  for (const scenario of scenarios.filter(({ name }) =>
    name.startsWith('read/'),
  )) {
    bench(scenario.name, () => {
      checksum = runScenario(library, scenario.calls)
    })
  }
})
