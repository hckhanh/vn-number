import { describe, expect, it } from 'vitest'
import Thousand from './Thousand.ts'

describe('Thousand', () => {
  it('should read number: 060.000', () => {
    const thousand = new Thousand('060')
    expect(thousand.read()).to.equal('không trăm sáu mươi nghìn')
  })

  it('should read number: 000.100', () => {
    const thousand = new Thousand('000')
    expect(thousand.read()).to.equal('')
  })
})
