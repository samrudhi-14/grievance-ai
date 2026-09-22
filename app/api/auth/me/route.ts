import { NextResponse } from 'next/server';
import { getSessionUser, getAdminSession } from '@/lib/auth/session';

export async function GET() {
  // Check citizen session first
  const citizen = await getSessionUser();
  if (citizen) {
    return NextResponse.json({
      success: true,
      data: citizen,
    });
  }

  // Check admin session
  const admin = await getAdminSession();
  if (admin) {
    return NextResponse.json({
      success: true,
      data: admin,
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Unauthenticated',
    },
    { status: 401 }
  );
}
