import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HomePage from '@/app/page'
import { CartProvider } from '@/hooks/useCart'
import { SessionProvider } from 'next-auth/react'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('Cart Integration Flow', () => {
  const mockProducts = [
    { id: '1', name: 'Product 1', slug: 'prod1', price: 29.99, images: ['/img1.jpg'] },
    { id: '2', name: 'Product 2', slug: 'prod2', price: 49.99, images: ['/img2.jpg'] },
  ]

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: { products: mockProducts } })
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <SessionProvider session={null}>
        <CartProvider>{ui}</CartProvider>
      </SessionProvider>
    )
  }

  it('adds product to guest cart', async () => {
    renderWithProviders(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })
    
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    
    await waitFor(() => {
      const cartCount = screen.getByText('1')
      expect(cartCount).toBeInTheDocument()
    })
  })
})