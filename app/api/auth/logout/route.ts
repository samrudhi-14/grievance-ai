import { NextResponse } from 'next/server';
import { CITIZEN_COOKIE_NAME, ADMIN_COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  // Clear both citizen and admin cookies
  response.cookies.set({
    name: CITIZEN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}
