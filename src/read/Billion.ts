import Numbers from './Numbers.ts'

/**
 * Group three numbers, a component in a billion position of the input number
 */
export default class Billion extends Numbers {
  public override read(firstNumber?: boolean): string {
    return `${super.read(firstNumber)} tỷ`.trim()
  }
}
