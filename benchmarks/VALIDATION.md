# Local validation for the v3 performance Changeset

This records the pre-PR local validation checkpoint. Subsequent CI results are
reported in the draft pull request.

Validated on 2026-10-02 in `/Users/khanh/Projects/vn-number`, branch
`codex/v3-performance`, starting commit `ca91bb335970b7408bd06c5fb0faa0af1460355d`.
The original checkout was clean on `chore/docs-khanh-id` and had no stashes.
That branch/ref is preserved. Dependency versions, lockfile, and `mise.toml`
are unchanged.

Commands prefixed with `mise exec --` use the repository's Node 24.16.0 and
pnpm 10.34.1. Results:

| Check | Result |
| --- | --- |
| `pnpm vitest run --coverage` | 150 tests passed in 7 files; baseline was 112 tests in 5 files |
| Coverage | 100% statements, functions, and lines; 99.34% branches |
| `pnpm exec tsc --noEmit` | Passed |
| `pnpm biome check` | Passed |
| `pnpm syncpack lint` | Passed |
| `pnpm syncpack format --check` | Passed |
| `pnpm audit` | No known vulnerabilities found |
| `pnpm prepublishOnly` | ESM bundle and TypeScript declarations built successfully; this script only builds |
| Built ESM smoke check | All benchmark fixtures and all four public exports match source |
| `pnpm bench:verify` | 412,046 byte-for-byte comparisons against v2.0.5 passed |
| `pnpm bench` | All 22 deterministic Vitest/CodSpeed fixtures completed; output-consumption assertions passed |
| `pnpm bench:compare` | Two sequential nine-round bundle runs; raw reports and source hashes saved |
| `pnpm exec changeset status` | Confirms `vn-number` 2.0.5 → 3.0.0, major |
| `deno check src/index.ts` | Passed using Deno 2.9.7 |
| `deno publish --dry-run --allow-dirty` | Passed; slow-type and package-content checks complete |
| `pnpm dlx jsr publish --dry-run --allow-dirty` | Passed; the CI-equivalent wrapper validates the package without publishing |
| `git diff --check` | Passed |

The normal build tool rewrites package metadata and removes `main`/`module`.
Those pre-existing entry fields were restored after validation to avoid an
unrelated package-interface change. The benchmark builder disables metadata
rewriting explicitly.

The initial JSR wrapper invocation without `--allow-dirty` refused the local
working tree after downloading its binary. Its requested flag was supplied for
the successful dry run; no commit was needed. The package's JSR version remains
the repository's existing `0.0.0-development` placeholder until release automation
copies the npm package version.

At this checkpoint, no commit, tag, push, pull request, merge, or package
publication had been performed.
The package version remains 2.0.5 with a pending major Changeset, following the
normal release-PR workflow. No runtime execution or performance claims are made
for browsers or other CPUs; Deno validation here is type/package checking.

See [performance results and reproduction instructions](README.md).

A final [skeptical review](REVIEW.md) adds 16,395 edge/fallback comparisons,
varied full-output-consumption scaling controls, and byte-for-byte bundle and
public-declaration checks. No production code changed during that review.
