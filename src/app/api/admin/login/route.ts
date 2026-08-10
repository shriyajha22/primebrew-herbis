import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Contact.primebrew@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const JWT_SECRET = process.env.JWT_SECRET || 'pbh_super_secret_jwt_key_2026_primebrew';

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
      const adminUser = {
        _id: 'usr-admin',
        name: 'PrimeBrew Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        addresses: [],
        wishlist: [],
        walletBalance: 500,
      };

      // Sign real signed JWT token for Admin
      const token = jwt.sign(
        { userId: adminUser._id, email: adminUser.email, role: 'admin', name: adminUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: adminUser,
        token,
      });

      // Set HTTP-only admin cookie
      response.cookies.set('pbh_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      response.cookies.set('pbh_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
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
