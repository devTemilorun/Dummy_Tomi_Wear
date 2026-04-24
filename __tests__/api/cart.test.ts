import { GET, POST, PUT, DELETE } from '@/app/api/cart/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    cartItem: {
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Helper functions
function createGetRequest(url: string) {
  return new NextRequest(url)
}

function createPostRequest(body: any, url = 'http://localhost:3000/api/cart') {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function createPutRequest(body: any, url = 'http://localhost:3000/api/cart') {
  return new NextRequest(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function createDeleteRequest(url: string) {
  return new NextRequest(url, { method: 'DELETE' })
}

describe('Cart API', () => {
  const mockSession = { user: { id: 'user123', role: 'user' } }
  const mockCart = {
    id: 'cart1',
    userId: 'user123',
    items: [],
    total: 0,
  }
  const mockProduct = { id: 'prod1', name: 'Test', price: 25, images: ['/img.jpg'] }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      const req = createGetRequest('http://localhost:3000/api/cart')
      const response = await GET(req)
      expect(response.status).toBe(401)
    })

    it('returns user cart', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        ...mockCart,
        items: [{ id: 'item1', productId: 'prod1', quantity: 2, price: 25, product: mockProduct }],
      })
      const req = createGetRequest('http://localhost:3000/api/cart')
      const response = await GET(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.total).toBe(50)
    })
  })

  describe('POST', () => {
    it('adds product to cart', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart)
      ;(prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct)
      ;(prisma.cartItem.create as jest.Mock).mockResolvedValue({ id: 'newItem' })
      ;(prisma.cart.update as jest.Mock).mockResolvedValue({})

      const req = createPostRequest({ productId: 'prod1', quantity: 1 })
      const response = await POST(req)
      expect(response.status).toBe(200)
    })
  })

  describe('PUT', () => {
    it('updates item quantity', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        ...mockCart,
        items: [{ id: 'item1', productId: 'prod1', quantity: 1, price: 25 }],
      })
      ;(prisma.cartItem.update as jest.Mock).mockResolvedValue({})
      ;(prisma.cart.update as jest.Mock).mockResolvedValue({})

      const req = createPutRequest({ itemId: 'item1', quantity: 3 })
      const response = await PUT(req)
      expect(response.status).toBe(200)
    })
  })

  describe('DELETE', () => {
    it('removes item from cart', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        ...mockCart,
        items: [],
      })
      ;(prisma.cartItem.delete as jest.Mock).mockResolvedValue({})

      const req = createDeleteRequest('http://localhost:3000/api/cart?itemId=item1')
      const response = await DELETE(req)
      expect(response.status).toBe(200)
    })
  })
})