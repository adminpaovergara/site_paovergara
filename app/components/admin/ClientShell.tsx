import Link from "next/link";
import type { Profile } from "@/app/lib/admin/auth";
import { LogoutButton } from "@/app/components/admin/LogoutButton";

export function ClientShell({ children, profile }: { children: React.ReactNode; profile: Profile }) {
  return (
    <div className="min-h-screen bg-[#111111] text-paper">
      <header className="border-b border-paper/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-frame items-center justify-between gap-4">
          <Link href="/client" className="font-semibold uppercase tracking-[0.18em]">
            Pao Vergara
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-paper/60 sm:inline">{profile.company ?? profile.email}</span>
            <LogoutButton compact redirectTo="/client/login" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-frame px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
