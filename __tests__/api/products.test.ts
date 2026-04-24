import { GET, POST } from '@/app/api/products/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Helper to create NextRequest for GET
function createGetRequest(url: string) {
  return new NextRequest(url)
}

// Helper to create NextRequest for POST
function createPostRequest(body: any, url = 'http://localhost:3000/api/products') {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns paginated products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }]
      ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)
      ;(prisma.product.count as jest.Mock).mockResolvedValue(1)

      const req = createGetRequest('http://localhost:3000/api/products?page=1&limit=10')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toEqual(mockProducts)
      expect(data.total).toBe(1)
    })

    it('filters products by category', async () => {
      const mockProducts = [{ id: '1', name: 'Electronics Product', category: 'electronics' }]
      ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)
      ;(prisma.product.count as jest.Mock).mockResolvedValue(1)

      const req = createGetRequest('http://localhost:3000/api/products?category=electronics')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products[0].category).toBe('electronics')
    })

    it('searches products by name', async () => {
      const mockProducts = [{ id: '1', name: 'iPhone 15' }]
      ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)
      ;(prisma.product.count as jest.Mock).mockResolvedValue(1)

      const req = createGetRequest('http://localhost:3000/api/products?search=iphone')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products[0].name).toBe('iPhone 15')
    })
  })

  describe('POST', () => {
    it('returns 401 if not admin', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      const req = createPostRequest({ name: 'New Product' })
      const response = await POST(req)
      expect(response.status).toBe(401)
    })

    it('creates product when admin', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'admin' }
      })
      const mockProduct = { id: '2', name: 'New Product', slug: 'new-product-123' }
      ;(prisma.product.create as jest.Mock).mockResolvedValue(mockProduct)

      const req = createPostRequest({
        name: 'New Product',
        description: 'Description',
        price: 20,
        images: ['http://img.com'],
        category: 'Test',
        stock: 10,
      })
      const response = await POST(req)
      const data = await response.json()
      expect(response.status).toBe(201)
      expect(data.name).toBe('New Product')
    })
  })
})