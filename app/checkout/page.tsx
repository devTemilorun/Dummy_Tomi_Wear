"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Address } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { loadPaystackScript } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  useEffect(() => {
    loadPaystackScript();
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    setLoading(true);
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    try {
      // Initialize Paystack payment
      const initRes = await axios.post("/api/paystack/initialize", {
        email: session.user.email,
        amount: total,
        reference,
      });

      if (initRes.data.status) {
        // Create order in pending state
        await axios.post("/api/orders", {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          total,
          shippingAddress: address,
          reference,
        });

        // Redirect to Paystack payment page
        window.location.href = initRes.data.data.authorization_url;
      } else {
        throw new Error("Payment initialization failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  // Verify payment after redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verify = urlParams.get("verify");
    const ref = urlParams.get("reference");
    
    if (verify && ref) {
      axios
        .get(`/api/paystack/verify?reference=${ref}`)
        .then(async (res) => {
          if (res.data.data.status === "success") {
            toast.success("Payment successful! Order confirmed.");
            clearCart();
            router.push("/user");
          } else {
            toast.error("Payment verification failed");
          }
        })
        .catch((error) => {
          console.error("Verification error:", error);
          toast.error("Verification failed");
        });
    }
  }, [clearCart, router]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Checkout
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          value={address.fullName}
          onChange={handleChange}
          required
        />
        <Input
          label="Street Address"
          name="address"
          value={address.address}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
          <Input
            label="State"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ZIP Code"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={address.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? "Processing..." : `Pay $${total.toFixed(2)} with Paystack`}
        </Button>
      </form>
    </div>
  );
}