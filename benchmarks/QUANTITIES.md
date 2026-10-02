# Controlled quantities diagnosis

The quantities slowdown is **warmup-sensitive, not explained solely by the CPU
mismatch**. A single CI runner reproduced the slowdown with CodSpeed's default
warmup, while settled measurements of the same code and inputs improved. No
production reader change was made in response to this diagnostic.

## Exact provenance

The original comparison was `fc62f7c` versus `6ed2598`, in
[CodSpeed](https://app.codspeed.io/hckhanh/vn-number/runs/compare/6abf93e633a25f6e1e74f5c9..6abf968ea9c8c0f373101403).
Its default-warmup quantities score was 633.476 → 1,081.985 simulated µs, with an
EPYC 9V74 baseline and EPYC 7763 candidate. Repeating the candidate reproduced it.

The controlled experiment is [GitHub run 37003644978](https://github.com/hckhanh/vn-number/actions/runs/37003644978),
[CodSpeed run 6abf9c33a9c8c0f373101449](https://app.codspeed.io/hckhanh/vn-number/runs/6abf9c33a9c8c0f373101449),
at branch head `864ffabf4c2525164799369a50a34c8447ddcf9e`. GitHub checked out the
PR test merge `4caad81c8806d61d75a11d607a4357c9ea0b24b4`.
Its reader source is unchanged from `6ed2598`.

The baseline is release `aca1fd91b2bdd0c0dfde4038bbae2e58b3815ce4`, whose production
source matches `fc62f7c`. Both libraries are built with the same installed
tsdown/Rolldown toolchain and ESM settings. Their hashes still match the original
reviewed bundles; the [raw record](results/quantities-codspeed-control.json)
contains both hashes and the fixture hash.

All measurements below ran on **one Intel Xeon 6973P-C CI runner**. The native
comparisons record Node **24.16.0**, V8 **13.6.233.17-node.49**, ICU **78.3**.
The paired CodSpeed probes use the same runtime, dependencies and flags, in four
sequential, separate Vitest invocations on that runner. Each invocation uses the
same first three cases in order: single quantity, single price, then quantities.
The 50 quantities are identical numbers: 49 two-digit values and one `1`.
Every conversion takes the candidate's short-number path; no group scanning,
bigint conversion, random generation or formatting is involved in its callback.

## Results: microseconds per 50 conversions

| Controlled measurement | Baseline | Candidate | Speedup |
| --- | ---: | ---: | ---: |
| CodSpeed, default seven warmups | 615.990 | 1,104.533 | 0.56× |
| CodSpeed, 1,000 settling rounds before default warmup | 151.321 | 73.677 | 2.05× |
| Native timing, warmed and alternating samples | 11.068 | 3.655 | 3.03× |
| Native timing, CodSpeed V8 flags, warmed and alternating samples | 13.150 | 4.197 | 3.13× |

The original source-module benchmark in the same job still measured 1,082.729 µs
for the candidate; the diagnostic did not silently change or replace it.
The settled probes perform exactly the same timed conversions as their default
counterparts. The extra rounds run in `beforeAll`, outside instrumented timing.
The default pair recorded 22/16 system calls; both settled measurements recorded
zero. The native comparator validates complete output equality before measuring
nine alternating samples. Raw evidence:

- [CodSpeed values and measurement flags](results/quantities-codspeed-control.json)
- [Native samples, hardware and runtime](results/quantities-ci-native.json)
- [Native samples with simulation flags](results/quantities-ci-simulation-flags.json)

## Interpretation and limits

CodSpeed core 5.7.1's simulation flags include `--no-opt`, `--predictable`,
`--predictable-gc-schedule`, and `--expose-gc`. Its Vitest analysis runner warms a
callback seven times, invokes GC, then measures one callback. `--no-opt` disables
the optimizing compiler, but leaves V8's Sparkplug baseline compiler enabled.

A local replay with these flags plus `--trace-baseline --trace-gc` observed
baseline batch compilation inside a quantities measurement window, including
`getUnitSuffix`, `readFirstGroup`, `processFirstGroup`, `processGroup`, `readTens`
and `readOnes`. The measured bytecode-batch timing depends on prior execution.
That trace uses a smaller replay harness on the Mac; it is evidence that compiler
work can enter this timing window, not an exact profile of the CI slowdown.

The controlled CI data establish warmup sensitivity and rule out CPU differences
as the sole explanation. They support improved **steady-state conversion** on
this workload. They do not erase the higher default-warmup cost, prove every
excess instruction is compilation, or establish an improvement in cold import,
first-call latency or total startup work. Changing reader code solely to move a
V8 compilation boundary out of one measured callback would not establish a real
application improvement.

The smallest next benchmark change is to label and gate settled conversion
separately from startup/transition measurements, retaining these paired controls.
If startup performance is a release requirement, profile total startup and the
first complete user operation separately before changing the reader. This
bounded diagnosis leaves the original score visible and introduces no speculative
production fix.

## Reproduce

Use direct Node invocation to honor the mise pin; this Mac's pnpm subprocesses
can select Node 26 even when `mise exec -- node` selects 24.16.0. Actual versions
are recorded in reports. Run native comparisons sequentially:

```sh
mise exec -- node benchmarks/compare.mjs --baseline vn-number@2.0.5 --filter read/quantities --output /tmp/quantities-native.json
mise exec -- node --interpreted-frames-native-stack --allow-natives-syntax --hash-seed=1 --random-seed=1 --no-opt --predictable --predictable-gc-schedule --expose-gc --no-concurrent-sweeping --max-old-space-size=4096 benchmarks/compare.mjs --filter read/quantities --output /tmp/quantities-simulation-flags.json
mise exec -- node benchmarks/prepare-quantities.mjs
```

The preparation command writes four explicitly named probes, bundles and metadata
under ignored `benchmarks/results/local/quantities/`. The CodSpeed workflow runs
them in separate invocations in one job, after the unchanged source benchmarks.
A local `vitest bench` invocation without the CodSpeed instrument reports native
timings, not simulated scores. Use `bench src/` to select the regular suite while
the generated probes exist. No release, tag or merge is part of this diagnosis.

## Fresh-process follow-up

The remaining first-call/short-lived usage check is documented in the
[fresh-process assessment](COLD_START.md). It preserves the default-warmup score
above and uses native wall-clock measurements with no library warmup.
