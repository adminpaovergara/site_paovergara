import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/app/components/SectionIntro";
import { siteCopy } from "@/app/data/site";
import type { Locale } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("remote", locale);
}

const steps = {
  es: [
    "Envía material y referencias.",
    "Revisa look y ajustes.",
    "Aprueba y descarga."
  ],
  en: [
    "Send footage and references.",
    "Review look and notes.",
    "Approve and download."
  ]
};

export default async function RemoteColorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="py-20">
      <SectionIntro
        eyebrow={locale === "es" ? "Flujo remoto" : "Remote workflow"}
        title={siteCopy[locale].remoteTitle}
        copy={
          locale === "es"
            ? "Color profesional, sin depender de la ciudad."
            : "Professional color, wherever the team is."
        }
      />
      <section className="mx-auto mt-16 grid max-w-frame gap-8 px-5 sm:px-8 md:grid-cols-3">
        {steps[locale].map((step, index) => (
          <article key={step} className="border-t border-ink/15 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-8 text-2xl leading-9">{step}</p>
          </article>
        ))}
      </section>
      <div className="mx-auto mt-16 max-w-frame px-5 sm:px-8">
        <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-paper">
          {locale === "es" ? "Cotizar" : "Request quote"}
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
