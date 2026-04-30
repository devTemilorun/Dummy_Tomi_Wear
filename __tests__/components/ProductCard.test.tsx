import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/components/products/ProductCard'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

const mockAddItem = jest.fn()
jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    items: [],
    total: 0,
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
  }),
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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays product information', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('displays product image', () => {
    render(<ProductCard product={mockProduct} />)
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('has link to product detail page', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/test-product')
  })

  it('calls addItem when Add to Cart button is clicked', () => {
    render(<ProductCard product={mockProduct} />)
    const addButton = screen.getByText('Add to Cart')
    fireEvent.click(addButton)
    expect(mockAddItem).toHaveBeenCalledWith('1', 1)
  })
})