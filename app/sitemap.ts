import type { MetadataRoute } from "next";
import { projects } from "@/app/data/projects";
import { pagePaths, siteUrl, type SeoPage } from "@/app/data/seo";
import { locales } from "@/app/lib/i18n";

const staticPages: Array<{ page: SeoPage; priority: number }> = [
  { page: "home", priority: 1 },
  { page: "work", priority: 0.9 },
  { page: "services", priority: 0.8 },
  { page: "remote", priority: 0.8 },
  { page: "about", priority: 0.7 },
  { page: "contact", priority: 0.7 },
  { page: "login", priority: 0.3 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = locales.flatMap((locale) =>
    staticPages.map(({ page, priority }) => ({
      url: `${siteUrl}/${locale}${pagePaths[page]}`,
      lastModified,
      changeFrequency: page === "home" || page === "work" ? ("monthly" as const) : ("yearly" as const),
      priority
    }))
  );

  const projectPages = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${siteUrl}/${locale}/work/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.75 : 0.6
    }))
  );

  return [...pages, ...projectPages];
}
