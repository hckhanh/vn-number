import { bench, describe } from 'vitest'
import { formatVnNumber, formatVnCurrency, formatVnPercent } from './number.ts'

describe('formatVnNumber', () => {
  describe('various number sizes', () => {
    bench('small number (123)', () => {
      formatVnNumber(123)
    })

    bench('thousands (12,345)', () => {
      formatVnNumber(12345)
    })

    bench('millions (1,234,567)', () => {
      formatVnNumber(1234567)
    })

    bench('billions (1,234,567,890)', () => {
      formatVnNumber(1234567890)
    })
  })

  describe('input type variations', () => {
    const testNumber = 19990000

    bench('number input', () => {
      formatVnNumber(testNumber)
    })

    bench('string input', () => {
      formatVnNumber(String(testNumber))
    })

    bench('bigint input', () => {
      formatVnNumber(BigInt(testNumber))
    })

    bench('decimal number', () => {
      formatVnNumber(12345.67)
    })

    bench('all input types for same value', () => {
      formatVnNumber(testNumber)
      formatVnNumber(String(testNumber))
      formatVnNumber(BigInt(testNumber))
    })
  })

  describe('edge cases', () => {
    bench('null with default fallback', () => {
      formatVnNumber(null)
    })

    bench('undefined with default fallback', () => {
      formatVnNumber(undefined)
    })

    bench('invalid string with custom fallback', () => {
      formatVnNumber('not a number', 'N/A')
    })

    bench('zero', () => {
      formatVnNumber(0)
    })

    bench('negative number', () => {
      formatVnNumber(-12345)
    })

    bench('NaN', () => {
      formatVnNumber(NaN)
    })

    bench('empty string', () => {
      formatVnNumber('')
    })

    bench('very large number', () => {
      formatVnNumber(Number.MAX_SAFE_INTEGER)
    })
  })

  describe('stress tests', () => {
    bench('100 random numbers', () => {
      for (let i = 0; i < 100; i++) {
        formatVnNumber(Math.floor(Math.random() * 1000000000))
      }
    })

    bench('mixed valid and invalid inputs (100 iterations)', () => {
      for (let i = 0; i < 100; i++) {
        if (i % 3 === 0) formatVnNumber(null)
        else if (i % 3 === 1) formatVnNumber(undefined)
        else formatVnNumber(Math.floor(Math.random() * 1000000))
      }
    })
  })
})

describe('formatVnCurrency', () => {
  describe('various currency amounts', () => {
    bench('small amount (1,000)', () => {
      formatVnCurrency(1000)
    })

    bench('typical amount (500,000)', () => {
      formatVnCurrency(500000)
    })

    bench('large amount (19,990,000)', () => {
      formatVnCurrency(19990000)
    })

    bench('very large amount (1,000,000,000)', () => {
      formatVnCurrency(1000000000)
    })

    bench('trillion (1,000,000,000,000)', () => {
      formatVnCurrency(1000000000000)
    })
  })

  describe('input type variations', () => {
    const testAmount = 19990000

    bench('number input', () => {
      formatVnCurrency(testAmount)
    })

    bench('string input', () => {
      formatVnCurrency(String(testAmount))
    })

    bench('bigint input', () => {
      formatVnCurrency(BigInt(testAmount))
    })

    bench('decimal amount', () => {
      formatVnCurrency(19990000.5)
    })

    bench('all input types for same value', () => {
      formatVnCurrency(testAmount)
      formatVnCurrency(String(testAmount))
      formatVnCurrency(BigInt(testAmount))
    })
  })

  describe('edge cases', () => {
    bench('null with default fallback', () => {
      formatVnCurrency(null)
    })

    bench('undefined with default fallback', () => {
      formatVnCurrency(undefined)
    })

    bench('invalid string with custom fallback', () => {
      formatVnCurrency('invalid', 'N/A')
    })

    bench('zero', () => {
      formatVnCurrency(0)
    })

    bench('negative amount', () => {
      formatVnCurrency(-50000)
    })

    bench('NaN', () => {
      formatVnCurrency(NaN)
    })

    bench('fractional currency', () => {
      formatVnCurrency(12345.99)
    })
  })

  describe('stress tests', () => {
    bench('100 random amounts', () => {
      for (let i = 0; i < 100; i++) {
        formatVnCurrency(Math.floor(Math.random() * 100000000))
      }
    })

    bench('typical e-commerce prices (100 iterations)', () => {
      for (let i = 0; i < 100; i++) {
        // Prices between 10,000 and 50,000,000 VND
        formatVnCurrency(Math.floor(Math.random() * 49990000) + 10000)
      }
    })
  })
})

