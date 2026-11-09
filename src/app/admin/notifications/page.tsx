
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { ArrowLeft } from "lucide-react";

async function markAsRead(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const notificationId = String(formData.get("notification_id") ?? "");

  if (!notificationId) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Unable to mark notification as read:", error.message);
    return;
  }

  revalidatePath("/admin/notifications");
}

export default async function AdminNotificationsPage() {
  const { supabase, user } = await requireRole("admin");

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("id, user_id, appointment_id, title, message, is_read, created_at")
    .order("created_at", { ascending: false });

  const notificationList = notifications ?? [];

  const userIds = [
    ...new Set(notificationList.map((notification) => notification.user_id)),
  ];

  let profiles: { id: string; full_name: string }[] = [];

  if (userIds.length > 0) {
    const { data, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profilesError) {
      console.error("Unable to load patient names:", profilesError.message);
    }

    profiles = data ?? [];
  }

  const getPatientName = (userId: string) =>
    profiles.find((profile) => profile.id === userId)?.full_name ?? "Patient";

  const unreadCount = notificationList.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notificationList.length - unreadCount;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-2xl font-bold text-blue-700"
            >
              CarePoint
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              Administration Portal
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">
              Administrator
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Back to Dashboard Button */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Notifications
          </h1>
          <p className="mt-2 text-slate-600">
            Monitor patient notifications and recent appointment activity.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load notifications: {error.message}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Notifications</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {notificationList.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Unread Notifications</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Read Notifications</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {readCount}
            </p>
          </div>
        </section>

        {/* Notification List */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Notifications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest notifications recorded in CarePoint.
              </p>
            </div>

            <Link
              href="/admin/appointments"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage Appointments →
            </Link>
          </div>

          {notificationList.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-700">
                No notifications yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Notifications will appear here when they are created.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 ${
                    notification.is_read ? "bg-white" : "bg-blue-50/50"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {notification.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            notification.is_read
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {notification.is_read ? "Read" : "Unread"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-700">
                        {notification.message}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span>
                          Patient: {getPatientName(notification.user_id)}
                        </span>

                        <span>
                          {new Date(notification.created_at).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </span>

                        {notification.appointment_id && (
                          <span>Appointment linked</span>
                        )}
                      </div>
                    </div>

                    {!notification.is_read && (
                      <form action={markAsRead}>
                        <input
                          type="hidden"
                          name="notification_id"
                          value={notification.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Mark as Read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
