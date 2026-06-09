# Resumen Tecnico

## Objetivo

Migrar `paovergara.com` desde WordPress hacia una aplicacion moderna en Next.js, desplegada en Vercel y preparada para crecer hacia administracion de contenido y portal de clientes.

## Stack Actual

- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- Hosting: Vercel.
- Base de datos: Supabase Postgres.
- Backend actual: API Routes de Next.js.
- Formularios: API interna `/api/leads`, Supabase y SMTP.
- Email: Google Workspace SMTP.

## Estado de Fase 1

- Sitio publico bilingue: `es` y `en`.
- Rutas principales: home, work, services, remote color grading, about, contact y login placeholder.
- Formulario de contacto conectado a catalogos de Supabase.
- Endpoint server-side para leads.
- SEO base: metadata, sitemap, robots y Open Graph image.
- Efecto visual antes/despues en proyectos seleccionados.

## Carpetas Importantes

- `app/[locale]`: paginas publicas bilingues.
- `app/components`: componentes visuales.
- `app/data`: contenido estatico inicial del sitio.
- `app/lib`: logica de servidor, integraciones y helpers.
- `app/api`: endpoints backend.
- `supabase/migrations`: cambios versionados de base de datos.
- `docs`: documentacion tecnica y operativa.

## Principio Rector

El frontend puede ser inspeccionado por cualquier usuario. Por eso, secretos, credenciales, service role keys, SMTP y operaciones sensibles deben vivir siempre en servidor, variables de entorno privadas o Supabase con RLS/permisos correctos.
