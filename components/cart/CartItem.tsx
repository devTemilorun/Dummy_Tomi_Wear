"use client";

import Image from "next/image";
import Button from "../ui/Button";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 border-b dark:border-gray-700 pb-4">
      {/* Product Image */}
      <div className="relative w-20 h-20 shrink-0">
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {item.name}
        </h3>
        <p className="text-blue-600 font-medium mt-1">
          ${item.price.toFixed(2)}
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </Button>
          <span className="w-8 text-center text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}