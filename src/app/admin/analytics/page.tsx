
import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireRole("admin");

  const { data: appointments, error: appointmentError } = await supabase
    .from("appointments")
    .select("appointment_date, status, department_id");

  const { data: departments, error: departmentError } = await supabase
    .from("departments")
    .select("id, name");

  if (appointmentError || departmentError) {
    console.error(
      "Analytics data error:",
      appointmentError?.message || departmentError?.message
    );
  }

  const allAppointments = appointments ?? [];
  const allDepartments = departments ?? [];

  const total = allAppointments.length;

  const pending = allAppointments.filter(
    (item) => item.status === "pending"
  ).length;

  const confirmed = allAppointments.filter(
    (item) => item.status === "confirmed"
  ).length;

  const cancelled = allAppointments.filter(
    (item) => item.status === "cancelled"
  ).length;

  // Generate the latest six months.
  const now = new Date();

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (5 - index),
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();

    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    const count = allAppointments.filter((appointment) => {
      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`
      );

      return (
        appointmentDate.getFullYear() === year &&
        appointmentDate.getMonth() === month
      );
    }).length;

    return {
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      key,
      count,
    };
  });

  const maxMonthlyCount = Math.max(
    1,
    ...monthlyData.map((item) => item.count)
  );

  // Department-wise appointment counts.
  const departmentData = allDepartments
    .map((department) => ({
      name: department.name,
      count: allAppointments.filter(
        (appointment) => appointment.department_id === department.id
      ).length,
    }))
    .sort((a, b) => b.count - a.count);

  const maxDepartmentCount = Math.max(
    1,
    ...departmentData.map((item) => item.count)
  );

  const stats = [
    {
      title: "Total Appointments",
      value: total,
      color: "border-blue-500",
      icon: "📅",
    },
    {
      title: "Pending",
      value: pending,
      color: "border-amber-500",
      icon: "⏳",
    },
    {
      title: "Confirmed",
      value: confirmed,
      color: "border-green-500",
      icon: "✓",
    },
    {
      title: "Cancelled",
      value: cancelled,
      color: "border-red-500",
      icon: "✕",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="mb-8 mt-5">
          <h1 className="text-3xl font-bold text-slate-900">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Monitor appointment performance and department activity.
          </p>
        </div>

        {/* Statistics Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`rounded-xl border border-slate-200 border-l-4 ${stat.color} bg-white p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Monthly Appointment Chart */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Monthly Appointment Trends
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Appointment count for the latest six months.
          </p>

          <div className="mt-8 flex h-64 items-end justify-around gap-3 border-b border-slate-200 pb-2">
            {monthlyData.map((item) => {
              const height =
                item.count === 0
                  ? 0
                  : Math.max(5, (item.count / maxMonthlyCount) * 100);

              return (
                <div
                  key={item.key}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    {item.count}
                  </span>

                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className="w-full max-w-14 rounded-t-lg bg-blue-600 transition-all hover:bg-blue-800"
                      style={{ height: `${height}%` }}
                      title={`${item.label}: ${item.count} appointments`}
                    />
                  </div>

                  <span className="text-xs font-medium text-slate-500">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Department-wise Analytics */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Department-wise Appointments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Appointment distribution across hospital departments.
          </p>

          {departmentData.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No department data available.
            </p>
          ) : (
            <div className="mt-7 space-y-6">
              {departmentData.map((department) => {
                const width =
                  department.count === 0
                    ? 0
                    : (department.count / maxDepartmentCount) * 100;

                return (
                  <div key={department.name}>
                    <div className="mb-2 flex justify-between gap-4">
                      <span className="text-sm font-medium text-slate-700">
                        {department.name}
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {department.count}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cyan-600 transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Appointment Status Summary */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Appointment Status Summary
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-amber-50 p-5">
              <p className="text-sm text-amber-700">Pending</p>
              <p className="mt-2 text-2xl font-bold text-amber-800">
                {pending}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-sm text-green-700">Confirmed</p>
              <p className="mt-2 text-2xl font-bold text-green-800">
                {confirmed}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-5">
              <p className="text-sm text-red-700">Cancelled</p>
              <p className="mt-2 text-2xl font-bold text-red-800">
                {cancelled}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
