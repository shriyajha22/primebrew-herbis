import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
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

    const targetEmail = ADMIN_EMAIL || 'Contact.primebrew@gmail.com';

    // Verify email match
    if (email.trim().toLowerCase() !== targetEmail.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin email or password' },
        { status: 401 }
      );
    }

    let isPasswordValid = false;

    // 1. Verify bcrypt hash if configured
    if (ADMIN_PASSWORD_HASH) {
      isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    }
    // 2. Verify env password if configured
    else if (ADMIN_PASSWORD) {
      isPasswordValid = password === ADMIN_PASSWORD;
    }
    // 3. Reject authentication if admin password env variable is not configured
    else {
      return NextResponse.json(
        { success: false, message: 'Server configuration error: ADMIN_PASSWORD environment variable is not configured on server.' },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin email or password' },
        { status: 401 }
      );
    }

    const adminUser = {
      _id: 'usr-admin',
      name: 'PrimeBrew Admin',
      email: targetEmail,
      role: 'admin',
      addresses: [],
      wishlist: [],
      walletBalance: 1000,
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
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication server error' },
      { status: 500 }
    );
  }
}
