"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Grievance = {
  grievanceId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  assignedOfficer: string | null;
  department: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

type HistoryItem = {
  id: number;
  previousStatus: string | null;
  newStatus: string;
  remark: string;
  changedBy: string | null;
  createdAt: string;
};

type TrackResponse = {
  success: boolean;
  grievance?: Grievance;
  history?: HistoryItem[];
  error?: string;
};

const STATUS_STEPS = [
  "SUBMITTED",
  "ASSIGNED",
  "UNDER_INVESTIGATION",
  "IN_PROGRESS",
  "RESOLVED",
];

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  ASSIGNED: "Assigned",
  UNDER_INVESTIGATION: "Under Investigation",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function formatStatus(status: string) {
  return (
    STATUS_LABELS[status] ||
    status
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ")
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "RESOLVED":
      return "bg-green-100 text-green-700";

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";

    case "ASSIGNED":
    case "UNDER_INVESTIGATION":
      return "bg-amber-100 text-amber-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TrackPage() {
  const [grievanceId, setGrievanceId] = useState("");
  const [grievance, setGrievance] =
    useState<Grievance | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function trackGrievance(id: string) {
    const cleanId = id.trim().toUpperCase();

    if (!cleanId) {
      setError("Please enter a grievance ID.");
      return;
    }

    setLoading(true);
    setError("");
    setGrievance(null);
    setHistory([]);

    try {
      const response = await fetch(
        `/api/track/${encodeURIComponent(cleanId)}`,
        {
          cache: "no-store",
        }
      );

      const result: TrackResponse = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.grievance
      ) {
        throw new Error(
          result.error || "Unable to find grievance."
        );
      }

      setGrievanceId(cleanId);
      setGrievance(result.grievance);
      setHistory(result.history || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to track grievance."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleTrack(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    await trackGrievance(grievanceId);
  }

  /*
   * Automatically track a grievance when opened from Dashboard.
   *
   * We intentionally use window.location.search instead of
   * useSearchParams() so Next.js can build /track successfully.
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const idFromUrl = params.get("grievanceId");

    if (idFromUrl) {
      const cleanId = idFromUrl.trim().toUpperCase();

      setGrievanceId(cleanId);
      void trackGrievance(cleanId);
    }
  }, []);

  const currentStatus = grievance?.status || "SUBMITTED";

  const currentStepIndex =
    STATUS_STEPS.indexOf(currentStatus);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href="/dashboard"
            className="text-xl font-extrabold text-blue-600"
          >
            GrievanceAI
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold tracking-wide text-blue-600">
            GRIEVANCE TRACKING
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Track Your Grievance
          </h1>

          <p className="mt-2 text-slate-600">
            Enter your grievance ID to see the latest status
            and progress of your complaint.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleTrack}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <label
            htmlFor="grievanceId"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Grievance ID
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="grievanceId"
              type="text"
              value={grievanceId}
              onChange={(e) =>
                setGrievanceId(e.target.value)
              }
              placeholder="Example: GRV-2026-81177"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Tracking..."
                : "Track Grievance"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <strong>Unable to track:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-700">
            Fetching the latest grievance information...
          </div>
        )}

        {/* Result */}
        {grievance && !loading && (
          <section className="mt-8">
            {/* Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm text-slate-500">
                    Grievance ID
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold">
                    {grievance.grievanceId}
                  </h2>

                  <h3 className="mt-3 text-lg font-bold">
                    {grievance.title}
                  </h3>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusColor(
                    grievance.status
                  )}`}
                >
                  {formatStatus(grievance.status)}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Category
                  </p>

                  <p className="mt-1 font-semibold">
                    {grievance.category}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Priority
                  </p>

                  <p className="mt-1 font-semibold">
                    {grievance.priority}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Department
                  </p>

                  <p className="mt-1 font-semibold">
                    {grievance.department}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Submitted
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatDate(grievance.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold">
                  {grievance.location}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-slate-500">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {grievance.description}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">
                Grievance Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Follow the progress of your complaint.
              </p>

              <div className="mt-8">
                {STATUS_STEPS.map((step, index) => {
                  const completed =
                    currentStepIndex >= index;

                  const current =
                    currentStepIndex === index;

                  return (
                    <div
                      key={step}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {index !==
                        STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-[15px] top-8 h-full w-0.5 ${
                            currentStepIndex > index
                              ? "bg-blue-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          completed
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-bold ${
                              current
                                ? "text-blue-700"
                                : completed
                                  ? "text-slate-900"
                                  : "text-slate-500"
                            }`}
                          >
                            {formatStatus(step)}
                          </h3>

                          {current && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {step === "SUBMITTED" &&
                            "Your grievance has been successfully submitted."}

                          {step === "ASSIGNED" &&
                            "Your grievance has been assigned to a concerned officer."}

                          {step === "UNDER_INVESTIGATION" &&
                            "The concerned department is investigating your complaint."}

                          {step === "IN_PROGRESS" &&
                            "The department is working on resolving the issue."}

                          {step === "RESOLVED" &&
                            "Your grievance has been successfully resolved."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity */}
            {history.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold">
                  Activity History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Updates recorded for this grievance.
                </p>

                <div className="mt-6 space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold">
                          {formatStatus(item.newStatus)}
                        </p>

                        <p className="text-xs text-slate-500">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>

                      {item.remark && (
                        <p className="mt-2 text-sm text-slate-600">
                          {item.remark}
                        </p>
                      )}

                      {item.changedBy && (
                        <p className="mt-2 text-xs text-slate-400">
                          Updated by: {item.changedBy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help */}
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h3 className="font-bold text-blue-900">
                Need help?
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                If your grievance has not progressed for a
                long time, you can contact the concerned
                department.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}