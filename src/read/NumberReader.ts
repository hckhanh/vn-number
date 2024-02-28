import Numbers from '~/read/Numbers.ts'
import Billion from '~/read/Billion.ts'
import Thousand from '~/read/Thousand.ts'
import Million from '~/read/Million.ts'
import { InvalidNumberTypeError } from '~/read/Utils.ts'

enum NumberType {
  Numbers,
  Thousand,
  Million,
  Billion
}

/**
 * A number reader in Vietnamese language helper
 */
export default class NumberReader {
  /**
   * Read a number in Vietnamese language
   *
   * @param number the number to read
   * @return a string of the number is read in Vietnamese
   */
  public static read(number: string | number | bigint): string {
    const s = number.toString()

    const numberGroups = this.getGroupNumbers(s)
    const numbers = this.mapToNumbers(numberGroups)
    return this.readNumbers(numbers)
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
      numbers.unshift(this.getNumber(numberGroups[i], currentType++))
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

  private static readonly NumberClasses = {
    [NumberType.Numbers]: Numbers,
    [NumberType.Thousand]: Thousand,
    [NumberType.Million]: Million,
    [NumberType.Billion]: Billion
  }

  /**
   * Map a number in string to a {@link Numbers} object
   *
   * @param s Input string to map
   * @param type Type number of the {@link Numbers} object
   */
  private static getNumber(s: string, type: NumberType): Numbers {
    const NumberClass = this.NumberClasses[type]

    if (NumberClass) {
      return new NumberClass(s)
    }

    throw new InvalidNumberTypeError(type)
  }
}
