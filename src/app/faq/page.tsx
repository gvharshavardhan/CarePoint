
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
  ShieldCheck,
  CalendarCheck,
  Stethoscope,
  UserRound,
  Mail,
  ArrowRight,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const faqs = [
  {
    category: "Getting Started",
    icon: Stethoscope,
    question: "What is CarePoint?",
    answer:
      "CarePoint is a fictional digital healthcare platform created for portfolio and demonstration purposes. It helps users explore departments, discover doctors and experience appointment request workflows.",
  },
  {
    category: "Getting Started",
    icon: Stethoscope,
    question: "How can I explore medical departments?",
    answer:
      "Visit the Departments page from the navigation menu. You can explore different medical specialties and learn about the services represented in this demo.",
  },
  {
    category: "Doctors & Appointments",
    icon: CalendarCheck,
    question: "How can I find a doctor?",
    answer:
      "Open the Our Doctors page to explore fictional doctor profiles, qualifications and specializations.",
  },
  {
    category: "Doctors & Appointments",
    icon: CalendarCheck,
    question: "How do I request an appointment?",
    answer:
      "Visit the Book a Visit page, select a department and doctor, choose a preferred date and time, and enter the requested details.",
  },
  {
    category: "Doctors & Appointments",
    icon: CalendarCheck,
    question: "Is my appointment request sent to a real hospital?",
    answer:
      "No. CarePoint is a portfolio demonstration. Appointment requests are simulated and are not sent to a real hospital or healthcare provider.",
  },
  {
    category: "Account & Support",
    icon: UserRound,
    question: "Can I register as a patient?",
    answer:
      "The platform includes a patient portal concept. Patient registration and account features are part of the application's demonstration workflow.",
  },
  {
    category: "Account & Support",
    icon: UserRound,
    question: "Can I contact CarePoint?",
    answer:
      "You can use the Contact Us page to try the demo contact form. It displays a confirmation message but does not send a real email.",
  },
  {
    category: "Privacy & Safety",
    icon: ShieldCheck,
    question: "Does CarePoint provide medical advice?",
    answer:
      "No. CarePoint is not a medical service and does not provide diagnosis, prescriptions, treatment or emergency medical assistance.",
  },
];

const categories = [
  "All Questions",
  "Getting Started",
  "Doctors & Appointments",
  "Account & Support",
  "Privacy & Safety",
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All Questions" ||
      faq.category === activeCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#102f62] via-[#1649a5] to-[#155eef] px-5 py-20 text-white sm:py-24">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur">
              <HelpCircle size={32} />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              CarePoint Help Center
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              How can we help you?
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              Find quick answers about departments, doctors, appointments
              and your CarePoint account.
            </p>

            <div className="mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-2xl border border-white/20 bg-white px-4 py-3 shadow-xl">
              <Search className="shrink-0 text-slate-400" size={21} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(null);
                }}
                placeholder="Search your question..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search frequently asked questions"
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Knowledge Center
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-3 text-slate-500">
              Browse topics or select a question to see its answer.
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setOpenIndex(null);
                }}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-4xl">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  const Icon = faq.icon;

                  return (
                    <div
                      key={faq.question}
                      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                        isOpen
                          ? "border-blue-200 shadow-lg shadow-blue-100/60"
                          : "border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenIndex(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                            isOpen
                              ? "bg-blue-700 text-white"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <Icon size={21} />
                        </span>

                        <span className="flex-1">
                          <span className="block text-xs font-semibold uppercase tracking-wider text-blue-600">
                            {faq.category}
                          </span>
                          <span className="mt-1 block font-bold text-slate-900">
                            {faq.question}
                          </span>
                        </span>

                        <ChevronDown
                          size={21}
                          className={`shrink-0 text-blue-700 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:pl-24 sm:pr-8">
                          <p className="text-sm leading-8 text-slate-600">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                <Search className="mx-auto text-slate-400" size={35} />
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No questions found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try another search term or choose a different category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All Questions");
                    setOpenIndex(0);
                  }}
                  className="mt-5 font-semibold text-blue-700 hover:text-blue-900"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-[#102f62] to-[#155eef] p-8 text-white shadow-xl sm:p-12">
            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />

            <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
              <div className="max-w-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <MessageCircle size={25} />
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Still have questions?
                </h2>

                <p className="mt-3 leading-7 text-blue-100">
                  Visit our Contact Us page to try the CarePoint demo
                  contact form.
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

          {/* Demo Disclaimer */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={21} />
            <p className="text-sm leading-7 text-amber-900">
              <strong>Demo notice:</strong> CarePoint is a fictional
              portfolio project. It does not provide medical advice or
              real-world healthcare services.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
