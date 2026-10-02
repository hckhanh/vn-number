# v3 performance report

The slowest measured operations in v2.0.5 were long reader inputs containing
trailing zeros. The reader rescanned the remaining groups at every position and
built its group array with `unshift`. v3 locates the last nonzero group once,
reads groups directly from the input, and computes each suffix from its position.
Zero-heavy input processing is linear in the number of digits instead of
quadratic. Direct digit lookup also reduces coercion and string trimming on the
common decimal-integer path. Existing non-decimal behavior is retained separately.

## Review qualification for the extreme speedup

The 443× case is exactly `'1' + '0'.repeat(3000)`. Both versions retain a
pre-existing wording defect and return `một nghìn tỷ` for that extreme magnitude.
It is a compatibility stress test, not a general Vietnamese-correctness claim.
Additional varied, correctly spelled powers of a billion with 1,001–1,003 output
characters still improved 219× when every output character was hashed inside
timing. See the [skeptical review](REVIEW.md) for scaling controls, exact sample
ranges, build-equivalence verification, and limitations.

## Matched before/after results

Measured on an Apple M2 Pro (arm64, macOS/Darwin 27.0.0), Node **24.16.0**,
V8 **13.6.233.17-node.49**, ICU **78.3**. The baseline is release
`vn-number@2.0.5`, commit `aca1fd91b2bdd0c0dfde4038bbae2e58b3815ce4`.
The starting checkout was `ca91bb335970b7408bd06c5fb0faa0af1460355d`;
its library source was identical to that release. Both variants use the same
installed tsdown 0.22.1 / Rolldown 1.0.2 build toolchain and ESM/neutral settings.

Times below are median **microseconds per complete batch**, not per conversion.
The stress cases are shown first because they had the worst per-conversion
baseline latency. Each raw report also contains time per conversion.

| Workload | Conversions | v2.0.5 µs | v3 µs | Speedup | Repeat speedup |
| --- | ---: | ---: | ---: | ---: | ---: |
| 3,001 digits, trailing zeros | 1 | 1,966.221 | 4.434 | 443.45× | 443.53× |
| 3,000 zero digits | 1 | 1,971.153 | 4.641 | 424.73× | 425.53× |
| 3,000 dense digits | 1 | 266.592 | 170.712 | 1.56× | 1.56× |
| 300 dense digits | 1 | 22.422 | 17.215 | 1.30× | 1.32× |
| Read large bigints | 50 | 75.137 | 56.810 | 1.32× | 1.32× |
| Read financial amounts | 50 | 45.488 | 32.603 | 1.40× | 1.38× |
| Read invoices | 50 | 35.862 | 26.992 | 1.33× | 1.32× |
| Read mixed input types | 30 | 21.439 | 16.010 | 1.34× | 1.32× |
| Read prices | 50 | 35.287 | 26.348 | 1.34× | 1.33× |
| Read dashboard | 21 | 10.912 | 7.480 | 1.46× | 1.43× |
| Read quantities | 50 | 11.577 | 5.244 | 2.21× | 2.16× |
| Format data table | 300 | 96.537 | 97.330 | 0.99× | 1.00× |

Every reader case improved in both runs. The nine formatting controls were
unchanged in implementation; their observed speedups were 0.990–1.006× across
both runs. Those tiny differences are measurement variation, not claimed gains.
The single fixed quantity case (5) improved from 0.175 to 0.017 µs, but the
50-value quantity batch is a more representative throughput measure.

The unminified ESM bundle decreased from **8,969 to 8,274 bytes** (7.7%).
These byte counts include comments and are not compressed transfer sizes.
There is no new runtime dependency, eager precomputed vocabulary, or growing cache.

Raw data, including every timing sample, calibration counts, runtime metadata,
and candidate source hash:

- [Final bundle comparison](results/m2-pro-node24.16.0.json)
- [Independent repeat](results/m2-pro-node24.16.0-repeat.json)
- [Initial identical-source control](results/baseline-control.json)

The initial control compared the unmodified implementation against its release
snapshot. It used five 40 ms rounds in source mode; ratios were approximately
0.97–1.03×. Final results use the bundled implementation and nine 75 ms rounds.

## Reproduce

