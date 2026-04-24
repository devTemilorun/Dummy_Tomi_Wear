import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}))

// Helper to create NextRequest
function createNextRequest(body: any, url = 'http://localhost:3000/api/auth/register') {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

describe('Register API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 400 for invalid email', async () => {
    const req = createNextRequest({ name: 'Test', email: 'invalid', password: '123456' })
    const response = await POST(req)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('returns 400 for short password', async () => {
    const req = createNextRequest({ name: 'Test', email: 'test@test.com', password: '123' })
    const response = await POST(req)
    expect(response.status).toBe(400)
  })

  it('returns 400 if email already exists', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' })
    const req = createNextRequest({ name: 'Test', email: 'test@test.com', password: '123456' })
    const response = await POST(req)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Email already in use')
  })

  it('creates user successfully', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue({ 
      id: '2', 
      email: 'new@test.com', 
      name: 'New User' 
    })
    const req = createNextRequest({ name: 'New User', email: 'new@test.com', password: '123456' })
    const response = await POST(req)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.email).toBe('new@test.com')
  })
})