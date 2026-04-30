import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("ref");
  
  if (!reference) {
    return NextResponse.json({ error: "Reference required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: { include: { product: true } } }
  });
  
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}