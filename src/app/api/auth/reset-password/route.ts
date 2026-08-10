import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing token or email parameter' },
        { status: 400 }
      );
    }

    const validation = inMemoryStore.validatePasswordResetToken(token, email);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.reason || 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid and active',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to validate reset token' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token, email, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const result = inMemoryStore.resetUserPassword(token, email, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error resetting password' },
      { status: 500 }
    );
  }
}
