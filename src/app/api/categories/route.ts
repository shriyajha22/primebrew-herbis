import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export async function GET() {
  await connectToDatabase();
  return NextResponse.json({
    success: true,
    categories: inMemoryStore.categories,
  });
}
