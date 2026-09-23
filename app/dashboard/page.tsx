"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Grievance = {
  id: number;
  grievance_id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
};

type DashboardData = {
  success: boolean;
  user?: {
    id: number;
    name?: string;
  };
  stats?: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  grievances?: Grievance[];
  error?: string;
};

const statCards = [
  {
    key: "total",
    label: "Total",
    icon: "📋",
    description: "All complaints",
  },
  {
    key: "pending",
    label: "Pending",
    icon: "⏳",
    description: "Awaiting action",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: "🔄",
    description: "Being handled",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: "✓",
    description: "Successfully resolved",
  },
] as const;

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function getStatusStyle(status: string) {
  const value = status.toUpperCase();

  if (value === "RESOLVED" || value === "CLOSED") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    value === "IN_PROGRESS" ||
    value === "ASSIGNED" ||
    value === "UNDER_INVESTIGATION"
  ) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (value === "REJECTED") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

function getPriorityStyle(priority: string) {
  const value = priority.toUpperCase();

  if (
    value === "HIGH" ||
    value === "URGENT" ||
    value === "CRITICAL"
  ) {
    return "text-red-600";
  }

  if (value === "MEDIUM") {
    return "text-amber-600";
  }

  return "text-emerald-600";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] =
    useState<DashboardData | null>(null);
      async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Unable to load dashboard."
          );
        }

        setData(result);
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setData({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load dashboard.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = data?.stats ?? {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  };

  const grievances = data?.grievances ?? [];

  const userName =
    data?.user?.name || "Citizen";

  const firstName =
    userName.split(" ")[0];

  const initials =
    userName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  const filteredGrievances = useMemo(() => {
    const query = search.trim().toLowerCase();

    return grievances.filter((grievance) => {
      const matchesSearch =
        !query ||
        grievance.title
          .toLowerCase()
          .includes(query) ||
        grievance.grievance_id
          .toLowerCase()
          .includes(query) ||
        grievance.category
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "ALL" ||
        grievance.status.toUpperCase() === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [grievances, search, filter]);

  return (
    <main className="min-h-screen bg-[#f5f7fb] pb-24 text-slate-900 sm:pb-0">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-200">
              G
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                Grievance
                <span className="text-blue-600">
                  AI
                </span>
              </h1>

              <p className="text-[11px] font-medium text-slate-500">
                Citizen Portal
              </p>
            </div>
          </Link>

         <div className="flex items-center gap-3">

  <Link
    href="/notifications"
    aria-label="Notifications"
    className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-lg transition hover:border-blue-200 hover:bg-blue-50"
  >
    🔔
    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
  </Link>

  {data?.success ? (
    <div className="hidden items-center gap-3 sm:flex">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
        {initials}
      </div>

      <div>
        <p className="text-sm font-bold">
          {userName}
        </p>

        <p className="text-xs text-slate-500">
          Citizen Account
        </p>
    
    </div>

    <button
      type="button"
      onClick={handleLogout}
      className="ml-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
    >
      Logout
    </button>

  </div>
) : (
  <div className="flex items-center gap-2">

    <Link
      href="/login"
      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
    >
      Login
    </Link>

    <Link
      href="/register"
      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
    >
      Register
    </Link>

  </div>
)}

            </div>
          </div>

      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-7 text-white shadow-xl shadow-blue-100 sm:p-9">

          <div className="relative z-10 max-w-2xl">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-300" />

              Citizen Services Online

            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Hello, {firstName}! 👋
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Report civic problems, track your complaints,
              and stay connected with the authorities responsible
              for your area.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <Link
                href="/grievance"
className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"              >
                + Report an Issue
              </Link>

              <Link
                href="/track"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Track Grievance →
              </Link>

            </div>

          </div>

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-indigo-400/20" />

        </div>

        {/* LOADING */}

        {loading && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-700">

            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

            Loading your dashboard...

          </div>
        )}

        {/* ERROR */}

       {!loading && !data?.success && (
  <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">

    <h3 className="text-lg font-black text-slate-900">
      Login to access your dashboard
    </h3>

    <p className="mt-2 text-sm text-slate-600">
      Please log in to view your grievances, notifications,
      statistics, and citizen services.
    </p>

    <div className="mt-5 flex justify-center gap-3">

      <Link
        href="/login"
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
      >
        Create Account
      </Link>

    </div>

  </div>
)}

        {/* STATISTICS */}

        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {statCards.map((stat) => (

            <div
              key={stat.key}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {stats[stat.key]}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl transition group-hover:scale-110">
                  {stat.icon}
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.description}
              </p>

            </div>

          ))}

        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-7">

          <div className="mb-4">

            <h3 className="text-lg font-black">
              Quick Actions
            </h3>

            <p className="text-sm text-slate-500">
              Access the most important citizen services.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <Link
              href="/grievance"
              className="group rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                📝
              </div>

              <h3 className="mt-4 font-bold text-blue-900">
                Report an Issue
              </h3>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Submit a new civic grievance to the concerned department.
              </p>

              <span className="mt-3 inline-block text-xs font-bold text-blue-700">
                Start Report →
              </span>

            </Link>

            <Link
              href="/track"
              className="group rounded-2xl border border-indigo-100 bg-indigo-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                📍
              </div>

              <h3 className="mt-4 font-bold text-indigo-900">
                Track Complaint
              </h3>

              <p className="mt-1 text-xs leading-5 text-indigo-700">
                Follow the current status and progress of your grievance.
              </p>

              <span className="mt-3 inline-block text-xs font-bold text-indigo-700">
                Track Now →
              </span>

            </Link>

            <Link
              href="/notifications"
              className="group rounded-2xl border border-amber-100 bg-amber-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                🔔
              </div>

              <h3 className="mt-4 font-bold text-amber-900">
                Notifications
              </h3>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Stay updated when authorities take action.
              </p>

              <span className="mt-3 inline-block text-xs font-bold text-amber-700">
                View Alerts →
              </span>

            </Link>

          </div>

        </div>

        {/* MY GRIEVANCES */}

        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h3 className="text-xl font-black">
                  My Grievances
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View and track your submitted complaints.
                </p>

              </div>

              <Link
                href="/grievance"
                className="w-fit rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                + New Grievance
              </Link>

            </div>

            {/* SEARCH + FILTER */}

            {grievances.length > 0 && (

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔎
                  </span>

                  <input
                    type="search"
                    placeholder="Search by grievance ID, title or category..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="ALL">
                    All Status
                  </option>

                  <option value="SUBMITTED">
                    Submitted
                  </option>

                  <option value="ASSIGNED">
                    Assigned
                  </option>

                  <option value="UNDER_INVESTIGATION">
                    Under Investigation
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="RESOLVED">
                    Resolved
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>

                </select>

              </div>

            )}

          </div>

          {/* EMPTY STATE */}

          {filteredGrievances.length === 0 ? (

            <div className="p-10 text-center sm:p-14">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                📭
              </div>

              <h4 className="mt-4 font-bold">

                {grievances.length === 0
                  ? "No grievances yet"
                  : "No matching grievances"}

              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

                {grievances.length === 0
                  ? "Your submitted complaints will appear here."
                  : "Try changing your search or status filter."}

              </p>

              {grievances.length === 0 && (

                <Link
                  href="/grievance"
                  className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Report Your First Issue
                </Link>

              )}

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {filteredGrievances.map(
                (grievance) => (

                  <div
                    key={grievance.id}
                    className="p-5 transition hover:bg-slate-50 sm:p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {grievance.grievance_id}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                              grievance.status
                            )}`}
                          >
                            {formatStatus(
                              grievance.status
                            )}
                          </span>

                        </div>

                        <h4 className="mt-3 text-base font-bold">
                          {grievance.title}
                        </h4>

                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">

                          <span>
                            {grievance.category}
                          </span>

                          <span>•</span>

                          <span>
                            {formatDate(
                              grievance.created_at
                            )}
                          </span>

                          <span>•</span>

                          <span
                            className={`font-bold ${getPriorityStyle(
                              grievance.priority
                            )}`}
                          >
                            {grievance.priority} Priority
                          </span>

                        </div>

                      </div>

                      <Link
                        href={`/track?grievanceId=${encodeURIComponent(
                          grievance.grievance_id
                        )}`}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-bold transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        View & Track →
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* AI SECTION */}

        <div className="mt-7 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-blue-50 p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                🤖
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h3 className="font-black text-slate-900">
                    GrievanceAI Intelligence
                  </h3>

                  <span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-700">
                    AI POWERED
                  </span>

                </div>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Smart categorization, priority detection and
                  department routing help your complaint reach
                  the right authority faster.
                </p>

              </div>

            </div>

            <Link
              href="/grievance"
              className="whitespace-nowrap rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Use AI →
            </Link>

          </div>

        </div>

        {/* FOOTER */}

        <div className="mt-8 text-center">

          <p className="text-xs text-slate-400">
            GrievanceAI • Digital Citizen Grievance Redressal
          </p>

        </div>

      </section>

      {/* MOBILE NAVIGATION */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur sm:hidden">

        <div className="mx-auto flex max-w-md items-center justify-around">

          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-blue-600"
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-bold">
              Home
            </span>
          </Link>

          <Link
            href="/grievance"
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-slate-500"
          >
            <span className="text-lg">📝</span>
            <span className="text-[10px] font-bold">
              Report
            </span>
          </Link>

          <Link
            href="/track"
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-slate-500"
          >
            <span className="text-lg">📍</span>
            <span className="text-[10px] font-bold">
              Track
            </span>
          </Link>

          <Link
            href="/notifications"
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-slate-500"
          >
            <span className="text-lg">🔔</span>
            <span className="text-[10px] font-bold">
              Alerts
            </span>
          </Link>

        </div>

      </nav>

    </main>
  );
}