import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireClientProfile } from "@/app/lib/admin/auth";
import { getClientProjects } from "@/app/lib/admin/data";

export default async function ClientDashboardPage() {
  const profile = await requireClientProfile();
  const projects = await getClientProjects(profile.id);

  return (
    <>
      <section className="border-b border-paper/10 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">Portal privado</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-none sm:text-7xl">Proyectos en revisión</h1>
        <p className="mt-5 max-w-2xl leading-7 text-paper/65">Aquí aparecerán propuestas, versiones de color, comentarios y entregas asignadas a tu cuenta.</p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/client/projects/${project.id}`} className="group border border-paper/10 p-5 transition hover:border-paper/40">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/45">{project.status}</p>
            <h2 className="mt-4 text-3xl font-semibold">{project.title}</h2>
            <p className="mt-3 leading-7 text-paper/60">{project.description ?? "Proyecto privado de revisión."}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
              Abrir proyecto
              <ArrowRight className="transition group-hover:translate-x-1" size={16} />
            </span>
          </Link>
        ))}
        {!projects.length ? (
          <div className="border border-paper/10 p-5">
            <h2 className="text-2xl font-semibold">Sin proyectos asignados</h2>
            <p className="mt-3 leading-7 text-paper/60">Cuando Paola comparta una propuesta o versión de video, aparecerá aquí.</p>
          </div>
        ) : null}
      </section>
    </>
  );
}
