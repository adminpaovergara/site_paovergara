import Link from "next/link";
import { BarChart3 } from "lucide-react";
import type { Profile } from "@/app/lib/admin/auth";
import { AdminMobileNav } from "@/app/components/admin/AdminMobileNav";
import { adminNavItems } from "@/app/components/admin/adminNav";
import { LogoutButton } from "@/app/components/admin/LogoutButton";

export function AdminShell({ children, profile }: { children: React.ReactNode; profile: Profile }) {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-ink/10 bg-[#111111] p-5 text-paper lg:block">
        <Link href="/admin" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-paper/50">Admin</p>
          <p className="mt-2 text-2xl font-semibold">Pao Vergara</p>
        </Link>
        <nav className="mt-10 grid gap-1">
          {adminNavItems
            .filter((item) => item.roles.includes(profile.role))
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper/70 transition hover:bg-paper/10 hover:text-paper">
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-paper/10 pt-5">
          <p className="text-sm font-semibold">{profile.full_name ?? profile.email}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-paper/45">{profile.role}</p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-[#f4f1ea]/95 px-5 py-4 backdrop-blur sm:px-8 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="font-semibold uppercase tracking-[0.16em]">
              Pao Admin
            </Link>
            <div className="flex items-center gap-2">
              <AdminMobileNav role={profile.role} userName={profile.full_name ?? profile.email} />
              <LogoutButton compact />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-5 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  copy,
  action
}: {
  eyebrow: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-balance text-4xl font-semibold leading-none sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-graphite">{copy}</p>
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">{action}</div> : null}
    </div>
  );
}

export function InfoHint({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-ink/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">
      <BarChart3 className="mr-1" size={12} />
      <span className="min-w-0 leading-5">{children}</span>
    </span>
  );
}
