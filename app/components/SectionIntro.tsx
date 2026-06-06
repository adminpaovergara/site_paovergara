export function SectionIntro({
  eyebrow,
  title,
  copy
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mx-auto max-w-frame px-5 sm:px-8">
      {eyebrow ? <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-graphite">{eyebrow}</p> : null}
      <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
        {title}
      </h1>
      {copy ? <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">{copy}</p> : null}
    </div>
  );
}
