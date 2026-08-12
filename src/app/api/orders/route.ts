import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { inMemoryStore, connectToDatabase } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { Order } from '@/lib/types';
import { verifyAdminToken } from '@/lib/auth';
import { getOrderItemImage } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'pbh_super_secret_jwt_key_2026_primebrew';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    // 1. Order Tracking by Order Number (Public / Track Order)
    if (orderNumber) {
      let order: any = null;
      try {
        order = await OrderModel.findOne({ orderNumber: new RegExp(`^${orderNumber.trim()}$`, 'i') }).lean();
      } catch (err) {}
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

    // 2. Customer Order History by Email (Protected with Customer Cross-Account Isolation)
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // Verify token if present to prevent cross-customer order viewing
      let token = request.headers.get('cookie')
        ?.split(';')
        .find((c) => c.trim().startsWith('pbh_token='))
        ?.split('=')[1];

      if (!token) {
        token = request.headers.get('cookie')
          ?.split(';')
          .find((c) => c.trim().startsWith('pbh_admin_token='))
          ?.split('=')[1];
      }

      if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          if (decoded && decoded.email) {
            const tokenEmail = decoded.email.toLowerCase();
            const isAdmin = decoded.role === 'admin';
            if (tokenEmail !== cleanEmail && !isAdmin) {
              return NextResponse.json(
                { success: false, message: 'Access Denied: You are not authorized to view orders for another account.' },
                { status: 403 }
              );
            }
          }
        } catch (err) {
          // Token invalid or expired
        }
      }

      let filteredOrders: any[] = [];
      try {
        filteredOrders = await OrderModel.find({ 'shippingAddress.email': new RegExp(`^${cleanEmail}$`, 'i') }).sort({ createdAt: -1 }).lean();
      } catch (err) {}

      if (filteredOrders.length === 0) {
        filteredOrders = inMemoryStore.orders.filter(
          (o) => o.shippingAddress?.email?.toLowerCase() === cleanEmail
        );
      }
      return NextResponse.json({ success: true, orders: filteredOrders });
    }

    // 3. Storewide Orders Listing (Requires Admin Authorization)
    const auth = verifyAdminToken(request);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    let allOrders: any[] = [];
    try {
      allOrders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
    } catch (err) {}

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

    if (body.paymentMethod && body.paymentMethod !== 'Cash on Delivery') {
      return NextResponse.json(
        { success: false, message: 'PrimeBrew Herbis accepts Cash on Delivery (COD) only. Online payment options are disabled.' },
        { status: 400 }
      );
    }

    const formattedItems = body.items.map((item: any) => {
      const itemImg = getOrderItemImage(item);
      return {
        productId: String(item.productId || item._id || 'prod-unknown'),
        productName: String(item.productName || item.name || 'Herbal Tea'),
        productImage: itemImg,
        image: itemImg,
        price: Number(item.price || item.unitPrice) || 0,
        weight: String(item.weight || item.selectedWeight || '30 Tea Bags'),
        quantity: Number(item.quantity) || 1,
      };
    });

    const uniqueId = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PBH-2026-${randomSuffix}`;
    const trackingNumber = `SR-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const orderDocData = {
      orderNumber,
      createdAt: new Date().toISOString(),
      items: formattedItems,
      shippingAddress: {
        fullName: String(body.shippingAddress.fullName || '').trim(),
        phone: String(body.shippingAddress.phone || '').trim(),
        email: String(body.shippingAddress.email || '').trim().toLowerCase(),
        street: String(body.shippingAddress.street || '').trim(),
        city: String(body.shippingAddress.city || '').trim(),
        state: String(body.shippingAddress.state || '').trim(),
        pincode: String(body.shippingAddress.pincode || '').trim(),
        isDefault: Boolean(body.shippingAddress.isDefault),
      },
      gstInvoice: body.gstInvoice ? {
        gstin: String(body.gstInvoice.gstin || ''),
        companyName: String(body.gstInvoice.companyName || ''),
      } : undefined,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
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

    console.log('Order creation request received at /api/orders', {
      itemCount: formattedItems.length,
      hasShippingAddress: Boolean(body.shippingAddress),
      hasEmail: Boolean(body.shippingAddress?.email),
      paymentMethod: 'Cash on Delivery',
    });

    let createdOrder: any = null;
    try {
      console.log('Attempting OrderModel.create() in MongoDB Atlas...');
      const doc = await OrderModel.create(orderDocData);
      if (doc) {
        createdOrder = doc.toObject ? doc.toObject() : doc;
        createdOrder._id = doc._id.toString();
        console.log('✅ Order created successfully in MongoDB Atlas primebrew.orders', {
          orderId: createdOrder._id,
          orderNumber: createdOrder.orderNumber,
        });
      }
    } catch (dbErr: any) {
      console.error('❌ OrderModel.create() failed in MongoDB Atlas:', {
        name: dbErr?.name,
        message: dbErr?.message ? String(dbErr.message).replace(/\/\/[^:]+:[^@]+@/g, '//***:***@') : '',
        code: dbErr?.code || null,
        codeName: dbErr?.codeName || null,
        errors: dbErr?.errors ? Object.keys(dbErr.errors) : [],
      });
    }

    if (!createdOrder) {
      createdOrder = { _id: `ord-${uniqueId}`, ...orderDocData };
      inMemoryStore.orders.unshift(createdOrder);
    } else {
      inMemoryStore.orders.unshift(createdOrder);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
