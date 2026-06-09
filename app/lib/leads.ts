import { supabaseRest } from "@/app/lib/supabase-rest";
import type { Locale } from "@/app/lib/i18n";

export type LeadInsert = {
  name: string;
  email: string;
  phone_country_code: string | null;
  phone_number: string | null;
  contact_preference: string;
  company: string | null;
  country: string | null;
  project_type: string | null;
  urgency: string | null;
  message: string;
  locale: Locale;
  source_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  user_agent: string | null;
};

export async function insertLead(lead: LeadInsert) {
  await supabaseRest<void>({
    body: lead,
    mode: "service",
    path: "leads"
  });
}
