import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { inMemoryStore, connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'pbh_super_secret_jwt_key_2026_primebrew';

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existing = inMemoryStore.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please log in.' },
        { status: 400 }
      );
    }

    // Hash password with bcryptjs
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user to database store
    const newDbUser = inMemoryStore.createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'customer',
      walletBalance: 250, // ₹250 instant cashback signup bonus
    });

    // Record session activity
    inMemoryStore.recordUserActivity(newDbUser.name, newDbUser.email, '/register');

    // Sign JWT token
    const token = jwt.sign(
      { userId: newDbUser._id, email: newDbUser.email, role: 'customer', name: newDbUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = inMemoryStore.sanitizeUser(newDbUser);

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: safeUser,
      token,
    });

    // Set HTTP-only, Secure, SameSite session cookie
    response.cookies.set('pbh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error handling customer registration:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing registration' },
      { status: 500 }
    );
  }
}
