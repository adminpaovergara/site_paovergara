import { ShieldCheck, UserPlus } from "lucide-react";
import { AdminPageHeader, InfoHint } from "@/app/components/admin/AdminShell";
import { StatusPill } from "@/app/components/admin/AdminCards";
import { CreateUserForm } from "@/app/components/admin/AdminForms";
import { requireFullAdminProfile } from "@/app/lib/admin/auth";
import { getProfiles } from "@/app/lib/admin/data";

export default async function AdminUsersPage() {
  await requireFullAdminProfile();
  const profiles = await getProfiles();

  return (
    <>
      <AdminPageHeader
        eyebrow="Accesos"
        title="Usuarios y permisos"
        copy="Paola puede dar acceso a editores o clientes sin mezclar permisos. Un cliente nunca entra al admin."
        action={
          <a className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-paper" href="#crear-usuario">
            <UserPlus size={16} />
            Crear usuario
          </a>
        }
      />

      <div className="mb-5">
        <InfoHint>Roles: admin controla todo, editor edita contenido, client solo ve proyectos asignados.</InfoHint>
      </div>

      <div id="crear-usuario" className="mb-6">
        <CreateUserForm defaultRole="editor" />
      </div>

      <section className="overflow-hidden border border-ink/10 bg-paper">
        <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.5fr] gap-4 border-b border-ink/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite md:grid">
          <span>Usuario</span>
          <span>Rol</span>
          <span>Empresa</span>
          <span>Estado</span>
        </div>
        {profiles.map((profile) => (
          <div key={profile.id} className="grid gap-4 border-b border-ink/10 px-5 py-4 last:border-b-0 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.5fr]">
            <div>
              <p className="font-semibold">{profile.full_name ?? profile.email}</p>
              <p className="mt-1 text-sm text-graphite">{profile.email}</p>
            </div>
            <div className="flex items-start">
              <StatusPill tone={profile.role === "admin" ? "good" : "neutral"}>
                <ShieldCheck size={12} />
                {profile.role}
              </StatusPill>
            </div>
            <p className="text-sm text-graphite">{profile.company ?? "—"}</p>
            <StatusPill tone={profile.active ? "good" : "warn"}>{profile.active ? "Activo" : "Inactivo"}</StatusPill>
          </div>
        ))}
        {!profiles.length ? <p className="p-5 text-graphite">Todavía no hay perfiles creados.</p> : null}
      </section>
    </>
  );
}
