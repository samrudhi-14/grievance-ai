import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { AuthSessionUser } from '@/types/api';

const DEFAULT_SECRET = 'grievance_ai_super_secret_jwt_key_2026_bsc_it_project_token_32chars!';
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || DEFAULT_SECRET
);

export const CITIZEN_COOKIE_NAME = 'grievance_token';
export const ADMIN_COOKIE_NAME = 'admin_token';

export async function signSessionToken(
  user: AuthSessionUser,
  expiresIn = '7d'
): Promise<string> {
  return new SignJWT({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    departmentId: user.departmentId ?? null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<AuthSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      id: Number(payload.id),
      fullName: String(payload.fullName),
      email: String(payload.email),
      mobile: payload.mobile ? String(payload.mobile) : undefined,
      role: payload.role as AuthSessionUser['role'],
      departmentId:
        payload.departmentId !== undefined &&
        payload.departmentId !== null
          ? Number(payload.departmentId)
          : null,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<AuthSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CITIZEN_COOKIE_NAME)?.value;

  if (!token) return null;

  const user = await verifySessionToken(token);

  if (!user || user.role !== 'citizen') return null;

  return user;
}

export async function getAdminSession(): Promise<AuthSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) return null;

  const admin = await verifySessionToken(token);

if (
  !admin ||
  (
    admin.role !== 'admin' &&
    admin.role !== 'superadmin' &&
    admin.role !== 'officer'
  )
) {
  return null;
}

  return admin;
}