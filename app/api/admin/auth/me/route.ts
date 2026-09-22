import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSession,
  verifySessionToken,
} from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          step: "cookie",
          error: "No admin_token cookie found.",
        },
        { status: 401 }
      );
    }

    const verified = await verifySessionToken(token);

    if (!verified) {
      return NextResponse.json(
        {
          success: false,
          step: "jwt",
          error: "admin_token exists, but JWT verification failed.",
        },
        { status: 401 }
      );
    }

    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          step: "role",
          error: "JWT is valid, but admin session was rejected.",
          role: verified.role,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin session is working.",
      data: {
        id: session.id,
        fullName: session.fullName,
        email: session.email,
        role: session.role,
        departmentId: session.departmentId,
      },
    });
  } catch (error) {
    console.error("Admin session test error:", error);

    return NextResponse.json(
      {
        success: false,
        step: "server",
        error: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}