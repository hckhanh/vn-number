# Performance benchmarks

The maintained suite contains 13 reader and 9 formatting workloads in
`src/read/index.bench.ts` and `src/format/number.bench.ts`. Fixtures are generated
once from seed `0x564e2026` in `cases.ts`. Timed callbacks perform the advertised
conversions and consume output lengths. Setup and assertions are outside timing.
The dashboard case performs exactly 21 conversions.

Keep benchmark paths, names, input values, batch sizes and callbacks stable.
If measured work changes, establish a new baseline rather than treating the old
score as comparable. In particular, the older randomized suite on `main` does
not match these 22 cases; a report containing only NEW/SKIPPED cases is not a
before/after performance gate.

## Run through CodSpeed

The pinned integration is `@codspeed/vitest-plugin` **6.0.0-beta.2**, Node
**24.16.0**, Vitest **4.1.11**, Vite **8.3.2**, and CodSpeed action/runner **5.4.0**.
The SDK is a prerelease chosen explicitly for its Node 24 support. It supplies
the required simulation V8 flags; no custom flag override is maintained.

The workflow explicitly enables cycle estimation and includes allocation costs.
Runner 5 weights instructions by estimated cycle cost and uses Samply for Linux
walltime profiles. Its absolute scores are not comparable with runner 4.19.1.
Use a fresh baseline and candidate on runner 5.4.0, with matching CPU metadata;
do not report the instrumentation change as a library performance improvement.
See the [runner 5 migration notes](https://github.com/CodSpeedHQ/codspeed/releases/tag/v5.0.1)
and [action 5.4.0 release](https://github.com/CodSpeedHQ/action/releases/tag/v5.4.0).

On a configured CodSpeed runner:

```sh
codspeed run -m simulation -- pnpm bench
codspeed run -m walltime -- pnpm bench
```

Routine CI runs only the maintained source suite in simulation mode. The CodSpeed
workflow also accepts an explicit `mode` through manual dispatch or workflow_call
for walltime validation. Keep the instrument, SDK/runtime, inputs and build
settings matched between compared runs. Hosted VM walltime can be noisy; inspect
hardware and measurement warnings before treating small differences as changes.

The `bench` script selects `src/` explicitly so locally generated diagnostics
cannot enter routine reports. Diagnostic investigations should use an explicit
CodSpeed run outside the normal comparison series, with stable matched identities
for each controlled comparison. Do not repeatedly upload different variants
under the same URI in a single run.

## Compatibility verification

```sh
mise exec -- node benchmarks/verify.mjs
```

This compares outputs and public exports against release `vn-number@2.0.5`.
`baseline.mjs` reads immutable Git source into a temporary directory without
switching the checkout, changing refs, or installing another toolchain. It uses
system Git at `/usr/bin/git` and accepts branch names, tags or commit IDs.
This is a correctness check, not a performance measurement.

## Shared baseline for the tooling and performance PRs

[PR #298](https://github.com/hckhanh/vn-number/pull/298) establishes these fixtures
with the released reader on the upgraded toolchain. [PR #295](https://github.com/hckhanh/vn-number/pull/295)
uses the same files and dependencies with the optimized reader. Their fresh
CodSpeed comparisons are the performance evidence for the upgraded environment.
Older SDK 5 and randomized results are retained as history, not used as the gate
for this suite. Moving the shared harness does not change production library code.

## Historical v3 investigation

The original profiles, paired measurements, startup/warmup/flag probes and raw
samples are preserved in [the investigation snapshot](https://github.com/hckhanh/vn-number/tree/a69d7db5bce85962a4a4d74380b19fd7e5b0e619/benchmarks)
and [PR #295](https://github.com/hckhanh/vn-number/pull/295).
They are historical evidence with their recorded SDK/runtime and measurement
conditions, not additional routine benchmark cases. The snapshot also preserves
reproduction scripts for explicitly requested diagnostic work.

Those tests found faster reading while preserving existing output, including
legacy edge behavior. The extreme trailing-zero stress case retains an existing
magnitude-wording defect, so its large ratio must not be advertised as general
Vietnamese correctness. See the [v3 migration notes](https://github.com/hckhanh/vn-number/blob/codex/v3-performance/docs/migration-v3.md).

Only `dist` is included in the package allowlist. Benchmark tooling is not shipped
to library consumers.
