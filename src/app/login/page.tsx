
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  HeartPulse,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (roleError || !userRole) {
        await supabase.auth.signOut();
        setError(
          "Your account role could not be verified. Please contact support."
        );
        return;
      }

      if (userRole.role === "patient") {
        router.replace("/patient/dashboard");
      } else if (userRole.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        await supabase.auth.signOut();
        setError("Invalid account role. Please contact support.");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">

      {/* Background Decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Back to Home */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-blue-900/5 sm:p-9">

          {/* Logo */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
              <HeartPulse size={34} />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-blue-700">
              CarePoint
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Welcome Back!
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your healthcare dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

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
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-blue-700/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login to CarePoint"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
            >
              Create Account
            </Link>
          </p>

          {/* Security Information */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
            <ShieldCheck size={16} className="text-green-600" />
            Secure account access
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CarePoint Healthcare Platform
          </p>
        </div>
      </div>
    </main>
  );
}
