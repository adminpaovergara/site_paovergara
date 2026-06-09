import { LockKeyhole } from "lucide-react";
import { SectionIntro } from "@/app/components/SectionIntro";
import { siteCopy } from "@/app/data/site";
import type { Locale } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("login", locale);
}

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="py-20">
      <SectionIntro title={siteCopy[locale].loginTitle} copy={siteCopy[locale].loginIntro} />
      <section className="mx-auto mt-16 max-w-frame px-5 sm:px-8">
        <div className="max-w-xl border border-ink/15 p-8">
          <LockKeyhole size={28} />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-graphite">
            {locale === "es" ? "Fase 3" : "Phase 3"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            {locale === "es" ? "Acceso privado en construcción" : "Private access in progress"}
          </h2>
        </div>
      </section>
    </main>
  );
}
