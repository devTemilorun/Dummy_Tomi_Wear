"use client";

import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Shopping Cart
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Order Summary
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total:</span>
              <span className="text-xl text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}