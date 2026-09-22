"use client";

import { FormEvent, useState } from "react";
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
  remark: string | null;
  changedBy: string;
  createdAt: string;
};

type TrackResponse = {
  success: boolean;
  error?: string;
  grievance?: Grievance;
  history?: HistoryItem[];
};

const STATUS_STEPS = [
  "SUBMITTED",
  "ASSIGNED",
  "UNDER_INVESTIGATION",
  "IN_PROGRESS",
  "RESOLVED",
];

const statusLabels: Record<string, string> = {
  SUBMITTED: "Submitted",
  ASSIGNED: "Assigned",
  UNDER_INVESTIGATION: "Under Investigation",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusLabel(status: string) {
  return statusLabels[status] || status.replaceAll("_", " ");
}

export default function TrackPage() {
  const [grievanceId, setGrievanceId] = useState("");
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(event: FormEvent) {
    event.preventDefault();

    const id = grievanceId.trim();

    if (!id) {
      setError("Please enter your grievance ID.");
      return;
    }

    setLoading(true);
    setError("");
    setGrievance(null);
    setHistory([]);

    try {
      const response = await fetch(
        `/api/track/${encodeURIComponent(id)}`
      );

      const data: TrackResponse = await response.json();

      if (!response.ok || !data.success || !data.grievance) {
        setError(data.error || "Unable to find this grievance.");
        return;
      }

      setGrievance(data.grievance);
      setHistory(data.history || []);
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const currentStatus = grievance?.status || "";

  const currentStep = STATUS_STEPS.indexOf(currentStatus);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold text-blue-600"
          >
            GrievanceAI
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Title */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Grievance Tracking
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Track Your Grievance
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Enter your grievance ID to see the latest status,
            department, priority, and complete progress history.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleTrack}
          className="mx-auto mb-8 max-w-2xl rounded-2xl border bg-white p-5 shadow-sm"
        >
          <label
            htmlFor="grievanceId"
            className="mb-2 block text-sm font-semibold"
          >
            Grievance ID
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="grievanceId"
              type="text"
              value={grievanceId}
              onChange={(e) => setGrievanceId(e.target.value)}
              placeholder="Example: GRV-2026-81177"
              className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Tracking..." : "Track Grievance"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </form>

        {/* Results */}
        {grievance && (
          <div className="space-y-6">
            {/* Main information */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-sm text-slate-500">
                    Grievance ID
                  </p>

                  <h2 className="text-xl font-bold text-blue-600">
                    {grievance.grievanceId}
                  </h2>
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {getStatusLabel(grievance.status)}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-bold">
                  {grievance.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {grievance.description}
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                  label="Category"
                  value={grievance.category}
                />

                <InfoCard
                  label="Priority"
                  value={grievance.priority}
                />

                <InfoCard
                  label="Department"
                  value={grievance.department}
                />

                <InfoCard
                  label="Location"
                  value={grievance.location}
                />
              </div>

              <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(grievance.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(grievance.updatedAt)}
                  </p>
                </div>
              </div>
            </section>

            {/* Progress */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Grievance Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current status:{" "}
                <span className="font-semibold text-slate-700">
                  {getStatusLabel(grievance.status)}
                </span>
              </p>

              <div className="mt-8 space-y-6">
                {STATUS_STEPS.map((status, index) => {
                  const completed =
                    currentStep >= index;

                  const isCurrent =
                    currentStatus === status;

                  return (
                    <div
                      key={status}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                            completed
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {completed ? "✓" : index + 1}
                        </div>

                        {index < STATUS_STEPS.length - 1 && (
                          <div
                            className={`mt-1 h-10 w-0.5 ${
                              currentStep > index
                                ? "bg-blue-600"
                                : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <p
                          className={`font-semibold ${
                            isCurrent
                              ? "text-blue-600"
                              : completed
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {getStatusLabel(status)}
                        </p>

                        {isCurrent && (
                          <p className="mt-1 text-sm text-slate-500">
                            Your grievance is currently at this stage.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* History */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Activity History
              </h2>

              {history.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No activity history available.
                </p>
              ) : (
                <div className="mt-6 space-y-5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <p className="font-semibold">
                        {getStatusLabel(item.newStatus)}
                      </p>

                      {item.remark && (
                        <p className="mt-1 text-sm text-slate-600">
                          {item.remark}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        {item.changedBy} •{" "}
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Help */}
            <section className="rounded-2xl bg-blue-600 p-6 text-white shadow-sm">
              <h2 className="text-xl font-bold">
                Need help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Keep your grievance ID safe. You can use it anytime
                to check the latest progress of your complaint.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/grievance"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Report Another Issue
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10"
                >
                  Back to Dashboard
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}