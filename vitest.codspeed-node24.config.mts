import { mergeConfig } from 'vitest/config'
import config from './vitest.config.mts'

// Controlled Node 24 probe only; the primary suite retains its existing flags.
// Backport the analysis flags from CodSpeedHQ/codspeed-node commit e3224e7.
export default mergeConfig(config, {
  test: {
    execArgv: ['--no-maglev', '--no-minor-gc-task'],
  },
})
