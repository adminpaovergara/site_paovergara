"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Plus, Save, UserPlus } from "lucide-react";

type Status = "idle" | "saving" | "success" | "error";

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">{label}</span>
      {children}
    </label>
  );
}

function inputClass() {
  return "h-12 w-full min-w-0 border border-ink/15 bg-transparent px-3 text-sm outline-none transition focus:border-ink";
}

function textareaClass() {
  return "min-h-24 w-full min-w-0 border border-ink/15 bg-transparent px-3 py-3 text-sm outline-none transition focus:border-ink";
}

function ActionMessage({ status, success, error }: { status: Status; success: string; error: string }) {
  if (status === "success") return <p className="border border-emerald-700/30 bg-emerald-700/10 px-3 py-2 text-sm text-emerald-900">{success}</p>;
  if (status === "error") return <p className="border border-red-700/30 bg-red-700/5 px-3 py-2 text-sm text-red-800">{error}</p>;
  return null;
}

async function postJson(path: string, body: unknown, method = "POST") {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    throw new Error(String(payload?.error ?? "request_failed"));
  }

  return payload;
}

export function CreateUserForm({ defaultRole = "client", compact = false }: { defaultRole?: "admin" | "editor" | "client"; compact?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setTemporaryPassword("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const payload = await postJson("/api/admin/users", {
        fullName: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        role: String(formData.get("role") ?? defaultRole),
        company: String(formData.get("company") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        country: String(formData.get("country") ?? ""),
        notes: String(formData.get("notes") ?? "")
      });
      setTemporaryPassword(String(payload?.temporaryPassword ?? ""));
      setStatus("success");
      form.reset();
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="grid gap-4 border border-ink/10 bg-paper p-5" onSubmit={submit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">{defaultRole === "client" ? "Crear cliente" : "Crear usuario"}</p>
        <h2 className="mt-2 text-2xl font-semibold">{defaultRole === "client" ? "Acceso para cliente" : "Nuevo acceso"}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Nombre">
          <input className={inputClass()} name="fullName" required />
        </Field>
        <Field label="Email">
          <input className={inputClass()} name="email" type="email" required />
        </Field>
        {!compact ? (
          <Field label="Rol">
            <select className={inputClass()} defaultValue={defaultRole} name="role">
              <option value="client">Cliente</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
        ) : (
          <input name="role" type="hidden" value={defaultRole} />
        )}
        <Field label="Empresa">
          <input className={inputClass()} name="company" />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass()} name="phone" />
        </Field>
        <Field label="País">
          <input className={inputClass()} name="country" />
        </Field>
      </div>
      <Field label="Notas internas">
        <textarea className={textareaClass()} name="notes" />
      </Field>
      <ActionMessage error="No pudimos crear el acceso." status={status} success="Acceso creado. Copia la contraseña temporal." />
      {temporaryPassword ? (
        <div className="flex flex-col gap-3 border border-ink/10 bg-ink/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="break-all text-sm">{temporaryPassword}</code>
          <button className="inline-flex items-center justify-center gap-2 border border-ink/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em]" onClick={() => navigator.clipboard.writeText(temporaryPassword)} type="button">
            <Copy size={13} />
            Copiar
          </button>
        </div>
      ) : null}
      <button className="inline-flex h-12 w-full items-center justify-center gap-2 bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-paper sm:w-auto" disabled={status === "saving"} type="submit">
        {status === "saving" ? <Loader2 className="animate-spin" size={15} /> : <UserPlus size={15} />}
        Crear acceso
      </button>
    </form>
  );
}

