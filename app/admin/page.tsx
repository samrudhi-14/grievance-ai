"use client"; 

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Grievance = {
  id: number;
  grievance_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status:
    | "SUBMITTED"
    | "ASSIGNED"
    | "UNDER_INVESTIGATION"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED";
  department_id: number | null;
  assigned_officer: string | null;
  created_at: string;
  updated_at: string;
  citizen_name?: string;
  citizen_email?: string;
  department_name?: string;
};

type Department = {
  id: number;
  name: string;
};

type AdminData = {
  admin: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    departmentId: number | null;
  };
  grievances: Grievance[];
  departments: Department[];
};

const statusLabels: Record<string, string> = {
  SUBMITTED: "Submitted",
  ASSIGNED: "Assigned",
  UNDER_INVESTIGATION: "Under Investigation",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const statusClasses: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
  UNDER_INVESTIGATION: "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-orange-50 text-orange-700 border-orange-200",
  RESOLVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const priorityClasses: Record<string, string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load admin dashboard.");
        }

        setData(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const grievances = data?.grievances || [];

    return {
      total: grievances.length,
      submitted: grievances.filter((g) => g.status === "SUBMITTED").length,
      active: grievances.filter(
        (g) =>
          g.status === "ASSIGNED" ||
          g.status === "UNDER_INVESTIGATION" ||
          g.status === "IN_PROGRESS"
      ).length,
      resolved: grievances.filter((g) => g.status === "RESOLVED").length,
      critical: grievances.filter((g) => g.priority === "Critical").length,
    };
  }, [data]);

  const filteredGrievances = useMemo(() => {
    const grievances = data?.grievances || [];
    const query = search.toLowerCase().trim();

    return grievances.filter((grievance) => {
      const matchesSearch =
        !query ||
        grievance.grievance_id.toLowerCase().includes(query) ||
        grievance.title.toLowerCase().includes(query) ||
        grievance.category.toLowerCase().includes(query) ||
        grievance.location.toLowerCase().includes(query) ||
        grievance.citizen_name?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || grievance.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || grievance.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data, search, statusFilter, priorityFilter]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">
            Loading Admin Dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            ⚠️
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Admin Dashboard Unavailable
          </h1>

          <p className="mt-3 text-sm text-slate-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg text-white">
                🛡️
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  GrievanceAI
                </h1>
                <p className="text-xs text-slate-500">
                  Administration Portal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {data.admin.fullName}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {data.admin.role}
              </p>
            </div>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", {
                  method: "POST",
                });

                window.location.href = "/login";
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">
                ADMIN CONTROL CENTER
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Welcome back, {data.admin.fullName.split(" ")[0]} 👋
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Monitor citizen grievances, manage assignments, track
                resolution progress, and keep the civic response system moving.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-slate-300">
                Role
              </p>
              <p className="mt-1 font-semibold capitalize">
                {data.admin.role}
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon="📋"
            label="Total"
            value={stats.total}
            description="All grievances"
          />

          <StatCard
            icon="📥"
            label="New"
            value={stats.submitted}
            description="Awaiting action"
          />

          <StatCard
            icon="⚙️"
            label="Active"
            value={stats.active}
            description="Being processed"
          />

          <StatCard
            icon="✅"
            label="Resolved"
            value={stats.resolved}
            description="Successfully closed"
          />

          <StatCard
            icon="🚨"
            label="Critical"
            value={stats.critical}
            description="Needs attention"
          />
        </section>

        {/* Management */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Grievance Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, filter and manage citizen complaints.
            </p>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search grievance, citizen, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white md:col-span-2"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNDER_INVESTIGATION">
                  Under Investigation
                </option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Grievances */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {filteredGrievances.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl">🔎</div>
                <h3 className="mt-3 font-semibold text-slate-900">
                  No grievances found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredGrievances.map((grievance) => (
                  <div
                    key={grievance.id}
                    className="p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">
                            {grievance.grievance_id}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                              statusClasses[grievance.status]
                            }`}
                          >
                            {statusLabels[grievance.status]}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              priorityClasses[grievance.priority]
                            }`}
                          >
                            {grievance.priority}
                          </span>
                        </div>

                        <h3 className="mt-3 truncate text-base font-bold text-slate-900">
                          {grievance.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {grievance.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                          <span>📍 {grievance.location}</span>
                          <span>🏷️ {grievance.category}</span>

                          {grievance.citizen_name && (
                            <span>👤 {grievance.citizen_name}</span>
                          )}

                          <span>🕒 {formatDate(grievance.created_at)}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {grievance.department_name && (
                            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                              🏢 {grievance.department_name}
                            </span>
                          )}

                          {grievance.assigned_officer && (
                            <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                              👮 {grievance.assigned_officer}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/track?id=${encodeURIComponent(
                            grievance.grievance_id
                          )}`}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/grievances/${encodeURIComponent(
                            grievance.grievance_id
                          )}`}
                          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <AdminAction
            icon="📊"
            title="Complaint Analytics"
            description="Monitor grievance trends and resolution performance."
          />

          <AdminAction
            icon="🏢"
            title="Department Management"
            description="Review departments and their assigned complaints."
          />

          <AdminAction
            icon="🧠"
            title="AI Intelligence"
            description="Use AI classification to prioritize civic issues."
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function AdminAction({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}