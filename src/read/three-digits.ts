import { DIGIT_MAP, getDigitWord } from './digits.ts'

/**
 * Read the "hundreds" digit
 */
function readHundreds(first: string, groupLength: number): string {
  return groupLength > 2 ? `${getDigitWord(first)} trăm` : ''
}

/**
 * Read the "tens" digit
 */
function readTens(second: string, hasTensPosition: boolean): string {
  if (!hasTensPosition) return ''

  if (second === '0') return ' lẻ'
  if (second === '1') return ' mười'
  return ` ${getDigitWord(second)} mươi`
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
function readNonDigitGroup(group: string): string {
  const len = group.length
  const first = len > 2 ? group[len - 3] : '0'
  const second = len > 1 ? group[len - 2] : '0'
  const last = group[len - 1] || '0'

  let result = readHundreds(first, len)

  // If the last two digits are zero, return early
  if (second === '0' && last === '0') {
    return result.trim()
  }

  const hasTensPosition = len > 1
  result += readTens(second, hasTensPosition)
  result += readOnes(last, second, hasTensPosition)

  return result.trim()
}

/** Read decimal groups without repeatedly coercing digits or trimming strings. */
function readThreeDigitsCore(group: string, zeroReading: string = ''): string {
  const len = group.length
  const first = len > 2 ? group.charCodeAt(len - 3) - 48 : 0
  const second = len > 1 ? group.charCodeAt(len - 2) - 48 : 0
  const last = group.charCodeAt(len - 1) - 48
  // Reuse decoded digits for zero groups instead of decoding the group twice.
  if (first === 0 && second === 0 && last === 0) return zeroReading
  // Preserve the existing handling of non-decimal input without slowing the
  // documented decimal-integer path with repeated Number() conversions.
  if (
    !(
      first >= 0 &&
      first <= 9 &&
      second >= 0 &&
      second <= 9 &&
      last >= 0 &&
      last <= 9
    )
  ) {
    return readNonDigitGroup(group)
  }

  let result = len > 2 ? DIGIT_MAP[first] + ' trăm' : ''
  if (second === 0 && last === 0) return result

  if (len > 1) {
    if (result) result += ' '
    result +=
      second === 0 ? 'lẻ' : second === 1 ? 'mười' : DIGIT_MAP[second] + ' mươi'
  }
  if (last !== 0) {
    if (result) result += ' '
    result +=
      last === 1 && second > 1
        ? 'mốt'
        : last === 5 && second > 0
          ? 'lăm'
          : DIGIT_MAP[last]
  }
  return result
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
  return group === '' ? 'không' : readThreeDigitsCore(group, 'không')
}

/**
 * Read the later (non-first) group in the number sequence
 */
export function readSubsequentGroup(group: string): string {
  return readThreeDigitsCore(group)
}
