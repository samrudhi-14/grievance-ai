import { NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";

type RouteContext = {
  params: Promise<{
    grievanceId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { grievanceId } = await context.params;

    if (!grievanceId) {
      return NextResponse.json(
        {
          success: false,
          error: "Grievance ID is required.",
        },
        { status: 400 }
      );
    }

    const rows = await query<any[]>(
      `
      SELECT
        g.*,
        d.name AS department_name
      FROM grievances g
      LEFT JOIN departments d
        ON g.department_id = d.id
      WHERE g.grievance_id = ?
      LIMIT 1
      `,
      [grievanceId]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Grievance not found.",
        },
        { status: 404 }
      );
    }

    const grievance = rows[0];

    const history = await query<any[]>(
      `
      SELECT
        id,
        previous_status,
        new_status,
        remark,
        changed_by,
        created_at
      FROM grievance_history
      WHERE grievance_id = ?
      ORDER BY created_at ASC
      `,
      [grievance.id]
    );

    return NextResponse.json({
      success: true,

      grievance: {
        grievanceId: grievance.grievance_id,
        title: grievance.title,
        description: grievance.description,
        category: grievance.category,
        location: grievance.location,
        priority: grievance.priority,
        status: grievance.status,
        assignedOfficer: grievance.assigned_officer,
        department: grievance.department_name || "Not Assigned",
        createdAt: grievance.created_at,
        updatedAt: grievance.updated_at,
        resolvedAt: grievance.resolved_at,
      },

      history: history.map((item) => ({
        id: item.id,
        previousStatus: item.previous_status,
        newStatus: item.new_status,
        remark: item.remark || "",
        changedBy: item.changed_by,
        createdAt: item.created_at,
      })),
    });
  } catch (error) {
    console.error("Track grievance error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to track grievance.",
      },
      { status: 500 }
    );
  }
}