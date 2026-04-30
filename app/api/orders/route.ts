import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch user's orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(orders);
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST: Create new order after payment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      items, 
      total, 
      originalTotal, 
      shippingAddress, 
      reference, 
      couponId, 
      discountAmount, 
      discountPercentage 
    } = body;

    // Validate required fields
    if (!items || !items.length) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }
    
    if (!total || total <= 0) {
      return NextResponse.json(
        { error: "Invalid order total" },
        { status: 400 }
      );
    }
    
    if (!shippingAddress || !shippingAddress.fullName) {
      return NextResponse.json(
        { error: "Shipping address required" },
        { status: 400 }
      );
    }
    
    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference required" },
        { status: 400 }
      );
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: parseFloat(total),
        originalTotal: originalTotal ? parseFloat(originalTotal) : parseFloat(total),
        shippingAddress: shippingAddress,
        reference: reference,
        couponId: couponId || null,
        discountAmount: discountAmount || 0,
        discountPercentage: discountPercentage || 0,
        status: "pending",
        paymentStatus: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price),
          })),
        },
      },
      include: { items: true },
    });

    //  if coupon was applied
    if (couponId) {
      try {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } }
        });
      } catch (couponError) {
        console.error("Error updating coupon usage:", couponError);
      }
    }

    // Update product stock quantities
    for (const item of items) {
      try {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      } catch (stockError) {
        console.error(`Error updating stock for product ${item.productId}:`, stockError);
      }
    }

    // Clear user's cart after successful order creation
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
      });
      
      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
        await prisma.cart.update({
          where: { id: cart.id },
          data: { total: 0 },
        });
      }
    } catch (cartError) {
      console.error("Error clearing cart:", cartError);
    }

    return NextResponse.json({ 
      success: true, 
      order: order,
      message: "Order created successfully"
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}