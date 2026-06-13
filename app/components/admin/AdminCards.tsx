import Link from "next/link";
import { ArrowRight, CircleAlert, Info } from "lucide-react";

export function ActionCard({
  title,
  copy,
  href,
  label
}: {
  title: string;
  copy: string;
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="group grid min-h-44 content-between border border-ink/10 bg-paper p-5 transition hover:border-ink/40 sm:min-h-52">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-graphite">
          <Info size={14} />
          Acción guiada
        </p>
        <h2 className="mt-5 text-2xl font-semibold leading-tight">{title}</h2>
        <p className="mt-3 leading-7 text-graphite">{copy}</p>
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
        {label}
        <ArrowRight className="transition group-hover:translate-x-1" size={16} />
      </span>
    </Link>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="border border-ink/10 bg-paper p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite">{label}</p>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
      <p className="mt-3 text-sm leading-6 text-graphite">{detail}</p>
    </div>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  const className =
    tone === "good"
      ? "border-emerald-700/30 bg-emerald-700/10 text-emerald-900"
      : tone === "warn"
        ? "border-amber-700/30 bg-amber-700/10 text-amber-900"
        : "border-ink/15 bg-ink/5 text-graphite";

  return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>{children}</span>;
}

export function MissingPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-700/30 bg-amber-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900">
      <CircleAlert size={12} />
      {children}
    </span>
  );
}
