import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '@/components/cart/CartItem'
import { CartItem as CartItemType } from '@/types'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props
    return <img {...rest} style={fill ? { width: '100%', height: '100%' } : {}} />
  }
}))

const mockItem: CartItemType = {
  id: 'item1',
  productId: 'prod1',
  name: 'Test Product',
  price: 29.99,
  quantity: 2,
  image: '/test.jpg',
}

describe('CartItem Component', () => {
  const mockUpdateQuantity = jest.fn()
  const mockRemove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays product information', () => {
    render(
      <CartItem 
        item={mockItem} 
        onUpdateQuantity={mockUpdateQuantity} 
        onRemove={mockRemove} 
      />
    )
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('calls updateQuantity with increased quantity when plus button is clicked', () => {
    render(
      <CartItem 
        item={mockItem} 
        onUpdateQuantity={mockUpdateQuantity} 
        onRemove={mockRemove} 
      />
    )
    const buttons = screen.getAllByRole('button')
    const plusButton = buttons[1]
    fireEvent.click(plusButton)
    expect(mockUpdateQuantity).toHaveBeenCalledWith('item1', 3)
  })

  it('calls updateQuantity with decreased quantity when minus button is clicked', () => {
    render(
      <CartItem 
        item={mockItem} 
        onUpdateQuantity={mockUpdateQuantity} 
        onRemove={mockRemove} 
      />
    )
    const buttons = screen.getAllByRole('button')
    const minusButton = buttons[0]
    fireEvent.click(minusButton)
    expect(mockUpdateQuantity).toHaveBeenCalledWith('item1', 1)
  })

  it('disables minus button when quantity is 1', () => {
    const singleItem = { ...mockItem, quantity: 1 }
    render(
      <CartItem 
        item={singleItem} 
        onUpdateQuantity={mockUpdateQuantity} 
        onRemove={mockRemove} 
      />
    )
    const buttons = screen.getAllByRole('button')
    const minusButton = buttons[0]
    expect(minusButton).toBeDisabled()
  })

  it('calls remove when delete button is clicked', () => {
    render(
      <CartItem 
        item={mockItem} 
        onUpdateQuantity={mockUpdateQuantity} 
        onRemove={mockRemove} 
      />
    )
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[2]
    fireEvent.click(deleteButton)
    expect(mockRemove).toHaveBeenCalledWith('item1')
  })
})