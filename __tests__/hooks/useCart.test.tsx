import { renderHook, act, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '@/hooks/useCart'
import { ReactNode } from 'react'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

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

  it('adds item to guest cart', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { id: '1', name: 'Test Product', price: 10, images: ['/img.jpg'] }
    })
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result.current.addItem('1', 1)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(10)
  })

  it('updates item quantity', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { id: '1', name: 'Test Product', price: 10, images: ['/img.jpg'] }
    })
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result.current.addItem('1', 1)
    })
    
    await act(async () => {
      await result.current.updateQuantity(result.current.items[0].id, 3)
    })
    
    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.total).toBe(30)
  })

  it('removes item from cart', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { id: '1', name: 'Test Product', price: 10, images: ['/img.jpg'] }
    })
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result.current.addItem('1', 1)
    })
    
    await act(async () => {
      await result.current.removeItem(result.current.items[0].id)
    })
    
    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  it('clears cart', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { id: '1', name: 'Test Product', price: 10, images: ['/img.jpg'] }
    })
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result.current.addItem('1', 1)
    })
    
    await act(async () => {
      result.current.clearCart()
    })
    
    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })
})