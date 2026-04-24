import { POST as initializePayment } from '@/app/api/paystack/initialize/route'
import { POST as createOrder } from '@/app/api/orders/route'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Helper functions
function createPostRequest(body: any, url: string) {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('Checkout & Payment E2E Flow', () => {
  const mockSession = { user: { id: 'user1', email: 'buyer@test.com', role: 'user' } }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('completes order creation after payment initialization', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    
    // Mock the payment initialization response
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: true, data: { authorization_url: 'https://paystack.com/pay' } }),
      } as Response)
    )
    
    // 1. Initialize payment
    const initReq = createPostRequest(
      { email: 'buyer@test.com', amount: 100, reference: 'REF123' },
      'http://localhost:3000/api/paystack/initialize'
    )
    const initRes = await initializePayment(initReq)
    const initData = await initRes.json()
    expect(initData.status).toBe(true)
    
    // 2. Create order
    const orderReq = createPostRequest(
      {
        items: [{ productId: 'p1', quantity: 2, price: 50 }],
        total: 100,
        shippingAddress: { city: 'Lagos' },
        reference: 'REF123',
      },
      'http://localhost:3000/api/orders'
    )
    const orderRes = await createOrder(orderReq)
    const orderData = await orderRes.json()
    expect(orderRes.status).toBe(201)
    expect(orderData.reference).toBe('REF123')
  })
})