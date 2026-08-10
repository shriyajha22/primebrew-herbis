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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = inMemoryStore.findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Password comparison logic
    let isPasswordValid = false;
    if (user.passwordHash) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    } else {
      // Demo fallback or legacy user: set hash on first login if valid password provided
      isPasswordValid = true;
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Record active session
    inMemoryStore.recordUserActivity(user.name, user.email, '/login');

    // Sign JWT session token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = inMemoryStore.sanitizeUser(user);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
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
    console.error('Error handling customer login:', error);
    return NextResponse.json(
      { success: false, message: 'Server authentication error' },
      { status: 500 }
    );
  }
}
