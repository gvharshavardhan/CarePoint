
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Stethoscope,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";

type DoctorsPageProps = {
  searchParams: Promise<{
    department?: string;
  }>;
};

export default async function DoctorsPage({
  searchParams,
}: DoctorsPageProps) {
  const { department: departmentId } = await searchParams;

  const supabase = await createClient();

  // Fetch all active departments
  const { data: departmentsData } = await supabase
    .from("departments")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const departments = departmentsData ?? [];

  // Find selected department
  const selectedDepartment = departmentId
    ? departments.find((department) => department.id === departmentId)
    : null;

  // Fetch active doctors and apply department filter when selected
  let doctorsQuery = supabase
    .from("doctors")
    .select(
      "id, full_name, qualification, specialization, bio, image_url, department_id"
    )
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (departmentId) {
    doctorsQuery = doctorsQuery.eq("department_id", departmentId);
  }

  const { data: doctors, error } = await doctorsQuery;

  const doctorList = doctors ?? [];

  // Department name helper
  const getDepartmentName = (id: string) =>
    departments.find((department) => department.id === id)?.name ??
    "Medical Department";

  // Doctor initials helper
  const getInitials = (name: string) =>
    name
      .replace(/^Dr\.?\s*/i, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

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
                <Stethoscope size={16} />
                Our healthcare specialists
              </span>

              <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {selectedDepartment
                  ? `Our ${selectedDepartment.name} specialists`
                  : "Meet the people behind your care."}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                {selectedDepartment
                  ? `Explore doctors available in our ${selectedDepartment.name} department and find the right specialist for your healthcare journey.`
                  : "Explore our medical team, discover their specialties and find the right doctor for your healthcare journey."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Book an appointment
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/departments"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore departments
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-7">
              <div>
                <p className="text-3xl font-extrabold">
                  {doctorList.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs text-blue-100">
                  {selectedDepartment ? "Doctors in department" : "Active doctors"}
                </p>
              </div>

              <div className="border-l border-white/20 pl-8">
                <p className="text-3xl font-extrabold">
                  {departments.length.toString().padStart(2, "0")}
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
            </div>
          </div>
        </section>

        {/* DOCTOR LISTING */}
        <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                  Expert medical team
                </p>

                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  {selectedDepartment
                    ? `Doctors in ${selectedDepartment.name}`
                    : "Find the right specialist."}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                  {selectedDepartment
                    ? `Meet our ${selectedDepartment.name} doctors and explore their qualifications and specialties.`
                    : "Get to know our doctors and explore the specialties available through CarePoint."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Users size={18} />
                  {doctorList.length} doctors available
                </span>

                {departmentId && (
                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    View All Doctors
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>

            {selectedDepartment && (
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <Stethoscope size={16} />
                Showing: {selectedDepartment.name}
              </div>
            )}

            {departmentId && !selectedDepartment ? (
              <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                <p className="font-semibold text-amber-800">
                  Department not found or inactive.
                </p>
                <p className="mt-2 text-sm text-amber-700">
                  Please select an active department.
                </p>
                <Link
                  href="/departments"
                  className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                >
                  Browse departments
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : error ? (
              <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="font-semibold text-red-700">
                  Unable to load doctors.
                </p>
                <p className="mt-2 text-sm text-red-600">
                  Please refresh the page and try again.
                </p>
              </div>
            ) : doctorList.length === 0 ? (
              <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-12 text-center">
                <UserRound
                  size={38}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {selectedDepartment
                    ? `No active doctors in ${selectedDepartment.name}`
                    : "No active doctors available"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {selectedDepartment
                    ? "Please explore other departments or check again later."
                    : "Please check again later."}
                </p>

                {selectedDepartment && (
                  <Link
                    href="/doctors"
                    className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                  >
                    View all doctors
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {doctorList.map((doctor) => (
                  <article
                    key={doctor.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                  >
                    {/* Doctor Image */}
                    <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-slate-100 to-teal-50">
                      {doctor.image_url ? (
                        <img
                          src={doctor.image_url}
                          alt={doctor.full_name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-32 items-center justify-center rounded-full border-4 border-white bg-white text-4xl font-extrabold text-blue-700 shadow-lg">
                          {getInitials(doctor.full_name)}
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-blue-700 shadow-sm backdrop-blur">
                        {getDepartmentName(doctor.department_id)}
                      </span>

                      <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-lg">
                        <Stethoscope size={19} />
                      </span>
                    </div>

                    {/* Doctor Information */}
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        {doctor.specialization || "Medical Specialist"}
                      </p>

                      <h3 className="mt-2 text-lg font-extrabold text-slate-950">
                        {doctor.full_name}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {doctor.qualification || "Qualification not listed"}
                      </p>

                      <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">
                        {doctor.bio ||
                          `Explore ${doctor.full_name}'s medical specialty and appointment availability.`}
                      </p>

                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <Link
                          href={`/appointments?doctor=${doctor.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-700/10 transition hover:bg-blue-800"
                        >
                          <CalendarDays size={17} />
                          Book an appointment
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="bg-white px-5 pb-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 rounded-3xl border border-blue-100 bg-blue-50 px-7 py-10 sm:px-12 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700">
                <ShieldCheck size={16} />
                Need assistance?
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-slate-950">
                Need help choosing a doctor?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Contact our team for guidance on finding the right
                department and specialist.
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
