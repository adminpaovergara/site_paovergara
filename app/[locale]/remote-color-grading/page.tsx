import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/app/components/SectionIntro";
import { siteCopy } from "@/app/data/site";
import type { Locale } from "@/app/lib/i18n";

const steps = {
  es: [
    "Recepcion de material, referencias y brief creativo.",
    "Primera version de look y correcciones por video review.",
    "Aprobacion final y entrega en los formatos acordados."
  ],
  en: [
    "Receive footage, references and creative brief.",
    "First look pass and review notes through video review.",
    "Final approval and delivery in the agreed formats."
  ]
};

export default async function RemoteColorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="py-20">
      <SectionIntro
        eyebrow="Remote workflow"
        title={siteCopy[locale].remoteTitle}
        copy={
          locale === "es"
            ? "Un flujo pensado para agencias, productoras y directores que necesitan color profesional sin importar la ciudad."
            : "A workflow for agencies, production companies and directors who need professional color regardless of location."
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
          {locale === "es" ? "Cotizar proyecto" : "Request a quote"}
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
