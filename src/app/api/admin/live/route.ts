import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();

  try {
    const activeSessions = inMemoryStore.getActiveSessions();
    const currentlyOnline = activeSessions.filter((s) => s.isOnline).length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysOrders = inMemoryStore.orders.filter((o) => o.createdAt.startsWith(todayStr)).length;

    const pendingOrders = inMemoryStore.orders.filter((o) => o.orderStatus === 'Pending').length;
    const ordersInDelivery = inMemoryStore.orders.filter((o) =>
      ['Processing', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)
    ).length;
    const completedOrders = inMemoryStore.orders.filter((o) => o.orderStatus === 'Delivered').length;

    const todaysRevenue = inMemoryStore.orders
      .filter((o) => o.createdAt.startsWith(todayStr) && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalRevenue = inMemoryStore.orders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      kpis: {
        currentlyOnline,
        todaysOrders,
        pendingOrders,
        ordersInDelivery,
        completedOrders,
        todaysRevenue,
        totalRevenue,
      },
      activeSessions,
      orders: inMemoryStore.orders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch live admin data' },
      { status: 500 }
    );
  }
}
