import { NextResponse } from 'next/server';
import { inMemoryStore, connectToDatabase } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify user exists in database
    const userExists = inMemoryStore.users.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found with this email address. Please check your email or register a new account.',
        },
        { status: 404 }
      );
    }

    // Generate secure 1-hour token
    const token = inMemoryStore.createPasswordResetToken(cleanEmail);

    // Send reset email via mailer service
    const mailResult = await sendPasswordResetEmail(cleanEmail, token);

    if (!mailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Unable to dispatch reset email. ${mailResult.message}`,
          devNotice: mailResult.resetUrl ? `Dev URL: ${mailResult.resetUrl}` : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Password reset verification email sent to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (error: any) {
    console.error('Error handling forgot password request:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing password reset request.' },
      { status: 500 }
    );
  }
}
