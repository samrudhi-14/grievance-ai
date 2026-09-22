export type GrievancePriority =
  'Low' | 'Medium' | 'High' | 'Critical';

export type GrievanceStatus =
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'UNDER_INVESTIGATION'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type UserRole = 'citizen';

export type AdminRole = 'admin' | 'superadmin' | 'officer';

export interface UserRow {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminRow {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  department_id: number | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentRow {
  id: number;
  name: string;
  description: string | null;
  head_officer: string | null;
  contact_email: string | null;
  created_at: string;
}

export interface GrievanceRow {
  id: number;
  grievance_id: string;
  user_id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: GrievancePriority;
  status: GrievanceStatus;
  department_id: number | null;
  assigned_officer: string | null;
  ai_category: string | null;
  ai_priority: string | null;
  ai_department: string | null;
  ai_summary: string | null;
  attachment_path: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface GrievanceHistoryRow {
  id: number;
  grievance_id: number;
  previous_status: GrievanceStatus | null;
  new_status: GrievanceStatus;
  remark: string | null;
  changed_by: string;
  created_at: string;
}

export interface NotificationRow {
  id: number;
  user_id: number;
  grievance_id: number | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

export interface AIClassificationResult {
  category: string;
  priority: GrievancePriority;
  department: string;
  short_summary: string;
}