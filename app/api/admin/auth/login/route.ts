import { NextResponse } from 'next/server';
import { query } from '@/lib/db/mysql';
import { verifyPassword } from '@/lib/auth/password';
import { signSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth/session';
import { AdminRow } from '@/types/database';

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

    // Query admin user
    const admins = await query<AdminRow[]>(
      'SELECT * FROM admins WHERE email = ? AND is_active = 1 LIMIT 1',
      [normalizedEmail]
    );

    if (!admins || admins.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    const admin = admins[0];

    // Verify password hash
    const isPasswordValid = await verifyPassword(password, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    // Sign admin session JWT (1-day duration)
    const token = await signSessionToken(
      {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
        departmentId: admin.department_id,
      },
      '1d'
    );

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      data: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
        departmentId: admin.department_id,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Admin login error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          'Admin authentication failed. Please verify database connection.',
      },
      { status: 500 }
    );
  }
}
