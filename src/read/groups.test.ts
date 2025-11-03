import { describe, expect, it } from 'vitest'
import { calculateGroupTypes, processGroup } from './groups.ts'

describe('calculateGroupTypes', () => {
  it('should calculate types for different group counts', () => {
    expect(calculateGroupTypes(1)).to.deep.equal([0])
    expect(calculateGroupTypes(2)).to.deep.equal([1, 0])
    expect(calculateGroupTypes(3)).to.deep.equal([2, 1, 0])
    expect(calculateGroupTypes(4)).to.deep.equal([3, 2, 1, 0])
    expect(calculateGroupTypes(5)).to.deep.equal([1, 3, 2, 1, 0])
    expect(calculateGroupTypes(6)).to.deep.equal([2, 1, 3, 2, 1, 0])
    expect(calculateGroupTypes(7)).to.deep.equal([3, 2, 1, 3, 2, 1, 0])
  })

  it('should cycle back to 1 after billion (type 3)', () => {
    const types = calculateGroupTypes(5)
    expect(types[0]).to.equal(1) // After reaching 3, cycles back to 1
  })
})

describe('processGroup', () => {
  it('should process first group with type 0', () => {
    const groups = ['123']
    const groupTypes = [0]
    const result = processGroup('123', 0, groups, groupTypes)
    expect(result).to.equal('một trăm hai mươi ba')
  })

  it('should process first group before billion (type 0, next type 3)', () => {
    // Create a scenario where first group is type 0 and next is type 3
    // This is a manual test case to hit the isBeforeBillion branch
    const groups = ['1', '000', '000', '000']
    const groupTypes = [0, 3, 2, 1] // Manually crafted to test the condition
    const result = processGroup('1', 0, groups, groupTypes)
    // Should add "nghìn" from readFirstGroupBeforeBillion, plus " tỷ" from suffix
    expect(result).to.equal('một nghìn tỷ')
  })

  it('should process subsequent groups', () => {
    const groups = ['1', '234']
    const groupTypes = [1, 0]
    const result = processGroup('234', 1, groups, groupTypes)
    expect(result).to.equal('hai trăm ba mươi bốn')
  })

  it('should skip zero groups in subsequent positions', () => {
    const groups = ['1', '000']
    const groupTypes = [1, 0]
    const result = processGroup('000', 1, groups, groupTypes)
    expect(result).to.equal('')
  })

  it('should add billion suffix for trailing zeros', () => {
    const groups = ['1', '000', '000', '000']
    const groupTypes = [3, 2, 1, 0]
    const result = processGroup('1', 0, groups, groupTypes)
    expect(result).to.equal('một tỷ')
  })
})
