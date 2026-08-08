import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();

  try {
    const customerMap = new Map<string, any>();

    // Add registered users
    inMemoryStore.users.forEach((user) => {
      if (user.role === 'customer') {
        customerMap.set(user.email.toLowerCase(), {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.addresses?.[0]?.phone || user.phone || 'N/A',
          role: 'customer',
          walletBalance: user.walletBalance || 0,
          createdAt: 'August 1, 2026',
          ordersCount: 0,
          totalSpent: 0,
        });
      }
    });

    // Aggregate orders data for customers
    inMemoryStore.orders.forEach((order) => {
      const emailKey = order.shippingAddress?.email?.toLowerCase() || '';
      if (!emailKey) return;

      let existing = customerMap.get(emailKey);
      if (!existing) {
        existing = {
          _id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: order.shippingAddress?.fullName || 'Guest Customer',
          email: order.shippingAddress?.email || emailKey,
          phone: order.shippingAddress?.phone || 'N/A',
          role: 'customer',
          walletBalance: 0,
          createdAt: new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          ordersCount: 0,
          totalSpent: 0,
        };
        customerMap.set(emailKey, existing);
      }

      existing.ordersCount += 1;
      existing.totalSpent += order.total || 0;
    });

    const customers = Array.from(customerMap.values());

    return NextResponse.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers list' },
      { status: 500 }
    );
  }
}
