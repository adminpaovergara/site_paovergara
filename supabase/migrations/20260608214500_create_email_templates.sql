create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  locale text not null check (locale in ('es', 'en')),
  subject text not null,
  text_body text not null,
  html_body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_key, locale)
);

alter table public.email_templates enable row level security;

comment on table public.email_templates is 'Editable transactional email templates for admin-managed site communications.';
comment on column public.email_templates.template_key is 'Stable template identifier used by the application.';
comment on column public.email_templates.html_body is 'Editable HTML body. Supports {{name}}, {{booking_url}}, {{project_type}}, {{country}}, {{urgency}}, {{company}}, {{email}}, {{phone}} and {{message}} placeholders.';

insert into public.email_templates (template_key, locale, subject, text_body, html_body) values
  (
    'lead_auto_reply',
    'es',
    'Gracias por contactarnos | Pao Vergara',
    'Hola {{name}},

Gracias por contactarnos. Recibimos tu proyecto y el equipo de Pao Vergara lo revisara con cuidado.

Trabajamos el color, el finishing y la postproduccion con una mirada precisa para que cada imagen tenga identidad, ritmo y emocion.

El siguiente paso ideal es agendar una llamada breve para entender objetivos, tiempos, referencias y entregables.

Agenda aqui: {{booking_url}}

Nos vemos pronto,
Pao Vergara',
    '<!doctype html>
<html>
  <body style="margin:0;background:#f5f3ed;color:#111111;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f3ed;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dedbd2;">
            <tr>
              <td style="padding:38px 34px 28px;">
                <p style="margin:0 0 28px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6f6b62;">Solicitud recibida</p>
                <h1 style="margin:0 0 20px;font-size:32px;line-height:1.08;color:#111111;">Hola {{name}}, gracias por escribirnos.</h1>
                <p style="margin:0 0 18px;font-size:17px;line-height:1.65;color:#33312d;">Recibimos tu proyecto y lo vamos a revisar con cuidado. Nuestro trabajo es ayudar a que cada imagen encuentre una identidad clara, elegante y memorable.</p>
                <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#55514a;">Color grading, finishing y postproduccion pensados para publicidad, moda, belleza, videoclips y ficcion.</p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background:#111111;">
                      <a href="{{booking_url}}" style="display:inline-block;padding:15px 22px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;">Agenda una llamada</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#6f6b62;">En la llamada revisaremos objetivos, tiempos, referencias y entregables para proponerte el mejor camino.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 34px;border-top:1px solid #dedbd2;">
                <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#111111;">Pao Vergara</p>
                <p style="margin:8px 0 0;font-size:13px;color:#6f6b62;">Color grading / finishing / postproduccion</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
  ),
  (
    'lead_auto_reply',
    'en',
    'Thank you for reaching out | Pao Vergara',
    'Hi {{name}},

Thank you for reaching out. We received your project and the Pao Vergara team will review it carefully.

We shape color, finishing and post-production with a precise eye so every image carries identity, rhythm and emotion.

The best next step is a short call to understand goals, timing, references and deliverables.

Book here: {{booking_url}}

Speak soon,
Pao Vergara',
    '<!doctype html>
<html>
  <body style="margin:0;background:#f5f3ed;color:#111111;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f3ed;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dedbd2;">
            <tr>
              <td style="padding:38px 34px 28px;">
                <p style="margin:0 0 28px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6f6b62;">Request received</p>
                <h1 style="margin:0 0 20px;font-size:32px;line-height:1.08;color:#111111;">Hi {{name}}, thank you for reaching out.</h1>
                <p style="margin:0 0 18px;font-size:17px;line-height:1.65;color:#33312d;">We received your project and will review it carefully. Our work is to help every image find a clear, elegant and memorable identity.</p>
                <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#55514a;">Color grading, finishing and post-production for commercial, fashion, beauty, music video and fiction work.</p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background:#111111;">
                      <a href="{{booking_url}}" style="display:inline-block;padding:15px 22px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;">Book a call</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#6f6b62;">On the call we will review goals, timing, references and deliverables to suggest the best path forward.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 34px;border-top:1px solid #dedbd2;">
                <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#111111;">Pao Vergara</p>
                <p style="margin:8px 0 0;font-size:13px;color:#6f6b62;">Color grading / finishing / post-production</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
  )
on conflict (template_key, locale) do update set
  subject = excluded.subject,
  text_body = excluded.text_body,
  html_body = excluded.html_body,
  active = true,
  updated_at = now();
