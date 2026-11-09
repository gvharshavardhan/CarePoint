
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { ArrowLeft, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

async function updateMessageStatus(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const messageId = String(formData.get("message_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!messageId || !["read", "resolved"].includes(status)) {
    return;
  }

  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", messageId);

  if (error) {
    console.error("Unable to update contact message:", error.message);
    return;
  }

  revalidatePath("/admin/contact-messages");
}

export default async function AdminContactMessagesPage() {
  const { supabase, user } = await requireRole("admin");

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  const messageList = messages ?? [];

  const newCount = messageList.filter(
    (item) => item.status === "new"
  ).length;

  const readCount = messageList.filter(
    (item) => item.status === "read"
  ).length;

  const resolvedCount = messageList.filter(
    (item) => item.status === "resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
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
        {/* BACK BUTTON */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        {/* PAGE HEADING */}
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <MessageSquare size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Contact Messages
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View and manage enquiries submitted through the CarePoint website.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load contact messages: {error.message}
          </div>
        )}

        {/* STATISTICS */}
        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Messages</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {messageList.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">New Messages</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {newCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Read Messages</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {readCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Resolved Messages</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedCount}
            </p>
          </div>
        </section>

        {/* MESSAGES LIST */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                All Enquiries
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest contact form submissions.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
              {messageList.length} Messages
            </span>
          </div>

          {messageList.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Mail size={38} className="mx-auto text-slate-300" />

              <h3 className="mt-4 font-bold text-slate-700">
                No contact messages yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Messages submitted through the Contact page will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {messageList.map((item) => (
                <article key={item.id} className="p-6 transition hover:bg-slate-50">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {item.subject}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "new"
                              ? "bg-amber-100 text-amber-700"
                              : item.status === "read"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                        <span>
                          <strong className="text-slate-700">From:</strong>{" "}
                          {item.name}
                        </span>

                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Mail size={14} />
                          {item.email}
                        </a>
                      </div>

                      <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                          {item.message}
                        </p>
                      </div>

                      <p className="mt-4 text-xs text-slate-400">
                        Submitted:{" "}
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* MESSAGE ACTIONS */}
                  {item.status !== "resolved" && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {item.status === "new" && (
                        <form action={updateMessageStatus}>
                          <input
                            type="hidden"
                            name="message_id"
                            value={item.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="read"
                          />

                          <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Mark as Read
                          </button>
                        </form>
                      )}

                      <form action={updateMessageStatus}>
                        <input
                          type="hidden"
                          name="message_id"
                          value={item.id}
                        />
                        <input
                          type="hidden"
                          name="status"
                          value="resolved"
                        />

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                        >
                          <CheckCircle2 size={16} />
                          Mark as Resolved
                        </button>
                      </form>
                    </div>
                  )}

                  {item.status === "resolved" && (
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                      <CheckCircle2 size={17} />
                      This enquiry has been resolved.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
