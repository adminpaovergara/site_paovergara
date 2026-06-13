import { SlidersHorizontal } from "lucide-react";
import { AdminPageHeader, InfoHint } from "@/app/components/admin/AdminShell";
import { HomeSettingsForm } from "@/app/components/admin/AdminForms";
import { requireFullAdminProfile } from "@/app/lib/admin/auth";
import { getSiteSettings } from "@/app/lib/admin/data";

function getNumber(value: Record<string, unknown>, key: string) {
  return typeof value[key] === "number" ? String(value[key]) : "—";
}

function getNumberValue(value: Record<string, unknown>, key: string, fallback: number) {
  return typeof value[key] === "number" ? value[key] : fallback;
}

export default async function AdminSettingsPage() {
  await requireFullAdminProfile();
  const settings = await getSiteSettings();
  const home = settings.find((setting) => setting.key === "home_selected_work")?.value ?? {};

  return (
    <>
      <AdminPageHeader eyebrow="Settings" title="Configuración one-click" copy="Controla comportamiento del sitio desde tarjetas simples. Las estructuras técnicas quedan normalizadas en backend." />

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="border border-ink/10 bg-paper p-5">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} />
            <h2 className="text-2xl font-semibold">Home</h2>
          </div>
          <p className="mt-3 leading-7 text-graphite">Rotación de trabajos seleccionados y cantidad de piezas visibles.</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="text-graphite">Rotación activa</dt>
              <dd className="font-semibold">{home.rotationEnabled === true ? "Sí" : "No"}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="text-graphite">Visibles</dt>
              <dd className="font-semibold">{getNumber(home, "visibleCount")}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="text-graphite">Pool</dt>
              <dd className="font-semibold">{getNumber(home, "poolLimit")}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="text-graphite">Velocidad</dt>
              <dd className="font-semibold">{getNumber(home, "rotationIntervalMs")} ms</dd>
            </div>
          </dl>
          <HomeSettingsForm
            poolLimit={getNumberValue(home, "poolLimit", 12)}
            rotationEnabled={home.rotationEnabled === true}
            rotationIntervalMs={getNumberValue(home, "rotationIntervalMs", 6500)}
            transitionDurationMs={getNumberValue(home, "transitionDurationMs", 420)}
            visibleCount={getNumberValue(home, "visibleCount", 4)}
          />
        </article>

        <article className="border border-ink/10 bg-paper p-5">
          <h2 className="text-2xl font-semibold">Contacto y portal</h2>
          <p className="mt-3 leading-7 text-graphite">Próximos controles: booking URL, email receptor, SEO principal y activación del portal de clientes.</p>
          <div className="mt-6 grid gap-3">
            <InfoHint>Booking URL pendiente de configurar cuando el sitio esté publicado.</InfoHint>
            <InfoHint>Portal de clientes preparado en /client.</InfoHint>
            <InfoHint>GA4/Clarity fuera de esta fase.</InfoHint>
          </div>
        </article>
      </section>
    </>
  );
}
