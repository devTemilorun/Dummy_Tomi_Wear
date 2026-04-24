"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    axios
      .get(`/api/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      await addItem(product.id, 1);
    }
    toast.success(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/4 mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <p className="mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 mb-4 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImage] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 border-2 rounded overflow-hidden shrink-0 ${
                  selectedImage === idx
                    ? "border-blue-500"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-2xl text-blue-600 font-bold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {product.description}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Stock Status:</span>{" "}
            <span
              className={
                product.stock > 0 ? "text-green-600" : "text-red-600 font-semibold"
              }
            >
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                disabled={product.stock === 0}
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                disabled={quantity >= product.stock || product.stock === 0}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full md:w-auto flex items-center justify-center gap-2"
            size="lg"
          >
            <ShoppingCart size={18} /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}