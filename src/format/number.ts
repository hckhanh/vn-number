/**
 * NumberType is a TypeScript type alias that represents a value
 * which can be of the following types: string, number, bigint,
 * null, or undefined. It is intended to be used in scenarios
 * where a variable can accept any of these types as a valid value.
 */
type NumberType = string | number | bigint | null | undefined

/**
 * Formats a number using the provided formatter.
 * @param number The number to format.
 * @param formatter The formatter to use for number formatting.
 * @param fallbackValue The fallback value to use if the formatting fails.
 * @return The formatted number or the `fallbackValue` if formatting fails.
 */
function formatNumber(
  number: NumberType,
  formatter: Intl.NumberFormat,
  fallbackValue: string,
) {
  if (number == null) return fallbackValue
  if (typeof number === 'bigint') return formatter.format(number)
  if (typeof number === 'number')
    return Number.isNaN(number) ? fallbackValue : formatter.format(number)

  const num = Number(number)
  return Number.isNaN(num) ? fallbackValue : formatter.format(num)
}

const VN_NUMBER_FORMATTER = /*#__PURE__*/ new Intl.NumberFormat('vi-VN')

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
  number: NumberType,
  fallbackValue: string = '0',
): string {
  return formatNumber(number, VN_NUMBER_FORMATTER, fallbackValue)
}

const VN_CURRENCY_FORMATTER = /*#__PURE__*/ new Intl.NumberFormat('vi-VN', {
  currency: 'VND',
  style: 'currency',
})

/**
 * Formats a value as Vietnamese Dong (VND) currency.
 *
 * @example
 * ```ts
 * formatVnCurrency('19990000') // or formatVnCurrency(19990000)
 * // output: 19.990.000\u00A0₫
 * ```
 *
 * @param money The value to format as VND currency.
 * @param fallbackValue The fallback value to return if `money` is not a valid number. Default value is `0 ₫`
 * @return The value formatted as VND currency, or the `fallbackValue` if `money` is not a valid number.
 */
export function formatVnCurrency(
  money: NumberType,
  fallbackValue: string = '0\u00A0₫',
): string {
  return formatNumber(money, VN_CURRENCY_FORMATTER, fallbackValue)
}

const VN_PERCENT_FORMATTER = /*#__PURE__*/ new Intl.NumberFormat('vi-VN', {
  style: 'percent',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

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
  value: NumberType,
  fallbackValue: string = '0%',
): string {
  return formatNumber(value, VN_PERCENT_FORMATTER, fallbackValue)
}
