# Security and QA Audit

Date: 2026-06-12

## Scope

- Public Next.js site routes.
- Contact form API.
- Supabase tables used in phase 1.
- Environment variable exposure.
- Dependency vulnerability scan.

## Checks Performed

- Production build: passed.
- Dependency audit: passed with no known vulnerabilities.
- Main routes returned 200: `/es`, `/en`, `/es/work`, `/es/contact`, `/es/services`, `/es/remote-color-grading`, `/es/about`, `/es/login`, `/robots.txt`, `/sitemap.xml`.
- Security headers present: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- Contact API defensive checks:
  - Non-JSON requests return 415.
  - Foreign origins return 403.
  - Honeypot submissions return a soft 200 without email.
  - Missing required fields return 400.
- Browser smoke test: home page loads without active Next.js issues after refresh.

## Fixes Applied

- Added baseline security headers in `next.config.ts`.
- Added a `pnpm` override for `postcss` to avoid the vulnerable 8.4.x dependency path.
- Removed real Supabase key values from `.env.example`.
- Changed Supabase reads to use server-side `service_role` by default. No Supabase key is exposed with `NEXT_PUBLIC_`.
- Hardened public table grants and enabled force RLS on phase 1 public tables.
- Added defensive triggers as an extra guardrail for public table writes.
- Added network-error handling to the contact form submit flow.

## Important Finding

The current `SUPABASE_PUBLISHABLE_KEY` was previously present in `.env.example` and direct REST write tests showed it can still write to some tables in the active Supabase Data API surface. The application no longer needs this key, but it should be revoked or rotated in Supabase before production.

Required production action:

1. In Supabase, go to Project Settings > API Keys.
2. Delete or rotate the exposed publishable key.
3. Remove `SUPABASE_PUBLISHABLE_KEY` from Vercel variables unless a future client-side Supabase feature truly needs it.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` only in server-side environments.

## Recommended Next QA

- Add Cloudflare Turnstile or another challenge if spam increases.
- Add a stricter Content Security Policy after testing Mux, Next images, inline scripts and styles.
- Add uptime/error monitoring in Vercel.
- Before launch, test contact form from the Vercel production URL after rotating keys.
