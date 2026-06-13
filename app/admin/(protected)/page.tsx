import Link from "next/link";
import { AdminPageHeader } from "@/app/components/admin/AdminShell";
import { ActionCard, MetricCard, StatusPill } from "@/app/components/admin/AdminCards";
import { getAdminDashboardData } from "@/app/lib/admin/data";

export default async function AdminDashboardPage() {
  const { leads, metrics, settings } = await getAdminDashboardData();
  const homeSetting = settings.find((setting) => setting.key === "home_selected_work");

  return (
    <>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Centro de control one-click"
        copy="Acciones rápidas para administrar el sitio sin entrar en campos técnicos. Lo importante aparece primero; lo avanzado queda dentro de cada módulo."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Leads nuevos" value={metrics.newLeads} detail={`${metrics.leads7Days} recibidos en los últimos 7 días.`} />
        <MetricCard label="Clientes activos" value={metrics.clients} detail="Usuarios con rol cliente y acceso activo." />
        <MetricCard label="Trabajos publicados" value={metrics.publishedWork} detail={`${metrics.featuredWork} destacados para Home/Work.`} />
        <MetricCard label="Proyectos en revisión" value={metrics.activeClientProjects} detail="Base preparada para portal tipo Frame.io." />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <ActionCard title="Agregar trabajo" copy="Carga título, cliente, visuales y Mux playback ID en pasos guiados." href="/admin/work" label="Ir a trabajos" />
        <ActionCard title="Crear cliente" copy="Crea un acceso para enviar propuestas, versiones y entregas privadas." href="/admin/clients" label="Ir a clientes" />
        <ActionCard title="Revisar leads" copy="Convierte contactos del formulario en clientes o proyectos internos." href="/admin/leads" label="Ir a leads" />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-ink/10 bg-paper p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Últimos leads</h2>
            <Link href="/admin/leads" className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite hover:text-ink">
              Ver todos
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="grid gap-3 border-t border-ink/10 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="mt-1 text-sm text-graphite">{lead.email} · {lead.project_type ?? "Proyecto sin tipo"}</p>
                </div>
                <StatusPill tone={lead.status === "new" ? "warn" : "neutral"}>{lead.status}</StatusPill>
              </div>
            ))}
            {!leads.length ? <p className="text-graphite">Todavía no hay leads registrados.</p> : null}
          </div>
        </div>

        <div className="border border-ink/10 bg-paper p-5">
          <h2 className="text-2xl font-semibold">Estado del sitio</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-graphite">
            <p>
              Home: <strong className="text-ink">{homeSetting ? "configurado desde base" : "usando fallback"}</strong>
            </p>
            <p>
              Videos listos: <strong className="text-ink">{metrics.videosInReview}</strong>
            </p>
            <Link className="mt-3 inline-flex items-center justify-center border border-ink/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink" href="https://vercel.com/adminpaovergaras-projects/site-paovergara/analytics">
              Abrir Vercel Analytics
            </Link>
            <Link className="inline-flex items-center justify-center border border-ink/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink" href="https://vercel.com/adminpaovergaras-projects/site-paovergara/speed-insights">
              Abrir Speed Insights
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
