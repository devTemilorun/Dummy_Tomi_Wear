"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Button from "../ui/Button";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    await addItem(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("❤️ Like feature coming soon!", { icon: "🔥" });
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Like Button Overlay */}
          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition"
          >
            <Heart size={18} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
          
          <Button
            onClick={handleAddToCart}
            className="w-full mt-3 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} /> Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}