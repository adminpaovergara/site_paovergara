export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function t<T extends Record<Locale, string>>(value: T, locale: Locale): string {
  return value[locale];
}
