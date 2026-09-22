import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2/promise';
import { query } from '@/lib/db/mysql';
import { getSessionUser, getAdminSession } from '@/lib/auth/session';
import { generateGrievanceId } from '@/lib/utils/id-generator';
import {
  DepartmentRow,
  GrievanceRow,
  GrievancePriority,
} from '@/types/database';

const VALID_PRIORITIES = new Set<GrievancePriority>([
  'Low',
  'Medium',
  'High',
  'Critical',
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      priority,
      attachmentPath,
      aiCategory,
      aiPriority,
      aiDepartment,
      aiSummary,
    } = body;

    // 1. Validation
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    if (
      !description ||
      typeof description !== 'string' ||
      description.trim().length < 20
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Description must be at least 20 characters long.',
        },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { success: false, error: 'Grievance category is required.' },
        { status: 400 }
      );
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      return NextResponse.json(
        { success: false, error: 'Location details are required.' },
        { status: 400 }
      );
    }

    const selectedPriority: GrievancePriority = VALID_PRIORITIES.has(priority)
      ? priority
      : 'Medium';

    // 2. Identify Submitting User
    const citizen = await getSessionUser();
    let userId = citizen?.id;
    let userName = citizen?.fullName || 'Citizen';

    if (!userId) {
      // Fallback to first available citizen from database for testing / guest submission
      const demoUsers = await query<any[]>(
        'SELECT id, full_name FROM users ORDER BY id ASC LIMIT 1'
      );
      if (demoUsers && demoUsers.length > 0) {
        userId = demoUsers[0].id;
        userName = demoUsers[0].full_name;
      } else {
        return NextResponse.json(
          {
            success: false,
            error:
              'Please register or log in before submitting a grievance.',
          },
          { status: 401 }
        );
      }
    }

    // 3. Resolve Department ID by Category name
    const deptRows = await query<DepartmentRow[]>(
      'SELECT id FROM departments WHERE name = ? LIMIT 1',
      [category.trim()]
    );
    const departmentId = deptRows.length > 0 ? deptRows[0].id : null;

    // 4. Generate unique Grievance ID
    const grievanceId = generateGrievanceId();

    // 5. Insert Grievance Record
    const insertResult = await query<ResultSetHeader>(
      `INSERT INTO grievances (
        grievance_id, user_id, title, description, category, location,
        latitude, longitude, priority, status, department_id,
        ai_category, ai_priority, ai_department, ai_summary, attachment_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?, ?, ?, ?, ?, ?)`,
      [
        grievanceId,
        userId,
        title.trim(),
        description.trim(),
        category.trim(),
        location.trim(),
        latitude ? Number(latitude) : null,
        longitude ? Number(longitude) : null,
        selectedPriority,
        departmentId,
        aiCategory || null,
        aiPriority || null,
        aiDepartment || null,
        aiSummary || null,
        attachmentPath || null,
      ]
    );

    const primaryId = insertResult.insertId;

    // 6. Insert Initial Audit History
    await query(
      `INSERT INTO grievance_history (
        grievance_id, previous_status, new_status, remark, changed_by
      ) VALUES (?, NULL, 'SUBMITTED', ?, ?)`,
      [primaryId, 'Grievance registered in GrievanceAI portal.', userName]
    );

    // 7. Insert Notification for Citizen
    await query(
      `INSERT INTO notifications (
        user_id, grievance_id, title, message
      ) VALUES (?, ?, ?, ?)`,
      [
        userId,
        primaryId,
        'Grievance Registered',
        `Your grievance ${grievanceId} (${title.slice(0, 40)}) has been successfully logged.`,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Grievance submitted successfully.',
        data: {
          id: primaryId,
          grievanceId,
          title: title.trim(),
          category: category.trim(),
          priority: selectedPriority,
          status: 'SUBMITTED',
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Submit grievance error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          'Failed to record grievance. Please verify database connection.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (admin) {
      // Admin sees all grievances
      const allGrievances = await query<GrievanceRow[]>(
        `SELECT g.*, u.full_name as citizen_name, u.email as citizen_email, u.mobile as citizen_mobile
         FROM grievances g
         LEFT JOIN users u ON g.user_id = u.id
         ORDER BY g.created_at DESC`
      );
      return NextResponse.json({ success: true, data: allGrievances });
    }

    const citizen = await getSessionUser();
    if (citizen) {
      // Citizen sees only their own grievances
      const citizenGrievances = await query<GrievanceRow[]>(
        'SELECT * FROM grievances WHERE user_id = ? ORDER BY created_at DESC',
        [citizen.id]
      );
      return NextResponse.json({ success: true, data: citizenGrievances });
    }

    return NextResponse.json(
      { success: false, error: 'Unauthorized.' },
      { status: 401 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, error: err?.message || 'Database query error.' },
      { status: 500 }
    );
  }
}
