import { describe, expect, it } from 'vitest'
import { formatVndCurrency, formatVnNumber } from './number.ts'

describe('formatVnNumber', () => {
  it('return formatted value in Vietnamese', () => {
    expect(formatVnNumber(10000000)).to.eq('10.000.000')
  })

  it('format invalid number by fallback value', () => {
    expect(formatVnNumber('100,0,0.000')).to.eq('0')
  })

  it('format null by fallback value', () => {
    expect(formatVnNumber(null, 'Không giới hạn')).to.eq('Không giới hạn')
  })

  it('format null string by fallback value', () => {
    expect(formatVnNumber('null', 'Không giới hạn')).to.eq('Không giới hạn')
  })

  it('format undefined by empty value', () => {
    expect(formatVnNumber(undefined, '')).to.eq('')
  })

  it('format unknown string value by fallback value', () => {
    expect(formatVnNumber('unknown')).to.eq('0')
  })

  it('format NaN value by empty value', () => {
    expect(formatVnNumber(NaN, '')).to.eq('')
  })
})

describe('formatVndCurrency', () => {
  it('return formatted value in VND', () => {
    expect(formatVndCurrency(10000000)).to.match(/10\.000\.000\s₫/)
  })

  it('format invalid number by fallback value', () => {
    expect(formatVndCurrency('100,0,0.000')).to.eq('0 ₫')
  })

  it('format null by fallback value', () => {
    expect(formatVndCurrency(null, 'Không giới hạn')).to.eq('Không giới hạn')
  })

  it('format null string by fallback value', () => {
    expect(formatVndCurrency('null', 'Không giới hạn')).to.eq('Không giới hạn')
  })

  it('format undefined by empty value', () => {
    expect(formatVndCurrency(undefined, '')).to.eq('')
  })

  it('format unknown string value by fallback value', () => {
    expect(formatVndCurrency('unknown')).to.eq('0 ₫')
  })

  it('format NaN value by empty value', () => {
    expect(formatVndCurrency(NaN, '')).to.eq('')
  })
})
