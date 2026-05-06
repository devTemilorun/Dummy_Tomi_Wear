"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import Button from "../ui/Button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export default function AddToCartButton({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addItem(productId, 1);
    }
    toast.success(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="font-semibold">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            disabled={stock === 0}
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            disabled={quantity >= stock || stock === 0}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={stock === 0}
        className="w-full md:w-auto flex items-center justify-center gap-2"
        size="lg"
      >
        <ShoppingCart size={18} /> Add to Cart
      </Button>
    </div>
  );
}