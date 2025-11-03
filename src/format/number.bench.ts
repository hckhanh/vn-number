import { bench, describe } from 'vitest'
import { formatVnCurrency, formatVnNumber, formatVnPercent } from './number.ts'

describe('formatVnNumber - typical usage scenarios', () => {
  bench('format product quantity (15)', () => {
    formatVnNumber(15)
  })

  bench('format order count (1,234)', () => {
    formatVnNumber(1234)
  })

  bench('format total sales (125,678)', () => {
    formatVnNumber(125678)
  })

  bench('format user count (5,432,100)', () => {
    formatVnNumber(5432100)
  })

  bench('format decimal value (12,345.67)', () => {
    formatVnNumber(12345.67)
  })

  bench('format negative value (-5,432)', () => {
    formatVnNumber(-5432)
  })
})

describe('formatVnCurrency - typical usage scenarios', () => {
  bench('format small price (15,000 VND)', () => {
    formatVnCurrency(15000)
  })

  bench('format typical product price (199,000 VND)', () => {
    formatVnCurrency(199000)
  })

  bench('format invoice total (5,450,000 VND)', () => {
    formatVnCurrency(5450000)
  })

  bench('format transaction amount (19,990,000 VND)', () => {
    formatVnCurrency(19990000)
  })

  bench('format monthly revenue (125,000,000 VND)', () => {
    formatVnCurrency(125000000)
  })

  bench('format annual budget (2,500,000,000 VND)', () => {
    formatVnCurrency(2500000000)
  })

  bench('format large contract (15,000,000,000 VND)', () => {
    formatVnCurrency(15000000000)
  })

  bench('format decimal amount (199,000.50 VND)', () => {
    formatVnCurrency(199000.5)
  })
})

describe('formatVnPercent - typical usage scenarios', () => {
  bench('format discount rate (15%)', () => {
    formatVnPercent(0.15)
  })

  bench('format interest rate (5.5%)', () => {
    formatVnPercent(0.055)
  })

  bench('format completion rate (75%)', () => {
    formatVnPercent(0.75)
  })

  bench('format growth rate (25%)', () => {
    formatVnPercent(0.25)
  })

  bench('format conversion rate (2.5%)', () => {
    formatVnPercent(0.025)
  })

  bench('format full completion (100%)', () => {
    formatVnPercent(1)
  })

  bench('format over target (125%)', () => {
    formatVnPercent(1.25)
  })

  bench('format small percentage (0.5%)', () => {
    formatVnPercent(0.005)
  })

  bench('format negative change (-10%)', () => {
    formatVnPercent(-0.1)
  })
})

describe('formatVnNumber - realistic batch operations', () => {
  bench('format 50 order counts', () => {
    for (let i = 0; i < 50; i++) {
      const count = Math.floor(Math.random() * 10000)
      formatVnNumber(count)
    }
  })

  bench('format 50 product quantities', () => {
    for (let i = 0; i < 50; i++) {
      const quantity = Math.floor(Math.random() * 1000)
      formatVnNumber(quantity)
    }
  })
})

describe('formatVnCurrency - realistic batch operations', () => {
  bench('format 50 e-commerce prices (10k-50M VND)', () => {
    for (let i = 0; i < 50; i++) {
      const price = Math.floor(Math.random() * 49990000) + 10000
      formatVnCurrency(price)
    }
  })

  bench('format 50 invoice totals (100k-100M VND)', () => {
    for (let i = 0; i < 50; i++) {
      const total = Math.floor(Math.random() * 99900000) + 100000
      formatVnCurrency(total)
    }
  })

  bench('format 50 financial amounts (1M-10B VND)', () => {
    for (let i = 0; i < 50; i++) {
      const amount = Math.floor(Math.random() * 9999000000) + 1000000
      formatVnCurrency(amount)
    }
  })
})

