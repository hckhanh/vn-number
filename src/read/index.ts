import { calculateGroupTypes, processGroup } from './groups.ts'
import { splitIntoGroups } from './utils.ts'

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
  const groups = splitIntoGroups('' + number)
  const groupTypes = calculateGroupTypes(groups.length)

  const parts: string[] = []
  for (let i = 0; i < groups.length; i++) {
    const result = processGroup(groups[i], i, groups, groupTypes)
    if (result) {
      parts.push(result)
    }
  }

  return parts.join(' ').trim()
}
