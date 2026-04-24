"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = session.user.role === "admin";

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">{session.user.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {isAdmin ? (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition"
              >
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition"
              >
                <Package size={18} /> Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition"
              >
                <ShoppingBag size={18} /> Orders
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition"
              >
                <Users size={18} /> Users
              </Link>
            </>
          ) : (
            <Link
              href="/user"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition"
            >
              <LayoutDashboard size={18} /> My Orders
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}