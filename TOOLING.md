# Development tooling

Use the exact tools in `mise.toml`: Node 24.16.0, npm 12.2.0, and pnpm 12.8.1.
Run `mise install`, then run repository commands through `mise exec --` or an
activated mise shell. Check `pnpm exec node --version` before comparing benchmarks.
The library's consumer runtime support is unchanged.

pnpm manages dependencies and the single lockfile. npm is available for Changesets
registry and publication operations; the release workflow uses its pinned version.
Do not generate an npm lockfile. pnpm 12 writes multiple YAML documents in
`pnpm-lock.yaml`, including a package-manager dependency record. Regenerate the
lockfile with pnpm 12 instead of resolving generated lockfile conflicts by hand.

The migration uses Changesets 3.0.3, TypeScript 7.0.2, Vite 8.3.2, and tsdown 0.22.7.
The supporting tsdown patch supports TypeScript 7's native declaration compiler.
Its declaration plugin still reports an experimental-API warning; this project
uses ordinary TypeScript declarations, without custom language plugins.

Vitest and coverage remain at 4.1.11. CodSpeed 6.0.0-beta.2 supports Vite 8 and the
Vitest 4 benchmark API. Vitest 5 is deferred until CodSpeed supports its rewritten
benchmark API. Do not bypass this limitation with a peer dependency override.
The deterministic harness from PR #295 is shared by the tooling baseline and
performance candidate. Its 22 benchmark identities, fixtures, and timed callbacks
are identical across the two branches. Production optimization code stays in #295.

CodSpeed action and runner are pinned to stable 5.4.0. The workflow explicitly
keeps cycle estimation enabled and allocation exclusion disabled, matching the
runner's defaults. Runner 5 changes simulation instruction costing and switches
Linux walltime profiling to Samply. Compare fresh baseline/candidate runs using
the same runner; do not interpret score changes from runner 4 as code speedups.
The SDK, Node, Vitest, fixtures, and library source are unchanged by this upgrade.

GitHub workflows use Codecov action 7.1.1, mise action 5.0.1, and Changesets action
2.0.0, pinned to immutable commits. Changesets action 2 requires the renamed
`publish-script`, `pr-title`, `commit-message`, and `github-token` inputs. The
existing OIDC publishing and coverage permissions are retained.

## Validation

```sh
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm peers check
mise exec -- pnpm vitest run --coverage
mise exec -- pnpm typecheck
mise exec -- pnpm biome check
mise exec -- pnpm syncpack lint
mise exec -- pnpm syncpack format --check
mise exec -- pnpm prepublishOnly
mise exec -- pnpm audit
mise exec -- pnpm dlx jsr publish --dry-run
```

Run benchmarks through the pinned CodSpeed runner or the CodSpeed workflow, in
both simulation and walltime modes. Compare baseline and candidate using the same
Node version, dependencies, runner, fixtures, and benchmark identities. A tooling
upgrade requires fresh comparisons; previous performance scores do not establish
performance under the new toolchain.

Changesets 3 removes the old config-to-micromatch-to-braces dependency chain.
Keep the full audit enabled. pnpm 12's `allowBuilds` map preserves the existing
permissions for esbuild and sharp; do not replace it with a blanket build opt-in.
