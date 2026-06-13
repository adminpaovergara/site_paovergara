import { redirect } from "next/navigation";
import type { Locale } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("login", locale);
}

export default function LoginPage() {
  redirect("/client/login");
}
