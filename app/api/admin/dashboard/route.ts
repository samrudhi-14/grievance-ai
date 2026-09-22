import { NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";
import { getAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    // Check admin/officer session
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    // Get dashboard statistics
    const totalResult = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM grievances"
    );

    const submittedResult = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM grievances WHERE status = 'SUBMITTED'"
    );

    const activeResult = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total
       FROM grievances
       WHERE status IN ('ASSIGNED', 'UNDER_INVESTIGATION', 'IN_PROGRESS')`
    );

    const resolvedResult = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM grievances WHERE status = 'RESOLVED'"
    );

    const criticalResult = await query<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM grievances WHERE priority = 'Critical'"
    );

    // Get grievances
    const grievances = await query<
      {
        id: number;
        grievance_id: string;
        title: string;
        description: string;
        category: string;
        location: string;
        priority: string;
        status: string;
        assigned_officer: string | null;
        department_id: number | null;
        department_name: string | null;
        citizen_name: string;
        citizen_email: string;
        created_at: string;
        updated_at: string;
      }[]
    >(
      `SELECT
        g.id,
        g.grievance_id,
        g.title,
        g.description,
        g.category,
        g.location,
        g.priority,
        g.status,
        g.assigned_officer,
        g.department_id,
        d.name AS department_name,
        u.full_name AS citizen_name,
        u.email AS citizen_email,
        g.created_at,
        g.updated_at
      FROM grievances g
      LEFT JOIN departments d
        ON g.department_id = d.id
      INNER JOIN users u
        ON g.user_id = u.id
      ORDER BY
        CASE
          WHEN g.priority = 'Critical' THEN 1
          WHEN g.priority = 'High' THEN 2
          WHEN g.priority = 'Medium' THEN 3
          ELSE 4
        END,
        g.created_at DESC`
    );

    // Get departments
    const departments = await query<
      {
        id: number;
        name: string;
        description: string | null;
        head_officer: string | null;
        contact_email: string | null;
      }[]
    >(
      `SELECT
        id,
        name,
        description,
        head_officer,
        contact_email
      FROM departments
      ORDER BY name ASC`
    );

    return NextResponse.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          departmentId: admin.departmentId,
        },

        stats: {
          total: totalResult[0]?.total || 0,
          submitted: submittedResult[0]?.total || 0,
          active: activeResult[0]?.total || 0,
          resolved: resolvedResult[0]?.total || 0,
          critical: criticalResult[0]?.total || 0,
        },

        grievances,
        departments,
      },
    });
  } catch (error: unknown) {
    console.error("Admin dashboard error:", error);

    const err = error as { message?: string };

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to load admin dashboard.",
      },
      { status: 500 }
    );
  }
}