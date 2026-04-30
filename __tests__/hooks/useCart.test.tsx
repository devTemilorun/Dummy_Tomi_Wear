import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/hooks/useCart'
import { ReactNode } from 'react'

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { items: [], total: 0 } })),
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  put: jest.fn(() => Promise.resolve({ data: { success: true } })),
  delete: jest.fn(() => Promise.resolve({ data: { success: true } })),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
  })

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.clearCart()
    })
    
    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
  })
})