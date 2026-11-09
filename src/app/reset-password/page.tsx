
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  HeartPulse,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess("Your password has been updated successfully!");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-blue-900/5 sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
              <HeartPulse size={34} />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-blue-700">
              CarePoint
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Reset Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a new password for your CarePoint account.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New Password
              </label>

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
                  placeholder="Enter new password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-700"
              >
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={18} />
                  Password Updated
                </div>
                {success}
                <p className="mt-1 text-xs">
                  Redirecting you to Login...
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
            <ShieldCheck size={16} className="text-green-600" />
            Secure password recovery
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CarePoint Healthcare Platform
          </p>
        </div>
      </div>
    </main>
  );
}
