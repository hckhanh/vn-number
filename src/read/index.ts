import NumberReader from './NumberReader.ts'

/**
 * This is a helper that convert a number to a string like the way a real Vietnamese.
 * It can be used with unlimited value (use {@link string} for number bigger than {@link bigint})
 *
 * @example
 * ```ts
 * import { readVnNumber } from '@hckhanh/vn-number'
 *
 * readVnNumber('19990000') // or readVnNumber(19990000)
 * // output: mười chín triệu chín trăm chín mươi nghìn
 * ```
 *
 * @param number - The number to read. It can be string, number or bigint value
 * @return The Vietnamese number in string.
 */
export function readVnNumber(number: string | number | bigint): string {
  return NumberReader.read(number)
}
