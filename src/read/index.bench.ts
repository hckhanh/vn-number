import { bench, describe } from 'vitest'
import { readVnNumber } from './index.ts'

describe('readVnNumber', () => {
  describe('small numbers', () => {
    bench('single digit (5)', () => {
      readVnNumber(5)
    })

    bench('double digit (42)', () => {
      readVnNumber(42)
    })

    bench('three digits (999)', () => {
      readVnNumber(999)
    })
  })

  describe('medium numbers', () => {
    bench('thousands (5,000)', () => {
      readVnNumber(5000)
    })

    bench('ten thousands (50,000)', () => {
      readVnNumber(50000)
    })

    bench('hundreds of thousands (500,000)', () => {
      readVnNumber(500000)
    })
  })

  describe('large numbers', () => {
    bench('millions (1,000,000)', () => {
      readVnNumber(1000000)
    })

    bench('tens of millions (19,990,000)', () => {
      readVnNumber(19990000)
    })

    bench('hundreds of millions (999,999,999)', () => {
      readVnNumber(999999999)
    })
  })

  describe('very large numbers', () => {
    bench('billions (1,000,000,000)', () => {
      readVnNumber(1000000000)
    })

    bench('complex billion (123,456,789,012)', () => {
      readVnNumber(123456789012)
    })

    bench('very large number as string', () => {
      readVnNumber('999999999999999999999999')
    })

    bench('extremely large number string', () => {
      readVnNumber('123456789012345678901234567890')
    })
  })

  describe('input type variations', () => {
    const testNumber = 19990000

    bench('number input (19990000)', () => {
      readVnNumber(testNumber)
    })

    bench('string input ("19990000")', () => {
      readVnNumber(String(testNumber))
    })

    bench('bigint input (19990000n)', () => {
      readVnNumber(BigInt(testNumber))
    })

    bench('all input types for same value', () => {
      readVnNumber(testNumber)
      readVnNumber(String(testNumber))
      readVnNumber(BigInt(testNumber))
    })
  })

  describe('edge cases', () => {
    bench('zero', () => {
      readVnNumber(0)
    })

    bench('single digit string ("1")', () => {
      readVnNumber('1')
    })

    bench('large bigint', () => {
      readVnNumber(999999999999999999n)
    })

    bench('max safe integer', () => {
      readVnNumber(Number.MAX_SAFE_INTEGER)
    })
  })

  describe('performance patterns', () => {
    bench('sequential small numbers (1-10)', () => {
      for (let i = 1; i <= 10; i++) {
        readVnNumber(i)
      }
    })

    bench('sequential hundreds (100, 200, ..., 1000)', () => {
      for (let i = 100; i <= 1000; i += 100) {
        readVnNumber(i)
      }
    })

    bench('powers of 10 (1 to 1,000,000,000)', () => {
      readVnNumber(1)
      readVnNumber(10)
      readVnNumber(100)
      readVnNumber(1000)
      readVnNumber(10000)
      readVnNumber(100000)
      readVnNumber(1000000)
      readVnNumber(10000000)
      readVnNumber(100000000)
      readVnNumber(1000000000)
    })
  })

  describe('stress tests', () => {
    bench('100 random small numbers (0-999)', () => {
      for (let i = 0; i < 100; i++) {
        readVnNumber(Math.floor(Math.random() * 1000))
      }
    })

    bench('100 random medium numbers (1,000-999,999)', () => {
      for (let i = 0; i < 100; i++) {
        readVnNumber(Math.floor(Math.random() * 1000000) + 1000)
      }
    })

    bench('100 random large numbers (1,000,000-999,999,999)', () => {
      for (let i = 0; i < 100; i++) {
        readVnNumber(Math.floor(Math.random() * 1000000000) + 1000000)
      }
    })

    bench('mixed input types (100 iterations)', () => {
      for (let i = 0; i < 100; i++) {
        const num = Math.floor(Math.random() * 1000000)
        const type = i % 3
        if (type === 0) readVnNumber(num)
        else if (type === 1) readVnNumber(String(num))
        else readVnNumber(BigInt(num))
      }
    })
  })
})
