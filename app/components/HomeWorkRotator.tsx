"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkPortfolio } from "@/app/components/WorkPortfolio";
import type { Locale } from "@/app/lib/i18n";
import type { PortfolioProject } from "@/app/lib/portfolio-projects";

const DISPLAY_COUNT = 4;
const ROTATION_DELAY = 6500;
const TRANSITION_DELAY = 260;

function rotatedProjects(projects: PortfolioProject[], start: number) {
  if (projects.length <= DISPLAY_COUNT) {
    return projects;
  }

  return Array.from({ length: DISPLAY_COUNT }, (_, index) => projects[(start + index) % projects.length]);
}

export function HomeWorkRotator({ locale, projects }: { locale: Locale; projects: PortfolioProject[] }) {
  const [start, setStart] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const canRotate = projects.length > DISPLAY_COUNT;

  const visibleProjects = useMemo(() => rotatedProjects(projects, start), [projects, start]);

  useEffect(() => {
    if (!canRotate || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setStart((current) => (current + 1) % projects.length);
        setIsTransitioning(false);
      }, TRANSITION_DELAY);
    }, ROTATION_DELAY);

    return () => window.clearInterval(interval);
  }, [canRotate, isPaused, projects.length]);

  return (
    <div
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`transition duration-500 ease-out ${isTransitioning ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}>
        <WorkPortfolio projects={visibleProjects} locale={locale} onModalChange={setIsPaused} />
      </div>
    </div>
  );
}
