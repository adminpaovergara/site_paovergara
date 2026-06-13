import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import { requireClientProfile } from "@/app/lib/admin/auth";
import { getClientProjects, getVideoVersions } from "@/app/lib/admin/data";

export default async function ClientProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, profile] = await Promise.all([params, requireClientProfile()]);
  const [projects, versions] = await Promise.all([getClientProjects(profile.id), getVideoVersions(id)]);
  const project = projects.find((item) => item.id === id);
  const currentVersion = versions[0];

  if (!project) {
    notFound();
  }

  return (
    <>
      <Link className="text-sm font-semibold uppercase tracking-[0.14em] text-paper/50 hover:text-paper" href="/client">
        Volver a proyectos
      </Link>
      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.45fr]">
        <div>
          <div className="aspect-video bg-black">
            {currentVersion?.mux_playback_id ? (
              <iframe
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="h-full w-full"
                src={`https://player.mux.com/${currentVersion.mux_playback_id}?autoplay=false`}
                title={currentVersion.title}
              />
            ) : (
              <div className="grid h-full place-items-center text-paper/50">Video pendiente de asignar</div>
            )}
          </div>
          <div className="mt-6 border border-paper/10 p-5">
            <h2 className="text-2xl font-semibold">Comentarios</h2>
            <p className="mt-3 leading-7 text-paper/60">La siguiente iteración habilitará comentarios por timecode y solicitudes de cambios.</p>
            <button className="mt-5 inline-flex items-center gap-2 border border-paper/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">
              <MessageSquareText size={14} />
              Agregar comentario
            </button>
          </div>
        </div>
        <aside className="border border-paper/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/45">{project.status}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-none">{project.title}</h1>
          <p className="mt-5 leading-7 text-paper/65">{project.description ?? "Proyecto privado de revisión."}</p>
          <div className="mt-8 border-t border-paper/10 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/45">Versión actual</p>
            <p className="mt-2 font-semibold">{currentVersion ? `v${currentVersion.version_number} · ${currentVersion.title}` : "Pendiente"}</p>
          </div>
          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-paper px-4 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink">
            <CheckCircle2 size={15} />
            Aprobar versión
          </button>
          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-paper/20 px-4 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-paper">
            Solicitar cambios
          </button>
        </aside>
      </section>
    </>
  );
}
