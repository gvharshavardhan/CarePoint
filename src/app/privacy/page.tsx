
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  ArrowRight,
  FileText,
  Mail,
  Info,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const sections = [
  {
    id: "information",
    icon: Eye,
    title: "1. Information We Collect",
    description: "Information provided through the platform",
    content:
      "This demonstration may use information entered into forms, such as name, email address and appointment preferences. This is fictional demo functionality.",
  },
  {
    id: "usage",
    icon: Database,
    title: "2. How Information Is Used",
    description: "Understanding how information is used",
    content:
      "Information entered into the platform is intended to demonstrate features such as appointment requests and user account workflows. Do not enter real medical or sensitive personal information.",
  },
  {
    id: "security",
    icon: Lock,
    title: "3. Data Security",
    description: "Our approach to application security",
    content:
      "The project is designed to demonstrate privacy-conscious application architecture. No production healthcare security or compliance certification is claimed.",
  },
  {
    id: "responsibilities",
    icon: UserCheck,
    title: "4. User Responsibilities",
    description: "Safe use of the demonstration platform",
    content:
      "Users should provide only fictional information when testing this portfolio application and should not submit passwords, medical records or other sensitive personal data.",
  },
  {
    id: "third-party",
    icon: ShieldCheck,
    title: "5. Third-Party Services",
    description: "Development tools and infrastructure",
    content:
      "The application may use development tools and infrastructure services during development. This demo does not represent a live healthcare provider.",
  },
];

export default function PrivacyPage() {
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
              <ShieldCheck size={34} />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              CarePoint Privacy Center
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              Transparency matters. Understand how information is handled
              within the CarePoint demonstration platform.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-blue-50">
              <Lock size={16} />
              Privacy & Information Guidelines
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          {/* Demo Notice */}
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
                  CarePoint is a fictional portfolio project, not a real
                  healthcare provider. This page is a demonstration privacy
                  notice, not a legally reviewed privacy policy. Do not
                  submit real patient information.
                </p>
              </div>
            </div>
          </div>

          {/* Section Heading */}
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Information & Guidelines
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Our Privacy Guidelines
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Explore the key areas of our demonstration privacy notice.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="grid gap-5">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="group scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Privacy Guideline
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {section.title}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {section.description}
                      </p>

                      <p className="mt-4 text-sm leading-8 text-slate-600">
                        {section.content}
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
                  Questions about this policy?
                </h2>

                <p className="mt-3 text-sm leading-7 text-blue-100">
                  You can visit our Contact Us page for questions about
                  the CarePoint demonstration.
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

          {/* Footer Information */}
          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <FileText className="mt-1 shrink-0 text-blue-700" size={23} />

            <div>
              <h3 className="font-bold text-slate-900">
                About this privacy notice
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                This page describes the intended demonstration use of
                CarePoint. It does not establish a legal privacy agreement
                or claim production healthcare compliance.
              </p>

              <Link
                href="/terms"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                Read Terms & Conditions
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

