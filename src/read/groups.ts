import {
  readFirstGroupBeforeBillion,
  readFirstGroup,
  readSubsequentGroup,
} from './three-digits.ts'
import { allFollowingGroupsAreZero } from './utils.ts'

/**
 * Calculate group types for each position
 * @returns Array where index is group position, value is type (0=units, 1=thousand, 2=million, 3=billion)
 */
export function calculateGroupTypes(groupCount: number): number[] {
  const groupTypes: number[] = []
  for (let i = groupCount - 1, type = 0; i >= 0; i--) {
    groupTypes[i] = type
    type++
    if (type === 4) type = 1 // cycle back after billion
  }
  return groupTypes
}

/**
 * Get unit suffix for a group based on its type
 */
function getUnitSuffix(
  type: number,
  positionFromRight: number,
  hasTrailingZeros: boolean,
): string {
  const needsBillionSuffix = positionFromRight >= 3 && hasTrailingZeros

  if (type === 3) {
    // Billion: double "tỷ" for second billion cycle (position >= 6)
    if (positionFromRight >= 6 && hasTrailingZeros) {
      return ' tỷ tỷ'
    }
    return ' tỷ'
  }

  if (type === 2) {
    return needsBillionSuffix ? ' triệu tỷ' : ' triệu'
  }

  if (type === 1) {
    return needsBillionSuffix ? ' nghìn tỷ' : ' nghìn'
  }

  // Type 0 (units)
  return needsBillionSuffix ? ' tỷ' : ''
}

/**
 * Process the first group in the number sequence
 */
function processFirstGroup(
  group: string,
  type: number,
  nextGroupType: number,
  positionFromRight: number,
  hasTrailingZeros: boolean,
): string {
  const isBeforeBillion = type === 0 && nextGroupType === 3

  const groupReading = isBeforeBillion
    ? readFirstGroupBeforeBillion(group)
    : readFirstGroup(group)

  if (!groupReading) return ''

  const unitSuffix = getUnitSuffix(type, positionFromRight, hasTrailingZeros)
  return `${groupReading}${unitSuffix}`
}

/**
 * Process a subsequent (non-first) group in the number sequence
 */
function processSubsequentGroup(
  group: string,
  type: number,
  positionFromRight: number,
  hasTrailingZeros: boolean,
): string {
  const groupReading = readSubsequentGroup(group)
  if (!groupReading) return ''

  const unitSuffix = getUnitSuffix(type, positionFromRight, hasTrailingZeros)
  return `${groupReading}${unitSuffix}`
}

/**
 * Process a single group and return its reading with unit suffix
 */
export function processGroup(
  group: string,
  index: number,
  groups: string[],
  groupTypes: number[],
): string {
  const type = groupTypes[index]
  const positionFromRight = groups.length - 1 - index
  const hasTrailingZeros = allFollowingGroupsAreZero(groups, index)

  if (index === 0) {
    const nextGroupType = groups.length > 1 ? groupTypes[1] : -1
    return processFirstGroup(
      group,
      type,
      nextGroupType,
      positionFromRight,
      hasTrailingZeros,
    )
  }

  return processSubsequentGroup(group, type, positionFromRight, hasTrailingZeros)
}
