
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  HeartPulse,
  Mail,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(
        "If an account exists for this email, a password reset link will be sent. Please check your inbox."
      );
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
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

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
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Don't worry! Enter your registered email address and we'll send
              you a password reset link.
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleReset} className="space-y-5">
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
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                />
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
                  Check Your Email
                </div>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-5">
            <p className="text-center text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-700 hover:text-blue-900 hover:underline"
              >
                Login
              </Link>
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={16} className="text-green-600" />
              Secure password recovery
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CarePoint Healthcare Platform
          </p>
        </div>
      </div>
    </main>
  );
}
