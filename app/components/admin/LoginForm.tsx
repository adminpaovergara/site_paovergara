"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function LoginForm({ mode }: { mode: "admin" | "client" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      })
    }).catch(() => null);

    if (!response?.ok) {
      setStatus("error");
      setError(mode === "admin" ? "No pudimos validar este acceso de administración." : "No pudimos validar este acceso de cliente.");
      return;
    }

    const payload = (await response.json()) as { redirectTo?: string };
    window.location.href = payload.redirectTo ?? (mode === "admin" ? "/admin" : "/client");
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite">Email</label>
        <input
          className="h-14 border border-ink/15 bg-transparent px-4 text-base outline-none transition focus:border-ink"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite">Contraseña</label>
        <input
          className="h-14 border border-ink/15 bg-transparent px-4 text-base outline-none transition focus:border-ink"
          name="password"
          type="password"
          autoComplete={mode === "admin" ? "current-password" : "current-password"}
          required
        />
      </div>
      {error ? <p className="border border-red-700/30 bg-red-700/5 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <button className="inline-flex h-14 items-center justify-center gap-2 bg-ink px-5 text-sm font-semibold uppercase tracking-[0.14em] text-paper" type="submit">
        {status === "sending" ? <Loader2 className="animate-spin" size={16} /> : null}
        Entrar
        {status !== "sending" ? <ArrowRight size={16} /> : null}
      </button>
    </form>
  );
}
