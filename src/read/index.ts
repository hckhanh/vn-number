import { getUnitSuffix } from './groups.ts'
import { readFirstGroup, readSubsequentGroup } from './three-digits.ts'

/**
 * This is a helper that converts a number to a string like the way a real Vietnamese.
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
  const value = '' + number
  const length = value.length
  if (length === 0) return ''
  if (length <= 3) return readFirstGroup(value)

  const firstGroupLength = ((length - 1) % 3) + 1
  let lastGroupEnd = length
  // Locate the last nonzero group once, instead of rescanning the suffix for
  // every group. The first group is retained even for an all-zero input.
  while (
    lastGroupEnd > firstGroupLength &&
    value.charCodeAt(lastGroupEnd - 1) === 48 &&
    value.charCodeAt(lastGroupEnd - 2) === 48 &&
    value.charCodeAt(lastGroupEnd - 3) === 48
  ) {
    lastGroupEnd -= 3
  }

  const parts: string[] = []
  for (let start = 0, end = firstGroupLength; end <= lastGroupEnd; end += 3) {
    const group = value.slice(start, end)
    const reading =
      start === 0 ? readFirstGroup(group) : readSubsequentGroup(group)
    if (reading) {
      const positionFromRight = (length - end) / 3
      const type =
        positionFromRight === 0 ? 0 : ((positionFromRight - 1) % 3) + 1
      parts.push(
        reading + getUnitSuffix(type, positionFromRight, end === lastGroupEnd),
      )
    }
    start = end
  }
  return parts.join(' ').trim()
}
