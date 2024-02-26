import NumberReader from './NumberReader'

/**
 * This is a helper that convert a number to a string like the way a real Vietnamese read it.
 *
 * @example
 * ```ts
 * import { readVietnameseNumber } from '@hckhanh/vn-number/read'
 * // import { readVietnameseNumber } from 'jsr:@hckhanh/vn-number/read' // (for deno)
 *
 * readVietnameseNumber('19990000') // or readVietnameseNumber(19990000)
 * // output: mười chín triệu chín trăm chín mươi nghìn
 * ```
 *
 * @param number the number to read. It can be string or number type
 * @return the Vietnamese number in string.
 *
 * @module
 */
export function readVietnameseNumber(number: string | number): string {
  return NumberReader.read(number)
}
