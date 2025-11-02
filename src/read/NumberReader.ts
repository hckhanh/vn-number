import Billion from './Billion.ts'
import Million from './Million.ts'
import Numbers from './Numbers.ts'
import Thousand from './Thousand.ts'
import { InvalidNumberTypeError } from './Utils.ts'

/**
 * Type of number
 */
enum NumberType {
  /**
   * Number of the first group (100.000.000.xxx)
   */
  Numbers,
  /**
   * Number in the thousand group (100.000.xxx.000)
   */
  Thousand,
  /**
   * Number in the million group (100.xxx.000.000)
   */
  Million,
  /**
   * Number in the billion group (xxx.000.000.000)
   */
  Billion,
}

/**
 * A number reader in Vietnamese language helper
 */
export default class NumberReader {
  private static readonly NumberClasses = {
    [NumberType.Numbers]: Numbers,
    [NumberType.Thousand]: Thousand,
    [NumberType.Million]: Million,
    [NumberType.Billion]: Billion,
  }

  /**
   * Read a number in Vietnamese language
   *
   * @param number the number to read
   * @return a string of the number is read in Vietnamese
   */
  public static read(number: string | number | bigint): string {
    const s = number.toString()

    const numberGroups = NumberReader.getGroupNumbers(s)
    const numbers = NumberReader.mapToNumbers(numberGroups)
    return NumberReader.readNumbers(numbers)
  }

  /**
   * Convert all {@link Numbers} objects to a string
   *
   * @param numbers an array of {@link Numbers} objects
   * @return a {@link string} of the number is read in Vietnamese
   */
  private static readNumbers(numbers: Numbers[]): string {
    return numbers
      .reduce((result, group: Numbers, index: number) => {
        const beforeBillion =
          index + 1 < numbers.length && numbers[index + 1] instanceof Billion
        return `${result.trim()} ${group.read(index === 0, beforeBillion)}`
      }, '')
      .trim()
  }

  /**
   * Map all group numbers in {@link string} to {@link Numbers} objects in reverse order
   *
   * @param numberGroups group of numbers in string
   * @return an array of {@link Numbers}
   */
  private static mapToNumbers(numberGroups: string[]): Numbers[] {
    const numbers: Numbers[] = []

    for (let i = numberGroups.length - 1, currentType = 0; i >= 0; i--) {
      numbers.unshift(NumberReader.getNumber(numberGroups[i], currentType++))
      currentType = currentType === 4 ? 1 : currentType
    }

    return numbers
  }

  /**
   * Generate a group of numbers from the end of a string
   *
   * @param s input string of number
   */
  private static getGroupNumbers(s: string): string[] {
    return s.match(/.{1,3}(?=(.{3})*$)/g) || []
  }

  /**
   * Map a number in string to a {@link Numbers} object
   *
   * @param s Input string to map
   * @param type Type number of the {@link Numbers} object
   */
  private static getNumber(s: string, type: NumberType): Numbers {
    const NumberClass = NumberReader.NumberClasses[type]

    if (NumberClass) {
      return new NumberClass(s)
    }

    throw new InvalidNumberTypeError(type)
  }
}
