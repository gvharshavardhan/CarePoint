
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/client";

const contactDetails = [
  {
    icon: MapPin,
    title: "Location",
    detail: "CarePoint Digital Healthcare Demo",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@carepoint.demo",
    color: "bg-teal-50 text-teal-700",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "Demo contact information only",
    color: "bg-violet-50 text-violet-700",
  },
  {
    icon: Clock,
    title: "Support hours",
    detail: "Monday – Friday, 9:00 AM – 5:00 PM",
    color: "bg-amber-50 text-amber-700",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(false);
    setErrorMessage("");
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setErrorMessage("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          subject,
          message,
        });

      if (error) {
        console.error("Contact form submission failed:", error.message);
        setErrorMessage(
          "Unable to submit your message. Please try again."
        );
        return;
      }

      form.reset();
      setSubmitted(true);
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMessage(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

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
                <MessageCircle size={16} />
                Get in touch with CarePoint
              </span>

              <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Let's start a{" "}
                <span className="text-blue-200">conversation.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                Have a question about our platform? We'd love to hear from
                you. Send us a message and explore how CarePoint works.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Send us a message
                  <ArrowRight size={17} />
                </a>

                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Visit FAQs
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-7">
              <div>
                <p className="text-2xl font-extrabold">Connect</p>
                <p className="mt-1 text-xs text-blue-100">
                  Get in touch
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-2xl font-extrabold">Support</p>
                <p className="mt-1 text-xs text-blue-100">
                  Platform assistance
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-2xl font-extrabold">Care</p>
                <p className="mt-1 text-xs text-blue-100">
                  People-first experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CONTENT */}
        <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">

            {/* CONTACT INFORMATION */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Contact information
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                We'd love to hear from you.
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                Reach out to us for general enquiries, platform information
                or assistance with your CarePoint demo experience.
              </p>

              <div className="mt-9 space-y-4">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
                    >
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 break-words text-sm text-slate-500">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PLATFORM INFORMATION */}
              <div className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#102f62] to-[#155eef] p-7 text-white shadow-xl shadow-blue-900/10">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-white/15">
                    <Activity size={27} />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold">CarePoint</h3>
                    <p className="text-xs text-blue-100">
                      Digital Healthcare Platform
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-blue-100">
                  A fictional healthcare technology platform created for
                  demonstration and portfolio purposes. It does not
                  provide real medical services.
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-semibold text-blue-100">
                  <ShieldCheck size={17} />
                  Portfolio demonstration
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div
              id="contact-form"
              className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9 lg:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                    Send an enquiry
                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                    Send us a message.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    Fill in the details below to submit an enquiry.
                  </p>
                </div>

                <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 sm:flex">
                  <Send size={23} />
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              {submitted && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-7 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-bold">
                      Message submitted successfully!
                    </p>

                    <p className="mt-1 text-xs leading-6">
                      Thank you for contacting CarePoint. Your message
                      has been saved successfully.
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email address <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    maxLength={254}
                    autoComplete="email"
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is your enquiry about?"
                    required
                    maxLength={150}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Your message <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    required
                    maxLength={2000}
                    disabled={submitting}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Send message"}
                  <Send size={18} />
                </button>

                <p className="text-center text-xs leading-6 text-slate-400">
                  Your enquiry will be securely stored in the CarePoint
                  database for administrator review.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-white px-5 pb-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-3xl border border-blue-100 bg-blue-50 px-7 py-9 sm:px-12 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Looking for something specific?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Explore our frequently asked questions and learn more
                about the CarePoint platform.
              </p>
            </div>

            <Link
              href="/faq"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-1 hover:bg-blue-800"
            >
              Visit FAQs
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
