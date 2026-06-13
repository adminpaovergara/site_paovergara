import { supabaseRest } from "@/app/lib/supabase-rest";
import type { Profile } from "@/app/lib/admin/auth";

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  project_type: string | null;
  phone_country_code: string | null;
  phone_number: string | null;
  urgency: string | null;
  contact_preference: string;
  status: string;
  message: string;
  internal_notes: string | null;
  created_at: string;
};

export type AdminPortfolioProject = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  client_name: string;
  category: string;
  thumbnail_url: string;
  before_image_url: string | null;
  after_image_url: string | null;
  video_status: string;
  mux_playback_id: string | null;
  featured: boolean;
  published: boolean;
  order_index: number;
  created_at: string;
};

export type ClientProject = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
};

export type VideoVersion = {
  id: string;
  project_id: string;
  version_number: number;
  title: string;
  mux_playback_id: string | null;
  status: string;
  created_at: string;
};

export type AdminEmailTemplate = {
  id: string;
  template_key: string;
  locale: "es" | "en";
  subject: string;
  text_body: string;
  html_body: string;
  active: boolean;
  updated_at: string;
};

export async function getAdminDashboardData() {
  const [leads, projects, profiles, clientProjects, versions, settings] = await Promise.all([
    getLeads(),
    getAdminPortfolioProjects(),
    getProfiles(),
    getClientProjects(),
    getVideoVersions(),
    getSiteSettings()
  ]);

  const now = Date.now();
  const sevenDaysAgo = now - 1000 * 60 * 60 * 24 * 7;
  const thirtyDaysAgo = now - 1000 * 60 * 60 * 24 * 30;

  return {
    leads,
    projects,
    profiles,
    clientProjects,
    versions,
    settings,
    metrics: {
      newLeads: leads.filter((lead) => lead.status === "new").length,
      leads7Days: leads.filter((lead) => new Date(lead.created_at).getTime() >= sevenDaysAgo).length,
      leads30Days: leads.filter((lead) => new Date(lead.created_at).getTime() >= thirtyDaysAgo).length,
      publishedWork: projects.filter((project) => project.published).length,
      draftWork: projects.filter((project) => !project.published).length,
      featuredWork: projects.filter((project) => project.featured).length,
      clients: profiles.filter((profile) => profile.role === "client" && profile.active).length,
      activeClientProjects: clientProjects.filter((project) => project.status === "active" || project.status === "review").length,
      videosInReview: versions.filter((version) => version.status === "ready").length
    }
  };
}

export async function getLeads() {
  return supabaseRest<AdminLead[]>({
    path:
      "leads?select=id,name,email,company,country,project_type,phone_country_code,phone_number,urgency,contact_preference,status,message,internal_notes,created_at&order=created_at.desc&limit=50",
    revalidate: 0
  });
}

export async function getAdminPortfolioProjects() {
  return supabaseRest<AdminPortfolioProject[]>({
    path:
      "portfolio_projects?select=id,slug,title_es,title_en,client_name,category,thumbnail_url,before_image_url,after_image_url,video_status,mux_playback_id,featured,published,order_index,created_at&order=order_index.asc",
    revalidate: 0
  });
}

export async function getProfiles() {
  return supabaseRest<Profile[]>({
    path: "profiles?select=id,email,full_name,role,company,phone,country,notes,active,must_change_password,last_seen_at,created_at&order=created_at.desc",
    revalidate: 0
  });
}

export async function getClientProjects(clientId?: string) {
  const filter = clientId ? `&client_id=eq.${clientId}` : "";

  return supabaseRest<ClientProject[]>({
    path: `client_projects?select=id,client_id,title,description,status,created_at${filter}&order=created_at.desc`,
    revalidate: 0
  });
}

export async function getVideoVersions(projectId?: string) {
  const filter = projectId ? `&project_id=eq.${projectId}` : "";

  return supabaseRest<VideoVersion[]>({
    path: `video_versions?select=id,project_id,version_number,title,mux_playback_id,status,created_at${filter}&order=created_at.desc`,
    revalidate: 0
  });
}

export async function getSiteSettings() {
  return supabaseRest<Array<{ key: string; value: Record<string, unknown>; is_public: boolean }>>({
    path: "site_settings?select=key,value,is_public&order=key.asc",
    revalidate: 0
  });
}

export async function getEmailTemplates() {
  return supabaseRest<AdminEmailTemplate[]>({
    path: "email_templates?select=id,template_key,locale,subject,text_body,html_body,active,updated_at&order=template_key.asc",
    revalidate: 0
  });
}
