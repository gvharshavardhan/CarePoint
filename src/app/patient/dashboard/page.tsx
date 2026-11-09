
import Link from "next/link";
import {
  Activity,
  CalendarDays,
  Clock3,
  UserRound,
  ArrowRight,
  LayoutDashboard,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  Stethoscope,
  Plus,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Building2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth/require-role";

const navigation = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "My Appointments", href: "/patient/appointments", icon: CalendarCheck },
  { label: "Notifications", href: "/patient/notifications", icon: Bell },
  { label: "My Profile", href: "/patient/profile", icon: Settings },
];

export default async function PatientDashboardPage() {
  const { supabase, user } = await requireRole("patient");

  const [{ data: profile }, { data: appointments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("appointments")
      .select("id, appointment_date, appointment_time, status, reason")
      .eq("patient_id", user.id)
      .order("appointment_date", { ascending: true })
      .limit(5),
  ]);

  const name =
    profile?.full_name || user.email?.split("@")[0] || "Patient";

  const recentAppointments = appointments ?? [];

  const pendingCount = recentAppointments.filter(
    (item) => item.status === "pending"
  ).length;

  const confirmedCount = recentAppointments.filter(
    (item) => item.status === "confirmed"
  ).length;

  function getStatusStyle(status: string) {
    switch (status) {
      case "confirmed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link
          href="/"
          className="flex h-20 items-center gap-3 border-b border-slate-100 px-7"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-md shadow-blue-200">
            <HeartPulse size={25} />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Care<span className="text-blue-700">Point</span>
          </span>
        </Link>

        <div className="px-5 py-7">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Patient Portal
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/patient/dashboard";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="ml-auto" size={17} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <HeartPulse size={20} />
              <span className="text-sm font-bold">CarePoint Support</span>
            </div>

            <p className="mt-2 text-xs leading-6 text-slate-600">
              Need assistance navigating your patient portal?
            </p>

            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
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
        {/* Top Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <HeartPulse className="text-blue-700" size={26} />
              <span className="text-lg font-extrabold text-slate-900">
                Care<span className="text-blue-700">Point</span>
              </span>
            </Link>

            <div className="hidden lg:block">
              <p className="text-sm font-bold text-slate-800">
                Patient Dashboard
              </p>
              <p className="text-xs text-slate-400">
                Your personal healthcare overview
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-800">{name}</p>
                <p className="text-xs text-slate-500">Patient Account</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-blue-100 bg-blue-50 font-bold text-blue-700">
                {name.charAt(0).toUpperCase()}
              </div>

              <form action={signOut} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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
              const active = item.href === "/patient/dashboard";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                    active
                      ? "bg-blue-700 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Dashboard Body */}
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102f62] via-[#1649a5] to-[#155eef] p-7 text-white shadow-xl shadow-blue-900/10 sm:p-10">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                  <Activity size={15} />
                  Patient Dashboard
                </div>

                <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Welcome back, {name}!
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                  Manage your appointment requests, keep track of their
                  status and explore your CarePoint patient portal.
                </p>
              </div>

              <Link
                href="/appointments"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-blue-800 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                <Plus size={19} />
                Book an Appointment
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-9">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Appointment Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick look at your latest five appointment requests.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <CalendarDays size={24} />
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Latest 5
                  </span>
                </div>

                <p className="mt-5 text-3xl font-extrabold text-slate-900">
                  {recentAppointments.length}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Recent appointment requests
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock3 size={24} />
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Awaiting review
                  </span>
                </div>

                <p className="mt-5 text-3xl font-extrabold text-slate-900">
                  {pendingCount}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Pending requests
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Approved
                  </span>
                </div>

                <p className="mt-5 text-3xl font-extrabold text-slate-900">
                  {confirmedCount}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Confirmed appointments
                </p>
              </div>
            </div>
          </section>

          {/* Account Information */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <UserRound size={26} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Your Account
                  </p>
                  <h2 className="mt-1 font-bold text-slate-900">
                    Account Information
                  </h2>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <Link
                href="/patient/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                View Profile
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Recent Appointments */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Appointment Activity
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Recent Appointment Requests
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  The latest five requests associated with your account.
                </p>
              </div>

              <Link
                href="/patient/appointments"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
              >
                View All
                <ArrowRight size={17} />
              </Link>
            </div>

            {!recentAppointments.length ? (
              <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <ClipboardList size={29} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No appointment requests yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
                  You haven't submitted any appointment requests yet.
                  Book your first appointment to get started.
                </p>

                <Link
                  href="/appointments"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  <Plus size={17} />
                  Book Your First Appointment
                </Link>
              </div>
            ) : (
              <div className="mt-7 space-y-3">
                {recentAppointments.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/30 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <CalendarDays size={22} />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {item.appointment_date}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock3 size={14} />
                          {String(item.appointment_time).slice(0, 5)}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {item.reason || "General appointment request"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold capitalize ${getStatusStyle(item.status)}`}
                    >
                      {item.status === "confirmed" && (
                        <CheckCircle2 size={14} />
                      )}
                      {item.status === "pending" && <Clock3 size={14} />}
                      {item.status === "cancelled" && (
                        <ShieldCheck size={14} />
                      )}
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="mt-9">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Explore CarePoint
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Quick access to other platform features.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Link
                href="/doctors"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Stethoscope size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Find a Doctor
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Explore our demo doctor directory.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
                />
              </Link>

              <Link
                href="/departments"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                    <Building2 size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Explore Departments
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Browse available demo departments.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
                />
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-slate-200 py-7 text-center">
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
