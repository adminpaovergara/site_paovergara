"use client";

import { LogOut } from "lucide-react";

export function LogoutButton({ compact = false, redirectTo = "/admin/login" }: { compact?: boolean; redirectTo?: string }) {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = redirectTo;
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 border border-current text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-paper hover:text-ink ${
        compact ? "px-3 py-2" : "w-full px-4 py-3"
      }`}
      onClick={logout}
      type="button"
    >
      <LogOut size={14} />
      Salir
    </button>
  );
}
