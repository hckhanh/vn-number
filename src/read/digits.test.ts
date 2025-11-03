import { describe, expect, it } from 'vitest'
import { getDigitWord } from './digits.ts'

describe('getDigitWord', () => {
  it('should return correct word for valid digits 0-9', () => {
    expect(getDigitWord('0')).to.equal('không')
    expect(getDigitWord('1')).to.equal('một')
    expect(getDigitWord('2')).to.equal('hai')
    expect(getDigitWord('3')).to.equal('ba')
    expect(getDigitWord('4')).to.equal('bốn')
    expect(getDigitWord('5')).to.equal('năm')
    expect(getDigitWord('6')).to.equal('sáu')
    expect(getDigitWord('7')).to.equal('bảy')
    expect(getDigitWord('8')).to.equal('tám')
    expect(getDigitWord('9')).to.equal('chín')
  })

  it('should handle edge cases', () => {
    // Out of range digits return empty string
    expect(getDigitWord('10')).to.equal('')
    expect(getDigitWord('99')).to.equal('')
    expect(getDigitWord('-1')).to.equal('')

    // NaN from invalid input returns empty string via fallback
    expect(getDigitWord('a')).to.equal('')
    expect(getDigitWord('abc')).to.equal('')

    // Empty string converts to 0, which maps to 'không'
    expect(getDigitWord('')).to.equal('không')
  })
})
