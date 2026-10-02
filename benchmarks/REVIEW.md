# Skeptical final review

No new production correctness, public API, or retained-memory regression was
found. The production source hash still matches both saved benchmark reports.
This records the local review checkpoint, before committing and opening the draft PR.
The reviewed changes were uncommitted on `codex/v3-performance` at that point.

## What the 443× measurement means

The exact input is `'1' + '0'.repeat(3000)`, a **3,001-character decimal string**
representing 10^3000. It splits into 1,001 groups: `1`, then 1,000 `000` groups.

In v2.0.5, every call to `processGroup` invokes `allFollowingGroupsAreZero`
before determining whether that group contributes text. The number of trailing
group checks is therefore `1000 + 999 + ... + 1 = 500,500`. Repeated `unshift`
also moves previously collected groups. This is quadratic work in group count.

The candidate checks the 3,000 trailing zero characters once, retains the
first group, and reads that single group. It calculates the suffix from the
original position. There are no group or type arrays, and no repeated suffix
scans. This path is linear in input length, plus output construction. The exact
443× factor depends on the costs of the operations and this V8/CPU combination;
it is not a universal ratio.

**Important pre-existing correctness limitation:** both versions return
`một nghìn tỷ` for that extreme input. v2.0.5's thousand/million suffix logic
does not express all repeated billion powers. The 443× figure is thus a synthetic
compatibility stress case, not evidence that arbitrary magnitudes are spelled
correctly. The optimization preserves that existing behavior. No new linguistic
semantics are claimed for malformed, negative, fractional, or exponential reader
inputs either.

## Challenge to constant-output or cache effects

No result cache, growing lookup table, or memoization was added. The existing
ten digit words are shared internally. All other new reader storage is local
to a call and bounded by its input/output length. The three existing Intl
formatters are unchanged. Return values are consumed by the timed harness and
full outputs are compared before timing.

To challenge the short-output workload, `review.mjs` adds nine distinct inputs
per case, independently checks correct repeated-billion wording, and hashes
**every UTF-16 output character inside timing**. The correctly spelled
2,998-digit inputs produce 1,001–1,003 characters rather than a fixed short
string. A separate sparse control also varies the final nonzero digit.

Times below include conversion **and full-output hashing**, in µs per conversion.
Each cell gives min / median / max across nine alternating samples:

| Varied control | Baseline | Candidate | Median speedup |
| --- | ---: | ---: | ---: |
| 1,000-digit powers of a billion | 229.041 / 230.007 / 232.815 | 3.124 / 3.151 / 3.158 | 73.01× |
| 1,999-digit powers of a billion | 883.416 / 885.311 / 888.862 | 6.052 / 6.065 / 6.077 | 145.96× |
| 2,998-digit powers of a billion | 1,961.840 / 1,973.155 / 2,112.799 | 8.957 / 9.005 / 9.063 | 219.12× |
| 3,001-digit sparse values, nonzero tail | 1,959.634 / 1,968.551 / 2,032.771 | 10.032 / 10.068 / 10.385 | 195.53× |

Tripling input length multiplies baseline time by about 8.6 and candidate time
by about 2.9. These controls support the quadratic-to-linear explanation without
depending on a constant short output. Raw samples and full fixture definitions
are in [the review data](results/skeptical-review.json) and `review.mjs`.

This control was rerun after the benchmark-helper CI fixes. Its full-output
checksum now uses `codePointAt`; the unchanged production bundles retain the
hashes below. Reproduce with `mise exec -- node benchmarks/review.mjs`.

## Original reported sample ranges

These are **µs per batch**, with min / median / max across nine samples:

| Workload | Run | Baseline | Candidate |
| --- | --- | ---: | ---: |
| Trailing zeros, 3,001 digits | First | 1,961.566 / 1,966.221 / 1,977.521 | 4.428 / 4.434 / 4.439 |
| Trailing zeros, 3,001 digits | Repeat | 1,964.909 / 1,970.181 / 2,023.783 | 4.415 / 4.442 / 4.550 |
| Dense, 3,000 digits | First | 265.275 / 266.592 / 274.013 | 169.875 / 170.712 / 171.316 |
| Dense, 3,000 digits | Repeat | 266.493 / 267.339 / 275.133 | 169.687 / 171.312 / 171.514 |
| Dashboard, 21 conversions | First | 10.889 / 10.912 / 10.956 | 7.457 / 7.480 / 7.499 |
| Dashboard, 21 conversions | Repeat | 10.753 / 10.804 / 10.869 | 7.496 / 7.546 / 7.570 |

