
import Link from "next/link";
import {
  FileText,
  UserCheck,
  CalendarCheck,
  ShieldCheck,
  AlertCircle,
  Scale,
  ArrowRight,
  Info,
  Mail,
  BookOpen,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const terms = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    subtitle: "Using the CarePoint platform",
    content:
      "By accessing and using the CarePoint demonstration website, you agree to these terms. If you do not agree, please discontinue using the demo.",
  },
  {
    id: "appointments",
    icon: CalendarCheck,
    title: "2. Appointment Requests",
    subtitle: "Understanding appointment functionality",
    content:
      "The appointment booking feature is provided for demonstration purposes. Submitting a form does not create a real appointment or guarantee a consultation.",
  },
  {
    id: "responsibilities",
    icon: UserCheck,
    title: "3. User Responsibilities",
    subtitle: "Safe use of the demonstration",
    content:
      "Users should provide fictional information when exploring this project. Do not submit real patient details, medical records or sensitive personal information.",
  },
  {
    id: "medical",
    icon: AlertCircle,
    title: "4. Medical Disclaimer",
    subtitle: "Important healthcare information",
    content:
      "CarePoint is not a real healthcare provider. The website does not provide medical advice, diagnosis or treatment. Always consult a qualified healthcare professional for medical concerns.",
  },
  {
    id: "liability",
    icon: Scale,
    title: "5. Limitation of Liability",
    subtitle: "Demonstration project limitations",
    content:
      "This project is provided as a demonstration without warranties. It must not be used as a substitute for professional healthcare services or relied upon for real medical decisions.",
  },
  {
    id: "changes",
    icon: ShieldCheck,
    title: "6. Changes to These Terms",
    subtitle: "Updates to this page",
    content:
      "These demonstration terms may be updated as the CarePoint project develops. Users should review this page for the latest version.",
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#102f62] via-[#1649a5] to-[#155eef] px-5 py-20 text-white sm:py-24">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur">
              <FileText size={34} />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              CarePoint Guidelines
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              Understand the terms that apply when exploring and using
              the CarePoint demonstration platform.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-blue-50">
              <BookOpen size={16} />
              User Guidelines & Platform Information
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          {/* Important Demo Notice */}
          <div className="mb-12 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Info size={28} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Important Demo Notice
                </span>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Please read before using CarePoint
                </h2>

                <p className="mt-3 text-sm leading-8 text-slate-600">
                  CarePoint is a fictional portfolio project. These terms
                  are provided for demonstration purposes and are not a
                  substitute for legally reviewed terms for a production
                  healthcare service.
                </p>
              </div>
            </div>
          </div>

          {/* Section Heading */}
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Platform Guidelines
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Terms of Use
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Please review the following six sections before exploring
              the demonstration platform.
            </p>
          </div>

          {/* Terms Cards */}
          <div className="grid gap-5">
            {terms.map((term) => {
              const Icon = term.icon;

              return (
                <article
                  key={term.id}
                  id={term.id}
                  className="group scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        User Agreement
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {term.title}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {term.subtitle}
                      </p>

                      <p className="mt-4 text-sm leading-8 text-slate-600">
                        {term.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-[#102f62] to-[#155eef] p-8 text-white shadow-xl sm:p-10">
            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />

            <div className="relative flex flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
              <div className="max-w-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Mail size={25} />
                </div>

                <h2 className="text-2xl font-bold">
                  Need help understanding our terms?
                </h2>

                <p className="mt-3 text-sm leading-7 text-blue-100">
                  If you have questions about using this demonstration
                  website, please contact us.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-blue-800 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                <Mail size={18} />
                Contact Us
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Related Page */}
          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <ShieldCheck className="mt-1 shrink-0 text-blue-700" size={24} />

            <div>
              <h3 className="font-bold text-slate-900">
                Your privacy matters too
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                Learn about the information-handling guidelines of the
                CarePoint demonstration platform.
              </p>

              <Link
                href="/privacy"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                Read Privacy Policy
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
