import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { HomeWorkRotator } from "@/app/components/HomeWorkRotator";
import { services } from "@/app/data/services";
import { siteCopy } from "@/app/data/site";
import { isLocale, type Locale, t } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";
import { getFeaturedPortfolioProjects } from "@/app/lib/portfolio-projects";
import { getHomeSelectedWorkSettings } from "@/app/lib/site-settings";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("home", locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = siteCopy[locale];
  const selectedWorkSettings = await getHomeSelectedWorkSettings();
  const featured = await getFeaturedPortfolioProjects(selectedWorkSettings.poolLimit);

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100svh-73px)] max-w-frame content-end px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_0.75fr] lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-graphite">{copy.eyebrow}</p>
          <h1 className="text-balance font-display text-[17vw] font-semibold uppercase leading-[0.8] sm:text-[15vw] lg:text-[9.5rem]">
            {copy.heroTitle}
          </h1>
        </div>
        <div className="mt-10 flex max-w-xl flex-col justify-end lg:mt-0">
          <p className="text-xl leading-8 text-ink/85 sm:text-2xl sm:leading-9">{copy.heroIntro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/work`} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-paper">
              {copy.heroCta}
              <ArrowRight size={16} />
            </Link>
            <Link href={`/${locale}/contact`} className="inline-flex items-center border border-ink/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em]">
              {copy.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink py-5 text-paper">
        <div className="mx-auto flex max-w-frame flex-wrap gap-x-8 gap-y-2 px-5 text-xs uppercase tracking-[0.22em] text-paper/70 sm:px-8">
          {(locale === "es"
            ? ["Publicidad", "Moda", "Belleza", "Videoclips", "Ficción", "Remoto"]
            : ["Commercials", "Fashion", "Beauty", "Music videos", "Fiction", "Remote"]
          ).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-frame px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-8">
          <h2 className="max-w-2xl text-balance text-4xl font-semibold sm:text-6xl">{copy.selectedWork}</h2>
          <Link href={`/${locale}/work`} className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-graphite hover:text-ink md:block">
            {locale === "es" ? "Ver todo" : "View all"}
          </Link>
        </div>
        <HomeWorkRotator projects={featured} locale={locale} settings={selectedWorkSettings} />
        <Link href={`/${locale}/work`} className="mt-10 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-graphite hover:text-ink md:hidden">
          {locale === "es" ? "Ver todo" : "View all"}
        </Link>
      </section>

      <section className="border-y border-ink/10 py-16 sm:py-20">
        <div className="mx-auto grid max-w-frame gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1fr]">
          <h2 className="text-balance text-4xl font-semibold sm:text-6xl">{copy.servicesTitle}</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {services.map((service) => (
              <article key={service.title.en} className="border-t border-ink/15 pt-5">
                <h3 className="text-xl font-semibold">{t(service.title, locale)}</h3>
                <p className="mt-3 leading-7 text-graphite">{t(service.description, locale)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
