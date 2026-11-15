import { describe, expect, it } from 'vitest'
import { readVnNumber } from '../index.ts'

describe('billion group boundaries', () => {
  const cases = [
    ['1000500000000', 'một nghìn tỷ năm trăm triệu'],
    ['1000001000000', 'một nghìn tỷ không trăm lẻ một triệu'],
    ['1000000000001', 'một nghìn tỷ không trăm lẻ một'],
    ['5000000002000000', 'năm triệu tỷ không trăm lẻ hai triệu'],
    ['1000000000000000001', 'một tỷ tỷ không trăm lẻ một'],
    ['1001500000000', 'một nghìn không trăm lẻ một tỷ năm trăm triệu'],
    ['1000000001000000001', 'một tỷ không trăm lẻ một tỷ không trăm lẻ một'],
    [
      '1000001000000000001',
      'một tỷ không trăm lẻ một nghìn tỷ không trăm lẻ một',
    ],
  ] as const

  it.each(
    cases,
  )('reads the string %s without losing its scale', (value, expected) => {
    expect(readVnNumber(value)).toBe(expected)
  })

  it.each(
    cases,
  )('reads the bigint %s without losing its scale', (value, expected) => {
    expect(readVnNumber(BigInt(value))).toBe(expected)
  })

  it.each(
    cases.filter(([value]) => Number.isSafeInteger(Number(value))),
  )('reads the number %s without losing its scale', (value, expected) => {
    expect(readVnNumber(Number(value))).toBe(expected)
  })

  for (const cycles of [1, 2, 3, 6, 30]) {
    for (const [extraZeros, unit] of [
      [0, ''],
      [3, ' nghìn'],
      [6, ' triệu'],
    ] as const) {
      const zeros = cycles * 9 + extraZeros
      const expected = 'một' + unit + ' tỷ'.repeat(cycles)

      it(`preserves all scales in 10^${zeros}`, () => {
        expect(readVnNumber('1' + '0'.repeat(zeros))).toBe(expected)
      })

      it(`preserves all scales in 10^${zeros} + 1`, () => {
        expect(readVnNumber('1' + '0'.repeat(zeros - 1) + '1')).toBe(
          expected + ' không trăm lẻ một',
        )
      })
    }
  }
})