describe('formatVnPercent - realistic batch operations', () => {
  bench('format 50 growth rates (-50% to +150%)', () => {
    for (let i = 0; i < 50; i++) {
      const growth = Math.random() * 2 - 0.5
      formatVnPercent(growth)
    }
  })

  bench('format 50 conversion rates (0-10%)', () => {
    for (let i = 0; i < 50; i++) {
      const rate = Math.random() * 0.1
      formatVnPercent(rate)
    }
  })

  bench('format 50 completion rates (0-100%)', () => {
    for (let i = 0; i < 50; i++) {
      const completion = Math.random()
      formatVnPercent(completion)
    }
  })
})

describe('real-world application scenarios', () => {
  bench('display e-commerce product card', () => {
    const price = 199000
    const discount = 0.15
    const finalPrice = price * (1 - discount)
    const stock = 45
    const sold = 1234

    formatVnCurrency(price)
    formatVnPercent(discount)
    formatVnCurrency(finalPrice)
    formatVnNumber(stock)
    formatVnNumber(sold)
  })

  bench('display shopping cart (5 items)', () => {
    const cart = [
      { quantity: 2, price: 199000 },
      { quantity: 1, price: 450000 },
      { quantity: 5, price: 89000 },
      { quantity: 3, price: 250000 },
      { quantity: 1, price: 1200000 },
    ]

    let subtotal = 0
    cart.forEach((item) => {
      const lineTotal = item.quantity * item.price
      subtotal += lineTotal

      formatVnNumber(item.quantity)
      formatVnCurrency(item.price)
      formatVnCurrency(lineTotal)
    })

    const shippingFee = 30000
    const discount = 0.1
    const discountAmount = subtotal * discount
    const total = subtotal + shippingFee - discountAmount

    formatVnCurrency(subtotal)
    formatVnCurrency(shippingFee)
    formatVnPercent(discount)
    formatVnCurrency(discountAmount)
    formatVnCurrency(total)
  })

  bench('display invoice (10 line items)', () => {
    let subtotal = 0

    for (let i = 0; i < 10; i++) {
      const quantity = Math.floor(Math.random() * 20) + 1
      const unitPrice = Math.floor(Math.random() * 5000000) + 50000
      const lineTotal = quantity * unitPrice
      subtotal += lineTotal

      formatVnNumber(quantity)
      formatVnCurrency(unitPrice)
      formatVnCurrency(lineTotal)
    }

    const taxRate = 0.1
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    formatVnCurrency(subtotal)
    formatVnPercent(taxRate)
    formatVnCurrency(taxAmount)
    formatVnCurrency(total)
  })

  bench('display financial dashboard (weekly metrics)', () => {
    const weeklyData = Array.from({ length: 7 }, () => ({
      revenue: Math.floor(Math.random() * 50000000) + 1000000,
      orders: Math.floor(Math.random() * 500) + 10,
      avgOrderValue: Math.floor(Math.random() * 2000000) + 100000,
      conversionRate: Math.random() * 0.1,
    }))

    weeklyData.forEach((day) => {
      formatVnCurrency(day.revenue)
      formatVnNumber(day.orders)
      formatVnCurrency(day.avgOrderValue)
      formatVnPercent(day.conversionRate)
    })

    const totalRevenue = weeklyData.reduce((sum, day) => sum + day.revenue, 0)
    const totalOrders = weeklyData.reduce((sum, day) => sum + day.orders, 0)
    const avgRevenue = totalRevenue / 7
    const avgOrders = totalOrders / 7

    formatVnCurrency(totalRevenue)
    formatVnNumber(totalOrders)
    formatVnCurrency(avgRevenue)
    formatVnNumber(avgOrders)
  })

  bench('display product catalog (20 products)', () => {
    for (let i = 0; i < 20; i++) {
      const price = Math.floor(Math.random() * 10000000) + 10000
      const discount = Math.random() * 0.5
      const finalPrice = price * (1 - discount)
      const stock = Math.floor(Math.random() * 1000) + 1
      const sold = Math.floor(Math.random() * 5000)
      const rating = 3 + Math.random() * 2

      formatVnCurrency(price)
      formatVnPercent(discount)
      formatVnCurrency(finalPrice)
      formatVnNumber(stock)
      formatVnNumber(sold)
      formatVnNumber(rating)
    }
  })

  bench('display sales report (monthly performance)', () => {
    const monthlyData = Array.from({ length: 12 }, () => ({
      revenue: Math.floor(Math.random() * 500000000) + 10000000,
      orders: Math.floor(Math.random() * 5000) + 100,
      newCustomers: Math.floor(Math.random() * 500) + 10,
      returningRate: Math.random() * 0.5 + 0.3,
      growthRate: Math.random() * 0.4 - 0.1,
    }))

    monthlyData.forEach((month) => {
      formatVnCurrency(month.revenue)
      formatVnNumber(month.orders)
      formatVnNumber(month.newCustomers)
      formatVnPercent(month.returningRate)
      formatVnPercent(month.growthRate)
    })
  })

  bench('display payment summary', () => {
    const subtotal = 5450000
    const shippingFee = 30000
    const discount = 0.15
    const discountAmount = subtotal * discount
    const taxRate = 0.1
    const taxableAmount = subtotal - discountAmount
    const taxAmount = taxableAmount * taxRate
    const total = taxableAmount + taxAmount + shippingFee

    formatVnCurrency(subtotal)
    formatVnCurrency(shippingFee)
    formatVnPercent(discount)
    formatVnCurrency(discountAmount)
    formatVnPercent(taxRate)
    formatVnCurrency(taxAmount)
    formatVnCurrency(total)
  })

  bench('display data table (50 rows × 6 columns)', () => {
    for (let i = 0; i < 50; i++) {
      const orderId = Math.floor(Math.random() * 100000)
      const quantity = Math.floor(Math.random() * 100) + 1
      const unitPrice = Math.floor(Math.random() * 5000000) + 10000
      const total = quantity * unitPrice
      const discount = Math.random() * 0.3
      const status = Math.random()

      formatVnNumber(orderId)
      formatVnNumber(quantity)
      formatVnCurrency(unitPrice)
      formatVnCurrency(total)
      formatVnPercent(discount)
      formatVnPercent(status)
    }
  })
})

