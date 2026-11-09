
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";

async function logoutAdmin() {
  "use server";

  const { supabase } = await requireRole("admin");

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Admin logout failed:", error.message);
    redirect("/admin/dashboard?error=logout-failed");
  }

  redirect("/login");
}

export default async function AdminDashboard() {
  const { supabase, user } = await requireRole("admin");

  const { count: totalAppointments } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true });

  const { count: pendingAppointments } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: confirmedAppointments } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("status", "confirmed");

  const { count: totalPatients } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { count: totalDoctors } = await supabase
    .from("doctors")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: totalDepartments } = await supabase
    .from("departments")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  // Contact message statistics
  const { count: totalContactMessages } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true });

  const { count: newContactMessages } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      "id, patient_id, doctor_id, appointment_date, appointment_time, status"
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const recentAppointments = appointments ?? [];

  const patientIds = [
    ...new Set(
      recentAppointments.map((appointment) => appointment.patient_id)
    ),
  ];

  const doctorIds = [
    ...new Set(
      recentAppointments.map((appointment) => appointment.doctor_id)
    ),
  ];

  let patientProfiles: { id: string; full_name: string }[] = [];
  let doctorProfiles: { id: string; full_name: string }[] = [];

  if (patientIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", patientIds);

    patientProfiles = data ?? [];
  }

  if (doctorIds.length > 0) {
    const { data } = await supabase
      .from("doctors")
      .select("id, full_name")
      .in("id", doctorIds);

    doctorProfiles = data ?? [];
  }

  const getPatientName = (id: string) =>
    patientProfiles.find((patient) => patient.id === id)?.full_name ??
    "Patient";

  const getDoctorName = (id: string) =>
    doctorProfiles.find((doctor) => doctor.id === id)?.full_name ??
    "Doctor";

  const stats = [
    {
      title: "Total Appointments",
      value: totalAppointments ?? 0,
      description: "All appointment requests",
      color: "bg-blue-50 text-blue-700",
      href: "/admin/appointments",
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments ?? 0,
      description: "Waiting for confirmation",
      color: "bg-amber-50 text-amber-700",
      href: "/admin/appointments",
    },
    {
      title: "Confirmed Appointments",
      value: confirmedAppointments ?? 0,
      description: "Successfully confirmed",
      color: "bg-green-50 text-green-700",
      href: "/admin/appointments",
    },
    {
      title: "Registered Patients",
      value: totalPatients ?? 0,
      description: "Patient profiles",
      color: "bg-purple-50 text-purple-700",
      href: "/admin/patients",
    },
    {
      title: "Active Doctors",
      value: totalDoctors ?? 0,
      description: "Available doctors",
      color: "bg-cyan-50 text-cyan-700",
      href: "/admin/doctors",
    },
    {
      title: "Departments",
      value: totalDepartments ?? 0,
      description: "Active departments",
      color: "bg-pink-50 text-pink-700",
      href: "/admin/departments",
    },
    {
      title: "Notifications",
      value: "View",
      description: "Patient and appointment alerts",
      color: "bg-orange-50 text-orange-700",
      href: "/admin/notifications",
    },
    {
      title: "Analytics",
      value: "View",
      description: "Reports and appointment trends",
      color: "bg-indigo-50 text-indigo-700",
      href: "/admin/analytics",
    },
    {
      title: "Contact Messages",
      value: totalContactMessages ?? 0,
      description: `${newContactMessages ?? 0} new enquiries`,
      color: "bg-teal-50 text-teal-700",
      href: "/admin/contact-messages",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-2xl font-bold text-blue-700">
              CarePoint
            </Link>

            <p className="mt-1 text-sm text-slate-500">
              Administration Portal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/profile"
              className="rounded-lg px-4 py-2 text-right transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <p className="text-sm font-semibold text-slate-800 hover:text-blue-700">
                Administrator
              </p>

              <p className="text-xs text-slate-500">{user.email}</p>

              <p className="mt-1 text-xs font-medium text-blue-600">
                View Profile →
              </p>
            </Link>

            {/* LOGOUT BUTTON */}
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-lg bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* DASHBOARD HEADING */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor appointments, patients, doctors and hospital activity.
          </p>
        </div>

        {/* CLICKABLE STATISTICS AND NAVIGATION CARDS */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <p className="text-sm font-medium text-slate-500 group-hover:text-blue-700">
                {stat.title}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>

              <span
                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${stat.color}`}
              >
                {stat.description}
              </span>

              <p className="mt-4 text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                View details →
              </p>
            </Link>
          ))}
        </section>

        {/* RECENT APPOINTMENTS */}
        <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The five most recently created appointments.
              </p>
            </div>

            <Link
              href="/admin/appointments"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              No appointments have been booked yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Patient</th>
                    <th className="px-6 py-4 font-semibold">Doctor</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {getPatientName(appointment.patient_id)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {getDoctorName(appointment.doctor_id)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {appointment.appointment_date}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {appointment.appointment_time}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
