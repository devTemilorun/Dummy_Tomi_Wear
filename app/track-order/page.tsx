'use client'
import { useState } from 'react'
import axios from 'axios'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const trackOrder = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/orders/track?ref=${orderNumber}`)
      setOrder(res.data)
    } catch (error) {
      alert('Order not found')
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
      
      {!order ? (
        <div className="flex gap-4">
          <Input 
            placeholder="Enter order number (e.g., TXN-12345)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1"
          />
          <Button onClick={trackOrder} disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Order #{order.reference}</h2>
          
          {/* Status Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Ordered</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ 
                  width: order.status === 'pending' ? '25%' :
                         order.status === 'processing' ? '50%' :
                         order.status === 'shipped' ? '75%' :
                         order.status === 'delivered' ? '100%' : '0%'
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </p>
            <p><strong>Total:</strong> ₦{order.total.toFixed(2)}</p>
            <p><strong>Shipping to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
          </div>
          
          <Button onClick={() => setOrder(null)} className="mt-4 w-full">
            Track Another Order
          </Button>
        </div>
      )}
    </div>
  )
}