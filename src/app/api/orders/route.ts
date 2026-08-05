import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';
import { Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');

  if (orderNumber) {
    const order = inMemoryStore.orders.find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  }

  return NextResponse.json({
    success: true,
    orders: inMemoryStore.orders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder: Order = {
      _id: `ord-${Date.now()}`,
      orderNumber: `PBH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: body.items || [],
      shippingAddress: body.shippingAddress,
      gstInvoice: body.gstInvoice,
      paymentMethod: body.paymentMethod || 'Razorpay',
      paymentStatus: body.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
      trackingNumber: `SR-${Math.floor(100000000 + Math.random() * 900000000)}`,
      courierName: 'Shiprocket Express',
      subtotal: body.subtotal,
      discount: body.discount || 0,
      shippingFee: body.shippingFee || 0,
      tax: body.tax || 0,
      total: body.total,
      estimatedDelivery: '3-5 Business Days',
    };

    inMemoryStore.orders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
