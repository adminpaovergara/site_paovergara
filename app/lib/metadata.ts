import type { Metadata } from "next";
import { defaultOgImage, pagePaths, pageSeo, siteName, siteUrl, type SeoPage } from "@/app/data/seo";
import type { Locale } from "@/app/lib/i18n";

const ogLocale: Record<Locale, string> = {
  es: "es_EC",
  en: "en_US"
};

export function localizedPath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}

export function buildAlternates(path = "") {
  return {
    canonical: `/es${path}`,
    languages: {
      es: `/es${path}`,
      en: `/en${path}`,
      "x-default": `/es${path}`
    }
  };
}

export function createPageMetadata(page: SeoPage, locale: Locale): Metadata {
  const path = pagePaths[page];
  const seo = pageSeo[page][locale];
  const url = localizedPath(locale, path);

  return {
    title: seo.title,
    description: seo.description,
    alternates: buildAlternates(path),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${siteName} | Color Grading & Finishing`
        }
      ],
      locale: ogLocale[locale],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [defaultOgImage]
    }
  };
}

export function createProjectMetadata({
  locale,
  slug,
  title,
  client,
  description,
  image
}: {
  locale: Locale;
  slug: string;
  title: string;
  client: string;
  description: string;
  image: string;
}): Metadata {
  const path = `/work/${slug}`;
  const pageTitle = `${title} | ${client} | ${siteName}`;

  return {
    title: pageTitle,
    description,
    alternates: buildAlternates(path),
    openGraph: {
      title: pageTitle,
      description,
      url: localizedPath(locale, path),
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 675,
          alt: `${client} - ${title}`
        }
      ],
      locale: ogLocale[locale],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image]
    }
  };
}

export { siteUrl };
