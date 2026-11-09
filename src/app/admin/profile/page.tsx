
import { requireRole } from "@/lib/auth/require-role";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function logout() {
  "use server";

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}

async function updateAdminProfile(formData: FormData) {
  "use server";

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const dateOfBirth = String(formData.get("date_of_birth") ?? "").trim();

  if (!fullName || fullName.length > 120) {
    redirect("/admin/profile?error=invalid-name");
  }

  if (phone.length > 25) {
    redirect("/admin/profile?error=invalid-phone");
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      date_of_birth: dateOfBirth || null,
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    console.error("Admin profile update failed:", error.message);
    redirect("/admin/profile?error=save-failed");
  }

  revalidatePath("/admin/profile");
  revalidatePath("/admin/dashboard");

  redirect("/admin/profile?updated=1");
}

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { supabase, user } = await requireRole("admin");
  const params = await searchParams;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, date_of_birth, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const details = [
    {
      label: "Full Name",
      value: profile?.full_name || "Administrator",
    },
    {
      label: "Email Address",
      value: user.email || "Not available",
    },
    {
      label: "Phone Number",
      value: profile?.phone || "Not added",
    },
    {
      label: "Date of Birth",
      value: profile?.date_of_birth || "Not added",
    },
    {
      label: "Account Created",
      value: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-IN")
        : new Date(user.created_at).toLocaleDateString("en-IN"),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <a
            href="/admin/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </a>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Admin Profile
          </h1>

          <p className="mt-2 text-gray-600">
            View and update your administrator account information.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-blue-700 px-6 py-8 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-blue-700">
              {(profile?.full_name || "A").charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-4 text-2xl font-semibold">
              {profile?.full_name || "Administrator"}
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              {user.email}
            </p>

            <span className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold">
              ADMINISTRATOR
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {params.updated === "1" && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                Profile updated successfully!
              </div>
            )}

            {params.error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {params.error === "invalid-name"
                  ? "Please enter a valid name (maximum 120 characters)."
                  : params.error === "invalid-phone"
                    ? "Phone number must not exceed 25 characters."
                    : "Unable to save your profile. Please try again."}
              </div>
            )}

            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Account Information
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>

                  <p className="mt-2 break-words font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Edit Profile
              </h3>

              <p className="mb-6 text-sm text-gray-600">
                Update your personal information below.
              </p>

              <form action={updateAdminProfile} className="space-y-5">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    maxLength={120}
                    defaultValue={profile?.full_name || ""}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={25}
                    defaultValue={profile?.phone || ""}
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="date_of_birth"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>

                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={profile?.date_of_birth || ""}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </form>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Security
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Sign out securely from your administrator account.
              </p>

              <form action={logout} className="mt-5">
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
