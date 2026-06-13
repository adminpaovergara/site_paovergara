"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { adminNavItems } from "@/app/components/admin/adminNav";
import type { Profile } from "@/app/lib/admin/auth";

export function AdminMobileNav({ role, userName }: { role: Profile["role"]; userName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const visibleItems = adminNavItems.filter((item) => item.roles.includes(role));

  return (
    <>
      <button
        aria-controls="admin-mobile-menu"
        aria-expanded={open}
        className="inline-flex min-h-12 items-center justify-center gap-2 border border-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-ink hover:text-paper"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu size={16} />
        Menú
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-ink/45"
            onClick={() => setOpen(false)}
            type="button"
          />
          <nav
            aria-label="Navegación de administración"
            className="absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto border-t border-ink/10 bg-[#f4f1ea] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl"
            id="admin-mobile-menu"
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">Admin</p>
                <p className="mt-2 text-xl font-semibold">Pao Vergara</p>
                <p className="mt-1 max-w-[14rem] truncate text-sm text-graphite">{userName}</p>
              </div>
              <button
                aria-label="Cerrar menú"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-ink/20"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    className={`flex min-h-14 items-center justify-between border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                      active ? "border-ink bg-ink text-paper" : "border-ink/10 bg-white/35 text-ink hover:border-ink"
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.label}
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
