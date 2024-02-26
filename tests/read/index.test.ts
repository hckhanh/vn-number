import { describe, expect, it } from 'vitest'
import { readVnNumber } from '~/read'

describe('index', function () {
  it('should read number 2.000.000.000 in string', function () {
    expect(readVnNumber('2000000000')).to.equal('hai tỷ')
  })

  it('should read number 2.000.000.000 in number', function () {
    expect(readVnNumber(2000000000)).to.equal('hai tỷ')
  })
})
