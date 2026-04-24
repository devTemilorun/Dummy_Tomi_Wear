"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      axios
        .get("/api/orders")
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        });
    }
  }, [session]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-500" size={18} />;
      case "processing":
        return <Package className="text-blue-500" size={18} />;
      case "delivered":
        return <CheckCircle className="text-green-500" size={18} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        My Orders
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(order.status)}
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Order #{order.id.slice(-8)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span className="capitalize font-medium">{order.status}</span>
                    {" • "}
                    Payment:{" "}
                    <span className="capitalize font-medium">{order.paymentStatus}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ${order.total.toFixed(2)}
                  </p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}