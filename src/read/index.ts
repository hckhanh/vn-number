import NumberReader from './NumberReader.ts'

/**
 * This is a helper that convert a number to a string like the way a real Vietnamese read it.
 *
 * @example
 * ```ts
 * import { readVnNumber } from '@hckhanh/vn-number'
 *
 * readVnNumber('19990000') // or readVnNumber(19990000) // output: mười chín triệu chín trăm chín mươi nghìn
 * ```
 *
 * @param number the number to read. It can be string or number type
 * @return the Vietnamese number in string.
 */
export function readVnNumber(number: string | number): string {
  return NumberReader.read(number)
}
