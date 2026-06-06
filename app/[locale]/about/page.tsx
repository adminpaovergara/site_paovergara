import Image from "next/image";
import { SectionIntro } from "@/app/components/SectionIntro";
import { siteCopy } from "@/app/data/site";
import type { Locale } from "@/app/lib/i18n";

const bio = {
  es: [
    "Paola Vergara es postproductora independiente enfocada en color grading y finishing, con mas de quince anos de experiencia en el medio audiovisual.",
    "Es Magister en Postproduccion Digital Audiovisual por ESPOL y DaVinci Resolve Certified Trainer por Blackmagic Design.",
    "Ha participado en proyectos nacionales e internacionales para publicidad, moda, musica y ficcion, colaborando con directores y equipos creativos de distintos mercados."
  ],
  en: [
    "Paola Vergara is an independent post-production artist focused on color grading and finishing, with more than fifteen years of experience in audiovisual work.",
    "She holds a Master's degree in Digital Audiovisual Post-Production from ESPOL and is a DaVinci Resolve Certified Trainer by Blackmagic Design.",
    "Her work spans national and international projects across commercials, fashion, music and fiction, collaborating with directors and creative teams in different markets."
  ]
};

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="py-20">
      <SectionIntro title={siteCopy[locale].aboutTitle} />
      <section className="mx-auto mt-16 grid max-w-frame gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1fr]">
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
            <p key={paragraph} className="border-t border-ink/15 py-6 text-xl leading-9 text-graphite">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
