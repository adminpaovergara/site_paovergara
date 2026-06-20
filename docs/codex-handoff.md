# Handoff Para Continuar En Codex

Ultima actualizacion: 2026-06-19

## Repo

```text
GitHub: adminpaovergara/site_paovergara
Rama activa: codex/initial-site
Carpeta local: /Users/MG/Documents/Codex/2026-06-06/pavovergara.com
Produccion temporal: https://site-paovergara.vercel.app
```

## Estado Actual

- Sitio publico Next.js + TypeScript + Tailwind CSS.
- Deploy automatico en Vercel conectado a GitHub.
- Supabase como backend de datos y Auth.
- Formulario de contacto conectado a Supabase y SMTP Google Workspace.
- Admin en `/admin` con base one-click.
- Admin mobile/PWA ya corregido:
  - `Salir` esta dentro del menu.
  - Menu movil es full-screen.
  - Manifest y service worker activos.
- Portal cliente base en `/client`.
- Videos destacados usando Mux playback IDs.
- Portfolio preparado para administracion desde base.

## Ultimos Commits Relevantes

```text
ad7d966 Fix admin mobile menu behavior
32f7fd4 Make admin mobile navigation PWA-ready
73292a7 Add guided admin and client portal foundation
f159be5 Store home work rotation settings in Supabase
f603183 Randomize individual selected work cards
```

## Antes De Continuar

1. Abrir el repo correcto, no la carpeta antigua `hola`.
2. Leer:
   - `docs/technical/ai-context.md`
   - `docs/technical/architecture.md`
   - `docs/technical/security.md`
   - `docs/technical/database-supabase.md`
   - `docs/production-env.md`
3. Ejecutar:

```sh
git status --short --branch
```

## Comandos

```sh
pnpm dev
pnpm build
```

Fallback local si `pnpm` no esta disponible:

```sh
PATH="$HOME/.local/bin:$PATH" ./node_modules/.bin/next dev -p 3001
PATH="$HOME/.local/bin:$PATH" ./node_modules/.bin/next build
```

Vercel:

```sh
PATH="$HOME/.local/bin:$PATH" vercel ls site-paovergara --scope adminpaovergaras-projects
```

## Verificacion Obligatoria Antes De Publicar

Para cambios visuales:

- Probar desktop.
- Probar mobile.
- Confirmar que no haya overflow horizontal.
- Confirmar que menu y botones funcionen.
- Ejecutar `next build`.
- Confirmar Vercel `Ready`.

Para admin:

- Revisar `/admin/login`.
- Revisar `/admin` autenticado.
- Revisar menu mobile.
- No exponer `service_role` ni secretos en frontend.

Para formulario:

- Confirmar `/api/leads`.
- Confirmar guardado en Supabase.
- Confirmar correo interno a `info@paovergara.com`.
- Confirmar correo HTML al lead.

## Siguiente Trabajo Recomendado

1. Validar con Paola el UX mobile del admin real.
2. Completar modulo `/admin/work` con editor real de trabajos.
3. Completar `/admin/leads` como mini CRM.
4. Completar `/admin/users` y flujo de invitaciones.
5. Completar `/admin/clients` y proyectos privados.
6. Agregar subida Mux desde backend, sin tokens en frontend.
7. Preparar dominio final `paovergara.com` cuando el sitio este aprobado.

## Prompt Sugerido Para Nuevo Proyecto Codex

```text
Vamos a continuar el proyecto paovergara.com.

Repo: adminpaovergara/site_paovergara
Rama: codex/initial-site

Antes de tocar codigo, lee:
- docs/codex-handoff.md
- docs/technical/ai-context.md
- docs/technical/architecture.md
- docs/technical/security.md
- docs/technical/database-supabase.md

Objetivo actual:
Continuar la administracion one-click y portal cliente, manteniendo seguridad, Supabase como backend, Vercel como hosting y verificacion mobile/desktop antes de publicar.

Reglas:
- No exponer secretos en frontend.
- Todo cambio de base debe ir con migracion Supabase.
- Probar build antes de cerrar.
- Para cambios visuales, verificar mobile y desktop.
```
