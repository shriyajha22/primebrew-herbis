import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@primebrewherbis.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: {
          _id: 'usr-admin',
          name: 'PrimeBrew Admin',
          email: ADMIN_EMAIL,
          role: 'admin',
          addresses: [],
          wishlist: [],
          walletBalance: 500,
        },
        token: 'pbh_admin_jwt_session_token_2026',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication server error' },
      { status: 500 }
    );
  }
}
