/**
 * Formats a number using the provided formatter.
 * @param number The number to format.
 * @param formatter The formatter to use for number formatting.
 * @param invalidValue The value to replace if `number` is invalid.
 * @param fallbackValue The fallback value to use if the formatting fails.
 * @return The formatted number or the `fallbackValue` if formatting fails.
 */
function formatNumber(
  number: string | number | bigint | null | undefined,
  formatter: Intl.NumberFormat,
  invalidValue: string,
  fallbackValue: string
) {
  if (
    (typeof number === 'number' && !isNaN(number)) ||
    typeof number === 'bigint'
  ) {
    return formatter.format(number)
  } else if (typeof number === 'string') {
    try {
      return formatter
        .format(Number(number))
        .replace(invalidValue, fallbackValue)
    } catch {
      return fallbackValue
    }
  } else {
    return fallbackValue
  }
}

/**
 * Formats a number as a Vietnamese formatted number.
 *
 * @example
 * ```ts
 * formatVnNumber('19990000') // or formatVnNumber(19990000)
 * // output: 19.990.000
 * ```
 *
 * @param number The number to format.
 * @param fallbackValue The fallback value to use if formatting fails. Default value is `0`
 * @return The formatted number or the `fallbackValue` if formatting fails.
 */
export function formatVnNumber(
  number: string | number | bigint | null | undefined,
  fallbackValue: string = '0'
): string {
  const formatter = new Intl.NumberFormat('vi-VN')
  return formatNumber(number, formatter, 'NaN', fallbackValue)
}

/**
 * Formats a value as Vietnamese Dong (VND) currency.
 *
 * @example
 * ```ts
 * formatVnCurrency('19990000') // or formatVnCurrency(19990000)
 * // output: 19.990.000 ₫
 * ```
 *
 * @param money The value to format as VND currency.
 * @param fallbackValue The fallback value to return if `money` is not a valid number. Default value is `0 ₫`
 * @return The value formatted as VND currency, or the `fallbackValue` if `money` is not a valid number.
 */
export function formatVnCurrency(
  money: string | number | bigint | null | undefined,
  fallbackValue: string = '0 ₫'
): string {
  const formatter = new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    style: 'currency'
  })
  return formatNumber(money, formatter, 'NaN ₫', fallbackValue)
}

/**
 * Formats a number or string representing value into a Vietnamese percentage format.
 *
 * @example
 * ```ts
 * formatVnPercent('0.99') // or formatVnPercent(0.99)
 * // output: 99%
 * ```
 *
 * @param value The value to format.
 * @param fallbackValue The fallback value to use if the `value` is invalid or not provided.
 *
 * @return The value formatted as a Vietnamese percentage, or the `fallbackValue` if `value` is not a valid number.
 */
export function formatVnPercent(
  value: string | number | bigint | null | undefined,
  fallbackValue: string = '0%'
): string {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })
  return formatNumber(value, formatter, 'NaN%', fallbackValue)
}
