import { bench, describe } from 'vitest'
import { readVnNumber } from './index.ts'

describe('readVnNumber - typical usage scenarios', () => {
  bench('product quantity (5 items)', () => {
    readVnNumber(5)
  })

  bench('typical product price (199,000 VND)', () => {
    readVnNumber(199000)
  })

  bench('invoice total (5,450,000 VND)', () => {
    readVnNumber(5450000)
  })

  bench('transaction amount (19,990,000 VND)', () => {
    readVnNumber(19990000)
  })

  bench('annual revenue (2,500,000,000 VND)', () => {
    readVnNumber(2500000000)
  })

  bench('large contract value (15,000,000,000 VND)', () => {
    readVnNumber(15000000000)
  })
})

describe('readVnNumber - realistic batch operations', () => {
  bench(
    'read 50 product quantities (1-100)',
    () => {
      const quantity = Math.floor(Math.random() * 100) + 1
      readVnNumber(quantity)
    },
    { iterations: 50 },
  )

  bench(
    'read 50 e-commerce prices (10k-50M VND)',
    () => {
      const price = Math.floor(Math.random() * 49990000) + 10000
      readVnNumber(price)
    },
    { iterations: 50 },
  )

  bench(
    'read 50 invoice totals (100k-100M VND)',
    () => {
      const total = Math.floor(Math.random() * 99900000) + 100000
      readVnNumber(total)
    },
    { iterations: 50 },
  )

  bench(
    'read 50 financial amounts (1M-10B VND)',
    () => {
      const amount = Math.floor(Math.random() * 9999000000) + 1000000
      readVnNumber(amount)
    },
    { iterations: 50 },
  )
})

describe('readVnNumber - real-world application scenarios', () => {
  bench('display shopping cart (5 items with quantities)', () => {
    const cart = [
      { quantity: 2, price: 199000 },
      { quantity: 1, price: 450000 },
      { quantity: 5, price: 89000 },
      { quantity: 3, price: 250000 },
      { quantity: 1, price: 1200000 },
    ]

    cart.forEach((item) => {
      readVnNumber(item.quantity)
      readVnNumber(item.price)
      readVnNumber(item.quantity * item.price)
    })
  })

  bench(
    'display invoice line items (10 items)',
    () => {
      const quantity = Math.floor(Math.random() * 20) + 1
      const unitPrice = Math.floor(Math.random() * 5000000) + 50000
      const lineTotal = quantity * unitPrice

      readVnNumber(quantity)
      readVnNumber(unitPrice)
      readVnNumber(lineTotal)
    },
    { iterations: 10 },
  )

  bench('display financial dashboard (20 metrics)', () => {
    const metrics = {
      dailyRevenue: Array.from(
        { length: 7 },
        () => Math.floor(Math.random() * 50000000) + 1000000,
      ),
      orderCounts: Array.from(
        { length: 7 },
        () => Math.floor(Math.random() * 500) + 10,
      ),
      avgOrderValue: Array.from(
        { length: 7 },
        () => Math.floor(Math.random() * 2000000) + 100000,
      ),
    }

    metrics.dailyRevenue.forEach((revenue) => {
      readVnNumber(revenue)
    })
    metrics.orderCounts.forEach((count) => {
      readVnNumber(count)
    })
    metrics.avgOrderValue.forEach((avg) => {
      readVnNumber(avg)
    })
  })

  bench(
    'display product catalog (20 products)',
    () => {
      const price = Math.floor(Math.random() * 10000000) + 10000
      const stock = Math.floor(Math.random() * 1000) + 1
      const sold = Math.floor(Math.random() * 5000)

      readVnNumber(price)
      readVnNumber(stock)
      readVnNumber(sold)
    },
    { iterations: 20 },
  )

  bench('display payment receipt (typical transaction)', () => {
    const subtotal = 5450000
    const shippingFee = 30000
    const discount = 500000
    const total = subtotal + shippingFee - discount

    readVnNumber(subtotal)
    readVnNumber(shippingFee)
    readVnNumber(discount)
    readVnNumber(total)
  })
})

describe('readVnNumber - input type variations', () => {
  const typicalPrice = 19990000

  bench('number input (typical price)', () => {
    readVnNumber(typicalPrice)
  })

  bench('string input (from API/form)', () => {
    readVnNumber(String(typicalPrice))
  })

  bench('bigint input (large transaction)', () => {
    readVnNumber(BigInt(typicalPrice))
  })

  bench('mixed input types in data processing (30 values)', () => {
    for (let i = 0; i < 30; i++) {
      const value = Math.floor(Math.random() * 100000000)
      const inputType = i % 3

      if (inputType === 0) readVnNumber(value)
      else if (inputType === 1) readVnNumber(String(value))
      else readVnNumber(BigInt(value))
    }
  })
})
