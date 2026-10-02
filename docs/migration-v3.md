# Upgrading to v3.0.0

The v3 performance release preserves the four public exports and their signatures:
`readVnNumber`, `formatVnNumber`, `formatVnCurrency`, and `formatVnPercent`.
Existing calls require no code changes. Formatting fallbacks, bigint handling,
Vietnamese spelling, leading-zero behavior, and output whitespace remain unchanged.
Runtime support and the ESM package format are unchanged. There are no new runtime
dependencies or growing caches.

This is a major release at the maintainer's request for a performance milestone.
It deliberately introduces no breaking API changes. The major Changeset prepares
the repository's normal release process to advance from 2.0.5 to 3.0.0; it does not
publish or tag a release.

`readVnNumber` avoids repeated trailing-zero scans and intermediate group arrays.
It also uses direct decimal-digit lookup. Use decimal integer strings or bigints
for large exact values. Existing odd results for negative, fractional, exponential,
or malformed reader inputs have been preserved for compatibility; this release
does not add a new interpretation for those inputs.

The formatting functions still delegate to `Intl.NumberFormat`. Their locale
details and rounding continue to depend on the runtime's ICU implementation.

Performance measurements and repeatable benchmark commands are in
[the benchmark report](../benchmarks/README.md). The new benchmark names and
batch counts differ from the old random workloads, so historical CodSpeed scores
are not directly comparable to the corrected suite.
