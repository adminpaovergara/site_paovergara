import Link from "next/link";
import type { Locale } from "@/app/lib/i18n";
import { socialLinks } from "@/app/data/site";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto grid max-w-frame gap-8 px-5 py-10 text-sm text-graphite sm:px-8 md:grid-cols-[1fr_auto]">
        <p>© {new Date().getFullYear()} Pao Vergara. Color grading and finishing.</p>
        <div className="flex flex-wrap gap-5">
          {socialLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="hover:text-ink">
              {link.label}
            </a>
          ))}
          <Link href={`/${locale}/contact`} className="hover:text-ink">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
