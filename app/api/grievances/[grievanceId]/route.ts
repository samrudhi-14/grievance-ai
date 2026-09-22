import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2/promise";
import { query } from "@/lib/db/mysql";
import { getAdminSession } from "@/lib/auth/session";
import {
  GrievancePriority,
  GrievanceStatus,
} from "@/types/database";

const VALID_STATUSES: GrievanceStatus[] = [
  "SUBMITTED",
  "ASSIGNED",
  "UNDER_INVESTIGATION",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
];

const VALID_PRIORITIES: GrievancePriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

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
        d.name AS department_name,
        u.full_name AS citizen_name,
        u.email AS citizen_email
      FROM grievances g
      LEFT JOIN departments d
        ON g.department_id = d.id
      LEFT JOIN users u
        ON g.user_id = u.id
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
      data: {
        ...grievance,
        history,
      },
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

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Admin access required.",
        },
        { status: 401 }
      );
    }

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

    if (
      status !== undefined &&
      !VALID_STATUSES.includes(status as GrievanceStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid grievance status.",
        },
        { status: 400 }
      );
    }

    if (
      priority !== undefined &&
      !VALID_PRIORITIES.includes(
        priority as GrievancePriority
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid grievance priority.",
        },
        { status: 400 }
      );
    }

    const rows = await query<any[]>(
      `
      SELECT
        id,
        grievance_id,
        user_id,
        status,
        priority,
        department_id,
        assigned_officer
      FROM grievances
      WHERE grievance_id = ?
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

    const oldStatus =
      grievance.status as GrievanceStatus;

    const newStatus =
      (status ?? oldStatus) as GrievanceStatus;

    const newPriority =
      (priority ??
        grievance.priority) as GrievancePriority;

    const newAssignedOfficer =
      assignedOfficer === undefined
        ? grievance.assigned_officer
        : assignedOfficer?.trim() || null;

    await query<ResultSetHeader>(
      `
      UPDATE grievances
      SET
        status = ?,
        priority = ?,
        assigned_officer = ?,
        updated_at = NOW(),
        resolved_at = ?
      WHERE grievance_id = ?
      `,
      [
        newStatus,
        newPriority,
        newAssignedOfficer,
        newStatus === "RESOLVED"
          ? new Date()
          : null,
        grievanceId,
      ]
    );

    // Add history when status changes
    if (oldStatus !== newStatus) {
      const adminName =
        admin.fullName ||
        admin.email ||
        "Administrator";

      await query<ResultSetHeader>(
        `
        INSERT INTO grievance_history (
          grievance_id,
          previous_status,
          new_status,
          remark,
          changed_by
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          grievance.id,
          oldStatus,
          newStatus,
          remark?.trim() ||
            `Status changed from ${oldStatus} to ${newStatus}.`,
          adminName,
        ]
      );

      // Notify citizen
      await query<ResultSetHeader>(
        `
        INSERT INTO notifications (
          user_id,
          grievance_id,
          title,
          message
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          grievance.user_id,
          grievance.id,
          "Grievance Status Updated",
          `Your grievance ${grievanceId} is now ${newStatus.replace(
            /_/g,
            " "
          )}.`,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Grievance updated successfully.",
      data: {
        grievanceId,
        status: newStatus,
        priority: newPriority,
        assignedOfficer: newAssignedOfficer,
      },
    });
  } catch (error) {
    console.error(
      "Admin grievance update error:",
      error
    );

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