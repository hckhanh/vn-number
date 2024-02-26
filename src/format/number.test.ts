import { describe, expect, it } from 'vitest'
import {
  formatVnCurrency,
  formatVnNumber,
  formatVnPercentage
} from './number.ts'

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

describe('formatVnCurrency', () => {
  it('return formatted value in VND', () => {
    expect(formatVnCurrency(10000000)).to.match(/10\.000\.000\s₫/)
  })

  it('format invalid number by fallback value', () => {
    expect(formatVnCurrency('100,0,0.000')).to.eq('0 ₫')
  })

  it('format null by fallback value', () => {
    expect(formatVnCurrency(null, 'Không giới hạn')).to.eq('Không giới hạn')
  })

  it('format null string by fallback value', () => {
    expect(formatVnCurrency('null', 'Không giới hạn')).to.eq('Không giới hạn')
  })

  it('format undefined by empty value', () => {
    expect(formatVnCurrency(undefined, '')).to.eq('')
  })

  it('format unknown string value by fallback value', () => {
    expect(formatVnCurrency('unknown')).to.eq('0 ₫')
  })

  it('format NaN value by empty value', () => {
    expect(formatVnCurrency(NaN, '')).to.eq('')
  })
})

describe('formatVnPercentage', () => {
  it('return formatted value 100% in Vietnamese', () => {
    expect(formatVnPercentage(1)).to.eq('100%')
  })

  it('return formatted value 10% in Vietnamese', () => {
    expect(formatVnPercentage(0.1)).to.eq('10%')
  })

  it('format invalid number by fallback value', () => {
    expect(formatVnPercentage('100,0,0.000')).to.eq('0%')
  })

  it('format null by fallback value', () => {
    expect(formatVnPercentage(null, '')).to.eq('')
  })

  it('format null string by fallback value', () => {
    expect(formatVnPercentage('null', 'Không xác định')).to.eq('Không xác định')
  })

  it('format undefined by empty value', () => {
    expect(formatVnPercentage(undefined, '')).to.eq('')
  })

  it('format unknown string value by fallback value', () => {
    expect(formatVnPercentage('unknown')).to.eq('0%')
  })

  it('format NaN value by empty value', () => {
    expect(formatVnPercentage(NaN, '')).to.eq('')
  })
})
