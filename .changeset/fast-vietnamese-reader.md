---
"vn-number": major
---

Prepare v3.0.0 with a faster Vietnamese number reader. Scan trailing zero groups once and read group positions directly, removing quadratic rescans and intermediate group/type arrays. Read decimal digits directly without repeated numeric coercion; preserve the legacy path for other inputs.

The public API and existing output remain compatible with v2.0.5. No import, argument, fallback, runtime-support, or return-value migration is required. This major release is requested as a performance milestone; it does not introduce an intentional breaking change.

Replace random timed benchmark setup with fixed seeded fixtures, correct the dashboard count to 21 conversions, and execute the advertised batch sizes. Add matched-runtime comparisons against the released source and bundles, plus exhaustive and seeded compatibility checks. See `benchmarks/README.md` for measurements and reproduction commands, and `docs/migration-v3.md` for upgrade notes.
