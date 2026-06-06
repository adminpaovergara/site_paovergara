import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/lib/i18n";
import type { Project } from "@/app/data/projects";

export function ProjectCard({ project, locale, priority = false }: { project: Project; locale: Locale; priority?: boolean }) {
  return (
    <Link href={`/${locale}/work/${project.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden bg-ink">
        <Image
          src={project.thumbnail}
          alt={`${project.client} - ${project.title}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-5 border-t border-ink/15 pt-4">
        <div>
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p className="mt-1 text-sm text-graphite">{project.client}</p>
        </div>
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-graphite">{project.category}</p>
      </div>
    </Link>
  );
}
