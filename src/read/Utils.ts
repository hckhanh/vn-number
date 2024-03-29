/**
 * Mapping object to map a number to string
 */
const NumberMap: { [key: string]: string } = {
  '0': 'không',
  '1': 'một',
  '2': 'hai',
  '3': 'ba',
  '4': 'bốn',
  '5': 'năm',
  '6': 'sáu',
  '7': 'bảy',
  '8': 'tám',
  '9': 'chín'
}

/**
 * Used when logic return wrong number from {@link NumberReader }
 */
export class NotNumberError extends Error {
  constructor(wrongNumber: string) {
    super(`Invalid number: ${JSON.stringify(wrongNumber)}`)
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
}

/**
 * Used when logic return wrong number type from {@link NumberReader }
 */
export class InvalidNumberTypeError extends Error {
  constructor(wrongType: number) {
    super(`Invalid number type: ${JSON.stringify(wrongType)}`)
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
}

/**
 * Get number from {@link NumberMap} according to the input single number
 * @param number the input number, only 1 char is valid
 * @return string the number in string
 */
export function getNumberFromMap(number: string[1]): string {
  if (Object.prototype.hasOwnProperty.call(NumberMap, number)) {
    return NumberMap[number]
  } else {
    throw new NotNumberError(number)
  }
}
