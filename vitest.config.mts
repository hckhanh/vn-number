import codspeed from '@codspeed/vitest-plugin'
import {
  coverageConfigDefaults,
  defaultExclude,
  defineConfig,
} from 'vitest/config'

export default defineConfig({
  plugins: [codspeed()],
  test: {
    exclude: [
      ...defaultExclude,
      'tsdown.config.*',
      'src/index.ts',
      'src/format/index.ts',
    ],
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        'tsdown.config.*',
        'src/index.ts',
        'src/format/index.ts',
      ],
    },
  },
})
