import { siteName, siteUrl } from "@/app/data/seo";
import type { Locale } from "@/app/lib/i18n";

const descriptions: Record<Locale, string> = {
  es: "Color grading, finishing digital y postproduccion para publicidad, moda, belleza, videoclips y ficcion.",
  en: "Color grading, digital finishing and post-production for commercials, fashion, beauty, music videos and fiction."
};

export function HomeJsonLd({ locale }: { locale: Locale }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        inLanguage: locale,
        publisher: {
          "@id": `${siteUrl}/#professional-service`
        }
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: siteName,
        url: siteUrl,
        jobTitle: "Colorist and finishing artist",
        sameAs: ["https://vimeo.com/paovergaracolorist", "https://www.instagram.com/paovergara_color/"]
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#professional-service`,
        name: siteName,
        url: siteUrl,
        description: descriptions[locale],
        image: `${siteUrl}/opengraph-image`,
        founder: {
          "@id": `${siteUrl}/#person`
        },
        areaServed: "Worldwide",
        serviceType: ["Color grading", "Digital finishing", "Post-production", "Remote color grading"],
        sameAs: ["https://vimeo.com/paovergaracolorist", "https://www.instagram.com/paovergara_color/"]
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
