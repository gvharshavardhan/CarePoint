
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength = (() => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  })();

  const strengthLabel =
    passwordStrength <= 1
      ? "Weak"
      : passwordStrength <= 3
        ? "Medium"
        : "Strong";

  const strengthColor =
    passwordStrength <= 1
      ? "bg-red-500"
      : passwordStrength <= 3
        ? "bg-yellow-500"
        : "bg-green-500";

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

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

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/patient/dashboard`,
          },
        });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (data.session) {
        router.push("/patient/dashboard");
        router.refresh();
        return;
      }

      setSuccess(
        "Registration successful! Please check your email and click the confirmation link to activate your account."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">

      {/* Background Decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative w-full max-w-lg">

        {/* Back to Home */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Registration Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-blue-900/5 sm:p-9">

          {/* Logo and Heading */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
              <HeartPulse size={34} />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-blue-700">
              CarePoint
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Create Your Account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Register to access your patient dashboard.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  disabled={loading}
                  className={inputClass}
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
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
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
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
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

              {/* Password Strength */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      Password strength
                    </span>

                    <span
                      className={`font-semibold ${
                        passwordStrength <= 1
                          ? "text-red-600"
                          : passwordStrength <= 3
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {strengthLabel}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          level <= passwordStrength
                            ? strengthColor
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm Password
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
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
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
                  aria-pressed={showConfirmPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p
                  className={`mt-2 flex items-center gap-1.5 text-xs ${
                    password === confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 size={14} />
                      Passwords match
                    </>
                  ) : (
                    "Passwords do not match"
                  )}
                </p>
              )}
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

            {/* Success Message */}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-700"
              >
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={18} />
                  Registration Successful
                </div>
                {success}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-blue-700/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create CarePoint Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Security Footer */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
            <ShieldCheck size={16} className="text-green-600" />
            Secure account registration
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CarePoint Healthcare Platform
          </p>
        </div>
      </div>
    </main>
  );
}
