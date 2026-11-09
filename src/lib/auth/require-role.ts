
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type UserRole = "patient" | "admin";

export async function requireRole(requiredRole: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: userRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleError) {
    console.error("Role verification failed:", roleError.message);
    redirect("/login?error=role-check");
  }

  if (!userRole) {
    redirect("/login?error=role-not-assigned");
  }

  if (userRole.role !== requiredRole) {
    if (userRole.role === "admin") {
      redirect("/admin/dashboard");
    }

    if (userRole.role === "patient") {
      redirect("/patient/dashboard");
    }

    redirect("/login?error=invalid-role");
  }

  // Return both values expected by the dashboard
  return { supabase, user };
}