export function LeadActions({ id, status: initialStatus, notes }: { id: string; status: string; notes: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const formData = new FormData(event.currentTarget);

    try {
      await postJson(
        `/api/admin/leads/${id}`,
        {
          status: String(formData.get("status") ?? ""),
          internalNotes: String(formData.get("internalNotes") ?? "")
        },
        "PATCH"
      );
      setStatus("success");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="mt-5 grid gap-3" onSubmit={submit}>
      <Field label="Estado">
        <select className={inputClass()} defaultValue={initialStatus} name="status">
          <option value="new">Nuevo</option>
          <option value="contacted">Contactado</option>
          <option value="qualified">Calificado</option>
          <option value="proposal_sent">Propuesta enviada</option>
          <option value="won">Ganado</option>
          <option value="lost">Perdido</option>
          <option value="archived">Archivado</option>
        </select>
      </Field>
      <Field label="Nota interna">
        <textarea className={textareaClass()} defaultValue={notes ?? ""} name="internalNotes" />
      </Field>
      <ActionMessage error="No pudimos actualizar el lead." status={status} success="Lead actualizado." />
      <button className="inline-flex h-11 w-full items-center justify-center gap-2 border border-ink/20 px-4 text-xs font-semibold uppercase tracking-[0.12em] sm:w-auto" disabled={status === "saving"} type="submit">
        {status === "saving" ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
        Guardar lead
      </button>
    </form>
  );
}

export function CreateClientProjectForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await postJson("/api/admin/client-projects", {
        clientId,
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        status: String(formData.get("status") ?? "draft")
      });
      setStatus("success");
      form.reset();
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="mt-5 grid gap-3 border-t border-ink/10 pt-5" onSubmit={submit}>
      <Field label="Nuevo proyecto">
        <input className={inputClass()} name="title" placeholder="Nombre del proyecto" required />
      </Field>
      <Field label="Descripción">
        <textarea className={textareaClass()} name="description" />
      </Field>
      <Field label="Estado">
        <select className={inputClass()} defaultValue="draft" name="status">
          <option value="draft">Borrador</option>
          <option value="active">Activo</option>
          <option value="review">En revisión</option>
        </select>
      </Field>
      <ActionMessage error="No pudimos crear el proyecto." status={status} success="Proyecto creado." />
      <button className="inline-flex h-11 w-full items-center justify-center gap-2 border border-ink/20 px-4 text-xs font-semibold uppercase tracking-[0.12em] sm:w-auto" disabled={status === "saving"} type="submit">
        {status === "saving" ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
        Crear proyecto
      </button>
    </form>
  );
}

export function WorkQuickActions({ id, published, featured, videoStatus }: { id: string; published: boolean; featured: boolean; videoStatus: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(body: Record<string, unknown>) {
    startTransition(async () => {
      await postJson(`/api/admin/work/${id}`, body, "PATCH");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <button className="border border-ink/20 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]" disabled={isPending} onClick={() => update({ published: !published })} type="button">
          {published ? "Despublicar" : "Publicar"}
        </button>
        <button className="border border-ink/20 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]" disabled={isPending} onClick={() => update({ featured: !featured })} type="button">
          {featured ? "Quitar destacado" : "Destacar"}
        </button>
      </div>
      <select className={inputClass()} defaultValue={videoStatus} disabled={isPending} onChange={(event) => update({ videoStatus: event.currentTarget.value })}>
        <option value="draft">Video borrador</option>
        <option value="processing">Procesando</option>
        <option value="ready">Video listo</option>
        <option value="archived">Archivado</option>
      </select>
    </div>
  );
}

export function HomeSettingsForm({
  rotationEnabled,
  visibleCount,
  poolLimit,
  rotationIntervalMs,
  transitionDurationMs
}: {
  rotationEnabled: boolean;
  visibleCount: number;
  poolLimit: number;
  rotationIntervalMs: number;
  transitionDurationMs: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const formData = new FormData(event.currentTarget);

    try {
      await postJson(
        "/api/admin/settings/home",
        {
          rotationEnabled: formData.get("rotationEnabled") === "on",
          visibleCount: Number(formData.get("visibleCount")),
          poolLimit: Number(formData.get("poolLimit")),
          rotationIntervalMs: Number(formData.get("rotationIntervalMs")),
          transitionDurationMs: Number(formData.get("transitionDurationMs"))
        },
        "PATCH"
      );
      setStatus("success");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={submit}>
      <label className="flex items-center justify-between gap-4 border-t border-ink/10 pt-3 text-sm">
        <span className="text-graphite">Rotación activa</span>
        <input defaultChecked={rotationEnabled} name="rotationEnabled" type="checkbox" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Visibles">
          <input className={inputClass()} defaultValue={visibleCount} max={12} min={1} name="visibleCount" type="number" />
        </Field>
        <Field label="Pool">
          <input className={inputClass()} defaultValue={poolLimit} max={48} min={4} name="poolLimit" type="number" />
        </Field>
        <Field label="Velocidad ms">
          <input className={inputClass()} defaultValue={rotationIntervalMs} max={30000} min={2500} name="rotationIntervalMs" step={100} type="number" />
        </Field>
        <Field label="Transición ms">
          <input className={inputClass()} defaultValue={transitionDurationMs} max={1500} min={150} name="transitionDurationMs" step={10} type="number" />
        </Field>
      </div>
      <ActionMessage error="No pudimos guardar la configuración." status={status} success="Configuración guardada." />
      <button className="inline-flex h-11 w-full items-center justify-center gap-2 bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-paper sm:w-auto" disabled={status === "saving"} type="submit">
        {status === "saving" ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
        Guardar Home
      </button>
    </form>
  );
}
