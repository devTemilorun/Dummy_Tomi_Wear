"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { data: session } = useSession();
  const { items } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ShopHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-600 transition">
              Products
            </Link>
            {session ? (
              <>
                <Link href="/user" className="hover:text-blue-600 transition">
                  Dashboard
                </Link>
                {session.user.role === "admin" && (
                  <Link href="/admin" className="hover:text-blue-600 transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-blue-600 transition">
                Login
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 p-4 flex flex-col space-y-3 border-t dark:border-gray-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600"
            >
              Products
            </Link>
            {session ? (
              <>
                <Link
                  href="/user"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-600"
                >
                  Dashboard
                </Link>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-600"
                  >
                    Admin
                  </Link>
                )}
                <button onClick={() => signOut()} className="text-left hover:text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}