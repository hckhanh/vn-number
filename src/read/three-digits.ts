import { getDigitWord } from './digits.ts'

/**
 * Read the "hundreds" digit
 */
function readHundreds(first: string, hasHundredsPosition: boolean): string {
  return !hasHundredsPosition ? '' : `${getDigitWord(first)} trăm`
}

/**
 * Read the "tens" digit
 */
function readTens(second: string, hasTensPosition: boolean): string {
  return !hasTensPosition
    ? ''
    : second === '0'
      ? ' lẻ'
      : second === '1'
        ? ' mười'
        : ` ${getDigitWord(second)} mươi`
}

/**
 * Read the "ones" digit with special rules
 */
function readOnes(
  last: string,
  second: string,
  hasTensPosition: boolean,
): string {
  if (!hasTensPosition) {
    return ` ${getDigitWord(last)}`
  }

  // Apply special rules when there's a tens position
  if (second !== '0' && second !== '1' && last === '1') {
    return ' mốt'
  }
  if (last === '5' && second !== '0') {
    return ' lăm'
  }
  if (last !== '0') {
    return ` ${getDigitWord(last)}`
  }

  return ''
}

/**
 * Core reading logic for a 3-digit group
 */
function readThreeDigitsCore(group: string): string {
  const len = group.length
  const first = len > 2 ? group[len - 3] : '0'
  const second = len > 1 ? group[len - 2] : '0'
  const last = group[len - 1] || '0'

  let result = readHundreds(first, len > 2)

  // If the last two digits are zero, return early
  if (second === '0' && last === '0') {
    return result.trim()
  }

  result += readTens(second, len > 1)
  result += readOnes(last, second, len > 1)

  return result.trim()
}

/**
 * Check if a group contains all zeros
 */
function isAllZeros(group: string): boolean {
  const len = group.length
  const first = len > 2 ? group[len - 3] : '0'
  const second = len > 1 ? group[len - 2] : '0'
  const last = group[len - 1] || '0'
  return first === '0' && second === '0' && last === '0'
}

/**
 * Read the first group in the number sequence when it's before a billion group
 * This adds a special "nghìn" suffix
 */
export function readFirstGroupBeforeBillion(group: string): string {
  if (isAllZeros(group)) {
    return 'không'
  }

  const result = readThreeDigitsCore(group)
  return result ? `${result} nghìn` : ''
}

/**
 * Read the first group in the number sequence (normal case)
 */
export function readFirstGroup(group: string): string {
  return isAllZeros(group) ? 'không' : readThreeDigitsCore(group)
}

/**
 * Read the later (non-first) group in the number sequence
 */
export function readSubsequentGroup(group: string): string {
  return isAllZeros(group) ? '' : readThreeDigitsCore(group)
}
