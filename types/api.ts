import { GrievancePriority, GrievanceStatus, UserRole, AdminRole } from './database';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthSessionUser {
  id: number;
  fullName: string;
  email: string;
  mobile?: string;
  role: UserRole | AdminRole;
  departmentId?: number | null;
}

export interface RegisterRequestBody {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface SubmitGrievanceRequestBody {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  priority: GrievancePriority;
  attachmentPath?: string | null;
  aiCategory?: string | null;
  aiPriority?: string | null;
  aiDepartment?: string | null;
  aiSummary?: string | null;
}

export interface UpdateGrievanceRequestBody {
  status?: GrievanceStatus;
  departmentId?: number | null;
  assignedOfficer?: string | null;
  remark?: string;
}

export interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}
