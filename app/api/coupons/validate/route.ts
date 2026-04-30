import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, total } = await req.json();
  
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() }
  });
  
  if (!coupon) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
  }
  
  if (coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
  }
  
  if (coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }
  
  const discountAmount = (total * coupon.discount) / 100
  const newTotal = total - discountAmount
  
  return NextResponse.json({
    valid: true,
    discount: coupon.discount,
    discountAmount,
    newTotal,
    couponId: coupon.id
  });
}