"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/app/lib/i18n";
import type { PortfolioProject } from "@/app/lib/portfolio-projects";

function videoEmbedUrl(project: PortfolioProject) {
  if (project.videoProvider === "mux" && project.muxPlaybackId) {
    return `https://player.mux.com/${project.muxPlaybackId}?autoplay=any`;
  }

  if (project.videoProvider === "vimeo" && project.videoUrl) {
    const id = project.videoUrl.match(/(?:video\/|vimeo\.com\/)(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0` : project.videoUrl;
  }

  if (project.videoProvider === "youtube" && project.videoUrl) {
    const id = project.videoUrl.match(/[?&]v=([^&]+)/)?.[1] ?? project.videoUrl.match(/youtu\.be\/([^?]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : project.videoUrl;
  }

  return project.videoUrl;
}

function formatDuration(seconds?: number) {
  if (!seconds) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function WorkPortfolio({ locale, projects }: { locale: Locale; projects: PortfolioProject[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activeProject = useMemo(() => projects.find((project) => project.slug === activeSlug) ?? null, [activeSlug, projects]);
  const embedUrl = activeProject ? videoEmbedUrl(activeProject) : undefined;
  const copy =
    locale === "es"
      ? { after: "Después", before: "Antes", close: "Cerrar", play: "Reproducir", role: "Rol", duration: "Duración", unavailable: "Video en preparación" }
      : { after: "After", before: "Before", close: "Close", play: "Play", role: "Role", duration: "Duration", unavailable: "Video in preparation" };

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveSlug(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeProject]);

  return (
    <>
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {projects.map((project, index) => (
          <button
            aria-label={`${copy.play}: ${project.client} - ${project.title[locale]}`}
            className="group block text-left"
            key={project.slug}
            onClick={() => setActiveSlug(project.slug)}
            type="button"
          >
            <div className="relative aspect-video overflow-hidden bg-ink">
              <Image
                src={project.beforeImage ?? project.thumbnail}
                alt={`${project.client} - ${project.title[locale]}`}
                fill
                priority={index < 2}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className={`object-cover transition duration-500 group-hover:scale-[1.035] ${
                  project.beforeImage ? "" : "brightness-110 contrast-75 grayscale saturate-50"
                }`}
              />
              <Image
                src={project.afterImage ?? project.thumbnail}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover opacity-0 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-100 group-focus-visible:scale-[1.035] group-focus-visible:opacity-100"
              />
              <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/20" />
              <div className="absolute left-4 top-4 border border-paper/70 bg-ink/60 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper backdrop-blur transition group-hover:opacity-0 group-focus-visible:opacity-0">
                {copy.before}
              </div>
              <div className="absolute left-4 top-4 border border-paper/70 bg-ink/60 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {copy.after}
              </div>
              <div className="absolute bottom-4 left-4 border border-paper/70 bg-ink/60 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper backdrop-blur">
                {copy.play}
              </div>
            </div>
            <div className="mt-4 flex items-start justify-between gap-5 border-t border-ink/15 pt-4">
              <div>
                <h2 className="text-xl font-semibold">{project.title[locale]}</h2>
                <p className="mt-1 text-sm text-graphite">{project.client}</p>
              </div>
              <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-graphite">{project.category}</p>
            </div>
          </button>
        ))}
      </div>

      {activeProject ? (
        <div className="fixed inset-0 z-50 bg-ink/95 text-paper" role="dialog" aria-modal="true" aria-label={`${activeProject.client} - ${activeProject.title[locale]}`}>
          <div className="flex min-h-svh flex-col">
            <div className="flex items-center justify-between border-b border-paper/15 px-5 py-4 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/55">Pao Vergara</p>
              <button
                aria-label={copy.close}
                className="grid h-11 w-11 place-items-center border border-paper/20 transition hover:bg-paper hover:text-ink"
                onClick={() => setActiveSlug(null)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid flex-1 content-center gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_20rem] lg:gap-8">
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {embedUrl ? (
                    <iframe
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                      src={embedUrl}
                      title={`${activeProject.client} - ${activeProject.title[locale]}`}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm uppercase tracking-[0.16em] text-paper/60">{copy.unavailable}</div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3 border-b border-paper/10 pb-4 sm:border-b-0 sm:pb-0">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-paper/25 bg-paper/10">
                    <Image src={activeProject.afterImage ?? activeProject.thumbnail} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="grid min-w-0 gap-1">
                    <span className="block truncate text-base font-semibold">{activeProject.title[locale]}</span>
                    <span className="block truncate text-sm text-paper/55">
                      Pao Vergara · {activeProject.client} · {activeProject.category}
                    </span>
                  </span>
                </div>
              </div>
              <aside className="border-t border-paper/15 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <p className="leading-7 text-paper/70">{activeProject.description[locale]}</p>
                <dl className="mt-8 grid gap-5 text-sm">
                  <div>
                    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-paper/45">{copy.role}</dt>
                    <dd className="mt-2">{activeProject.role[locale]}</dd>
                  </div>
                  {activeProject.durationSeconds ? (
                    <div>
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-paper/45">{copy.duration}</dt>
                      <dd className="mt-2">{formatDuration(activeProject.durationSeconds)}</dd>
                    </div>
                  ) : null}
                </dl>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
