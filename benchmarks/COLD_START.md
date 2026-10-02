# Fresh-process quantities assessment

Fresh-process conversion improved in every measured quantity workload. Import
and process startup still dominate tiny command-line uses, so these results do
not establish faster whole-program startup. No production change was needed.

## Method and provenance

This is **native wall-clock time**, independent of CodSpeed simulation. Every
sample launches the same pinned Node executable in a new process. There are 30
baseline/candidate pairs per library scenario, plus 30 empty-process controls:
**510 fresh processes** in total. Pair order alternates and case order rotates.
No result or outlier is discarded. The report records minimum, p10, median, p90,
maximum and every raw sample, plus paired median differences.

Baseline: `aca1fd91b2bdd0c0dfde4038bbae2e58b3815ce4` (v2.0.5, production source
identical to `fc62f7c`). Candidate: `7081c1a8aad8d61360b4b022c8e4dfd22ec030c4`,
whose production source is unchanged from `6ed2598`. Both bundles use the same
installed tsdown/Rolldown toolchain and settings. Their SHA-256 hashes match the
previous reviewed baseline/candidate bundles. The measured Mac uses an M2 Pro,
Node **24.16.0**, V8 **13.6.233.17-node.49**, ICU **78.3**.

The parent validates complete output equality, then each child is independently
started with no library calls before timing. Child Node/V8 versions and complete
returned outputs are checked after each process exits. Fixtures are fixed before
import: quantities 5, 89 and 100 for first calls, and the existing seeded 50-value
quantities array for bursts. Larger bursts repeat that array in order.

Phases are separated:

- Child uptime at the first user-code statement records Node startup through
  entry to the worker; it precedes fixture parsing and library import.
- Dynamic root import includes loading, parsing, module evaluation and the
  existing eager Intl formatter initializers.
- First-call timing ends immediately after the first `readVnNumber` returns.
- Burst timing includes its first call, remaining calls, output-array storage
  and the first-call timer. It excludes import and JSON serialization.
- Complete operation timing covers import through conversion completion.
- Parent-observed spawn-to-exit includes OS process creation, Node startup,
  fixture preparation, import, calls, JSON serialization, pipe transfer and exit.

Persistent Node compile caching and inherited `NODE_OPTIONS` are disabled in the
children. OS/filesystem caches are **not** flushed. These are fresh JavaScript
processes, not cold disks or newly booted machines. There is no forced GC or
extra V8 optimization flag in this measurement.

## Conversion results on the Mac

Values are median **µs**, with p10–p90 in parentheses. First-call rows use the
separate first-call timer; burst rows include the complete requested burst.

| Workload | v2.0.5 µs | Candidate µs | Median speedup |
| --- | ---: | ---: | ---: |
| first quantity 5 | 148.458 (122.125–186.708) | 82.875 (67.084–103.875) | 1.79× |
| first quantity 89 | 148.833 (122.875–171.167) | 82.604 (69.792–101.041) | 1.80× |
| first quantity 100 | 139.417 (112.209–166.500) | 81.271 (67.750–105.375) | 1.72× |
| quantities burst 10 | 189.021 (168.083–242.292) | 98.583 (86.667–117.750) | 1.92× |
| quantities burst 50 | 239.667 (213.333–254.250) | 132.145 (105.541–153.416) | 1.81× |
| quantities burst 400 | 641.708 (611.834–687.084) | 282.938 (259.541–322.250) | 2.27× |
| quantities burst 1000 | 1,461.188 (1,416.375–1,514.291) | 535.355 (498.833–571.250) | 2.73× |

The candidate's p90 conversion time is below the baseline's p10 for each case.
Thus the original default-warmup simulation slowdown did not reproduce in these
fresh native first calls or complete short bursts, including the first 400 calls
that span its approximate warmup/transition region.

## Import and complete-process costs

Root import alone has medians **9.955 → 9.922 ms**, with p10–p90 ranges
9.795–10.107 and 9.724–10.087 ms. The empty worker's spawn-to-exit median is
28.164 ms, with a 27.055–29.205 ms p10–p90 range. These controls explain why
saving tens or hundreds of microseconds in conversion has a small effect on a
short-lived program dominated by startup and import.

| Complete process scenario | Baseline median ms | Candidate median ms |
| --- | ---: | ---: |
| Import only | 37.711 | 38.103 |
| First quantity 89 | 37.560 | 38.456 |
| 50 conversions | 38.029 | 38.017 |
| 1,000 conversions | 39.467 | 38.638 |

Whole-process differences go in both directions. For first quantity 89, the
candidate's median is 0.896 ms higher despite a faster measured conversion;
child-entry uptime also differs before the library loads. All displayed
whole-process p10–p90 ranges overlap (the raw report has the full ranges).
The paired median difference for import-only spawn-to-exit is +0.064 ms,
compared with +0.392 ms when subtracting the separate medians. This illustrates
why individual startup ratios should not be treated as a library speedup or
regression. The experiment supports improved conversion, without claiming that
every complete-process scenario improves.

## Recommendation and remaining limit

The evidence supports v3 as a **number-conversion performance release**: measured
first calls and short bursts improve as well as steady-state work, correctness
checks pass, and the public API is unchanged. There is no evidence-backed reason
to alter the reader further to address the reported quantities signal.

Keep the existing default-warmup result visible: the prior single-runner CodSpeed
pair was 615.990 → 1,104.533 simulated µs, while settled work was
151.321 → 73.677 simulated µs. That is a different measurement regime; native
startup milliseconds must not be compared directly with simulated microseconds.
No threshold, existing benchmark callback, or gate was loosened for this test.

The recommendation covers the tested Node workload and runtime. Browser/Deno
startup, cold filesystem I/O, and arbitrary application initialization are not
measured. Import/startup speed should not be advertised as a major gain. Further
optimization is not necessary to complete this bounded assessment.

## Reproduce and inspect

```sh
mise exec -- node benchmarks/cold-start.mjs --rounds 30 --output /tmp/vn-number-cold-start.json
```

Use direct Node invocation to honor the mise pin. The child uses `process.execPath`
and records its runtime, avoiding this Mac's pnpm subprocess Node-version drift.
The same command runs in the CodSpeed workflow **outside** instrumentation, with
both versions on the same CI runner. Its full JSON is in the job log.

[Mac raw samples](results/cold-start-m2-node24.json) ·
[Earlier controlled warmup diagnosis](QUANTITIES.md)
