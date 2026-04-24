import { POST as initialize } from '@/app/api/paystack/initialize/route'
import { GET as verify } from '@/app/api/paystack/verify/route'
import { getServerSession } from 'next-auth'
import axios from 'axios'
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Helper functions
function createPostRequest(body: any, url = 'http://localhost:3000/api/paystack/initialize') {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function createGetRequest(url: string) {
  return new NextRequest(url)
}

describe('Paystack API', () => {
  const mockSession = { user: { id: 'user123', email: 'test@example.com' } }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initialize', () => {
    it('returns 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      const req = createPostRequest({ email: 'test@example.com', amount: 100, reference: 'REF' })
      const response = await initialize(req)
      expect(response.status).toBe(401)
    })

    it('initializes payment successfully', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      mockedAxios.post.mockResolvedValue({
        data: { status: true, data: { authorization_url: 'https://paystack.com/pay' } },
      })
      const req = createPostRequest({ email: 'test@example.com', amount: 100, reference: 'REF123' })
      const response = await initialize(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.status).toBe(true)
      expect(data.data.authorization_url).toBeDefined()
    })
  })

  describe('Verify', () => {
    it('verifies payment successfully', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { status: true, data: { status: 'success', reference: 'REF123' } },
      })
      const req = createGetRequest('http://localhost:3000/api/paystack/verify?reference=REF123')
      const response = await verify(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.data.status).toBe('success')
    })

    it('returns 400 if reference missing', async () => {
      const req = createGetRequest('http://localhost:3000/api/paystack/verify')
      const response = await verify(req)
      expect(response.status).toBe(400)
    })
  })
})