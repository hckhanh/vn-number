import { describe, expect, it } from 'vitest'
import { readVnNumber } from '~/read/index.ts'

describe('index', function () {
  it('should read number 2.000.000.000 in string', function () {
    expect(readVnNumber('2000000000')).to.equal('hai tỷ')
  })

  it('should read number 2.000.000.000 in number', function () {
    expect(readVnNumber(2000000000)).to.equal('hai tỷ')
  })

  it('should read number 2.500.000.000 in BigIn', function () {
    expect(readVnNumber(BigInt(2500000000))).to.equal('hai tỷ năm trăm triệu')
  })
})
