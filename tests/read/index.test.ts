import { describe, expect, it } from 'vitest'
import { readVietnameseNumber } from '../../src/read'

describe('index', function () {
  it('should read number 2.000.000.000 in string', function () {
    expect(readVietnameseNumber('2000000000')).to.equal('hai tỷ')
  })

  it('should read number 2.000.000.000 in number', function () {
    expect(readVietnameseNumber(2000000000)).to.equal('hai tỷ')
  })
})
