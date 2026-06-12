import { projects as fallbackProjects } from "@/app/data/projects";
import type { Locale } from "@/app/lib/i18n";
import { supabaseRest } from "@/app/lib/supabase-rest";

export type VideoProvider = "mux" | "vimeo" | "youtube" | "r2" | "external";

export type PortfolioProject = {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  client: string;
  category: string;
  year?: string;
  role: Record<Locale, string>;
  thumbnail: string;
  beforeImage?: string;
  afterImage?: string;
  videoProvider: VideoProvider;
  videoStatus: "draft" | "processing" | "ready" | "archived";
  videoUrl?: string;
  muxPlaybackId?: string;
  durationSeconds?: number;
  featured: boolean;
  orderIndex: number;
};

type PortfolioProjectRow = {
  slug: string;
  title_es: string;
  title_en: string;
  description_es: string | null;
  description_en: string | null;
  client_name: string;
  category: string;
  year: string | null;
  role_es: string | null;
  role_en: string | null;
  thumbnail_url: string;
  before_image_url: string | null;
  after_image_url: string | null;
  video_provider: VideoProvider;
  video_status: PortfolioProject["videoStatus"];
  video_url: string | null;
  mux_playback_id: string | null;
  duration_seconds: number | null;
  featured: boolean;
  order_index: number;
};

function mapRow(row: PortfolioProjectRow): PortfolioProject {
  return {
    slug: row.slug,
    title: {
      es: row.title_es,
      en: row.title_en
    },
    description: {
      es: row.description_es ?? "",
      en: row.description_en ?? row.description_es ?? ""
    },
    client: row.client_name,
    category: row.category,
    year: row.year ?? undefined,
    role: {
      es: row.role_es ?? "Color grading / finishing",
      en: row.role_en ?? row.role_es ?? "Color grading / finishing"
    },
    thumbnail: row.thumbnail_url,
    beforeImage: row.before_image_url ?? undefined,
    afterImage: row.after_image_url ?? undefined,
    videoProvider: row.video_provider,
    videoStatus: row.video_status,
    videoUrl: row.video_url ?? undefined,
    muxPlaybackId: row.mux_playback_id ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    featured: row.featured,
    orderIndex: row.order_index
  };
}

function fallbackPortfolioProjects(): PortfolioProject[] {
  return fallbackProjects.map((project, index) => ({
    slug: project.slug,
    title: {
      es: project.title,
      en: project.title
    },
    description: project.description,
    client: project.client,
    category: project.category,
    year: project.year,
    role: {
      es: "Color grading / finishing",
      en: "Color grading / finishing"
    },
    thumbnail: project.thumbnail,
    beforeImage: project.beforeImage,
    afterImage: project.afterImage,
    videoProvider: project.videoUrl.includes("youtube.com") ? "youtube" : "vimeo",
    videoStatus: "ready",
    videoUrl: project.videoUrl,
    featured: Boolean(project.featured),
    orderIndex: (index + 1) * 10
  }));
}

export async function getPortfolioProjects() {
  try {
    const rows = await supabaseRest<PortfolioProjectRow[]>({
      path:
        "portfolio_projects?select=slug,title_es,title_en,description_es,description_en,client_name,category,year,role_es,role_en,thumbnail_url,before_image_url,after_image_url,video_provider,video_status,video_url,mux_playback_id,duration_seconds,featured,order_index&published=eq.true&order=order_index.asc",
      revalidate: 300
    });

    return rows.map(mapRow);
  } catch (error) {
    console.error(error);
    return fallbackPortfolioProjects();
  }
}

export async function getFeaturedPortfolioProjects(limit = 5) {
  const projects = await getPortfolioProjects();
  return projects.filter((project) => project.featured).slice(0, limit);
}
