import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();

  const totalRevenue = inMemoryStore.orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 24850);
  const totalOrders = inMemoryStore.orders.length + 42;
  const pendingOrders = inMemoryStore.orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length + 3;
  const totalCustomers = inMemoryStore.users.length + 320;
  const lowStockProducts = inMemoryStore.products.filter((p) => p.stock < 50);

  return NextResponse.json({
    success: true,
    metrics: {
      totalRevenue,
      todayRevenue: 3490,
      totalOrders,
      pendingOrders,
      totalCustomers,
      conversionRate: "4.8%",
      visitorsToday: 1240,
    },
    lowStockAlerts: lowStockProducts,
    recentOrders: inMemoryStore.orders.slice(0, 5),
    salesGraph: [
      { month: "Jan", sales: 18500 },
      { month: "Feb", sales: 22400 },
      { month: "Mar", sales: 28900 },
      { month: "Apr", sales: 31200 },
      { month: "May", sales: 36800 },
      { month: "Jun", sales: 42100 },
      { month: "Jul", sales: 49500 },
      { month: "Aug", sales: 54200 },
    ],
  });
}
