"use client";

import { useEffect, useRef, useState } from "react";
import { WorkPortfolio } from "@/app/components/WorkPortfolio";
import type { Locale } from "@/app/lib/i18n";
import type { PortfolioProject } from "@/app/lib/portfolio-projects";

const DISPLAY_COUNT = 4;
const ROTATION_DELAY = 6500;
const TRANSITION_DELAY = 420;

function initialProjects(projects: PortfolioProject[]) {
  return projects.slice(0, DISPLAY_COUNT);
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function HomeWorkRotator({ locale, projects }: { locale: Locale; projects: PortfolioProject[] }) {
  const [visibleProjects, setVisibleProjects] = useState(() => initialProjects(projects));
  const [transitioningSlot, setTransitioningSlot] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const visibleProjectsRef = useRef(visibleProjects);
  const canRotate = projects.length > DISPLAY_COUNT;

  useEffect(() => {
    visibleProjectsRef.current = visibleProjects;
  }, [visibleProjects]);

  useEffect(() => {
    setVisibleProjects(initialProjects(projects));
    setTransitioningSlot(null);
  }, [projects]);

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
      }, TRANSITION_DELAY);
    }, ROTATION_DELAY);

    return () => window.clearInterval(interval);
  }, [canRotate, isPaused, projects]);

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
