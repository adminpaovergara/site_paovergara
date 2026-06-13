import { ClientShell } from "@/app/components/admin/ClientShell";
import { requireClientProfile } from "@/app/lib/admin/auth";

export const metadata = {
  robots: { index: false, follow: false }
};

export default async function ProtectedClientLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireClientProfile();

  return <ClientShell profile={profile}>{children}</ClientShell>;
}
