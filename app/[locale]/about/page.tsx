import Image from "next/image";
import { SectionIntro } from "@/app/components/SectionIntro";
import { siteCopy } from "@/app/data/site";
import type { Locale } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("about", locale);
}

const bio = {
  es: [
    "Colorista y artista de finishing con más de quince años en postproducción.",
    "Magíster en Postproducción Digital Audiovisual por ESPOL y DaVinci Resolve Certified Trainer.",
    "Trabaja con directores, agencias y marcas en publicidad, moda, música y ficción."
  ],
  en: [
    "Colorist and finishing artist with more than fifteen years in post-production.",
    "Master's degree in Digital Audiovisual Post-Production from ESPOL and DaVinci Resolve Certified Trainer.",
    "Works with directors, agencies and brands across commercials, fashion, music and fiction."
  ]
};

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="py-16 sm:py-20">
      <SectionIntro title={siteCopy[locale].aboutTitle} />
      <section className="mx-auto mt-12 grid max-w-frame gap-10 px-5 sm:mt-16 sm:px-8 lg:grid-cols-[0.9fr_1fr] lg:gap-12">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <Image
            src="https://paovergara.com/wp-content/uploads/2022/07/foto-back-con-franjas-negras-2-e1651257873252.png"
            alt="Pao Vergara"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-end">
          {bio[locale].map((paragraph) => (
            <p key={paragraph} className="border-t border-ink/15 py-5 text-lg leading-8 text-graphite sm:py-6 sm:text-xl sm:leading-9">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
