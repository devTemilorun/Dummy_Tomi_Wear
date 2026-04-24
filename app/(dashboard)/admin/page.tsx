"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenue: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/orders"),
      axios.get("/api/products?limit=1"),
      axios.get("/api/admin/users"),
    ])
      .then(([ordersRes, productsRes, usersRes]) => {
        const orders = ordersRes.data;
        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + order.total,
          0
        );
        setStats({
          totalOrders: orders.length,
          totalProducts: productsRes.data.total,
          totalUsers: usersRes.data.length,
          revenue: totalRevenue,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-green-500",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}