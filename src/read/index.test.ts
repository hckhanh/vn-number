import { describe, expect, it } from 'vitest'
import { readVnNumber } from './index.ts'

describe('index', () => {
  it('should read number 2.000.000.000 in string', () => {
    expect(readVnNumber('2000000000')).to.equal('hai tỷ')
  })

  it('should read number 2.000.000.000 in number', () => {
    expect(readVnNumber(2000000000)).to.equal('hai tỷ')
  })

  it('should read number 2.500.000.000 in BigIn', () => {
    expect(readVnNumber(BigInt(2500000000))).to.equal('hai tỷ năm trăm triệu')
  })
})
