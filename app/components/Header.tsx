import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { alternateLocale, type Locale, t } from "@/app/lib/i18n";
import { navItems } from "@/app/data/site";

export function Header({ locale }: { locale: Locale }) {
  const alt = alternateLocale(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-frame items-center justify-between px-5 py-4 sm:px-8">
        <Link href={`/${locale}`} className="font-display text-sm font-semibold uppercase tracking-[0.22em]">
          Pao Vergara
        </Link>
        <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.16em] text-graphite md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="transition hover:text-ink">
              {t(item.label, locale)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
          <Link href={`/${alt}`} className="text-graphite transition hover:text-ink">
            {alt}
          </Link>
          <Link
            href={`/${locale}/login`}
            aria-label="Client Login"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 transition hover:border-ink hover:bg-ink hover:text-paper"
          >
            <LockKeyhole size={15} />
          </Link>
        </div>
      </div>
      <nav className="mx-auto flex max-w-frame gap-5 overflow-x-auto px-5 pb-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-graphite sm:px-8 md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={`/${locale}${item.href}`} className="shrink-0 transition hover:text-ink">
            {t(item.label, locale)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
