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
  
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponPercentage, setCouponPercentage] = useState(0);
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const [finalTotal, setFinalTotal] = useState(total);
  
  // Address state
  const [address, setAddress] = useState<Address>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Load Paystack  and check cart
  useEffect(() => {
    loadPaystackScript();
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Update total when total or discount changes
  useEffect(() => {
    setFinalTotal(total - couponDiscount);
  }, [total, couponDiscount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Apply coupon function
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (appliedCouponId) {
      toast.error("Coupon already applied");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/coupons/validate", {
        code: couponCode,
        total: total,
      });

      if (res.data.valid) {
        setCouponDiscount(res.data.discountAmount);
        setCouponPercentage(res.data.discount);
        setAppliedCouponId(res.data.couponId);
        setFinalTotal(res.data.newTotal);
        toast.success(`${res.data.discount}% discount applied! You saved ₦${res.data.discountAmount.toFixed(2)}`);
        setCouponCode(""); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid or expired coupon");
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async () => {
    setCouponDiscount(0);
    setCouponPercentage(0);
    setAppliedCouponId(null);
    setFinalTotal(total);
    toast.success("Coupon removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.fullName || !address.address || !address.city || !address.state || !address.zipCode || !address.phone) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (!session) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    setLoading(true);
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    try {
      const initRes = await axios.post("/api/paystack/initialize", {
        email: session.user.email,
        amount: finalTotal,
        reference,
      });

      if (initRes.data.status) {
        const orderData: any = {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          total: finalTotal,
          originalTotal: total,
          shippingAddress: address,
          reference,
        };
        
        if (appliedCouponId) {
          orderData.couponId = appliedCouponId;
          orderData.discountAmount = couponDiscount;
          orderData.discountPercentage = couponPercentage;
        }
        
        await axios.post("/api/orders", orderData);

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

  // Calculate summary values
  const shippingCost = 0; 
  const tax = 0; 
  const subtotal = total;
  const discountAmount = couponDiscount;
  const orderTotal = finalTotal + shippingCost + tax;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Checkout
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Address Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <Input
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                value={address.fullName}
                onChange={handleChange}
                required
              />
              <Input
                label="Street Address"
                name="address"
                placeholder="123 Main Street"
                value={address.address}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  placeholder="Lagos"
                  value={address.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  placeholder="Lagos"
                  value={address.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  placeholder="100001"
                  value={address.zipCode}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={address.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items Preview */}
            <div className="max-h-64 overflow-y-auto mb-4 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b dark:border-gray-700">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Coupon Section */}
            <div className="border-t dark:border-gray-700 pt-4 mt-4">
              {!appliedCouponId ? (
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={applyCoupon}
                    disabled={loading || !couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4 flex justify-between items-center">
                  <div>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {couponPercentage}% OFF applied!
                    </span>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      You saved ₦{couponDiscount.toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={removeCoupon}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
              
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponPercentage}%):</span>
                  <span>-₦{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                <span>₦{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₦{orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Pay Now Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || items.length === 0}
              className="w-full mt-6"
              size="lg"
            >
              {loading ? "Processing..." : `Pay ₦${orderTotal.toFixed(2)} with Paystack`}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment powered by Paystack. Your payment information is encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}