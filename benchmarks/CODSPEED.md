# CodSpeed configuration audit

Audit date: 2026-10-02. The Node 24 simulation flag set is incomplete in the
installed SDK. The workflow mode, action authentication, and installed Vitest /
Vite combination are otherwise consistent with their supported interfaces.

## Versions and measurement boundaries

| Component | Actual version / configuration | Finding |
| --- | --- | --- |
| Node / V8 | 24.16.0 / 13.6.233.17-node.49 | Maglev remains enabled under `--no-opt` |
| CodSpeed Node plugin / core | 5.7.1 / 5.7.1 | Missing two flags added by upstream's Node 24 support |
| CodSpeed action / runner | 4.19.1 / 4.19.1 | Both held fixed in the controlled comparison |
| Vitest / Vite | 4.1.11 / 7.3.6 | Within plugin 5.7.1's declared peer ranges |
| Mode / workers | `simulation` / forks | SDK selects its analysis runner and adds V8 flags |
| CI authentication | `contents: read`, `id-token: write` | Matches documented OIDC setup; uploads succeed |

Repository commit `1e7d18b` upgraded the plugin from 5.4.0 to 5.7.1, and
`c5ace8b` upgraded the action from 4.17.0 to 4.19.1. Both changes precede the
benchmark-only baseline `fc62f7c`. No SDK or runner version changed between the
old-reader and optimized-reader measurements.

The action's omitted `runner-version` reads its checked-in default; the logs
confirm runner 4.19.1, not an unpinned latest runner. The Node SDK version and
Rust runner/action version are separate release lines.

## Confirmed SDK compatibility gap

