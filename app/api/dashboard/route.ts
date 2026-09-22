import { NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Please log in to view your dashboard.",
        },
        { status: 401 }
      );
    }

    const grievances = await query<any[]>(
      `
      SELECT
        id,
        grievance_id,
        title,
        category,
        priority,
        status,
        created_at
      FROM grievances
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [user.id]
    );

    const total = grievances.length;

    const pending = grievances.filter(
      (g) => g.status === "SUBMITTED" || g.status === "PENDING"
    ).length;

    const inProgress = grievances.filter(
      (g) =>
        g.status === "IN_PROGRESS" ||
        g.status === "ASSIGNED" ||
        g.status === "UNDER_REVIEW"
    ).length;

    const resolved = grievances.filter(
      (g) => g.status === "RESOLVED" || g.status === "CLOSED"
    ).length;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.fullName ,
      },
      stats: {
        total,
        pending,
        inProgress,
        resolved,
      },
      grievances: grievances.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data.",
      },
      { status: 500 }
    );
  }
}