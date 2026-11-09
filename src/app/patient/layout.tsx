import { requireRole } from "@/lib/auth/require-role";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  await requireRole("patient");
  return <>{children}</>;
}
