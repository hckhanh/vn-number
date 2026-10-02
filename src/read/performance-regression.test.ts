import { describe, expect, it } from 'vitest'
import { readVnNumber } from './index.ts'

describe('linear group traversal regressions', () => {
  it.each([
    ['', ''],
    ['0000', 'không nghìn'],
    ['00001', 'không nghìn không trăm lẻ một'],
    ['0010', 'không nghìn không trăm mười'],
    ['01', 'lẻ một'],
    ['001', 'không trăm lẻ một'],
    ['010', 'không trăm mười'],
    ['000000001', 'không triệu không trăm lẻ một'],
  ])('preserves leading zeros and group width for %j', (value, expected) => {
    expect(readVnNumber(value)).toBe(expected)
  })

  it('retains every billion suffix on long powers of a billion', () => {
    const expected = 'một' + ' tỷ'.repeat(333)
    const value = '1' + '0'.repeat(2997)
    expect(readVnNumber(value)).toBe(expected)
    expect(readVnNumber(BigInt(value))).toBe(expected)
  })

  it('retains the first group of long all-zero input', () => {
    expect(readVnNumber('0'.repeat(3000))).toBe('không' + ' tỷ'.repeat(333))
  })

  it('skips interior zero groups without moving the final group suffix', () => {
    expect(readVnNumber('1' + '0'.repeat(2996) + '1')).toBe(
      'một tỷ không trăm lẻ một',
    )
    expect(readVnNumber('1000000000000000001')).toBe('một tỷ không trăm lẻ một')
  })

  it('keeps full hundreds and special endings across many dense groups', () => {
    const block =
      'một trăm hai mươi mốt triệu một trăm lẻ năm nghìn một trăm mười lăm'
    expect(readVnNumber('121105115'.repeat(100))).toBe(
      Array(100).fill(block).join(' tỷ '),
    )
  })

  it.each([
    ['x', ''],
    ['x00', 'trăm'],
    ['x01', 'trăm lẻ một'],
    ['x05', 'trăm lẻ năm'],
    ['x10', 'trăm mười'],
    ['x15', 'trăm mười lăm'],
    ['x20', 'trăm hai mươi'],
    ['x21', 'trăm hai mươi mốt'],
    ['x25', 'trăm hai mươi lăm'],
    ['0x1', 'không trăm  mươi mốt'],
    ['0x5', 'không trăm  mươi lăm'],
    ['0x0', 'không trăm  mươi'],
    ['1x', 'mười'],
    ['-1', 'mươi mốt'],
    ['1.5', 'một trăm  mươi lăm'],
    ['NaN', 'trăm  mươi'],
    ['1\t1', 'một trăm không mươi mốt'],
  ])('preserves the legacy non-decimal result for %j', (value, expected) => {
    // Compatibility only: these inputs are not newly supported reader syntax.
    expect(readVnNumber(value)).toBe(expected)
  })
})
