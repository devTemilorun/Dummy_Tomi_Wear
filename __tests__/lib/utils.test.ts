import { formatPrice } from '@/lib/utils'

describe('Utils', () => {
  describe('formatPrice', () => {
    it('formats price as USD currency', () => {
      expect(formatPrice(9.99)).toBe('$9.99')
      expect(formatPrice(10)).toBe('$10.00')
      expect(formatPrice(1000)).toBe('$1,000.00')
    })
  })
})