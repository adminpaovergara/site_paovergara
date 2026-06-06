import type { Locale } from "@/app/lib/i18n";

const labels = {
  es: {
    name: "Nombre",
    email: "Email",
    company: "Empresa",
    country: "Pais",
    type: "Tipo de proyecto",
    message: "Mensaje",
    submit: "Enviar"
  },
  en: {
    name: "Name",
    email: "Email",
    company: "Company",
    country: "Country",
    type: "Project type",
    message: "Message",
    submit: "Send"
  }
};

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = labels[locale];

  return (
    <form className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="border border-ink/15 bg-transparent px-4 py-4 outline-none focus:border-ink" placeholder={copy.name} />
        <input className="border border-ink/15 bg-transparent px-4 py-4 outline-none focus:border-ink" placeholder={copy.email} type="email" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="border border-ink/15 bg-transparent px-4 py-4 outline-none focus:border-ink" placeholder={copy.company} />
        <input className="border border-ink/15 bg-transparent px-4 py-4 outline-none focus:border-ink" placeholder={copy.country} />
      </div>
      <input className="border border-ink/15 bg-transparent px-4 py-4 outline-none focus:border-ink" placeholder={copy.type} />
      <textarea
        className="min-h-40 border border-ink/15 bg-transparent px-4 py-4 outline-none focus:border-ink"
        placeholder={copy.message}
      />
      <button className="w-fit bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-graphite">
        {copy.submit}
      </button>
    </form>
  );
}
