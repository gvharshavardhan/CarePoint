
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";

async function updateAppointmentStatus(formData: FormData) {
  "use server";

  const appointmentId = formData.get("appointmentId");
  const newStatus = formData.get("status");

  if (
    typeof appointmentId !== "string" ||
    !["confirmed", "cancelled"].includes(String(newStatus))
  ) {
    return;
  }

  const { supabase } = await requireRole("admin");

  const allowedStatuses =
    newStatus === "confirmed" ? ["pending"] : ["pending", "confirmed"];

  const { data: appointment, error } = await supabase
    .from("appointments")
    .update({ status: newStatus })
    .eq("id", appointmentId)
    .in("status", allowedStatuses)
    .select(
      "id, patient_id, doctor_id, appointment_date, appointment_time"
    )
    .maybeSingle();

  if (error) {
    console.error("Appointment update failed:", error.message);
    return;
  }

  if (!appointment) {
    console.error("Appointment not found or status already changed.");
    return;
  }

  const { data: doctor } = await supabase
    .from("doctors")
    .select("full_name")
    .eq("id", appointment.doctor_id)
    .maybeSingle();

  const doctorName = doctor?.full_name ?? "your doctor";

  const isConfirmed = newStatus === "confirmed";

  const title = isConfirmed
    ? "Appointment Confirmed"
    : "Appointment Cancelled";

  const message = isConfirmed
    ? `Your appointment with ${doctorName} on ${appointment.appointment_date} at ${appointment.appointment_time} has been confirmed.`
    : `Your appointment with ${doctorName} on ${appointment.appointment_date} at ${appointment.appointment_time} has been cancelled by the hospital. Please book another appointment if needed.`;

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert({
      user_id: appointment.patient_id,
      appointment_id: appointment.id,
      title,
      message,
    });

  if (notificationError) {
    console.error(
      "Patient notification could not be created:",
      notificationError.message
    );
  }

  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
  revalidatePath("/patient/appointments");
  revalidatePath("/patient/notifications");
}

export default async function AdminAppointmentsPage() {
  const { supabase, user } = await requireRole("admin");

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      "id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, created_at"
    )
    .order("created_at", { ascending: false });

  const appointmentList = appointments ?? [];

  const patientIds = [
    ...new Set(appointmentList.map((item) => item.patient_id)),
  ];

  const doctorIds = [
    ...new Set(appointmentList.map((item) => item.doctor_id)),
  ];

  const departmentIds = [
    ...new Set(appointmentList.map((item) => item.department_id)),
  ];

  const [profilesResult, doctorsResult, departmentsResult] =
    await Promise.all([
      patientIds.length > 0
        ? supabase
            .from("profiles")
            .select("id, full_name, phone")
            .in("id", patientIds)
        : Promise.resolve({ data: [] }),

      doctorIds.length > 0
        ? supabase
            .from("doctors")
            .select("id, full_name, specialization")
            .in("id", doctorIds)
        : Promise.resolve({ data: [] }),

      departmentIds.length > 0
        ? supabase
            .from("departments")
            .select("id, name")
            .in("id", departmentIds)
        : Promise.resolve({ data: [] }),
    ]);

  const profiles = profilesResult.data ?? [];
  const doctors = doctorsResult.data ?? [];
  const departments = departmentsResult.data ?? [];

  const getPatient = (id: string) =>
    profiles.find((item) => item.id === id);

  const getDoctor = (id: string) =>
    doctors.find((item) => item.id === id);

  const getDepartment = (id: string) =>
    departments.find((item) => item.id === id);

  const pendingCount = appointmentList.filter(
    (item) => item.status === "pending"
  ).length;

  const confirmedCount = appointmentList.filter(
    (item) => item.status === "confirmed"
  ).length;

  const cancelledCount = appointmentList.filter(
    (item) => item.status === "cancelled"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <a
              href="/admin/dashboard"
              className="text-2xl font-bold text-blue-700"
            >
              CarePoint
            </a>
            <p className="mt-1 text-sm text-slate-500">
              Administration Portal
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">
              Administrator
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <a
            href="/admin/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </a>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Appointment Management
          </h1>

          <p className="mt-2 text-slate-600">
            Review patient bookings and manage appointment requests.
          </p>
        </div>

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Appointments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {appointmentList.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-amber-600">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-green-600">Confirmed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {confirmedCount}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-red-600">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {cancelledCount}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              All Patient Appointments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View booking details and update appointment status.
            </p>
          </div>

          {error ? (
            <div className="p-8 text-center text-red-600">
              Unable to load appointments: {error.message}
            </div>
          ) : appointmentList.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No appointments have been booked yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-4">Patient</th>
                    <th className="whitespace-nowrap px-5 py-4">Doctor</th>
                    <th className="whitespace-nowrap px-5 py-4">Department</th>
                    <th className="whitespace-nowrap px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="whitespace-nowrap px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointmentList.map((appointment) => {
                    const patient = getPatient(appointment.patient_id);
                    const doctor = getDoctor(appointment.doctor_id);
                    const department = getDepartment(
                      appointment.department_id
                    );

                    return (
                      <tr key={appointment.id}>
                        <td className="min-w-40 px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {patient?.full_name ?? "Patient"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {patient?.phone ?? "No phone number"}
                          </p>
                        </td>

                        <td className="min-w-40 px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {doctor?.full_name ?? "Doctor"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {doctor?.specialization ?? ""}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {department?.name ?? "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          <p>{appointment.appointment_date}</p>
                          <p className="mt-1 text-xs">
                            {appointment.appointment_time}
                          </p>
                        </td>

                        <td className="max-w-48 px-5 py-4 text-slate-600">
                          <p className="line-clamp-3">
                            {appointment.reason || "Not specified"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : appointment.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td className="min-w-40 px-5 py-4">
                          {appointment.status === "pending" ? (
                            <div className="flex flex-col gap-2">
                              <form action={updateAppointmentStatus}>
                                <input
                                  type="hidden"
                                  name="appointmentId"
                                  value={appointment.id}
                                />
                                <input
                                  type="hidden"
                                  name="status"
                                  value="confirmed"
                                />
                                <button
                                  type="submit"
                                  className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                                >
                                  Confirm
                                </button>
                              </form>

                              <form action={updateAppointmentStatus}>
                                <input
                                  type="hidden"
                                  name="appointmentId"
                                  value={appointment.id}
                                />
                                <input
                                  type="hidden"
                                  name="status"
                                  value="cancelled"
                                />
                                <button
                                  type="submit"
                                  className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                >
                                  Cancel
                                </button>
                              </form>
                            </div>
                          ) : appointment.status === "confirmed" ? (
                            <form action={updateAppointmentStatus}>
                              <input
                                type="hidden"
                                name="appointmentId"
                                value={appointment.id}
                              />
                              <input
                                type="hidden"
                                name="status"
                                value="cancelled"
                              />
                              <button
                                type="submit"
                                className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No actions
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
