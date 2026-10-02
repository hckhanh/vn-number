import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' })

/** Extract released source without switching branches or changing the checkout. */
export function snapshotBaseline(ref) {
  const commit = git('rev-parse', '--verify', `${ref}^{commit}`).trim()
  const files = git('ls-tree', '-r', '--name-only', commit, 'src')
    .trim()
    .split('\n')
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
