import { describe, expect, it } from 'vitest'
import { formatVnCurrency, formatVnNumber, formatVnPercent } from './number.ts'

describe('formatVnNumber', () => {
  it('return formatted value in Vietnamese', () => {
    expect(formatVnNumber(10000000)).to.eq('10.000.000')
  })

  it('format bigint value', () => {
    expect(formatVnNumber(BigInt(10000000))).to.eq('10.000.000')
    expect(formatVnNumber(BigInt('9999999999999999'))).to.eq('9.999.999.999.999.999')
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

  it('format bigint value in VND', () => {
    expect(formatVnCurrency(BigInt(10000000))).to.match(/10\.000\.000\s₫/)
    expect(formatVnCurrency(BigInt('9999999999999999'))).to.match(/9\.999\.999\.999\.999\.999\s₫/)
  })

  it('format invalid number by fallback value', () => {
    expect(formatVnCurrency('100,0,0.000')).to.eq('0\u00A0₫')
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
    expect(formatVnCurrency('unknown')).to.eq('0\u00A0₫')
  })

  it('format NaN value by empty value', () => {
    expect(formatVnCurrency(NaN, '')).to.eq('')
  })
})

describe('formatVnPercent', () => {
  it('return formatted value 100% in Vietnamese', () => {
    expect(formatVnPercent(1)).to.eq('100%')
  })
  it('return formatted value 99% in Vietnamese', () => {
    expect(formatVnPercent('0.99')).to.eq('99%')
  })

  it('return formatted value 10% in Vietnamese', () => {
    expect(formatVnPercent(0.1)).to.eq('10%')
  })

  it('format bigint value as percent', () => {
    expect(formatVnPercent(BigInt(1))).to.eq('100%')
    expect(formatVnPercent(BigInt(5))).to.eq('500%')
  })

  it('format invalid number by fallback value', () => {
    expect(formatVnPercent('100,0,0.000')).to.eq('0%')
  })

  it('format null by fallback value', () => {
    expect(formatVnPercent(null, '')).to.eq('')
  })

  it('format null string by fallback value', () => {
    expect(formatVnPercent('null', 'Không xác định')).to.eq('Không xác định')
  })

  it('format undefined by empty value', () => {
    expect(formatVnPercent(undefined, '')).to.eq('')
  })

  it('format unknown string value by fallback value', () => {
    expect(formatVnPercent('unknown')).to.eq('0%')
  })

  it('format NaN value by empty value', () => {
    expect(formatVnPercent(NaN, '')).to.eq('')
  })
})
