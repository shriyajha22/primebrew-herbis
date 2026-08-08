import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  await connectToDatabase();
  try {
    const { orderId } = params;
    const body = await request.json();

    const orderIndex = inMemoryStore.orders.findIndex(
      (o) => o._id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase()
    );

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const currentOrder = inMemoryStore.orders[orderIndex];

    // Update allowed fields
    if (body.orderStatus) {
      currentOrder.orderStatus = body.orderStatus;
    }
    if (body.paymentStatus) {
      currentOrder.paymentStatus = body.paymentStatus;
    }
    if (body.trackingNumber !== undefined) {
      currentOrder.trackingNumber = body.trackingNumber;
    }
    if (body.courierName !== undefined) {
      currentOrder.courierName = body.courierName;
    }

    inMemoryStore.orders[orderIndex] = currentOrder;

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: currentOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
