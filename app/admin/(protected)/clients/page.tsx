import { UserPlus } from "lucide-react";
import { AdminPageHeader, InfoHint } from "@/app/components/admin/AdminShell";
import { StatusPill } from "@/app/components/admin/AdminCards";
import { CreateClientProjectForm, CreateUserForm } from "@/app/components/admin/AdminForms";
import { requireFullAdminProfile } from "@/app/lib/admin/auth";
import { getClientProjects, getProfiles } from "@/app/lib/admin/data";

export default async function AdminClientsPage() {
  await requireFullAdminProfile();
  const [profiles, projects] = await Promise.all([getProfiles(), getClientProjects()]);
  const clients = profiles.filter((profile) => profile.role === "client");

  return (
    <>
      <AdminPageHeader
        eyebrow="Portal privado"
        title="Clientes y proyectos"
        copy="Este módulo prepara la experiencia tipo Frame.io: clientes con proyectos, videos, comentarios y aprobaciones."
        action={
          <a className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-paper" href="#crear-cliente">
            <UserPlus size={16} />
            Crear cliente
          </a>
        }
      />

      <div className="mb-5">
        <InfoHint>Flujo recomendado: crear cliente → crear proyecto → asignar video → enviar acceso.</InfoHint>
      </div>

      <div id="crear-cliente" className="mb-6">
        <CreateUserForm compact defaultRole="client" />
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        {clients.map((client) => {
          const clientProjects = projects.filter((project) => project.client_id === client.id);

          return (
            <article key={client.id} className="border border-ink/10 bg-paper p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{client.full_name ?? client.email}</h2>
                  <p className="mt-2 text-sm text-graphite">{client.company ?? "Cliente sin empresa"} · {client.email}</p>
                </div>
                <StatusPill tone={client.active ? "good" : "warn"}>{client.active ? "Activo" : "Inactivo"}</StatusPill>
              </div>
              <div className="mt-6 grid gap-3">
                {clientProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between gap-3 border-t border-ink/10 py-3">
                    <div>
                      <p className="font-semibold">{project.title}</p>
                      <p className="text-sm text-graphite">{project.description ?? "Sin descripción"}</p>
                    </div>
                    <StatusPill>{project.status}</StatusPill>
                  </div>
                ))}
                {!clientProjects.length ? <p className="border-t border-ink/10 py-3 text-sm text-graphite">Sin proyectos asignados todavía.</p> : null}
              </div>
              <CreateClientProjectForm clientId={client.id} />
            </article>
          );
        })}
        {!clients.length ? <p className="border border-ink/10 bg-paper p-5 text-graphite">Todavía no hay clientes creados.</p> : null}
      </section>
    </>
  );
}
