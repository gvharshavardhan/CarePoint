
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Departments", href: "/departments" },
  { name: "Our Doctors", href: "/doctors" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

type UserRole = "patient" | "admin";

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setIsLoggedIn(false);
        setRole(null);
        setIsLoading(false);
        return;
      }

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      setIsLoggedIn(true);
      setRole(userRole?.role === "admin" ? "admin" : "patient");
      setIsLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error.message);
      setIsSigningOut(false);
      return;
    }

    setIsLoggedIn(false);
    setRole(null);
    setMobileMenuOpen(false);

    router.push("/");
    router.refresh();
  };

  const dashboardHref =
    role === "admin" ? "/admin/dashboard" : "/patient/dashboard";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">

        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="CarePoint Home"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Activity size={26} strokeWidth={2.2} />
          </span>

          <span className="text-[25px] font-extrabold tracking-tight text-slate-950">
            care<span className="text-blue-700">point</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-xl px-3 py-3 text-[14px] font-semibold transition duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {item.name}
                {active && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-700" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <LayoutDashboard size={17} />
                    <span className="hidden xl:inline">
                      {role === "admin" ? "Admin Portal" : "My Dashboard"}
                    </span>
                    <span className="xl:hidden">Dashboard</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={17} />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    Log In
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    <UserRound size={16} />
                    Register
                  </Link>
                </>
              )}
            </>
          )}

          {/* Book Appointment */}
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl"
          >
            <CalendarDays size={17} />
            Book Appointment
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 md:flex lg:hidden"
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-100 bg-white px-5 py-5 shadow-xl md:block lg:hidden"
        >
          <nav aria-label="Mobile navigation" className="space-y-2">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`}
                >
                  {item.name}
                  {active && <ArrowRight size={16} />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <LayoutDashboard size={18} />
                      {role === "admin"
                        ? "Admin Dashboard"
                        : "Patient Dashboard"}
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Log In
                    </Link>

                    <Link
                      href="/register"
                      className="rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}

            <Link
              href="/appointments"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
            >
              <CalendarDays size={18} />
              Book an Appointment
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
