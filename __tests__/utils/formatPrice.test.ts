import { formatPrice } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats integer price correctly', () => {
    expect(formatPrice(10)).toBe('$10.00')
    expect(formatPrice(100)).toBe('$100.00')
    expect(formatPrice(1000)).toBe('$1,000.00')
  })

  it('formats decimal price correctly', () => {
    expect(formatPrice(19.99)).toBe('$19.99')
    expect(formatPrice(0.50)).toBe('$0.50')
    expect(formatPrice(0.01)).toBe('$0.01')
  })

  it('handles negative numbers', () => {
    expect(formatPrice(-5)).toBe('-$5.00')
    expect(formatPrice(-19.99)).toBe('-$19.99')
  })
})