
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
  Clock,
  Sparkles,
  HeartHandshake,
  MoveRight,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const departments = [
  {
    name: "Cardiology",
    detail: "Heart health and cardiovascular care.",
    icon: HeartPulse,
    tint: "bg-rose-50 text-rose-600",
    number: "01",
  },
  {
    name: "Neurology",
    detail: "Care for the brain and nervous system.",
    icon: Brain,
    tint: "bg-violet-50 text-violet-600",
    number: "02",
  },
  {
    name: "General Medicine",
    detail: "Everyday healthcare and wellness.",
    icon: Stethoscope,
    tint: "bg-blue-50 text-blue-700",
    number: "03",
  },
  {
    name: "Orthopedics",
    detail: "Bone, joint and mobility care.",
    icon: Activity,
    tint: "bg-teal-50 text-teal-700",
    number: "04",
  },
];

const benefits = [
  {
    title: "People-first care",
    text: "A welcoming experience designed around clarity, comfort and your time.",
    icon: Users,
    number: "01",
  },
  {
    title: "Connected experience",
    text: "Keep appointment requests and updates organized in one convenient place.",
    icon: HeartHandshake,
    number: "02",
  },
  {
    title: "Privacy-minded design",
    text: "Role-based access and secure-by-design application architecture.",
    icon: ShieldCheck,
    number: "03",
  },
];

const highlights = [
  {
    icon: CalendarDays,
    title: "Easy appointments",
    text: "Submit appointment requests conveniently.",
  },
  {
    icon: Clock,
    title: "Organized updates",
    text: "Keep track of your appointment status.",
  },
  {
    icon: ShieldCheck,
    title: "Secure access",
    text: "Separate patient and admin experiences.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="overflow-hidden bg-white">
        {/* HERO SECTION */}
        <section className="relative isolate bg-gradient-to-br from-[#f4f8ff] via-white to-[#edf9f8]">
          <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[550px] rounded-full bg-blue-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-[450px] rounded-full bg-teal-100/40 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-10 md:py-24 lg:px-10 lg:py-28">
            {/* Hero Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
                <Sparkles size={15} />
                A more thoughtful healthcare experience
              </div>

              <h1 className="mt-8 max-w-2xl text-5xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-6xl lg:text-[68px]">
                Healthcare that puts{" "}
                <span className="text-blue-700">you</span> first.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Discover medical specialties, explore our doctors and manage
                appointment requests through one connected healthcare
                experience.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-700 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-blue-700/20 transition duration-200 hover:-translate-y-1 hover:bg-blue-800"
                >
                  Book an appointment
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/doctors"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  Meet our doctors
                  <ArrowUpRight size={17} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-blue-100 pt-7">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <ShieldCheck size={18} className="text-teal-600" />
                  Privacy-minded experience
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <HeartPulse size={18} className="text-blue-700" />
                  Connected care journey
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mx-auto w-full max-w-[530px]">
              <div className="absolute -right-6 top-8 size-32 rounded-full border border-blue-200/80" />
              <div className="absolute -bottom-8 -left-8 size-40 rounded-full bg-teal-100/60 blur-2xl" />

              <div className="relative rounded-[36px] border border-white bg-white p-3 shadow-[0_30px_100px_-35px_rgba(30,64,175,0.35)]">
                <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-100 via-[#e8f2ff] to-teal-100 p-6 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800">
                      Your health, in focus
                    </span>

                    <span className="rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-teal-700 shadow-sm">
                      CarePoint
                    </span>
                  </div>

                  <div className="relative my-10 flex min-h-[280px] items-center justify-center">
                    <div className="absolute size-[260px] rounded-full border border-white/80" />
                    <div className="absolute size-[210px] rounded-full border border-white/90" />
                    <div className="absolute size-[155px] rounded-full border border-white/90" />

                    <div className="relative flex size-36 items-center justify-center rounded-[38px] bg-blue-700 text-white shadow-2xl shadow-blue-900/30">
                      <Activity size={82} strokeWidth={1.5} />
                    </div>

                    <div className="absolute right-2 top-10 flex size-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-lg">
                      <HeartPulse size={26} />
                    </div>

                    <div className="absolute bottom-4 left-4 flex size-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-lg">
                      <ShieldCheck size={25} />
                    </div>

                    <div className="absolute left-5 top-8 flex size-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-md">
                      <Stethoscope size={21} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          A connected experience
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          Care, made clearer.
                        </p>
                      </div>

                      <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <ArrowUpRight size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <CheckCircle2 size={23} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Designed with care
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Clarity at every step
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK HIGHLIGHTS */}
        <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className={`flex items-center gap-4 p-6 sm:p-7 ${
                  index !== 0 ? "border-t border-slate-100 sm:border-l sm:border-t-0" : ""
                }`}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEPARTMENTS */}
        <section
          id="departments"
          className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Explore our specialties
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Care for every chapter of life.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Explore our medical departments and find the care options
                available through the CarePoint platform.
              </p>
            </div>

            <Link
              href="/departments"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3 hover:text-blue-900"
            >
              Explore all departments
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map(({ name, detail, icon: Icon, tint, number }) => (
              <Link
                key={name}
                href="/departments"
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="absolute -right-10 -top-10 size-32 rounded-full bg-blue-50/60 opacity-0 transition group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-14 items-center justify-center rounded-2xl ${tint}`}
                    >
                      <Icon size={27} />
                    </span>

                    <span className="text-xs font-bold tracking-widest text-slate-300">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-bold text-slate-900">
                    {name}
                  </h3>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                    {detail}
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-blue-700">
                    Explore department
                    <MoveRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CAREPOINT DIFFERENCE */}
        <section className="bg-[#f5f8ff] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                The CarePoint difference
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                A better experience starts with the details.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                We bring essential healthcare information and appointment
                management together in one convenient platform.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map(({ title, text, icon: Icon, number }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Icon size={26} />
                    </span>

                    <span className="text-xs font-extrabold tracking-widest text-slate-300">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[32px] bg-[#102f62] px-7 py-14 text-white shadow-2xl shadow-blue-900/10 sm:px-12 md:px-16 md:py-16">
            <div className="pointer-events-none absolute -right-20 -top-32 size-96 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-5 -top-16 size-64 rounded-full border border-white/10" />

            <div className="relative flex flex-col justify-between gap-10 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-200">
                  Your next step
                </p>

                <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  Make your healthcare journey feel more connected.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                  Explore departments, meet our doctors and submit an
                  appointment request through CarePoint.
                </p>
              </div>

              <Link
                href="/appointments"
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Get started
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Portfolio Disclaimer */}
      <div className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50/95 px-4 py-2 text-center text-[11px] font-medium text-amber-900 shadow-lg backdrop-blur">
        Portfolio demo only · Not a real healthcare provider · No real
        appointments or medical services
      </div>
    </>
  );
}
