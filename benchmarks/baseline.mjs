import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Use the system executable, independently of the caller's PATH.
const git = (...args) =>
  execFileSync('/usr/bin/git', args, { cwd: root, encoding: 'utf8' })

export const headCommit = () => git('rev-parse', '--verify', 'HEAD').trim()

/** Extract released source without switching branches or changing the checkout. */
export function snapshotBaseline(ref) {
  // CLI refs are names or object IDs, never options or revision expressions.
  if (typeof ref !== 'string' || !/^[\w][\w./@-]*$/.test(ref)) {
    throw new TypeError(
      'Baseline must be a branch name, tag name, or commit ID',
    )
  }
  const commit = git(
    'rev-parse',
    '--verify',
    '--end-of-options',
    `${ref}^{commit}`,
  ).trim()
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(commit)) {
    throw new Error('Git did not resolve the baseline to a commit ID')
  }
  const files = git('ls-tree', '-rz', '--name-only', commit, '--', 'src')
    .split('\0')
    .filter((path) => path.endsWith('.ts') && !/\.(test|bench)\.ts$/.test(path))
  const directory = mkdtempSync(join(tmpdir(), 'vn-number-baseline-'))
  try {
    writeFileSync(
      join(directory, 'package.json'),
      git('show', `${commit}:package.json`),
    )
    writeFileSync(
      join(directory, 'tsconfig.json'),
      git('show', `${commit}:tsconfig.json`),
    )
    for (const path of files) {
      const target = join(directory, path)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, git('show', `${commit}:${path}`))
    }
  } catch (error) {
    rmSync(directory, { recursive: true, force: true })
    throw error
  }
  return {
    commit,
    files,
    directory,
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  }
}

/** Build sequentially: process.cwd() is global and controls region comments. */
export async function buildComparison(snapshot) {
  const { build } = await import('tsdown')
  const previousDirectory = process.cwd()
  async function buildFrom(sourceRoot, label) {
    process.chdir(sourceRoot)
    await build({
      config: false,
      tsconfig: join(root, 'tsconfig.json'),
      entry: ['src/index.ts'],
      outDir: join(snapshot.directory, label),
      platform: 'neutral',
      format: 'esm',
      dts: false,
      exports: false,
      logLevel: 'silent',
    })
  }
  try {
    await buildFrom(snapshot.directory, 'baseline')
    await buildFrom(root, 'candidate')
  } finally {
    process.chdir(previousDirectory)
  }
  return {
    baselineEntry: join(snapshot.directory, 'baseline/index.js'),
    candidateEntry: join(snapshot.directory, 'candidate/index.js'),
  }
}
