# Contexto Rapido Para IA

Usar este documento al iniciar una nueva sesion de IA sobre el proyecto.

## Proyecto

Sitio publico de Pao Vergara, color grading, finishing y postproduccion. Migracion desde WordPress hacia Next.js en Vercel, con Supabase como base para contenido y leads.

## Carpeta Correcta

```text
/Users/MG/Documents/Codex/2026-06-06/pavovergara.com
```

No trabajar sobre carpetas antiguas o de prueba como `hola`.

## Prioridades

1. Sitio premium, minimalista, cinematografico y rapido.
2. Experiencia bilingue ES/EN.
3. Seguridad: secretos solo en servidor.
4. Arquitectura preparada para admin y portal de clientes.
5. Documentacion actualizada con cada cambio relevante.

## Estado Actual

- Next.js App Router.
- Supabase conectado para catalogos del formulario y leads.
- Formulario usa `/api/leads`.
- `public.leads` no tiene acceso publico.
- SMTP preparado para Google Workspace.
- Dominio final se conectara al cierre del proyecto.

## Antes de Editar

Leer:

- `docs/technical/architecture.md`
- `docs/technical/security.md`
- `docs/technical/ai-coding-guide.md`
- `docs/production-env.md`

Luego ejecutar:

```sh
git status --short
```

## Comandos Habituales

```sh
pnpm dev
pnpm build
```

## Criterio de Cambios

- Cambios pequenos, verificables y alineados a la estructura existente.
- Separar frontend, backend, integraciones y datos.
- No exponer credenciales en cliente.
- Crear migraciones para cambios de Supabase.
- Probar build antes de cerrar tareas importantes.
