
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function addDepartment(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || name.length > 120) {
    console.error("Department name is required and must be within 120 characters.");
    return;
  }

  const slug = createSlug(name);

  if (!slug) {
    console.error("Please enter a valid department name.");
    return;
  }

  const { error } = await supabase.from("departments").insert({
    name,
    slug,
    description,
    is_active: true,
  });

  if (error) {
    console.error("Unable to add department:", error.message);
    return;
  }

  revalidatePath("/admin/departments");
  revalidatePath("/admin/dashboard");
  revalidatePath("/departments");
  revalidatePath("/appointments");
}

async function updateDepartment(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const id = String(formData.get("department_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !name || name.length > 120) {
    console.error("Valid department ID and name are required.");
    return;
  }

  const slug = createSlug(name);

  if (!slug) {
    console.error("Please enter a valid department name.");
    return;
  }

  const { error } = await supabase
    .from("departments")
    .update({
      name,
      slug,
      description,
    })
    .eq("id", id);

  if (error) {
    console.error("Unable to update department:", error.message);
    return;
  }

  revalidatePath("/admin/departments");
  revalidatePath("/admin/dashboard");
  revalidatePath("/departments");
  revalidatePath("/appointments");
}

async function toggleDepartmentStatus(formData: FormData) {
  "use server";

  const { supabase } = await requireRole("admin");

  const id = String(formData.get("department_id") ?? "");
  const currentStatus = String(formData.get("is_active") ?? "");

  if (!id || !["true", "false"].includes(currentStatus)) {
    return;
  }

  const { error } = await supabase
    .from("departments")
    .update({
      is_active: currentStatus !== "true",
    })
    .eq("id", id);

  if (error) {
    console.error("Unable to change department status:", error.message);
    return;
  }

  revalidatePath("/admin/departments");
  revalidatePath("/admin/dashboard");
  revalidatePath("/departments");
  revalidatePath("/doctors");
  revalidatePath("/appointments");
}

export default async function AdminDepartmentsPage() {
  const { supabase, user } = await requireRole("admin");

  const { data: departments, error } = await supabase
    .from("departments")
    .select("id, name, slug, description, is_active, created_at")
    .order("created_at", { ascending: false });

  const departmentList = departments ?? [];

  const activeCount = departmentList.filter(
    (department) => department.is_active
  ).length;

  const inactiveCount = departmentList.length - activeCount;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
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
        {/* Page Heading */}
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Department Management
          </h1>

          <p className="mt-2 text-slate-600">
            Add, edit and manage CarePoint hospital departments.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load departments: {error.message}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Departments</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {departmentList.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active Departments</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Inactive Departments</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {inactiveCount}
            </p>
          </div>
        </section>

        {/* Add Department Form */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Add New Department
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter a department name and description. Its URL slug will be
            generated automatically.
          </p>

          <form action={addDepartment} className="mt-6 grid gap-5">
            <div>
              <label
                htmlFor="department-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Department Name *
              </label>

              <input
                id="department-name"
                name="name"
                required
                maxLength={120}
                placeholder="Example: ENT"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="department-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="department-description"
                name="description"
                rows={4}
                placeholder="Enter department information..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                + Add Department
              </button>
            </div>
          </form>
        </section>

        {/* Department List */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              Registered Departments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage department information and visibility.
            </p>
          </div>

          {departmentList.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No departments found.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {departmentList.map((department) => (
                <div key={department.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {department.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Slug: {department.slug}
                      </p>

                      <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        {department.description || "No description provided."}
                      </p>

                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          department.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {department.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <form action={toggleDepartmentStatus}>
                      <input
                        type="hidden"
                        name="department_id"
                        value={department.id}
                      />

                      <input
                        type="hidden"
                        name="is_active"
                        value={String(department.is_active)}
                      />

                      <button
                        type="submit"
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                          department.is_active
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {department.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>

                  <details className="mt-5 rounded-lg border border-slate-200 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-blue-600">
                      Edit Department Details
                    </summary>

                    <form
                      action={updateDepartment}
                      className="mt-5 grid gap-4"
                    >
                      <input
                        type="hidden"
                        name="department_id"
                        value={department.id}
                      />

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Department Name
                        </label>

                        <input
                          name="name"
                          required
                          maxLength={120}
                          defaultValue={department.name}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Description
                        </label>

                        <textarea
                          name="description"
                          rows={4}
                          defaultValue={department.description ?? ""}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
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
