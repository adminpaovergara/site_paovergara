import { AdminPageHeader, InfoHint } from "@/app/components/admin/AdminShell";
import { getContactCatalogs } from "@/app/lib/contact-catalogs";

function CatalogBlock({ title, items }: { title: string; items: Array<{ value: string; label: { es: string; en: string } }> }) {
  return (
    <article className="border border-ink/10 bg-paper p-5">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.value} className="grid gap-2 border-t border-ink/10 pt-3 sm:grid-cols-[1fr_1fr_auto]">
            <p className="font-semibold">{item.label.es}</p>
            <p className="text-graphite">{item.label.en}</p>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">{item.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default async function AdminCatalogsPage() {
  const catalogs = await getContactCatalogs();

  return (
    <>
      <AdminPageHeader eyebrow="Catálogos" title="Opciones del formulario" copy="Edita listas sin tocar código: países, tipos de proyecto, urgencias y preferencias de contacto." />
      <div className="mb-5">
        <InfoHint>En v1 se recomienda desactivar opciones antes que borrarlas, para no perder historial de leads.</InfoHint>
      </div>
      <section className="grid gap-5 xl:grid-cols-2">
        <CatalogBlock title="Tipos de proyecto" items={catalogs.projectTypes} />
        <CatalogBlock title="Timing" items={catalogs.urgencyOptions} />
        <CatalogBlock title="Preferencias de contacto" items={catalogs.contactOptions} />
        <article className="border border-ink/10 bg-paper p-5">
          <h2 className="text-2xl font-semibold">Países</h2>
          <p className="mt-3 text-sm text-graphite">{catalogs.countries.length} países activos en el formulario.</p>
          <div className="mt-5 grid max-h-[480px] gap-3 overflow-auto pr-2">
            {catalogs.countries.map((country) => (
              <div key={country.value} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-ink/10 pt-3">
                <span>{country.flag}</span>
                <span className="font-semibold">{country.label.es}</span>
                <span className="text-sm text-graphite">{country.dial}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
