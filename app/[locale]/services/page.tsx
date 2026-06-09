import { SectionIntro } from "@/app/components/SectionIntro";
import { services } from "@/app/data/services";
import { siteCopy } from "@/app/data/site";
import { type Locale, t } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("services", locale);
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="py-20">
      <SectionIntro title={siteCopy[locale].servicesTitle} />
      <section className="mx-auto mt-16 grid max-w-frame gap-5 px-5 sm:px-8 md:grid-cols-2">
        {services.map((service, index) => (
          <article key={service.title.en} className="border border-ink/15 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-10 text-3xl font-semibold">{t(service.title, locale)}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-graphite">{t(service.description, locale)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
