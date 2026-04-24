"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "@/types";
import { useSession } from "next-auth/react";
import axios from "axios";

interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Load guest cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("guestCart");
    if (stored) {
      try {
        const guestCart = JSON.parse(stored);
        setItems(guestCart.items || []);
        setTotal(guestCart.total || 0);
      } catch (error) {
        console.error("Error parsing guest cart:", error);
        localStorage.removeItem("guestCart");
      }
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      const syncCart = async () => {
        try {
          // Get server cart
          const res = await axios.get("/api/cart");
          const serverCart = res.data;
          
          // Merge guest cart if exists
          const guest = localStorage.getItem("guestCart");
          if (guest && items.length > 0) {
            for (const item of items) {
              await axios.post("/api/cart", {
                productId: item.productId,
                quantity: item.quantity,
              });
            }
            localStorage.removeItem("guestCart");
          }
          
          setItems(serverCart.items || []);
          setTotal(serverCart.total || 0);
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      };
      syncCart();
    }
  }, [session, items.length]);

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!session?.user?.id) {
      localStorage.setItem("guestCart", JSON.stringify({ items, total }));
    }
  }, [items, total, session]);

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      if (session?.user?.id) {
        // Logged in: use backend API
        await axios.post("/api/cart", { productId, quantity });
        const res = await axios.get("/api/cart");
        setItems(res.data.items);
        setTotal(res.data.total);
      } else {
        // Guest: store locally
        const productRes = await axios.get(`/api/products/${productId}`);
        const product = productRes.data;
        
        const existingIndex = items.findIndex((i) => i.productId === productId);
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          setItems(newItems);
          setTotal((prev) => prev + product.price * quantity);
        } else {
          const newItem: CartItem = {
            id: Date.now().toString(),
            productId,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0] || "/placeholder.png",
          };
          setItems([...items, newItem]);
          setTotal((prev) => prev + product.price * quantity);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      if (session?.user?.id) {
        await axios.delete(`/api/cart?itemId=${itemId}`);
        const res = await axios.get("/api/cart");
        setItems(res.data.items);
        setTotal(res.data.total);
      } else {
        const newItems = items.filter((i) => i.id !== itemId);
        setItems(newItems);
        setTotal(newItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
      }
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      if (session?.user?.id) {
        await axios.put("/api/cart", { itemId, quantity });
        const res = await axios.get("/api/cart");
        setItems(res.data.items);
        setTotal(res.data.total);
      } else {
        const newItems = items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        setItems(newItems);
        setTotal(newItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const clearCart = () => {
    setItems([]);
    setTotal(0);
    if (!session?.user?.id) {
      localStorage.removeItem("guestCart");
    }
  };

  const contextValue: CartContextType = {
    items,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return React.createElement(CartContext.Provider, { value: contextValue }, children);
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}