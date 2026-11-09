
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Activity,
  HeartPulse,
  LayoutDashboard,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  ArrowRight,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth/require-role";

const navigation = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "My Appointments", href: "/patient/appointments", icon: CalendarCheck },
  { label: "Notifications", href: "/patient/notifications", icon: Bell },
  { label: "My Profile", href: "/patient/profile", icon: Settings },
];

export default async function PatientProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { supabase, user } = await requireRole("patient");
  const params = await searchParams;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, phone, date_of_birth")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile loading failed:", profileError.message);
  }

  const displayName =
    profile?.full_name || user.email?.split("@")[0] || "Patient";

  async function updateProfile(formData: FormData) {
    "use server";

    const fullName = String(formData.get("full_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const dateOfBirth = String(formData.get("date_of_birth") ?? "").trim();

    if (!fullName || fullName.length > 120) {
      redirect("/patient/profile?error=invalid-name");
    }

    if (phone.length > 25) {
      redirect("/patient/profile?error=invalid-phone");
    }

    const { supabase, user } = await requireRole("patient");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update failed:", error.message);
      redirect("/patient/profile?error=save-failed");
    }

    revalidatePath("/patient/profile");
    revalidatePath("/patient/dashboard");

    redirect("/patient/profile?updated=1");
  }

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
              const active = item.href === "/patient/profile";

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
                My Profile
              </p>
              <p className="text-xs text-slate-400">
                View and update your personal information
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">Patient Account</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {displayName.charAt(0).toUpperCase()}
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

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 lg:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/patient/profile";

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

        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* Page Introduction */}
          <section className="rounded-3xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-lg sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              Patient Portal
            </p>

            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Manage your personal details and keep your information up to date.
            </p>
          </section>

          {/* Success and Error Messages */}
          {params.updated === "1" && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={20} />
              Your profile has been updated successfully.
            </div>
          )}

          {params.error && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <AlertCircle size={20} />
              {params.error === "invalid-name"
                ? "Please enter a valid name (maximum 120 characters)."
                : params.error === "invalid-phone"
                  ? "Phone number must not exceed 25 characters."
                  : "Unable to save your profile. Please try again."}
            </div>
          )}

          {/* Profile Form */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <UserRound size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update your details below.
                  </p>
                </div>
              </div>
            </div>

            <form action={updateProfile} className="space-y-6 p-6 sm:p-8">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name *
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    maxLength={120}
                    defaultValue={profile?.full_name ?? ""}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    readOnly
                    value={user.email ?? ""}
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Your registered email address cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={25}
                    defaultValue={profile?.phone ?? ""}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="date_of_birth"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Date of Birth
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={profile?.date_of_birth ?? ""}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/patient/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Back to Dashboard
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </form>
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
