import { GET, PUT, DELETE } from '@/app/api/admin/users/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

function createPutRequest(body: any, url = 'http://localhost:3000/api/admin/users') {
  return new NextRequest(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function createDeleteRequest(url: string) {
  return new NextRequest(url, { method: 'DELETE' })
}

describe('Admin Users API', () => {
  const adminSession = { user: { id: 'admin1', role: 'admin' } }
  const userSession = { user: { id: 'user1', role: 'user' } }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 if not admin', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(userSession)
      const req = createGetRequest('http://localhost:3000/api/admin/users')
      const response = await GET(req)
      expect(response.status).toBe(401)
    })

    it('returns all users for admin', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(adminSession)
      const mockUsers = [{ id: '1', name: 'User1' }, { id: '2', name: 'Admin' }]
      ;(prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers)
      const req = createGetRequest('http://localhost:3000/api/admin/users')
      const response = await GET(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
    })
  })

  describe('PUT', () => {
    it('updates user role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(adminSession)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: 'user1', role: 'admin' })
      const req = createPutRequest({ userId: 'user1', role: 'admin' })
      const response = await PUT(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.role).toBe('admin')
    })
  })

  describe('DELETE', () => {
    it('deletes user', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(adminSession)
      ;(prisma.user.delete as jest.Mock).mockResolvedValue({})
      const req = createDeleteRequest('http://localhost:3000/api/admin/users?userId=user1')
      const response = await DELETE(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})