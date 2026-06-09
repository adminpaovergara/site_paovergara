import type { Locale } from "@/app/lib/i18n";
import { supabaseRest } from "@/app/lib/supabase-rest";

export type EmailTemplate = {
  subject: string;
  textBody: string;
  htmlBody: string;
};

type EmailTemplateRow = {
  subject: string;
  text_body: string;
  html_body: string;
};

export async function getEmailTemplate(key: string, locale: Locale) {
  const rows = await supabaseRest<EmailTemplateRow[]>({
    mode: "service",
    path: `email_templates?select=subject,text_body,html_body&template_key=eq.${encodeURIComponent(key)}&locale=eq.${locale}&active=eq.true&limit=1`
  });
  const template = rows[0];

  if (!template) {
    return null;
  }

  return {
    subject: template.subject,
    textBody: template.text_body,
    htmlBody: template.html_body
  };
}

export function renderTemplate(value: string, variables: Record<string, string>) {
  return value.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => variables[key] ?? "");
}
