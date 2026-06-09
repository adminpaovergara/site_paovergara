# Production Environment

Variables required in Vercel for Phase 1 contact leads.

## Supabase

- `SUPABASE_URL`: Project URL. Current project: `https://dghljunkjmvydpxcoqgh.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY`: Public key used server-side to read active form catalogs.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key. Keep server-only. Never prefix with `NEXT_PUBLIC_`.

## Google Workspace SMTP

Use a Google Workspace App Password for `SMTP_PASS`. Do not use the normal account password.

- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `465`
- `SMTP_SECURE`: `true`
- `SMTP_USER`: Google Workspace email account, for example `admin@paovergara.com`
- `SMTP_PASS`: Google Workspace App Password
- `SMTP_FROM`: Sender header, for example `Pao Vergara <admin@paovergara.com>`
- `LEAD_NOTIFY_TO`: Destination inbox. Current production target: `info@paovergara.com`. Use commas for multiple recipients.
- `LEAD_BOOKING_URL`: Public booking URL for the call-to-action button in the lead auto-reply email.

## Flow

1. Contact page loads public form catalogs from Supabase.
2. `/api/leads` validates the form against those catalogs.
3. The lead is saved in `public.leads` with contact details, phone, timing, source page and UTM data.
4. The internal notification email is sent to `info@paovergara.com` through Google Workspace SMTP.
5. The lead receives a branded HTML auto-reply with a booking button.
6. If email fails, the API still returns success after saving the lead.

## Security Boundary

- Do not use `NEXT_PUBLIC_` for Supabase service keys, SMTP credentials or admin secrets.
- Browser code only posts to the same-origin `/api/leads` endpoint.
- `public.leads` has no `anon` or `authenticated` privileges/policies. Inserts must go through the server API with `SUPABASE_SERVICE_ROLE_KEY`.
- Public Supabase read access is limited to active form catalogs: countries, project types, urgency options and contact preferences.
- The API rejects cross-origin browser posts and non-JSON payloads before validation.

## Form Protection

Current baseline protections:

- Honeypot field.
- Minimum time-to-submit check.
- Per-IP rate limit.
- Maximum request size.
- Field length limits.
- Allowed values for country code, project type, urgency and contact preference.
- Link-count filter in the message field.

If spam increases in production, add Cloudflare Turnstile or Vercel Firewall rules before adding heavier friction to the form.
