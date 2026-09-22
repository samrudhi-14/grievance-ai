import { NextResponse } from 'next/server';
import { query } from '@/lib/db/mysql';
import { verifyPassword } from '@/lib/auth/password';
import { signSessionToken, CITIZEN_COOKIE_NAME } from '@/lib/auth/session';
import { UserRow } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query citizen user
    const users = await query<UserRow[]>(
      'SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1',
      [normalizedEmail]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password hash
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Sign session JWT
    const token = await signSessionToken({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: 'citizen',
    });

    // Build response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful.',
      data: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: 'citizen',
      },
    });

    response.cookies.set({
      name: CITIZEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          'Authentication failed. Please verify database connection.',
      },
      { status: 500 }
    );
  }
}
