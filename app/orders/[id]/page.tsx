"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Package, MapPin, CreditCard, Calendar } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  items: OrderItem[];
}

export default function OrderDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      axios
        .get(`/api/orders/${id}`)
        .then((res) => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          setLoading(false);
        });
    }
  }, [id, session]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/3 mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "processing": return "text-blue-600 bg-blue-100";
      case "shipped": return "text-purple-600 bg-purple-100";
      case "delivered": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Order Details
      </h1>
      <p className="text-gray-500 mb-6">Order #{order.id.slice(-8)}</p>

      {/* Order Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Package size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Order Status</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>
            Payment: {order.paymentStatus}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar size={14} /> {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Shipping Address</h2>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          <p className="font-medium">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Order Items</h2>
        </div>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b dark:border-gray-700 pb-4 last:border-0">
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src={item.product.images[0] || "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-blue-600">${item.price.toFixed(2)} each</p>
                <p className="font-medium mt-1">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t dark:border-gray-700 pt-4 mt-4 text-right">
          <p className="text-lg font-bold">
            Total: <span className="text-blue-600">${order.total.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}