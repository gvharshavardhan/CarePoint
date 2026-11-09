
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  Eye,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Stethoscope,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const values = [
  {
    icon: HeartPulse,
    number: "01",
    title: "Patient First",
    description:
      "We design every experience around patient convenience, accessibility and care.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Trust & Safety",
    description:
      "We value responsible technology, privacy and transparent communication.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Users,
    number: "03",
    title: "Accessibility",
    description:
      "We aim to make healthcare information and appointment workflows easier to access.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Award,
    number: "04",
    title: "Excellence",
    description:
      "We focus on quality, continuous improvement and a better digital experience.",
    color: "bg-amber-50 text-amber-700",
  },
];

const approachItems = [
  "Explore medical departments in one place.",
  "Discover doctor profiles and specialties.",
  "Submit and manage appointment requests.",
  "Access an organized patient experience.",
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#102f62] via-[#1649a5] to-[#155eef] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-14 size-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 size-80 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-50 backdrop-blur">
                <HeartPulse size={16} />
                About the CarePoint platform
              </span>

              <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Making healthcare{" "}
                <span className="text-blue-200">simpler and smarter.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                A thoughtful digital healthcare platform concept that
                connects medical departments, doctor discovery and
                appointment management in one convenient experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/departments"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Explore departments
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Meet our doctors
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-7">
              <div>
                <p className="text-3xl font-extrabold">Care</p>
                <p className="mt-1 text-xs text-blue-100">
                  People-first approach
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-3xl font-extrabold">Connect</p>
                <p className="mt-1 text-xs text-blue-100">
                  Organized experience
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-3xl font-extrabold">Clarity</p>
                <p className="mt-1 text-xs text-blue-100">
                  Simple information
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Who we are
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                A better digital experience for healthcare.
              </h2>

              <p className="mt-6 text-sm leading-8 text-slate-600 sm:text-base">
                CarePoint brings together a clean and accessible interface
                for exploring healthcare departments, viewing doctor
                profiles and requesting appointments through one platform.
              </p>

              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Our goal is to demonstrate how thoughtful technology and
                user-friendly design can make healthcare-related digital
                interactions more convenient.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Simple and accessible navigation",
                  "Organized doctor and department information",
                  "Connected appointment workflows",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-teal-600"
                    />
                    <p className="text-sm font-semibold text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-blue-100/70 blur-2xl" />

              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 p-8 text-white sm:p-12">
                <div className="absolute -right-16 -top-16 size-64 rounded-full border border-white/10" />
                <div className="absolute -right-5 -top-5 size-40 rounded-full border border-white/10" />

                <div className="relative flex min-h-[330px] flex-col justify-between">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <Activity size={36} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                      Thoughtful technology
                    </p>

                    <h3 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                      Care made clearer.
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-7 text-blue-100">
                      Bringing important healthcare information and
                      appointment interactions together through one
                      connected platform.
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-5">
                    <HeartPulse size={22} className="text-blue-200" />
                    <span className="text-sm font-semibold">
                      Introducing CarePoint
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION AND VISION */}
        <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Our purpose
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                What drives CarePoint.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                Our mission and vision guide the experience we aim to
                create through this platform.
              </p>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-2">
              <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  <Target size={29} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-widest text-blue-700">
                  Our Mission
                </p>

                <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                  Making access simpler.
                </h3>

                <p className="mt-4 text-sm leading-8 text-slate-600">
                  To create a simple, accessible and user-friendly digital
                  healthcare experience that helps users explore
                  departments, discover doctors and manage appointment
                  requests conveniently.
                </p>
              </article>

              <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
                  <Eye size={29} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-widest text-teal-700">
                  Our Vision
                </p>

                <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                  A connected experience.
                </h3>

                <p className="mt-4 text-sm leading-8 text-slate-600">
                  To demonstrate a connected digital platform where
                  healthcare information, patient interactions and
                  appointment workflows are organized in a convenient
                  and transparent way.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                What matters to us
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Our core values.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                The principles that guide the CarePoint platform
                experience and design.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    key={value.title}
                    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex size-14 items-center justify-center rounded-2xl ${value.color}`}
                      >
                        <Icon size={26} />
                      </div>

                      <span className="text-xs font-extrabold tracking-widest text-slate-300">
                        {value.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-lg font-extrabold text-slate-950">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {value.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* OUR APPROACH */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#102f62] to-[#155eef] px-5 py-20 text-white sm:px-8 lg:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-white/10" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-200">
                Our approach
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Technology with a human touch.
              </h2>

              <p className="mt-5 text-sm leading-8 text-blue-100 sm:text-base">
                We believe digital platforms should make everyday tasks
                easier. CarePoint focuses on clear information, simple
                navigation, accessible design and organized appointment
                workflows.
              </p>

              <Link
                href="/doctors"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-900 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Discover our doctors
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur sm:p-9">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles size={28} />
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                A connected platform experience
              </h3>

              <div className="mt-7 space-y-5">
                {approachItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-cyan-200"
                    />
                    <p className="text-sm leading-6 text-blue-50">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APPOINTMENT CTA */}
        <section className="bg-white px-5 py-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-3xl border border-blue-100 bg-blue-50 px-7 py-10 sm:px-12 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700">
                <CalendarDays size={16} />
                Your next step
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Explore the CarePoint experience.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Discover medical specialties and doctor profiles or
                explore the appointment request process.
              </p>
            </div>

            <Link
              href="/appointments"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-1 hover:bg-blue-800"
            >
              Explore appointments
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>

        {/* PROJECT DISCLAIMER */}
        <section className="px-5 pb-12 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <ShieldCheck size={20} className="mt-0.5 shrink-0" />
            <p>
              <strong>Project demonstration:</strong> CarePoint is a
              fictional portfolio project. It is not a real hospital or
              healthcare provider and does not offer medical services or
              clinical care.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
