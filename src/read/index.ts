import NumberReader from './NumberReader'

/**
 * read the number function
 *
 * @param number the number to read. It can be string or number type
 * @return the Vietnamese number in string.
 */
export function readVnNumber(number: string | number): string {
  return NumberReader.read(number)
}
