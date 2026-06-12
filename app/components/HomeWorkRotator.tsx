"use client";

import { useEffect, useRef, useState } from "react";
import { WorkPortfolio } from "@/app/components/WorkPortfolio";
import type { Locale } from "@/app/lib/i18n";
import type { PortfolioProject } from "@/app/lib/portfolio-projects";
import type { HomeSelectedWorkSettings } from "@/app/lib/site-settings";

function displayCount(projects: PortfolioProject[], settings: HomeSelectedWorkSettings) {
  return Math.min(settings.visibleCount, projects.length);
}

function initialProjects(projects: PortfolioProject[], settings: HomeSelectedWorkSettings) {
  return projects.slice(0, displayCount(projects, settings));
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function HomeWorkRotator({
  locale,
  projects,
  settings
}: {
  locale: Locale;
  projects: PortfolioProject[];
  settings: HomeSelectedWorkSettings;
}) {
  const [visibleProjects, setVisibleProjects] = useState(() => initialProjects(projects, settings));
  const [transitioningSlot, setTransitioningSlot] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const visibleProjectsRef = useRef(visibleProjects);
  const canRotate = settings.rotationEnabled && projects.length > displayCount(projects, settings);

  useEffect(() => {
    visibleProjectsRef.current = visibleProjects;
  }, [visibleProjects]);

  useEffect(() => {
    setVisibleProjects(initialProjects(projects, settings));
    setTransitioningSlot(null);
  }, [projects, settings]);

  useEffect(() => {
    if (!canRotate || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      const currentProjects = visibleProjectsRef.current;
      const visibleSlugs = new Set(currentProjects.map((project) => project.slug));
      const candidates = projects.filter((project) => !visibleSlugs.has(project.slug));

      if (candidates.length === 0) {
        return;
      }

      const slot = Math.floor(Math.random() * currentProjects.length);
      const nextProject = randomItem(candidates);
      setTransitioningSlot(slot);

      window.setTimeout(() => {
        setVisibleProjects((latestProjects) => latestProjects.map((project, index) => (index === slot ? nextProject : project)));
        window.setTimeout(() => setTransitioningSlot(null), 80);
      }, settings.transitionDurationMs);
    }, settings.rotationIntervalMs);

    return () => window.clearInterval(interval);
  }, [canRotate, isPaused, projects, settings.rotationIntervalMs, settings.transitionDurationMs]);

  return (
    <div
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <WorkPortfolio projects={visibleProjects} locale={locale} onModalChange={setIsPaused} transitioningSlots={transitioningSlot === null ? [] : [transitioningSlot]} />
    </div>
  );
}
