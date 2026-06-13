import { AdminShell } from "@/app/components/admin/AdminShell";
import { requireAdminProfile } from "@/app/lib/admin/auth";

export const metadata = {
  robots: { index: false, follow: false }
};

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdminProfile();

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
