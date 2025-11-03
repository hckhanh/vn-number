import { describe, expect, it } from 'vitest'
import {
  readFirstGroupBeforeBillion,
  readFirstGroup,
  readSubsequentGroup,
} from './three-digits.ts'

describe('readFirstGroupBeforeBillion', () => {
  it('should return "không" for all zeros', () => {
    expect(readFirstGroupBeforeBillion('0')).to.equal('không')
    expect(readFirstGroupBeforeBillion('00')).to.equal('không')
    expect(readFirstGroupBeforeBillion('000')).to.equal('không')
  })

  it('should add "nghìn" suffix for non-zero groups', () => {
    expect(readFirstGroupBeforeBillion('1')).to.equal('một nghìn')
    expect(readFirstGroupBeforeBillion('12')).to.equal('mười hai nghìn')
    expect(readFirstGroupBeforeBillion('123')).to.equal('một trăm hai mươi ba nghìn')
  })

  it('should handle special cases with "nghìn" suffix', () => {
    expect(readFirstGroupBeforeBillion('21')).to.equal('hai mươi mốt nghìn')
    expect(readFirstGroupBeforeBillion('15')).to.equal('mười lăm nghìn')
    expect(readFirstGroupBeforeBillion('101')).to.equal('một trăm lẻ một nghìn')
  })
})

describe('readFirstGroup', () => {
  it('should return "không" for all zeros', () => {
    expect(readFirstGroup('0')).to.equal('không')
    expect(readFirstGroup('00')).to.equal('không')
    expect(readFirstGroup('000')).to.equal('không')
  })

  it('should read numbers without suffix', () => {
    expect(readFirstGroup('1')).to.equal('một')
    expect(readFirstGroup('12')).to.equal('mười hai')
    expect(readFirstGroup('123')).to.equal('một trăm hai mươi ba')
  })
})

describe('readSubsequentGroup', () => {
  it('should return empty string for all zeros', () => {
    expect(readSubsequentGroup('0')).to.equal('')
    expect(readSubsequentGroup('00')).to.equal('')
    expect(readSubsequentGroup('000')).to.equal('')
  })

  it('should read numbers without suffix', () => {
    expect(readSubsequentGroup('1')).to.equal('một')
    expect(readSubsequentGroup('12')).to.equal('mười hai')
    expect(readSubsequentGroup('123')).to.equal('một trăm hai mươi ba')
  })
})
