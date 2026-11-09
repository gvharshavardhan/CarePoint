
import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminPatientsPage() {
  const { supabase, user } = await requireRole("admin");

  const { data: patients, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, date_of_birth, created_at")
    .order("created_at", { ascending: false });

  const patientList = patients ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-2xl font-bold text-blue-700"
            >
              CarePoint
            </Link>
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
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Patient Management
          </h1>
          <p className="mt-2 text-slate-600">
            View and manage registered CarePoint patients.
          </p>
        </div>

        <section className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Registered Patients
            </p>
            <p className="mt-3 text-3xl font-bold text-blue-700">
              {patientList.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Patient Records
            </p>
            <p className="mt-3 text-3xl font-bold text-green-700">
              {error ? "Error" : "Available"}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              Registered Patients
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Patient information stored in the database.
            </p>
          </div>

          {error ? (
            <div className="p-8 text-center text-red-600">
              Unable to load patients: {error.message}
            </div>
          ) : patientList.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No registered patients found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Patient Name</th>
                    <th className="px-6 py-4 font-semibold">Phone Number</th>
                    <th className="px-6 py-4 font-semibold">Date of Birth</th>
                    <th className="px-6 py-4 font-semibold">
                      Registration Date
                    </th>
                    <th className="px-6 py-4 font-semibold">Patient ID</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {patientList.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {patient.full_name || "Not provided"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {patient.phone || "Not provided"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {patient.date_of_birth || "Not provided"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {new Date(patient.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {patient.id.slice(0, 8)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
