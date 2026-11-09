
import Link from "next/link";
import {
  Activity,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  ArrowRight,
  HeartPulse,
  ClipboardList,
  Stethoscope,
  XCircle,
} from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth/require-role";
import { revalidatePath } from "next/cache";

const navigation = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "My Appointments", href: "/patient/appointments", icon: CalendarCheck },
  { label: "Notifications", href: "/patient/notifications", icon: Bell },
  { label: "My Profile", href: "/patient/profile", icon: Settings },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PatientAppointmentsPage() {
  const { supabase, user } = await requireRole("patient");

  async function cancelAppointment(formData: FormData) {
    "use server";

    const appointmentId = formData.get("appointmentId");

    if (typeof appointmentId !== "string" || !appointmentId) {
      return;
    }

    const { supabase, user } = await requireRole("patient");

    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId)
      .eq("patient_id", user.id)
      .eq("status", "pending");

    if (error) {
      console.error("Appointment cancellation failed:", error.message);
      throw new Error("Unable to cancel appointment. Please try again.");
    }

    revalidatePath("/patient/appointments");
    revalidatePath("/patient/dashboard");
  }

  // Fetch profile and appointment records
  const [{ data: profile }, { data: appointments, error }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle(),

      supabase
        .from("appointments")
        .select(`
          id,
          doctor_id,
          department_id,
          appointment_date,
          appointment_time,
          reason,
          status
        `)
        .eq("patient_id", user.id)
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false }),
    ]);

  if (error) {
    console.error("Unable to fetch appointments:", error.message);
  }

  const name =
    profile?.full_name || user.email?.split("@")[0] || "Patient";

  const appointmentList = appointments ?? [];

  // Collect doctor and department IDs
  const doctorIds = [
    ...new Set(appointmentList.map((item) => item.doctor_id)),
  ];

  const departmentIds = [
    ...new Set(appointmentList.map((item) => item.department_id)),
  ];

  // Fetch doctor and department records separately
  const [
    { data: doctors, error: doctorsError },
    { data: departments, error: departmentsError },
  ] = await Promise.all([
    doctorIds.length > 0
      ? supabase
          .from("doctors")
          .select("id, full_name, specialization")
          .in("id", doctorIds)
      : Promise.resolve({ data: [], error: null }),

    departmentIds.length > 0
      ? supabase
          .from("departments")
          .select("id, name")
          .in("id", departmentIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (doctorsError) {
    console.error("Unable to fetch doctors:", doctorsError.message);
  }

  if (departmentsError) {
    console.error("Unable to fetch departments:", departmentsError.message);
  }

  // Create lookup maps
  const doctorMap = new Map(
    (doctors ?? []).map((doctor) => [doctor.id, doctor])
  );

  const departmentMap = new Map(
    (departments ?? []).map((department) => [department.id, department])
  );

  // Attach doctor and department information to appointments
  const enrichedAppointments = appointmentList.map((item) => ({
    ...item,
    doctor: doctorMap.get(item.doctor_id),
    department: departmentMap.get(item.department_id),
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link
          href="/"
          className="flex h-20 items-center gap-3 border-b border-slate-100 px-7"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
            <HeartPulse size={24} />
          </div>

          <span className="text-xl font-extrabold text-slate-900">
            Care<span className="text-blue-700">Point</span>
          </span>
        </Link>

        <div className="px-5 py-7">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Patient Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/patient/appointments";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <HeartPulse size={20} />
              <span className="text-sm font-bold">CarePoint Support</span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Need assistance navigating your patient portal?
            </p>

            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
            >
              Contact Us <ArrowRight size={13} />
            </Link>
          </div>

          <form action={signOut} className="mt-5">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={19} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <Activity className="text-blue-700" size={25} />
              <span className="text-lg font-extrabold text-slate-900">
                Care<span className="text-blue-700">Point</span>
              </span>
            </Link>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-800">
                My Appointments
              </p>
              <p className="text-xs text-slate-400">
                View and manage your appointment requests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {name}
                </p>
                <p className="text-xs text-slate-500">Patient Account</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {name.charAt(0).toUpperCase()}
              </div>

              <form action={signOut} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="rounded-xl p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 lg:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/patient/appointments";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                    active ? "bg-blue-50 text-blue-700" : "text-slate-600"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Appointments Body */}
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-lg sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Patient Portal
              </p>

              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                My Appointments
              </h1>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                View your appointment history and manage pending requests.
              </p>
            </div>

            <Link
              href="/appointments"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              <CalendarDays size={18} />
              Book Appointment
              <ArrowRight size={16} />
            </Link>
          </section>

          {/* Summary */}
          <section className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <CalendarDays className="text-blue-700" size={25} />
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {appointmentList.length}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Total appointments
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Clock3 className="text-amber-600" size={25} />
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {appointmentList.filter((a) => a.status === "pending").length}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Pending requests
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <CalendarCheck className="text-emerald-600" size={25} />
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {appointmentList.filter((a) => a.status === "confirmed").length}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Confirmed appointments
              </p>
            </div>
          </section>

          {/* Appointment List */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Appointment History
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All appointment requests associated with your account.
              </p>
            </div>

            {error ? (
              <div className="mt-7 rounded-xl bg-red-50 p-5 text-sm text-red-700">
                Unable to load appointments. Please refresh the page and try again.
              </div>
            ) : appointmentList.length === 0 ? (
              <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-14 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 font-bold text-slate-800">
                  No appointments found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  You haven't submitted any appointment requests yet.
                </p>

                <Link
                  href="/appointments"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Book Your First Appointment
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="mt-7 space-y-4">
                {enrichedAppointments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <Stethoscope size={23} />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {item.doctor?.full_name ?? "Doctor"}
                          </h3>

                          <p className="mt-1 text-sm text-blue-700">
                            {item.doctor?.specialization ?? "Specialist"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.department?.name ?? "Department"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays size={17} className="text-blue-700" />
                        {formatDate(item.appointment_date)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock3 size={17} className="text-blue-700" />
                        {String(item.appointment_time).slice(0, 5)}
                      </div>
                    </div>

                    {item.reason && (
                      <p className="mt-3 text-sm text-slate-500">
                        <span className="font-semibold text-slate-700">
                          Reason:{" "}
                        </span>
                        {item.reason}
                      </p>
                    )}

                    {item.status === "pending" && (
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <form action={cancelAppointment}>
                          <input
                            type="hidden"
                            name="appointmentId"
                            value={item.id}
                          />

                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle size={16} />
                            Cancel Appointment
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="mt-10 border-t border-slate-200 py-6 text-center">
            <p className="text-xs leading-6 text-slate-400">
              © {new Date().getFullYear()} CarePoint Healthcare Platform.
              <br />
              Fictional portfolio demonstration only · Not a real healthcare service.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