Use the repository's pinned toolchain and lockfile. Close other CPU-heavy work
and run benchmarks sequentially on the same machine:

```sh
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm bench:verify
mise exec -- pnpm bench:compare --output /tmp/vn-number-comparison.json
mise exec -- pnpm bench:compare --output /tmp/vn-number-repeat.json
mise exec -- pnpm bench
```

`bench:compare` defaults to the v2.0.5 tag. It reads that ref with `git show`,
creates a temporary source snapshot, and builds both implementations with the
same installed toolchain. It never switches branches, changes refs, installs
packages, or rewrites package metadata. Temporary snapshots and bundles are
removed on completion. To compare another ref or narrow the workload:

```sh
mise exec -- pnpm bench:compare --baseline vn-number@2.0.5 --filter read/dashboard
mise exec -- pnpm bench:compare --mode source --filter 'trailing zeros'
```

All fixtures are generated once from seed `0x564e2026`. Timed callbacks only
perform the advertised conversions and accumulate output lengths. Input
construction, random generation, type conversion of fixtures, assertions, and
build work are outside timing. Each case first checks complete output equality.
Each implementation warms up and calibrates independently; timed samples then
alternate baseline/candidate order over nine rounds. Results report medians,
not the best sample. These are steady-state measurements, not cold-import tests.

The harness uses Node's native TypeScript loading and requires Node 24 and
system Git at `/usr/bin/git` (macOS/Linux) for the development comparison
workflow. Baselines accept branch names, tag names, or commit IDs, not revision
expressions or command-line options. These development requirements do not
change the library's runtime compatibility.

## Profiling

Capture profiles separately from wall-clock benchmark runs:

```sh
mise exec -- node --cpu-prof --cpu-prof-dir=/tmp --cpu-prof-name=vn-baseline.cpuprofile benchmarks/compare.mjs --mode source --profile baseline --filter 'trailing zeros'
mise exec -- node --cpu-prof --cpu-prof-dir=/tmp --cpu-prof-name=vn-candidate.cpuprofile benchmarks/compare.mjs --mode source --profile candidate --filter 'trailing zeros'
mise exec -- node --cpu-prof --cpu-prof-dir=/tmp --cpu-prof-name=vn-dashboard.cpuprofile benchmarks/compare.mjs --mode source --profile baseline --filter read/dashboard
```

A five-second baseline dashboard profile attributed about 41% of samples to
the core three-digit reader and its hundreds/tens/ones helpers, another 14% to
the first/subsequent-group wrappers, and 8% to group splitting.
A diagnostic three-second sparse-input profile with `--no-turbo-inlining`
attributed about 91% to `processGroup` and `allFollowingGroupsAreZero` combined.
The source also shows why this becomes quadratic: every zero group causes another
scan of its remaining zero suffix. Sampling attribution is approximate and can
move into callers after JIT inlining. The no-inlining diagnostic was not used for
reported performance timings.

## Correctness and limits

`bench:verify` performs **412,046 byte-for-byte comparisons** against v2.0.5:
the integer range 0–100,000 as number/string/bigint; seeded large integers;
leading zeros; dense and sparse groups; malformed strings; and formatting values
and fallbacks. Public exports must also match. Targeted Vitest regressions cover
long powers of a billion, zero groups, special Vietnamese endings, and legacy
non-decimal behavior.

Compatibility with the existing reader is the contract of this optimization.
It does not establish new linguistic semantics for unsupported negative,
fractional, exponential, or malformed inputs, nor repair existing large-magnitude
wording quirks. See [migration notes](../docs/migration-v3.md).

Results describe this machine and runtime. Browser, Deno, other Node/V8 versions,
and other CPUs can have different ratios. The corrected CodSpeed fixtures have
new names and exact batch counts; their scores should start a new comparison
series. In particular, PR #294's Node update also changed the dashboard runner
CPU, so its historical score change is not evidence of a library regression.

The package keeps version 2.0.5 until the repository's normal Changesets release
step consumes the pending major Changeset and generates 3.0.0. Nothing in this
work publishes a package or creates a tag.

See the [complete local validation record](VALIDATION.md) for tests, type checks,
lint, audit, build, release-plan validation, and package dry runs.
