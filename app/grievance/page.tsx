"use client";

import Link from "next/link";
import { useState } from "react";

export default function GrievancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          priority: "Medium",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit grievance.");
      }

      setSubmitted(true);

      setTitle("");
      setCategory("");
      setDescription("");
      setLocation("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold">
          Grievance<span className="text-blue-600">AI</span>
        </h1>

        <p className="text-sm text-slate-700">
          Citizen Grievance App
        </p>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Report a Civic Issue
        </h2>

        <Link
  href="/dashboard"
  className="mt-4 mb-4 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
  ← Back to Dashboard
</Link>

        <p className="mt-2 text-slate-700">
          Submit your complaint and track its progress.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="text-5xl">✅</div>

              <h3 className="mt-4 text-2xl font-bold">
                Grievance Submitted
              </h3>

              <p className="mt-2 text-slate-700">
                Your complaint has been received successfully.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div>
                <label className="mb-2 block font-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-900">
                  Issue Title
                </label>

                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: Road damage near school"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-blue-400 dark:focus:ring-blue-900"                   />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-900">
                  Category
                </label>

                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"              >                  <option value="">Select category</option>
                  <option>Roads & Potholes</option>
                  <option>Garbage & Sanitation</option>
                  <option>Water Supply</option>
                  <option>Streetlights</option>
                  <option>Traffic</option>
                  <option>Other Civic Issue</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-900">
                  Description
                </label>

                <textarea
                  required
                  minLength={20}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem in at least 20 characters..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-blue-400 dark:focus:ring-blue-900"               />

                <p className="mt-1 text-xs text-slate-700">
                  Minimum 20 characters
                </p>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-900">
                  Location
                </label>

                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Example: Andheri East, Mumbai"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-blue-400 dark:focus:ring-blue-900"                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-semibold text-slate-900">
                  Photo Evidence
                </label>

                <input
  type="file"
  accept="image/jpeg,image/png"
  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900"
/>

<p className="mt-1 text-xs font-medium text-slate-700">
  Upload a JPG or PNG photo as evidence.
</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Grievance →"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}