describe('formatVnPercent', () => {
  describe('various percentage values', () => {
    bench('zero percent (0)', () => {
      formatVnPercent(0)
    })

    bench('typical percentage (0.99)', () => {
      formatVnPercent(0.99)
    })

    bench('half percent (0.5)', () => {
      formatVnPercent(0.5)
    })

    bench('full percentage (1)', () => {
      formatVnPercent(1)
    })

    bench('over 100% (1.5)', () => {
      formatVnPercent(1.5)
    })

    bench('small percentage (0.0123)', () => {
      formatVnPercent(0.0123)
    })

    bench('very large percentage (10)', () => {
      formatVnPercent(10)
    })
  })

  describe('input type variations', () => {
    bench('number input (0.75)', () => {
      formatVnPercent(0.75)
    })

    bench('string input ("0.75")', () => {
      formatVnPercent('0.75')
    })

    bench('bigint input (1n)', () => {
      formatVnPercent(1n)
    })

    bench('all input types', () => {
      formatVnPercent(0.75)
      formatVnPercent('0.75')
      formatVnPercent(1n)
    })
  })

  describe('edge cases', () => {
    bench('null with default fallback', () => {
      formatVnPercent(null)
    })

    bench('undefined with default fallback', () => {
      formatVnPercent(undefined)
    })

    bench('invalid string with custom fallback', () => {
      formatVnPercent('not a number', 'N/A')
    })

    bench('negative percentage', () => {
      formatVnPercent(-0.25)
    })

    bench('very small decimal', () => {
      formatVnPercent(0.00001)
    })

    bench('NaN', () => {
      formatVnPercent(NaN)
    })
  })

  describe('stress tests', () => {
    bench('100 random percentages (0-1)', () => {
      for (let i = 0; i < 100; i++) {
        formatVnPercent(Math.random())
      }
    })

    bench('100 random percentages (0-2)', () => {
      for (let i = 0; i < 100; i++) {
        formatVnPercent(Math.random() * 2)
      }
    })
  })
})

describe('comparison benchmarks', () => {
  const testNumber = 19990000

  bench('formatVnNumber vs formatVnCurrency', () => {
    formatVnNumber(testNumber)
    formatVnCurrency(testNumber)
  })

  bench('all three format functions', () => {
    formatVnNumber(testNumber)
    formatVnCurrency(testNumber)
    formatVnPercent(0.99)
  })

  bench('formatVnNumber: number vs string vs bigint', () => {
    formatVnNumber(testNumber)
    formatVnNumber(String(testNumber))
    formatVnNumber(BigInt(testNumber))
  })

  bench('formatVnCurrency: number vs string vs bigint', () => {
    formatVnCurrency(testNumber)
    formatVnCurrency(String(testNumber))
    formatVnCurrency(BigInt(testNumber))
  })

  bench('all functions with error handling', () => {
    formatVnNumber(null, 'N/A')
    formatVnCurrency(null, 'N/A')
    formatVnPercent(null, 'N/A')
  })
})

describe('real-world scenarios', () => {
  bench('e-commerce product display (price + quantity)', () => {
    const price = 199000
    const quantity = 5
    const total = price * quantity

    formatVnCurrency(price)
    formatVnNumber(quantity)
    formatVnCurrency(total)
  })

  bench('financial dashboard (100 records)', () => {
    for (let i = 0; i < 100; i++) {
      const revenue = Math.floor(Math.random() * 100000000)
      const growth = Math.random() * 2 - 0.5 // -50% to +150%
      const orders = Math.floor(Math.random() * 10000)

      formatVnCurrency(revenue)
      formatVnPercent(growth)
      formatVnNumber(orders)
    }
  })

  bench('data table rendering (50 rows × 4 columns)', () => {
    for (let i = 0; i < 50; i++) {
      formatVnNumber(Math.floor(Math.random() * 1000))
      formatVnCurrency(Math.floor(Math.random() * 10000000))
      formatVnPercent(Math.random())
      formatVnNumber(Math.floor(Math.random() * 100000))
    }
  })

  bench('form validation and display', () => {
    // Simulate user input validation and formatting
    const inputs = ['19990000', 'invalid', null, '12345.67', undefined, '0.99']

    inputs.forEach((input) => {
      formatVnNumber(input, 'Invalid')
      formatVnCurrency(input, 'Invalid')
    })
  })
})
