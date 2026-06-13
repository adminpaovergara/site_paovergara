import { Plus } from "lucide-react";
import { AdminPageHeader, InfoHint } from "@/app/components/admin/AdminShell";
import { MissingPill, StatusPill } from "@/app/components/admin/AdminCards";
import { WorkQuickActions } from "@/app/components/admin/AdminForms";
import { getAdminPortfolioProjects } from "@/app/lib/admin/data";

export default async function AdminWorkPage() {
  const projects = await getAdminPortfolioProjects();

  return (
    <>
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Trabajos públicos"
        copy="Administra el portfolio como una lista visual. Los campos técnicos quedan detrás de opciones avanzadas para no convertir esto en una planilla interminable."
        action={
          <button className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-paper">
            <Plus size={16} />
            Agregar trabajo
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <InfoHint>Filtros rápidos: publicado, borrador, destacado, video listo, falta antes/después</InfoHint>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const missingBeforeAfter = !project.before_image_url || !project.after_image_url;
          const missingMux = project.video_status === "ready" && !project.mux_playback_id;

          return (
            <article key={project.id} className="border border-ink/10 bg-paper">
              <div className="aspect-video bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`${project.client_name} - ${project.title_es}`} className="h-full w-full object-cover" src={project.thumbnail_url} />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone={project.published ? "good" : "warn"}>{project.published ? "Publicado" : "Borrador"}</StatusPill>
                  {project.featured ? <StatusPill>Destacado</StatusPill> : null}
                  <StatusPill tone={project.video_status === "ready" ? "good" : "warn"}>{project.video_status}</StatusPill>
                </div>
                <h2 className="mt-5 text-2xl font-semibold leading-tight">{project.title_es}</h2>
                <p className="mt-2 text-sm text-graphite">{project.client_name} · {project.category}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {missingBeforeAfter ? <MissingPill>Falta antes/después</MissingPill> : null}
                  {missingMux ? <MissingPill>Falta Mux ID</MissingPill> : null}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button className="border border-ink/20 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]">Vista previa</button>
                  <button className="border border-ink/20 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]">Editar</button>
                </div>
                <WorkQuickActions featured={project.featured} id={project.id} published={project.published} videoStatus={project.video_status} />
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
