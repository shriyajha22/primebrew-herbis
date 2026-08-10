import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { inMemoryStore, connectToDatabase } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { Order } from '@/lib/types';
import { verifyAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    const isDbConnected = mongoose.connection.readyState === 1;

    if (orderNumber) {
      let order: any = null;
      if (isDbConnected) {
        order = await OrderModel.findOne({ orderNumber: new RegExp(`^${orderNumber.trim()}$`, 'i') }).lean();
      }
      if (!order) {
        order = inMemoryStore.orders.find(
          (o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase()
        );
      }

      if (!order) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    if (email) {
      let filteredOrders: any[] = [];
      if (isDbConnected) {
        filteredOrders = await OrderModel.find({ 'shippingAddress.email': new RegExp(`^${email.trim()}$`, 'i') }).sort({ createdAt: -1 }).lean();
      }
      if (filteredOrders.length === 0) {
        filteredOrders = inMemoryStore.orders.filter(
          (o) => o.shippingAddress?.email?.toLowerCase() === email.trim().toLowerCase()
        );
      }
      return NextResponse.json({ success: true, orders: filteredOrders });
    }

    // Require Admin Authorization for storewide order listing
    const auth = verifyAdminToken(request);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    let allOrders: any[] = [];
    if (isDbConnected) {
      allOrders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
    }
    if (allOrders.length === 0) {
      allOrders = inMemoryStore.orders;
    }

    return NextResponse.json({
      success: true,
      orders: allOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Database query error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.items || body.items.length === 0 || !body.shippingAddress) {
      return NextResponse.json(
        { success: false, message: 'Invalid order data. Items and shipping address are required.' },
        { status: 400 }
      );
    }

    const uniqueId = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PBH-2026-${randomSuffix}`;
    const trackingNumber = `SR-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: Order = {
      _id: `ord-${uniqueId}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      items: body.items,
      shippingAddress: body.shippingAddress,
      gstInvoice: body.gstInvoice,
      paymentMethod: body.paymentMethod || 'Razorpay',
      paymentStatus: body.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
      trackingNumber,
      courierName: 'Shiprocket Express',
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      shippingFee: Number(body.shippingFee) || 0,
      tax: Number(body.tax) || 0,
      total: Number(body.total) || 0,
      estimatedDelivery: '3-5 Business Days',
    };

    // Save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      await OrderModel.create(newOrder);
    }

    // Update inMemoryStore as fallback
    inMemoryStore.orders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