[Upstream commit e3224e7](https://github.com/CodSpeedHQ/codspeed-node/commit/e3224e7)
adds `--no-minor-gc-task` on Node >=20 and `--no-maglev` on Node >=24. On this
project's Node 24, `--no-opt` aliases `--no-turbofan`; Maglev can still optimize
hot code. The former minor-GC flag was renamed, so SDK 5.7.1 supplies neither
minor-GC-task suppression nor Maglev suppression on Node 24. The local
`node --no-opt --v8-options` output confirms both remain enabled.

Those changes ship with explicit Node 24 support in
[6.0.0-beta.0](https://github.com/CodSpeedHQ/codspeed-node/releases/tag/v6.0.0-beta.0).
A flag backport addresses that measured configuration difference; it does not
turn 5.7.1 into a fully supported Node 24 SDK or prove all future compatibility.
No prerelease dependency upgrade was made.

## Controlled experiment

The `node24-flags` pair uses the same frozen quantities, library bundles, case
order, seven warmups and timed callback as the original `seven` pair, adding
only the two upstream flags through `vitest.codspeed-node24.config.mts`.
Each runs in a separate Vitest process on one CI runner. Assertions after
measurement confirm the extra flags actually reached the workers; all workers
log their Node/V8 versions and complete arguments. Distinct benchmark paths and
names preserve the original scores instead of overwriting them.

### Results on one AMD EPYC 7763 runner

[GitHub run 37009044464](https://github.com/hckhanh/vn-number/actions/runs/37009044464)
and [CodSpeed run 6abfa96148983cb45770b3fb](https://app.codspeed.io/hckhanh/vn-number/runs/6abfa96148983cb45770b3fb)
measured branch head `98b15849afe138109419a741cf78b7fc425ddb87` through PR test
merge `f4d7645b0b936a6461eb3168884e640e14692697`. All seven checks passed.
The release baseline remains `aca1fd91b2bdd0c0dfde4038bbae2e58b3815ce4`;
production source and both bundle hashes are unchanged from the earlier controls.

Times are CPU-simulation microseconds per 50 conversions, not native latency.

| Same-runner measurement | Baseline | Candidate | Speedup | System calls, baseline / candidate |
| --- | ---: | ---: | ---: | ---: |
| Existing flags, default seven warmups | 614.795 | 1,104.389 | 0.56× | 20 / 15 |
| Add the two Node 24 flags, same seven warmups | 296.576 | 123.892 | 2.39× | 0 / 0 |
| Existing flags, 1,000 extra settling rounds | 151.654 | 73.670 | 2.06× | 0 / 0 |

The original source benchmark remains at 1,081.754 µs. Both default-flag
quantities measurements report significant system time; the corrected pair
reports no measurement warnings. The full raw record includes all three cases
for every probe, hashes, environment, worker arguments and measurement warnings:
[Node 24 flag evidence](results/codspeed-node24-flags.json).

The missing flag set materially affects this simulation window and accounts for
the direction of the quantities anomaly in this controlled experiment. The
library, inputs, default warmup count, runner and SDK did not change. This is
stronger evidence than attributing the difference to CPU variation or to the
local Sparkplug trace. The test applies both flags together, so it does not
isolate Maglev from minor-GC scheduling, or prove that either one alone explains
every extra instruction. It also does not establish a new native speedup: native
steady-state and first-call results are separate measurements.

### Recommendation and scope

Use the upstream-compatible Node 24 analysis flag set for future simulation
comparisons, with a fresh matched baseline. The explicit compatibility config
and its CI pair provide a tested backport while retaining stable dependencies.
The regular suite and historical default probes remain visible; this audit does
not silently replace their measurement regime or erase their regression signal.
The new configuration is an opt-in Node 24 diagnostic, not a general runtime
flag recommendation for library users. A full SDK or runner upgrade should be a
separate compatibility change, not part of claiming a v3 reader speedup.

All six probe workers confirmed Node 24.16.0 / V8 13.6.233.17-node.49. The two
corrected workers asserted both flags after their measurements. The installed
SDK still provides the rest of the simulation flags; Vite merges the additional
arguments with those defaults. No native benchmark or production code changed.

## Other upgrade changes

The 5.7.1 analysis runner calls each callback seven times, runs GC, then measures
one call. Tinybench options such as `time`, `iterations`, `warmupTime`, and
`warmupIterations` do not control this simulation path. The separate settled
probes use supported suite `beforeAll` hooks and intentionally answer a different
question from the default-warmup probes. They remain separately named.

The [6.0.0-beta.1 release](https://github.com/CodSpeedHQ/codspeed-node/releases/tag/v6.0.0-beta.1)
adds Vite 8 support, fixes benchmark-option setup/teardown, and removes deprecated
Vitest subpath imports. This checkout uses Vite 7 and suite hooks rather than
benchmark-option setup/teardown. Its deprecated-import warnings are real but
nonfatal; these changes do not establish the cause of the quantities signal.
The [beta.2 native-addon loading fix](https://github.com/CodSpeedHQ/codspeed-node/releases/tag/v6.0.0-beta.2) is also distinct from the V8 flag test.

[Runner 5.0's changes](https://github.com/CodSpeedHQ/codspeed/blob/main/CHANGELOG.md)
include new CPU cycle estimation defaults and initially enabled allocation
exclusion, reversed in 5.0.1. Updating that release line during this experiment
would change the measurement model. Any later runner upgrade needs a fresh
paired baseline and explicit metric settings.

The [current Vitest integration documentation](https://codspeed.io/docs/benchmarks/nodejs/vitest)
uses `simulation` and OIDC, which already match this workflow. A
`workflow_dispatch` trigger could enable CodSpeed backtests but is unrelated to
the current PR-triggered measurements. No trigger, authentication, threshold,
or result-filter changes were needed for this experiment.

## Reproduce

```sh
mise exec -- node benchmarks/prepare-quantities.mjs
```

Inside the pinned CodSpeed action, run each of the following once in the same
job. The workflow also retains the regular and settled probes. Do not run the
same benchmark URI twice with different flags in one upload.

```sh
pnpm vitest bench benchmarks/results/local/quantities/baseline-seven.bench.ts
pnpm vitest bench benchmarks/results/local/quantities/candidate-seven.bench.ts
pnpm vitest bench --config vitest.codspeed-node24.config.mts benchmarks/results/local/quantities/baseline-node24-flags.bench.ts
pnpm vitest bench --config vitest.codspeed-node24.config.mts benchmarks/results/local/quantities/candidate-node24-flags.bench.ts
```

A local worker smoke test can set `CODSPEED_ENV=1 CODSPEED_RUNNER_MODE=simulation`
and invoke `node node_modules/vitest/vitest.mjs` with the same arguments. Without
the Linux instrument it only verifies execution/configuration and produces no
valid CPU-simulation measurement.
