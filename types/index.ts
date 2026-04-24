import { User as PrismaUser } from "@prisma/client";

// User type without sensitive data
export type SafeUser = Omit<PrismaUser, "hashedPassword">;

// Cart item structure
export interface CartItem {
  id: string;        
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Cart state
export interface CartState {
  items: CartItem[];
  total: number;
}

// Shipping address
export interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}