The small single-value quantity benchmark is not used as a representative
headline. See the 50-value quantity batch and 21-value dashboard instead.

## Provenance and build comparison

The baseline comes from `git show` at the committed release
`aca1fd91b2bdd0c0dfde4038bbae2e58b3815ce4` (`vn-number@2.0.5`), not from the
modified working tree. `git diff` confirms the original checkout commit
`ca91bb335970b7408bd06c5fb0faa0af1460355d` had identical source, package metadata,
TypeScript configuration, and build configuration to that release.

Both variants run in the same Node 24.16.0 process on the M2 Pro. Both use
the same installed tsdown 0.22.1 / Rolldown 1.0.2, neutral ESM output, no
declaration generation during timing builds, and no package-export rewriting.
Each is built from its own source root so temporary paths do not inflate size.

Review hardening now copies the baseline's actual package and TypeScript
metadata and explicitly shares the unchanged compiler configuration. Building
with the original snapshot metadata and with the hardened metadata produced
**byte-identical JavaScript for both versions**. Existing timing evidence is
therefore still applicable. The verified bundle hashes are:

- Baseline: `4baf03e9c187d46076061290c944e75244207b97d25bbf641f6e891b75894dc7` (8,969 bytes)
- Candidate: `d1d6363cf7e46b8acf936ca286ea9abe885311ac23f9ba5f13464baa9545d163` (8,274 bytes)

## Correctness and scope checks

The group-position formula preserves v2.0.5's type cycle. Trailing-zero checks
remain strict ASCII-zero checks; leading-zero widths and unreadable groups keep
their previous behavior. The direct decimal-digit path uses the old reader for
non-ASCII/non-decimal groups. Replacing the repeated-billion suffix array with
`' tỷ'.repeat(count)` preserves its spaces and content.

The initial 412,046 differential checks are supplemented by **16,395** checks
covering all strings up to three UTF-16 units from the review alphabet, including
Unicode whitespace/digits and unpaired surrogates, plus negative/decimal/bigint
inputs and custom formatting fallbacks. All pass. There is no options object in
the public API; the existing formatting fallback argument is unchanged.

All four root exports and emitted TypeScript declarations remain unchanged.
`DIGIT_MAP` and `getUnitSuffix` are newly exported only between internal source
modules; the package's public export map is unchanged. Dependency versions,
lockfile, toolchain, and PR #294 were not modified.

The original branch `chore/docs-khanh-id` still points to
`ca91bb335970b7408bd06c5fb0faa0af1460355d`; it originally had no modifications
or stashes, and no stashes were created, dropped, or applied. Before PR preparation, no commit, push,
tag, PR, merge, or publication had been performed. `git diff --check` passes.

## Exact changed-file inventory

27 changed or new files; no files were deleted:

```text
.changeset/fast-vietnamese-reader.md
.gitignore
README.md
benchmarks/README.md
benchmarks/REVIEW.md
benchmarks/VALIDATION.md
benchmarks/baseline.mjs
benchmarks/cases.ts
benchmarks/compare.mjs
benchmarks/results/baseline-control.json
benchmarks/results/m2-pro-node24.16.0-repeat.json
benchmarks/results/m2-pro-node24.16.0.json
benchmarks/results/skeptical-review.json
benchmarks/review.mjs
benchmarks/verify.mjs
docs/migration-v3.md
package.json
src/format/number.bench.ts
src/read/digits.ts
src/read/groups.test.ts
src/read/groups.ts
src/read/index.bench.ts
src/read/index.ts
src/read/performance-regression.test.ts
src/read/three-digits.test.ts
src/read/three-digits.ts
src/read/utils.test.ts
```
