import Link from "next/link";

const notifications = [
  {
    icon: "📝",
    title: "Grievance Submitted",
    message:
      "Your grievance has been successfully registered and is awaiting review.",
    time: "Just now",
    unread: true,
  },
  {
    icon: "🔄",
    title: "Status Update",
    message:
      "Your grievance status will appear here when an officer takes action.",
    time: "Today",
    unread: false,
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    message:
      "GrievanceAI can help categorize your complaint and identify the appropriate department.",
    time: "Today",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
     <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              G
            </div>

            <div>
              <h1 className="text-xl font-extrabold">
                Grievance<span className="text-blue-600">AI</span>
              </h1>

              <p className="text-xs text-slate-500">
                Notifications
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold">
            Notifications
          </h2>

          <p className="mt-2 text-slate-500">
            Stay updated about your grievances and account.
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                notification.unread
                  ? "border-blue-200 bg-blue-50/40"
                  : "border-slate-200"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {notification.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <h3 className="font-bold">
                      {notification.title}
                    </h3>

                    <span className="text-xs text-slate-400">
                      {notification.time}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {notification.message}
                  </p>

                  {notification.unread && (
                    <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>

            <div>
              <h3 className="font-bold text-blue-900">
                Stay informed
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                You will receive important updates about grievance
                status, assignments, and resolutions here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}