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
export function getDigitWord(digit: string): string {
  return DIGIT_MAP[Number(digit)] || ''
}
