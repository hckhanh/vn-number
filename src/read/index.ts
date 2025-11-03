/**
 * Mapping single digit to Vietnamese word
 */
const DIGIT_MAP: readonly string[] = [
  'không',
  'một',
  'hai',
  'ba',
  'bốn',
  'năm',
  'sáu',
  'bảy',
  'tám',
  'chín',
]

/**
 * Get Vietnamese word for a digit
 */
function getDigitWord(digit: string): string {
  const d = Number(digit)
  return DIGIT_MAP[d] || ''
}

/**
 * Read a 3-digit group
 * @param group - 3-digit string (can be 1-3 chars)
 * @param isFirst - is this the first group
 * @param isBeforeBillion - is this group before a billion group
 * @returns Vietnamese reading of the group
 */
function readThreeDigits(
  group: string,
  isFirst: boolean,
  isBeforeBillion: boolean,
): string {
  const len = group.length
  const first = len > 2 ? group[len - 3] : '0'
  const second = len > 1 ? group[len - 2] : '0'
  const last = group[len - 1] || '0'

  // All zeros
  if (first === '0' && second === '0' && last === '0') {
    return isFirst ? 'không' : ''
  }

  let result = ''

  // First digit (hundreds)
  // Only processes if the group has at least 3 digits (has a hundreds position)
  if (len > 2) {
    result = `${getDigitWord(first)} trăm`
  }

  // If the last two digits are zero, skip
  if (second === '0' && last === '0') {
    if (isFirst && isBeforeBillion) {
      result += ' nghìn'
    }
    return result.trim()
  }

  // Second digit (tens)
  // Only process if group has at least 2 digits
  if (len > 1) {
    if (second === '0') {
      result += ' lẻ'
    } else if (second === '1') {
      result += ' mười'
    } else {
      result += ` ${getDigitWord(second)} mươi`
    }
  }

  // Last digit (ones)
  if (len > 1) {
    // Has tens digit - use special rules
    if (second !== '0' && second !== '1' && last === '1') {
      result += ' mốt'
    } else if (last === '5' && second !== '0') {
      result += ' lăm'
    } else if (last !== '0') {
      result += ` ${getDigitWord(last)}`
    }
  } else {
    // No ten digit - just add the last digit
    result += ` ${getDigitWord(last)}`
  }

  if (isFirst && isBeforeBillion) {
    result += ' nghìn'
  }

  return result.trim()
}

/**
 * Split number string into 3-digit groups from right to left
 */
function splitIntoGroups(numStr: string): string[] {
  const groups: string[] = []
  let i = numStr.length

  while (i > 0) {
    const start = Math.max(0, i - 3)
    groups.unshift(numStr.slice(start, i))
    i = start
  }

  return groups
}

/**
 * This is a helper that convert a number to a string like the way a real Vietnamese.
 * It can be used with unlimited value (use {@link string} for number bigger than {@link bigint})
 *
 * @example
 * ```ts
 * readVnNumber('19990000') // or readVnNumber(19990000)
 * // output: mười chín triệu chín trăm chín mươi nghìn
 * ```
 *
 * @param number The number to read. It can be string, number or bigint value
 * @return The Vietnamese number in string.
 */
export function readVnNumber(number: string | number | bigint): string {
  const numStr = number.toString()
  const groups = splitIntoGroups(numStr)
  const groupCount = groups.length

  // Map each group index to its type (0=units, 1=thousand, 2=million, 3=billion)
  // After billion, it cycles: 4->1, 5->2, 6->3, 7->1, etc.
  const groupTypes: number[] = []
  for (let i = groupCount - 1, type = 0; i >= 0; i--) {
    groupTypes[i] = type
    type++
    if (type === 4) type = 1 // cycle back after billion
  }

  const parts: string[] = []

  // Check if all groups after index i are zeros
  const allFollowingGroupsAreZero = (index: number): boolean => {
    for (let j = index + 1; j < groupCount; j++) {
      const g = groups[j]
      if (g !== '000' && g !== '00' && g !== '0') {
        return false
      }
    }
    return true
  }

  for (let i = 0; i < groupCount; i++) {
    const group = groups[i]
    const isFirst = i === 0
    const type = groupTypes[i]
    const positionFromRight = groupCount - 1 - i
    const nextGroupType = i + 1 < groupCount ? groupTypes[i + 1] : -1
    // beforeBillion only applies to plain Numbers (type 0), not to Thousand/Million/Billion
    const isBeforeBillion = type === 0 && nextGroupType === 3

    const groupReading = readThreeDigits(group, isFirst, isBeforeBillion)

    if (groupReading) {
      // Check if this is a group in the billion+ range with all following groups being zero
      const needsBillionSuffix =
        positionFromRight >= 3 && allFollowingGroupsAreZero(i)

      // Add unit suffix based on type (but not if already added by readThreeDigits)
      if (type === 3) {
        // Billion
        // Double "tỷ" only for second billion cycle and beyond (position >= 6)
        if (positionFromRight >= 6 && allFollowingGroupsAreZero(i)) {
          parts.push(`${groupReading} tỷ tỷ`)
        } else {
          parts.push(`${groupReading} tỷ`)
        }
      } else if (type === 2) {
        // Million
        if (needsBillionSuffix) {
          parts.push(`${groupReading} triệu tỷ`)
        } else {
          parts.push(`${groupReading} triệu`)
        }
      } else if (type === 1) {
        // Thousand
        if (needsBillionSuffix) {
          parts.push(`${groupReading} nghìn tỷ`)
        } else {
          parts.push(`${groupReading} nghìn`)
        }
      } else {
        // Units
        if (needsBillionSuffix) {
          parts.push(`${groupReading} tỷ`)
        } else {
          parts.push(groupReading)
        }
      }
    }
  }

  return parts.join(' ').trim()
}
