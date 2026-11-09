
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Bone,
  Brain,
  Eye,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Smile,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";

const departmentDesign: Record<
  string,
  {
    description: string;
    icon: typeof HeartPulse;
    color: string;
    number: string;
  }
> = {
  "Dental Care": {
    description:
      "Support for healthy teeth, gums and confident smiles through dental care.",
    icon: Smile,
    color: "bg-cyan-50 text-cyan-700",
    number: "01",
  },
  Ophthalmology: {
    description:
      "Eye examinations, vision assessments and specialized eye care.",
    icon: Eye,
    color: "bg-indigo-50 text-indigo-700",
    number: "02",
  },
  "General Medicine": {
    description:
      "Everyday healthcare, preventive checkups and general medical care.",
    icon: Stethoscope,
    color: "bg-emerald-50 text-emerald-700",
    number: "03",
  },
  Cardiology: {
    description:
      "Heart health, cardiovascular conditions and preventive care.",
    icon: HeartPulse,
    color: "bg-rose-50 text-rose-700",
    number: "04",
  },
  Pediatrics: {
    description:
      "Compassionate healthcare for infants, children and adolescents.",
    icon: Baby,
    color: "bg-sky-50 text-sky-700",
    number: "05",
  },
  Dermatology: {
    description:
      "Care for skin, hair and nail health and related conditions.",
    icon: Sparkles,
    color: "bg-pink-50 text-pink-700",
    number: "06",
  },
  Orthopedics: {
    description:
      "Specialized care for bones, joints, muscles and mobility.",
    icon: Bone,
    color: "bg-orange-50 text-orange-700",
    number: "07",
  },
  Neurology: {
    description:
      "Care for the brain, nervous system and neurological conditions.",
    icon: Brain,
    color: "bg-violet-50 text-violet-700",
    number: "08",
  },
};

export default async function DepartmentsPage() {
  const supabase = await createClient();

  const { data: departments, error } = await supabase
    .from("departments")
    .select("id, name, slug, description")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const departmentList = departments ?? [];

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#102f62] via-[#1649a5] to-[#155eef] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-14 size-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 size-80 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-50 backdrop-blur">
                <ShieldCheck size={16} />
                Quality healthcare under one roof
              </span>

              <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Medical care for{" "}
                <span className="text-blue-200">every need.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                Explore our medical specialties, discover the right
                department and connect with doctors through CarePoint.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Meet our doctors
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Book an appointment
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-7">
              <div>
                <p className="text-3xl font-extrabold">
                  {departmentList.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs text-blue-100">
                  Active departments
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-3xl font-extrabold">Care</p>
                <p className="mt-1 text-xs text-blue-100">
                  People-first experience
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-3xl font-extrabold">24/7</p>
                <p className="mt-1 text-xs text-blue-100">
                  Online platform access
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEPARTMENT LIST */}
        <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                  Explore our specialties
                </p>

                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  Healthcare designed around you.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                  Explore the departments available through our platform
                  and find the specialty that matches your needs.
                </p>
              </div>

              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3"
              >
                Explore our doctors
                <ArrowRight size={17} />
              </Link>
            </div>

            {error ? (
              <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="font-semibold text-red-700">
                  Unable to load departments.
                </p>
                <p className="mt-2 text-sm text-red-600">
                  Please refresh the page and try again.
                </p>
              </div>
            ) : departmentList.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="font-semibold text-slate-800">
                  No active departments available.
                </p>
              </div>
            ) : (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {departmentList.map((department, index) => {
                  const design =
                    departmentDesign[department.name] ?? {
                      description:
                        department.description ||
                        "Explore the medical services available in this department.",
                      icon: Activity,
                      color: "bg-blue-50 text-blue-700",
                      number: String(index + 1).padStart(2, "0"),
                    };

                  const Icon = design.icon;

                  return (
                    <article
                      key={department.id}
                      className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                    >
                      <div className="absolute -right-12 -top-12 size-36 rounded-full bg-blue-50/70 opacity-0 transition duration-300 group-hover:opacity-100" />

                      <div className="relative flex items-center justify-between">
                        <div
                          className={`flex size-14 items-center justify-center rounded-2xl ${design.color}`}
                        >
                          <Icon size={27} />
                        </div>

                        <span className="text-xs font-extrabold tracking-widest text-slate-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="relative mt-8">
                        <h3 className="text-lg font-bold text-slate-900">
                          {department.name}
                        </h3>

                        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                          {department.description || design.description}
                        </p>
                      </div>

                      <div className="relative mt-auto flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
                        <Link
                          href={`/doctors?department=${encodeURIComponent(department.id)}`}
                          className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 transition hover:text-blue-900"
                        >
                          View doctors
                          <ArrowUpRight size={15} />
                        </Link>

                        <Link
                          href="/appointments"
                          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-blue-700"
                        >
                          Book visit
                          <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* WHY CAREPOINT */}
        <section className="bg-white px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Your care journey
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                The right information makes healthcare simpler.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                CarePoint brings departments, doctors and appointment
                management together in one organized platform.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Explore available medical specialties.",
                  "Find doctors through the doctors directory.",
                  "Submit and track your appointment requests.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      <ShieldCheck size={15} />
                    </span>
                    <p className="text-sm font-medium text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-950 to-blue-700 p-8 text-white sm:p-12">
              <div className="absolute -right-12 -top-12 size-48 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
                  <HeartPulse size={34} />
                </div>

                <h3 className="mt-8 text-2xl font-bold sm:text-3xl">
                  Start your care journey with CarePoint.
                </h3>

                <p className="mt-4 text-sm leading-7 text-blue-100">
                  Explore the available doctors and submit an appointment
                  request through our online platform.
                </p>

                <Link
                  href="/appointments"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
                >
                  Request an appointment
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 rounded-3xl border border-blue-100 bg-blue-50 px-7 py-10 sm:px-12 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Need help choosing a department?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Visit our contact page to find out how to reach the
                CarePoint team.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-1 hover:bg-blue-800"
            >
              Contact us
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