describe('input type variations - real-world scenarios', () => {
  const typicalPrice = 19990000

  bench('formatVnCurrency with different input types', () => {
    formatVnCurrency(typicalPrice)
    formatVnCurrency(String(typicalPrice))
    formatVnCurrency(BigInt(typicalPrice))
  })

  bench('formatVnNumber with different input types', () => {
    const count = 1234
    formatVnNumber(count)
    formatVnNumber(String(count))
    formatVnNumber(BigInt(count))
  })

  bench('formatVnPercent with different input types', () => {
    const rate = 0.15
    formatVnPercent(rate)
    formatVnPercent(String(rate))
  })

  bench('mixed input types in data processing (30 values)', () => {
    for (let i = 0; i < 30; i++) {
      const value = Math.floor(Math.random() * 100000000)
      const inputType = i % 3

      if (inputType === 0) {
        formatVnCurrency(value)
      } else if (inputType === 1) {
        formatVnCurrency(String(value))
      } else {
        formatVnCurrency(BigInt(value))
      }
    }
  })
})

describe('combined operations - real-world scenarios', () => {
  bench('format all three types together (typical dashboard row)', () => {
    const revenue = 19990000
    const growth = 0.25
    const orders = 1234

    formatVnCurrency(revenue)
    formatVnPercent(growth)
    formatVnNumber(orders)
  })

  bench('format complete product listing (30 products)', () => {
    for (let i = 0; i < 30; i++) {
      const price = Math.floor(Math.random() * 10000000) + 10000
      const discount = Math.random() * 0.5
      const stock = Math.floor(Math.random() * 1000) + 1

      formatVnCurrency(price)
      formatVnPercent(discount)
      formatVnNumber(stock)
    }
  })
})
