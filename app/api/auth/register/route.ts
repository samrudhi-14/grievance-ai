import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2/promise';
import { query } from '@/lib/db/mysql';
import { hashPassword } from '@/lib/auth/password';
import { UserRow } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, password } = body;

    // 1. Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name must contain at least 2 characters.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanedMobile = (mobile || '').toString().replace(/\D/g, '');
    if (cleanedMobile.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Mobile number must be exactly 10 digits.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check for existing user
    const existingUsers = await query<UserRow[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists. Please log in.',
        },
        { status: 409 }
      );
    }

    // 3. Hash password securely
    const passwordHash = await hashPassword(password);

    // 4. Insert into database
    const insertResult = await query<ResultSetHeader>(
      'INSERT INTO users (full_name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [fullName.trim(), normalizedEmail, cleanedMobile, passwordHash, 'citizen']
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        data: {
          id: insertResult.insertId,
          fullName: fullName.trim(),
          email: normalizedEmail,
          mobile: cleanedMobile,
          role: 'citizen',
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Registration API error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          'Unable to complete registration. Please ensure database is connected.',
      },
      { status: 500 }
    );
  }
}
