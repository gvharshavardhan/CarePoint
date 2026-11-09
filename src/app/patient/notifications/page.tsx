
import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { revalidatePath } from "next/cache";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Inbox,
  CalendarDays,
  ArrowUpRight,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default async function PatientNotificationsPage() {
  const { supabase, user } = await requireRole("patient");

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("id, title, message, is_read, created_at, appointment_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Notifications fetch error:", error.message);
  }

  const notificationList = notifications ?? [];
  const unreadCount = notificationList.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Back to Dashboard */}
        <div className="mb-6">
          <Link
            href="/patient/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Patient Dashboard
          </Link>
        </div>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Patient Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="mt-2 text-slate-500">
              Stay updated with your appointments and account activity.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Bell size={23} />
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900">
                {unreadCount}
              </p>
              <p className="text-sm text-slate-500">Unread notifications</p>
            </div>
          </div>
        </div>

        {/* Blue Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-lg sm:p-9">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Bell size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Your CarePoint Updates
              </h2>
              <p className="mt-1 text-sm text-blue-100">
                Important updates about your healthcare journey, all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Notifications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {notificationList.length} notification
                {notificationList.length !== 1 ? "s" : ""} in your account
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {unreadCount} unread
            </span>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <p className="font-medium text-red-600">
                Unable to load notifications.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Please refresh the page and try again.
              </p>
            </div>
          ) : notificationList.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Inbox size={36} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                You're all caught up!
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You don't have any notifications yet. Appointment updates and
                other important messages will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notificationList.map((notification) => {
                async function markAsRead() {
                  "use server";

                  const { supabase, user } = await requireRole("patient");

                  const { error } = await supabase
                    .from("notifications")
                    .update({ is_read: true })
                    .eq("id", notification.id)
                    .eq("user_id", user.id);

                  if (error) {
                    console.error(
                      "Mark notification as read failed:",
                      error.message
                    );
                    throw new Error("Unable to update notification.");
                  }

                  revalidatePath("/patient/notifications");
                }

                return (
                  <article
                    key={notification.id}
                    className={`flex flex-col gap-4 px-6 py-6 transition hover:bg-slate-50 sm:flex-row sm:items-start sm:justify-between ${
                      !notification.is_read ? "bg-blue-50/40" : "bg-white"
                    }`}
                  >
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          notification.is_read
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {notification.is_read ? (
                          <Check size={23} />
                        ) : (
                          <Bell size={23} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {notification.title}
                          </h3>

                          {!notification.is_read && (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              New
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {notification.message || "You have a new update."}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {new Date(notification.created_at).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }
                            )}
                          </span>

                          {notification.appointment_id && (
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              Appointment update
                            </span>
                          )}
                        </div>

                        {notification.appointment_id && (
                          <Link
                            href="/patient/appointments"
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900"
                          >
                            View appointment
                            <ArrowUpRight size={15} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {!notification.is_read && (
                      <form action={markAsRead} className="shrink-0 sm:pt-1">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
                        >
                          <CheckCheck size={16} />
                          Mark as read
                        </button>
                      </form>
                    )}

                    {notification.is_read && (
                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        Read
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          CarePoint keeps your appointment updates organized in one place.
        </p>
      </div>
    </main>
  );
}
