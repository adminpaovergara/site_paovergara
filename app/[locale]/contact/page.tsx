import { ContactForm } from "@/app/components/ContactForm";
import { SectionIntro } from "@/app/components/SectionIntro";
import { siteCopy, socialLinks } from "@/app/data/site";
import type { Locale } from "@/app/lib/i18n";
import { createPageMetadata } from "@/app/lib/metadata";
import { getContactCatalogs } from "@/app/lib/contact-catalogs";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return createPageMetadata("contact", locale);
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const catalogs = await getContactCatalogs();

  return (
    <main className="py-20">
      <SectionIntro
        title={siteCopy[locale].contactTitle}
        copy={
          locale === "es"
            ? "Cuéntanos qué necesitas. Respondemos con el siguiente paso."
            : "Tell us what you need. We will reply with the next step."
        }
      />
      <section className="mx-auto mt-16 grid max-w-frame gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.65fr]">
        <ContactForm catalogs={catalogs} locale={locale} />
        <aside className="border-t border-ink/15 pt-6 text-sm text-graphite lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink">Social</p>
          <div className="mt-6 grid gap-3">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-lg hover:text-ink">
                {link.label}
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
