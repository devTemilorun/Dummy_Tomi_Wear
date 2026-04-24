import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProductCard from '@/components/products/ProductCard'
import { CartProvider } from '@/hooks/useCart'
import { SessionProvider } from 'next-auth/react'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  default: jest.fn(),
}))

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 29.99,
  images: ['/test.jpg'],
}

describe('ProductCard', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <SessionProvider session={null}>
        <CartProvider>
          {ui}
        </CartProvider>
      </SessionProvider>
    )
  }

  it('displays product information', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('displays product image', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
  })

  it('has link to product detail page', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/test-product')
  })

  it('calls addItem when Add to Cart button is clicked', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } })
    mockedAxios.get.mockResolvedValue({ data: { items: [], total: 0 } })
    
    renderWithProviders(<ProductCard product={mockProduct} />)
    const addButton = screen.getByText('Add to Cart')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled()
    })
  })
})