import { getDigitWord } from './digits.ts'

/**
 * Read the hundreds digit
 */
function readHundreds(first: string, hasHundredsPosition: boolean): string {
  if (!hasHundredsPosition) return ''
  return `${getDigitWord(first)} trăm`
}

/**
 * Read the tens digit
 */
function readTens(second: string, hasTensPosition: boolean): string {
  if (!hasTensPosition) return ''

  if (second === '0') return ' lẻ'
  if (second === '1') return ' mười'
  return ` ${getDigitWord(second)} mươi`
}

/**
 * Read the ones digit with special rules
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
 * Add suffix for first group before billion
 */
function addFirstBeforeBillionSuffix(
  isFirst: boolean,
  isBeforeBillion: boolean,
): string {
  return isFirst && isBeforeBillion ? ' nghìn' : ''
}

/**
 * Read a 3-digit group
 * @param group - 3-digit string (can be 1-3 chars)
 * @param isFirst - is this the first group
 * @param isBeforeBillion - is this group before a billion group
 * @returns Vietnamese reading of the group
 */
export function readThreeDigits(
  group: string,
  isFirst: boolean,
  isBeforeBillion: boolean,
): string {
  const len = group.length
  const first = len > 2 ? group[len - 3] : '0'
  const second = len > 1 ? group[len - 2] : '0'
  const last = group[len - 1] || '0'

  // Handle all zeros
  if (first === '0' && second === '0' && last === '0') {
    return isFirst ? 'không' : ''
  }

  let result = readHundreds(first, len > 2)

  // If the last two digits are zero, return early
  if (second === '0' && last === '0') {
    result += addFirstBeforeBillionSuffix(isFirst, isBeforeBillion)
    return result.trim()
  }

  result += readTens(second, len > 1)
  result += readOnes(last, second, len > 1)
  result += addFirstBeforeBillionSuffix(isFirst, isBeforeBillion)

  return result.trim()
}
