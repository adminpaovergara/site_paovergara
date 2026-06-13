import { Mail, MessageCircle, UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/app/components/admin/AdminShell";
import { StatusPill } from "@/app/components/admin/AdminCards";
import { LeadActions } from "@/app/components/admin/AdminForms";
import { getLeads } from "@/app/lib/admin/data";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <>
      <AdminPageHeader
        eyebrow="Mini CRM"
        title="Leads y oportunidades"
        copy="Cada contacto debe tener una siguiente acción clara: responder, crear cliente, enviar correo o archivar."
      />

      <section className="grid gap-4">
        {leads.map((lead) => {
          const phone = [lead.phone_country_code, lead.phone_number].filter(Boolean).join("");

          return (
            <article key={lead.id} className="grid gap-5 border border-ink/10 bg-paper p-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone={lead.status === "new" ? "warn" : "neutral"}>{lead.status}</StatusPill>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">{new Date(lead.created_at).toLocaleDateString("es-EC")}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{lead.name}</h2>
                <p className="mt-2 text-sm text-graphite">{lead.email} · {lead.country ?? "Sin país"} · {lead.project_type ?? "Sin tipo"}</p>
                <p className="mt-4 max-w-3xl leading-7 text-graphite">{lead.message}</p>
                <LeadActions id={lead.id} notes={lead.internal_notes} status={lead.status} />
              </div>
              <div className="grid content-start gap-2 sm:grid-cols-3 lg:w-64 lg:grid-cols-1">
                <a className="inline-flex items-center justify-center gap-2 border border-ink/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]" href={phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : `mailto:${lead.email}`}>
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a className="inline-flex items-center justify-center gap-2 border border-ink/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]" href={`mailto:${lead.email}`}>
                  <Mail size={14} />
                  Email
                </a>
                <button className="inline-flex items-center justify-center gap-2 bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-paper">
                  <UserPlus size={14} />
                  Crear cliente
                </button>
              </div>
            </article>
          );
        })}
        {!leads.length ? <p className="border border-ink/10 bg-paper p-5 text-graphite">Todavía no hay leads para revisar.</p> : null}
      </section>
    </>
  );
}
