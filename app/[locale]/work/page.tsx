import { SectionIntro } from "@/app/components/SectionIntro";
import { WorkPortfolio } from "@/app/components/WorkPortfolio";
import type { Locale } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";
import { getPortfolioProjects } from "@/app/lib/portfolio-projects";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("work", locale);
}

const copy = {
  es: {
    title: "Trabajo seleccionado",
    intro: "Publicidad, moda, belleza, música e institucional."
  },
  en: {
    title: "Selected work",
    intro: "Commercials, fashion, beauty, music and institutional films."
  }
};

export default async function WorkPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const projects = await getPortfolioProjects();

  return (
    <main className="py-16 sm:py-20">
      <SectionIntro title={copy[locale].title} copy={copy[locale].intro} />
      <section className="mx-auto mt-12 max-w-frame px-5 sm:mt-16 sm:px-8">
        <WorkPortfolio projects={projects} locale={locale} />
      </section>
    </main>
  );
}
