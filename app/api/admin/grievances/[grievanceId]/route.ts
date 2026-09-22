import { NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";

type RouteContext = {
  params: Promise<{
    grievanceId: string;
  }>;
};

export async function PATCH(
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

    const body = await request.json();

    const {
      status,
      priority,
      assignedOfficer,
      remark,
    } = body;

    const grievances = await query<any[]>(
      `
      SELECT *
      FROM grievances
      WHERE grievance_id = ?
      LIMIT 1
      `,
      [grievanceId]
    );

    if (!grievances.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Grievance not found.",
        },
        { status: 404 }
      );
    }

    const grievance = grievances[0];

    await query(
      `
      UPDATE grievances
      SET
        status = ?,
        priority = ?,
        assigned_officer = ?,
        updated_at = NOW(),
        resolved_at = CASE
          WHEN ? = 'RESOLVED' THEN NOW()
          ELSE resolved_at
        END
      WHERE grievance_id = ?
      `,
      [
        status || grievance.status,
        priority || grievance.priority,
        assignedOfficer || null,
        status || grievance.status,
        grievanceId,
      ]
    );

    if (
      status &&
      status !== grievance.status
    ) {
      await query(
        `
        INSERT INTO grievance_history
        (
          grievance_id,
          previous_status,
          new_status,
          remark,
          changed_by,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, NOW())
        `,
        [
          grievance.id,
          grievance.status,
          status,
          remark || null,
          "Admin",
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Grievance updated successfully.",
    });
  } catch (error) {
    console.error("Admin grievance update error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update grievance.",
      },
      { status: 500 }
    );
  }
}