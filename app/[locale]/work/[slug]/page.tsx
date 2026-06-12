import { redirect } from "next/navigation";
import type { Locale } from "@/app/lib/i18n";

export default async function ProjectRedirect({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect(`/${locale}/work`);
}
