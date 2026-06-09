"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type PointerEvent, useState } from "react";
import type { Locale } from "@/app/lib/i18n";
import type { Project } from "@/app/data/projects";

export function ProjectCard({ project, locale, priority = false }: { project: Project; locale: Locale; priority?: boolean }) {
  const [reveal, setReveal] = useState(50);
  const labels = locale === "es" ? { before: "Antes", after: "Después" } : { before: "Before", after: "After" };
  const beforeImage = project.beforeImage ?? project.thumbnail;
  const afterImage = project.afterImage ?? project.thumbnail;
  const hasRealBefore = Boolean(project.beforeImage);
  const mediaStyle = { "--reveal": `${reveal}%` } as CSSProperties;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextReveal = ((event.clientX - rect.left) / rect.width) * 100;
    setReveal(Math.min(96, Math.max(4, nextReveal)));
  }

  return (
    <Link href={`/${locale}/work/${project.slug}`} className="group block">
      <div
        className="relative aspect-video overflow-hidden bg-ink"
        style={mediaStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setReveal(50)}
        aria-label={`${project.title}: ${labels.before} / ${labels.after}`}
      >
        <Image
          src={beforeImage}
          alt={`${project.client} - ${project.title} ${labels.before}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.035] ${
            hasRealBefore ? "" : "brightness-110 contrast-75 saturate-50"
          }`}
        />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
          <Image
            src={afterImage}
            alt={`${project.client} - ${project.title} ${labels.after}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-[var(--reveal)] w-px bg-paper shadow-[0_0_0_1px_rgba(17,17,17,0.35)]" />
        <div className="pointer-events-none absolute left-[var(--reveal)] top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/85 bg-ink/70 shadow-lg backdrop-blur">
          <span className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-b border-l border-paper" />
          <span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-r border-t border-paper" />
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-between text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper">
          <span className="bg-ink/70 px-2 py-1 backdrop-blur">{labels.after}</span>
          <span className="bg-ink/70 px-2 py-1 backdrop-blur">{labels.before}</span>
        </div>
        <p className="sr-only">
          {locale === "es"
            ? "Mueve el cursor sobre la imagen para comparar el antes y después."
            : "Move the cursor over the image to compare before and after."}
        </p>
      </div>
      <div className="mt-2 h-px bg-ink/15">
        <div className="h-px bg-ink transition-[width] duration-150" style={{ width: `${reveal}%` }} />
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
