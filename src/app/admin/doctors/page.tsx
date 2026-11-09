
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";

async function addDoctor(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const departmentId = String(formData.get("department_id") ?? "");
  const qualification = String(formData.get("qualification") ?? "").trim();
  const specialization = String(formData.get("specialization") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  if (!fullName || !departmentId) {
    console.error("Doctor name and department are required.");
    return;
  }

  const { error } = await supabase.from("doctors").insert({
    full_name: fullName,
    department_id: departmentId,
    qualification,
    specialization,
    bio,
    image_url: imageUrl || null,
    is_active: true,
  });

  if (error) {
    console.error("Unable to add doctor:", error.message);
    return;
  }

  revalidatePath("/admin/doctors");
  revalidatePath("/admin/dashboard");
  revalidatePath("/doctors");
}

async function updateDoctor(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const id = String(formData.get("doctor_id") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const departmentId = String(formData.get("department_id") ?? "");
  const qualification = String(formData.get("qualification") ?? "").trim();
  const specialization = String(formData.get("specialization") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  if (!id || !fullName || !departmentId) {
    console.error("Doctor ID, name and department are required.");
    return;
  }

  const { error } = await supabase
    .from("doctors")
    .update({
      full_name: fullName,
      department_id: departmentId,
      qualification,
      specialization,
      bio,
      image_url: imageUrl || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Unable to update doctor:", error.message);
    return;
  }

  revalidatePath("/admin/doctors");
  revalidatePath("/admin/dashboard");
  revalidatePath("/doctors");
}

async function toggleDoctorStatus(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const id = String(formData.get("doctor_id") ?? "");
  const currentStatus = String(formData.get("is_active") ?? "");

  if (!id || !["true", "false"].includes(currentStatus)) {
    return;
  }

  const { error } = await supabase
    .from("doctors")
    .update({ is_active: currentStatus !== "true" })
    .eq("id", id);

  if (error) {
    console.error("Unable to change doctor status:", error.message);
    return;
  }

  revalidatePath("/admin/doctors");
  revalidatePath("/admin/dashboard");
  revalidatePath("/doctors");
}

export default async function AdminDoctorsPage() {
  const { supabase, user } = await requireRole("admin");

  const [doctorsResult, departmentsResult] = await Promise.all([
    supabase
      .from("doctors")
      .select(
        "id, full_name, department_id, qualification, specialization, bio, image_url, is_active, created_at"
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("departments")
      .select("id, name")
      .eq("is_active", true)
      .order("name"),
  ]);

  const doctorList = doctorsResult.data ?? [];
  const departmentList = departmentsResult.data ?? [];

  const getDepartmentName = (departmentId: string) =>
    departmentList.find((department) => department.id === departmentId)?.name ??
    "Department";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
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
            Doctor Management
          </h1>
          <p className="mt-2 text-slate-600">
            Add, edit and manage CarePoint doctors.
          </p>
        </div>

        {doctorsResult.error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load doctors: {doctorsResult.error.message}
          </div>
        )}

        {departmentsResult.error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load departments: {departmentsResult.error.message}
          </div>
        )}

        <section className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Doctors</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {doctorList.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active Doctors</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {doctorList.filter((doctor) => doctor.is_active).length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Inactive Doctors</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {doctorList.filter((doctor) => !doctor.is_active).length}
            </p>
          </div>
        </section>

        {/* Add Doctor Form */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Add New Doctor
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the doctor's details and select a department.
          </p>

          {departmentList.length === 0 ? (
            <p className="mt-5 text-sm text-amber-700">
              No active departments are available. Add or activate a
              department before registering a doctor.
            </p>
          ) : (
            <form action={addDoctor} className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Doctor Name *
                </label>
                <input
                  name="full_name"
                  required
                  maxLength={120}
                  placeholder="Dr. John Smith"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department *
                </label>
                <select
                  name="department_id"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select department
                  </option>
                  {departmentList.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Qualification
                </label>
                <input
                  name="qualification"
                  maxLength={150}
                  placeholder="MBBS, MD"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Specialization
                </label>
                <input
                  name="specialization"
                  maxLength={150}
                  placeholder="Cardiology"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Profile Image URL
                </label>
                <input
                  name="image_url"
                  type="url"
                  placeholder="https://example.com/doctor.jpg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Short Biography
                </label>
                <input
                  name="bio"
                  maxLength={2000}
                  placeholder="Brief information about the doctor"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  + Add Doctor
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Doctors List */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              Registered Doctors
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage existing doctor records and availability status.
            </p>
          </div>

          {doctorList.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No doctors found.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {doctorList.map((doctor) => (
                <div key={doctor.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {doctor.full_name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {doctor.specialization || "Specialization not provided"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {getDepartmentName(doctor.department_id)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {doctor.qualification || "Qualification not provided"}
                      </p>

                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          doctor.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <form action={toggleDoctorStatus}>
                      <input
                        type="hidden"
                        name="doctor_id"
                        value={doctor.id}
                      />
                      <input
                        type="hidden"
                        name="is_active"
                        value={String(doctor.is_active)}
                      />
                      <button
                        type="submit"
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                          doctor.is_active
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {doctor.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>

                  <details className="mt-5 rounded-lg border border-slate-200 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-blue-600">
                      Edit Doctor Details
                    </summary>

                    <form action={updateDoctor} className="mt-5 grid gap-4 md:grid-cols-2">
                      <input
                        type="hidden"
                        name="doctor_id"
                        value={doctor.id}
                      />

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Doctor Name
                        </label>
                        <input
                          name="full_name"
                          required
                          maxLength={120}
                          defaultValue={doctor.full_name}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Department
                        </label>
                        <select
                          name="department_id"
                          required
                          defaultValue={doctor.department_id}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                        >
                          {departmentList.map((department) => (
                            <option key={department.id} value={department.id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Qualification
                        </label>
                        <input
                          name="qualification"
                          maxLength={150}
                          defaultValue={doctor.qualification ?? ""}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Specialization
                        </label>
                        <input
                          name="specialization"
                          maxLength={150}
                          defaultValue={doctor.specialization ?? ""}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Profile Image URL
                        </label>
                        <input
                          name="image_url"
                          type="url"
                          defaultValue={doctor.image_url ?? ""}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Biography
                        </label>
                        <textarea
                          name="bio"
                          maxLength={2000}
                          rows={3}
                          defaultValue={doctor.bio ?? ""}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </details>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
