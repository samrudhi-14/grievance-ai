"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Grievance = {
  id: number;
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

export default function ManageGrievancePage() {
  const params = useParams();
  const router = useRouter();

  const grievanceId = params["grievanceId"] as string;

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!grievanceId) return;

    async function loadGrievance() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/track/${encodeURIComponent(grievanceId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load grievance.");
        }

        setGrievance(data.grievance);
        setHistory(data.history || []);

        setStatus(data.grievance.status || "");
        setPriority(data.grievance.priority || "");
        setAssignedOfficer(data.grievance.assignedOfficer || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load grievance."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGrievance();
  }, [grievanceId]);

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/admin/grievances/${encodeURIComponent(grievanceId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            priority,
            assignedOfficer,
            remark,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to update grievance.");
      }

      setMessage("Grievance updated successfully.");

      setRemark("");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update grievance."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-300">
            Loading grievance...
          </p>
        </div>
      </main>
    );
  }

  if (error && !grievance) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-slate-300 hover:text-white"
          >
            ← Back
          </button>

          <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6">
            <h1 className="text-xl font-bold text-red-400 mb-2">
              Unable to load grievance
            </h1>

            <p className="text-slate-300">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!grievance) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Grievance not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Administration Portal
            </p>

            <h1 className="text-2xl font-bold">
              Manage Grievance
            </h1>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-700 bg-green-950/40 px-5 py-4 text-green-300">
            ✅ {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-950/40 px-5 py-4 text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Grievance heading */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-sm font-medium">
              {grievance.grievanceId}
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm">
              {grievance.category}
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            {grievance.title}
          </h2>

          <p className="text-slate-400 mt-2">
            Submitted on{" "}
            {new Date(grievance.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main details */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-5">
                Grievance Details
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Description
                  </p>

                  <p className="text-slate-200 leading-7">
                    {grievance.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Location
                  </p>

                  <p className="text-slate-200">
                    📍 {grievance.location}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Department
                  </p>

                  <p className="text-slate-200">
                    🏢 {grievance.department}
                  </p>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">
                Grievance History
              </h3>

              {history.length === 0 ? (
                <p className="text-slate-500">
                  No history available.
                </p>
              ) : (
                <div className="space-y-5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="border-l-2 border-blue-600 pl-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white">
                          {item.newStatus.replace(/_/g, " ")}
                        </span>

                        {item.previousStatus && (
                          <span className="text-sm text-slate-500">
                            from{" "}
                            {item.previousStatus.replace(
                              /_/g,
                              " "
                            )}
                          </span>
                        )}
                      </div>

                      {item.remark && (
                        <p className="text-slate-400 mt-1">
                          {item.remark}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 mt-2">
                        {item.changedBy} •{" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Admin controls */}
          <aside>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-6">
                Admin Controls
              </h3>

              {/* Current status */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-2">
                  Current Status
                </p>

                <div className="px-4 py-3 rounded-xl bg-slate-800 text-blue-300 font-medium">
                  {grievance.status.replace(/_/g, " ")}
                </div>
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="block text-sm text-slate-400 mb-2">
                  Update Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
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

              {/* Priority */}
              <div className="mb-5">
                <label className="block text-sm text-slate-400 mb-2">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">
                    Critical
                  </option>
                </select>
              </div>

              {/* Officer */}
              <div className="mb-5">
                <label className="block text-sm text-slate-400 mb-2">
                  Assigned Officer
                </label>

                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) =>
                    setAssignedOfficer(e.target.value)
                  }
                  placeholder="Enter officer name"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />
              </div>

              {/* Remark */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">
                  Admin Remark
                </label>

                <textarea
                  value={remark}
                  onChange={(e) =>
                    setRemark(e.target.value)
                  }
                  rows={4}
                  placeholder="Add a remark about this update..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 font-semibold transition"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Priority
                  </span>

                  <span className="text-slate-300">
                    {grievance.priority}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Officer
                  </span>

                  <span className="text-slate-300">
                    {grievance.assignedOfficer ||
                      "Not assigned"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Updated
                  </span>

                  <span className="text-slate-300">
                    {new Date(
                      grievance.updatedAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}