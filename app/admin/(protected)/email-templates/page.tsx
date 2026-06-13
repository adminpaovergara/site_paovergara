import { AdminPageHeader, InfoHint } from "@/app/components/admin/AdminShell";
import { StatusPill } from "@/app/components/admin/AdminCards";
import { requireFullAdminProfile } from "@/app/lib/admin/auth";
import { getEmailTemplates } from "@/app/lib/admin/data";

const variables = ["name", "booking_url", "project_type", "country", "urgency", "company", "email", "phone", "message"];

export default async function AdminEmailTemplatesPage() {
  await requireFullAdminProfile();
  const templates = await getEmailTemplates();

  return (
    <>
      <AdminPageHeader eyebrow="Correos" title="Plantillas editables" copy="Textos de respuesta automática y correos transaccionales. Las variables se reemplazan con datos reales del lead o cliente." />
      <div className="mb-5 flex flex-wrap gap-2">
        {variables.map((variable) => (
          <InfoHint key={variable}>{`{{${variable}}}`}</InfoHint>
        ))}
      </div>
      <section className="grid gap-5">
        {templates.map((template) => (
          <article key={template.id} className="grid gap-5 border border-ink/10 bg-paper p-5 lg:grid-cols-[0.6fr_1fr]">
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusPill>{template.locale}</StatusPill>
                <StatusPill tone={template.active ? "good" : "warn"}>{template.active ? "Activa" : "Inactiva"}</StatusPill>
              </div>
              <h2 className="mt-5 text-2xl font-semibold">{template.template_key}</h2>
              <p className="mt-3 text-sm text-graphite">Asunto</p>
              <p className="mt-1 font-semibold">{template.subject}</p>
              <button className="mt-6 border border-ink/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">Editar plantilla</button>
            </div>
            <div className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">Texto plano</p>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap border border-ink/10 bg-ink/5 p-4 text-sm leading-6">{template.text_body}</pre>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">HTML</p>
                <p className="mt-2 border border-ink/10 bg-ink/5 p-4 text-sm text-graphite">Vista previa HTML disponible en el siguiente paso del editor.</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
