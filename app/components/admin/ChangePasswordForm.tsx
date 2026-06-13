"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function ChangePasswordForm({ mode }: { mode: "admin" | "client" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 10) {
      setStatus("error");
      setError("Usa una contraseña de mínimo 10 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setError("Las contraseñas no coinciden.");
      return;
    }

    const response = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    }).catch(() => null);

    if (!response?.ok) {
      setStatus("error");
      setError("No pudimos actualizar la contraseña. Inténtalo de nuevo.");
      return;
    }

    const payload = (await response.json()) as { redirectTo?: string };
    window.location.href = payload.redirectTo ?? (mode === "admin" ? "/admin" : "/client");
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite">Nueva contraseña</label>
        <input
          className="h-14 border border-ink/15 bg-transparent px-4 text-base outline-none transition focus:border-ink"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite">Confirmar contraseña</label>
        <input
          className="h-14 border border-ink/15 bg-transparent px-4 text-base outline-none transition focus:border-ink"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      {error ? <p className="border border-red-700/30 bg-red-700/5 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <button className="inline-flex h-14 items-center justify-center gap-2 bg-ink px-5 text-sm font-semibold uppercase tracking-[0.14em] text-paper" type="submit">
        {status === "sending" ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
        Guardar contraseña
      </button>
    </form>
  );
}
