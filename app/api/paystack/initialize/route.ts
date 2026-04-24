import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, amount, reference } = await req.json();

    // Call Paystack initialize endpoint
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, 
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?verify=true`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}