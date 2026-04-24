import { GET, POST } from '@/app/api/orders/route'
import { PUT } from '@/app/api/orders/[id]/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    cart: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
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

function createPostRequest(body: any, url = 'http://localhost:3000/api/orders') {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function createPutRequest(body: any, url: string) {
  return new NextRequest(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('Orders API', () => {
  const mockSession = { user: { id: 'user123', role: 'user' } }
  const mockOrder = {
    id: 'order1',
    userId: 'user123',
    total: 100,
    items: [{ productId: 'prod1', quantity: 2, price: 50 }],
    shippingAddress: { city: 'NYC' },
    reference: 'REF123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      const req = createGetRequest('http://localhost:3000/api/orders')
      const response = await GET(req)
      expect(response.status).toBe(401)
    })

    it('returns user orders', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue([mockOrder])
      const req = createGetRequest('http://localhost:3000/api/orders')
      const response = await GET(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
    })
  })

  describe('POST', () => {
    it('creates order and clears cart', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.order.create as jest.Mock).mockResolvedValue(mockOrder)
      ;(prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: 'cart1' })
      ;(prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({})
      ;(prisma.cart.update as jest.Mock).mockResolvedValue({})

      const req = createPostRequest({
        items: [{ productId: 'prod1', quantity: 2, price: 50 }],
        total: 100,
        shippingAddress: { city: 'NYC' },
        reference: 'REF123',
      })
      const response = await POST(req)
      const data = await response.json()
      expect(response.status).toBe(201)
      expect(data.id).toBe('order1')
    })
  })

  describe('PUT (update status)', () => {
    it('allows admin to update order status', async () => {
      const adminSession = { user: { id: 'admin1', role: 'admin' } }
      ;(getServerSession as jest.Mock).mockResolvedValue(adminSession)
      ;(prisma.order.update as jest.Mock).mockResolvedValue({ ...mockOrder, status: 'shipped' })
      
      const req = createPutRequest(
        { status: 'shipped' },
        'http://localhost:3000/api/orders/order1'
      )
      const params = { params: { id: 'order1' } }
      const response = await PUT(req, params as any)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.status).toBe('shipped')
    })

    it('returns 401 if not admin', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      const req = createPutRequest(
        { status: 'shipped' },
        'http://localhost:3000/api/orders/order1'
      )
      const params = { params: { id: 'order1' } }
      const response = await PUT(req, params as any)
      expect(response.status).toBe(401)
    })
  })
})