import { describe, expect, it } from 'vitest'
import { allFollowingGroupsAreZero, splitIntoGroups } from './utils.ts'

describe('group helper compatibility', () => {
  it.each([
    ['', []],
    ['0', ['0']],
    ['001', ['001']],
    ['1001', ['1', '001']],
    ['0012345', ['0', '012', '345']],
    ['123456789', ['123', '456', '789']],
  ])('retains widths when splitting %j', (value, expected) => {
    expect(splitIntoGroups(value)).toEqual(expected)
  })

  it('recognizes each supported zero-group width and stops at nonzero groups', () => {
    expect(allFollowingGroupsAreZero(['1', '0', '00', '000'], 0)).toBe(true)
    expect(allFollowingGroupsAreZero(['1', '000', '001'], 0)).toBe(false)
    expect(allFollowingGroupsAreZero(['1', '000', 'invalid'], 0)).toBe(false)
    expect(allFollowingGroupsAreZero(['1'], 0)).toBe(true)
  })
})
