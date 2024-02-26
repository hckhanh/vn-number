/**
 * This is a helper that convert a number to a string like the way a real Vietnamese read it.
 *
 * - Zero dependencies
 * - Support edge runtimes
 * - Unlimited number (use string for big number)
 *
 * @example
 * ```ts
 * import { readVnNumber } from '@hckhanh/vn-number/read'
 * // import { readVnNumber } from 'jsr:@hckhanh/vn-number/read' // (for deno)
 *
 * readVnNumber('19990000') // or readVnNumber(19990000)
 * // output: mười chín triệu chín trăm chín mươi nghìn
 * ```
 *
 * @module
 */
export * from './index.ts'
