
"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Stethoscope,
  UserRound,
  Building2,
  ShieldCheck,
  HeartPulse,
  ClipboardList,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Department = {
  id: string;
  name: string;
};

type Doctor = {
  id: string;
  department_id: string;
  full_name: string;
  specialization: string;
};

type Availability = {
  start_time: string;
  end_time: string;
  slot_minutes: number;
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateTimeSlots(availability: Availability[]) {
  const slots: string[] = [];

  availability.forEach((schedule) => {
    const [startHour, startMinute] = schedule.start_time
      .slice(0, 5)
      .split(":")
      .map(Number);

    const [endHour, endMinute] = schedule.end_time
      .slice(0, 5)
      .split(":")
      .map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    const duration = schedule.slot_minutes;

    for (
      let time = start;
      time + duration <= end;
      time += duration
    ) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;

      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      );
    }
  });

  return [...new Set(slots)].sort();
}

function formatTime(time: string) {
  if (!time) return "";

  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

export default function AppointmentBookingForm() {
  const supabase = useMemo(() => createClient(), []);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [requestedDoctorId, setRequestedDoctorId] = useState("");

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);

  const [submittedDetails, setSubmittedDetails] = useState<{
    department: string;
    doctor: string;
    date: string;
    time: string;
  } | null>(null);

  const today = getTodayDate();

  // Read the doctor ID from the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const doctorFromUrl = params.get("doctor");

    if (doctorFromUrl) {
      setRequestedDoctorId(doctorFromUrl);
    }
  }, []);

  // Load active departments.
  useEffect(() => {
    async function loadDepartments() {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (error) {
        setError("Unable to load departments. Please refresh the page.");
      } else {
        setDepartments(data ?? []);
      }

      setLoadingDepartments(false);
    }

    loadDepartments();
  }, [supabase]);

  // Automatically find and select the doctor from the URL.
  // This waits until departments have finished loading.
  useEffect(() => {
    if (loadingDepartments || !requestedDoctorId) return;

    const doctorToLoad = requestedDoctorId;
    setRequestedDoctorId("");

    async function selectRequestedDoctor() {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, department_id")
        .eq("id", doctorToLoad)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !data) {
        setError("The selected doctor could not be found. Please select manually.");
        return;
      }

      const departmentExists = departments.some(
        (department) => department.id === data.department_id
      );

      if (!departmentExists) {
        setError("The selected doctor's department is unavailable.");
        return;
      }

      // Set both selections. The doctor list will load next.
      setDepartmentId(data.department_id);
      setDoctorId(data.id);
    }

    selectRequestedDoctor();
  }, [loadingDepartments, requestedDoctorId, departments, supabase]);

  // Load doctors whenever the selected department changes.
  useEffect(() => {
    let cancelled = false;

    async function loadDoctors() {
      if (!departmentId) {
        setDoctors([]);
        return;
      }

      setLoadingDoctors(true);

      const { data, error } = await supabase
        .from("doctors")
        .select("id, department_id, full_name, specialization")
        .eq("department_id", departmentId)
        .eq("is_active", true)
        .order("full_name");

      if (cancelled) return;

      if (error) {
        setError("Unable to load doctors. Please try again.");
        setDoctors([]);
      } else {
        setDoctors(data ?? []);
      }

      setLoadingDoctors(false);
    }

    loadDoctors();

    return () => {
      cancelled = true;
    };
  }, [departmentId, supabase]);

  // Load doctor's availability for the selected date.
  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      if (!doctorId || !appointmentDate) {
        setAvailability([]);
        return;
      }

      setLoadingSlots(true);

      const selectedDate = new Date(`${appointmentDate}T00:00:00`);
      const dayOfWeek = selectedDate.getDay();

      const { data, error } = await supabase
        .from("doctor_availability")
        .select("start_time, end_time, slot_minutes")
        .eq("doctor_id", doctorId)
        .eq("day_of_week", dayOfWeek)
        .eq("is_available", true)
        .order("start_time");

      if (cancelled) return;

      if (error) {
        setError("Unable to load available times. Please try again.");
        setAvailability([]);
      } else {
        setAvailability(data ?? []);
      }

      setLoadingSlots(false);
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [doctorId, appointmentDate, supabase]);

  const timeSlots = useMemo(() => {
    const slots = generateTimeSlots(availability);

    if (appointmentDate !== today) {
      return slots;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return slots.filter((slot) => {
      const [hour, minute] = slot.split(":").map(Number);
      return hour * 60 + minute > currentMinutes;
    });
  }, [availability, appointmentDate, today]);

  const selectedDepartment = departments.find(
    (department) => department.id === departmentId
  );

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === doctorId
  );

  function clearMessages() {
    setError("");
    setSuccess("");
    setLoginRequired(false);
    setSubmittedDetails(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();

    if (!departmentId || !doctorId || !appointmentDate || !appointmentTime) {
      setError("Please complete all required fields.");
      return;
    }

    if (appointmentDate < today) {
      setError("Please select today or a future date.");
      return;
    }

    if (reason.length > 500) {
      setError("Reason must not exceed 500 characters.");
      return;
    }

    if (!timeSlots.includes(appointmentTime)) {
      setError("This time slot is no longer available. Please select another.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setLoginRequired(true);
        setError("Please log in to submit your appointment request.");
        return;
      }

      const bookingDetails = {
        department: selectedDepartment?.name ?? "",
        doctor: selectedDoctor?.full_name ?? "",
        date: appointmentDate,
        time: appointmentTime,
      };

      const { data: newAppointment, error: insertError } = await supabase
        .from("appointments")
        .insert({
          patient_id: user.id,
          doctor_id: doctorId,
          department_id: departmentId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason: reason.trim(),
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError || !newAppointment) {
        if (insertError?.code === "23505") {
          setError(
            "This doctor has already been booked for that time. Please select another slot."
          );
        } else if (insertError?.code === "42501") {
          setError(
            "Your appointment could not be submitted because of a database permission restriction. Please contact support."
          );
        } else {
          console.error("Appointment submission error:", insertError);
          setError("Unable to submit your appointment. Please try again.");
        }

        return;
      }

      // Ask the database to create a trusted notification for this appointment.
      // The database function verifies that the signed-in patient owns the appointment.
      const { error: notificationError } = await supabase.rpc(
        "create_appointment_submission_notification",
        {
          p_appointment_id: newAppointment.id,
        }
      );

      setSubmittedDetails(bookingDetails);

      if (notificationError) {
        console.error("Notification creation error:", notificationError);
        setSuccess(
          "Your appointment request was submitted successfully and is pending confirmation. However, we couldn't create its notification."
        );
      } else {
        setSuccess(
          "Your appointment request has been successfully submitted and is pending confirmation."
        );
      }

      setAppointmentTime("");
      setReason("");
    } catch (err) {
      console.error("Unexpected appointment error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#102f62] via-[#1649a5] to-[#155eef] px-5 py-16 text-white sm:py-20">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="grid items-center gap-10 md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-cyan-100">
                <CalendarDays size={17} />
                Online Appointment Booking
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Book your visit with confidence.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
                Choose your department, find the right doctor and select
                a convenient appointment time.
              </p>

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-cyan-300" />
                  Easy booking
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-cyan-300" />
                  Patient portal
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-cyan-300" />
                  Available time slots
                </span>
              </div>
            </div>

            <div className="hidden justify-center md:flex">
              <div className="flex h-52 w-52 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white text-blue-700 shadow-xl">
                  <HeartPulse size={76} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Get Started
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Schedule an Appointment
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Complete the following steps to submit your appointment request.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          {/* Booking Form */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-100/40">
            <div className="border-b border-slate-100 bg-white px-6 py-6 sm:px-9">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarDays size={25} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Appointment Details
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Fields marked with * are required.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-9">
              {/* Messages */}
              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700"
                >
                  <div className="flex items-start gap-2">
                    <Info className="mt-1 shrink-0" size={18} />
                    <div>
                      {error}

                      {loginRequired && (
                        <p className="mt-2">
                          <Link href="/login" className="font-bold underline">
                            Log in to continue
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={22} />
                    Appointment request submitted!
                  </div>

                  <p className="mt-2 text-sm leading-7">{success}</p>

                  {submittedDetails && (
                    <div className="mt-4 space-y-2 rounded-xl bg-white/80 p-4 text-sm">
                      <p>
                        <strong>Department:</strong>{" "}
                        {submittedDetails.department}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {submittedDetails.doctor}
                      </p>
                      <p>
                        <strong>Date:</strong> {submittedDetails.date}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {formatTime(submittedDetails.time)}
                      </p>
                    </div>
                  )}

                  <Link
                    href="/patient/appointments"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline"
                  >
                    View My Appointments
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}

              {/* Step 1 */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    01
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Select Department
                    </h4>
                    <p className="text-xs text-slate-500">
                      Choose the medical specialty.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Medical Department *
                </label>

                <div className="relative">
                  <Building2
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    size={19}
                  />

                  <select
                    id="department"
                    value={departmentId}
                    onChange={(event) => {
                      setDepartmentId(event.target.value);
                      setDoctorId("");
                      setAppointmentDate("");
                      setAppointmentTime("");
                      clearMessages();
                    }}
                    required
                    disabled={loadingDepartments}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  >
                    <option value="">
                      {loadingDepartments
                        ? "Loading departments..."
                        : "Choose a department"}
                    </option>

                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Step 2 */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    02
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Choose Your Doctor
                    </h4>
                    <p className="text-xs text-slate-500">
                      Select a doctor from the chosen department.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="doctor"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Available Doctors *
                </label>

                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    size={19}
                  />

                  <select
                    id="doctor"
                    value={doctorId}
                    onChange={(event) => {
                      setDoctorId(event.target.value);
                      setAppointmentDate("");
                      setAppointmentTime("");
                      clearMessages();
                    }}
                    disabled={!departmentId || loadingDoctors}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  >
                    <option value="">
                      {!departmentId
                        ? "Select a department first"
                        : loadingDoctors
                          ? "Loading doctors..."
                          : doctors.length === 0
                            ? "No doctors available"
                            : "Choose a doctor"}
                    </option>

                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.full_name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Step 3 */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    03
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Select Date & Time
                    </h4>
                    <p className="text-xs text-slate-500">
                      Choose an available appointment slot.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="appointmentDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Preferred Appointment Date *
                </label>

                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    size={19}
                  />

                  <input
                    id="appointmentDate"
                    type="date"
                    min={today}
                    value={appointmentDate}
                    onChange={(event) => {
                      setAppointmentDate(event.target.value);
                      setAppointmentTime("");
                      clearMessages();
                    }}
                    required
                    disabled={!doctorId}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  />
                </div>

                <div className="mb-3 mt-6 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock size={18} className="text-blue-700" />
                    Available Time Slots *
                  </label>

                  {timeSlots.length > 0 && (
                    <span className="text-xs font-medium text-emerald-700">
                      {timeSlots.length} slots available
                    </span>
                  )}
                </div>

                {!doctorId || !appointmentDate ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center">
                    <CalendarDays
                      className="mx-auto text-slate-400"
                      size={27}
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      Select a doctor and date to see available times.
                    </p>
                  </div>
                ) : loadingSlots ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-7 text-center text-sm text-slate-500">
                    Loading available times...
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center">
                    <Clock className="mx-auto text-amber-600" size={25} />
                    <p className="mt-3 text-sm font-semibold text-amber-900">
                      No available times for this date.
                    </p>
                    <p className="mt-1 text-xs text-amber-800">
                      Please choose another date.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {timeSlots.map((slot) => {
                      const isSelected = appointmentTime === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setAppointmentTime(slot);
                            clearMessages();
                          }}
                          aria-pressed={isSelected}
                          className={`rounded-xl border px-3 py-3.5 text-sm font-semibold transition-all duration-200 ${
                            isSelected
                              ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-200"
                              : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {formatTime(slot)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100" />

              {/* Step 4 */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    04
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Additional Information
                    </h4>
                    <p className="text-xs text-slate-500">
                      Tell us briefly about your visit.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Reason for Visit
                </label>

                <textarea
                  id="reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Briefly describe the reason for your visit..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {reason.length}/500 characters
                </p>
              </div>

              {/* Submit */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <Info
                    className="mt-0.5 shrink-0 text-blue-700"
                    size={20}
                  />
                  <p className="text-xs leading-6 text-slate-600">
                    Your appointment request will be submitted with pending
                    status. You can track its status from your patient
                    dashboard.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!appointmentTime || submitting || loadingSlots}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Stethoscope size={19} />
                {submitting
                  ? "Submitting appointment..."
                  : "Submit Appointment Request"}
                {!submitting && <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-[#102f62] to-[#155eef] p-6 text-white">
                <div className="flex items-center gap-3">
                  <ClipboardList size={23} />
                  <h3 className="text-lg font-bold">Booking Summary</h3>
                </div>
                <p className="mt-2 text-sm text-blue-100">
                  Your selected appointment details.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Department
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedDepartment?.name || "Not selected"}
                  </p>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Doctor
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedDoctor?.full_name || "Not selected"}
                  </p>
                  {selectedDoctor && (
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedDoctor.specialization}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Appointment Date
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {appointmentDate || "Not selected"}
                  </p>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Appointment Time
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {appointmentTime
                      ? formatTime(appointmentTime)
                      : "Not selected"}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Clock size={17} />
                    <span className="text-sm font-bold">
                      Pending Confirmation
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-amber-800">
                    Your appointment request will remain pending until
                    confirmed by the administrator.
                  </p>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <HeartPulse size={23} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                Need assistance?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                If you have questions about using the appointment
                demonstration, visit our contact page.
              </p>

              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
              >
                Contact Us
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={21} />
          <p className="text-sm leading-7 text-amber-900">
            <strong>Demo notice:</strong> CarePoint is a fictional portfolio
            project. Appointment requests are for demonstration purposes
            and do not represent real hospital bookings or medical services.
          </p>
        </div>
      </section>
    </div>
  );
}
