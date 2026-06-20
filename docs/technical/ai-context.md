# Contexto Rapido Para IA

Usar este documento al iniciar una nueva sesion de IA sobre el proyecto.

## Proyecto

Sitio publico y administracion de Pao Vergara, color grading, finishing y postproduccion. Migracion desde WordPress hacia Next.js en Vercel, con Supabase como base para contenido, leads, usuarios, clientes y futuro portal tipo Frame.io.

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
- Sitio publico bilingue ES/EN.
- Work usa portfolio con videos Mux y tarjetas antes/despues.
- Home rota trabajos seleccionados con configuracion preparada en Supabase.
- Supabase conectado para catalogos del formulario, leads, portfolio, settings, perfiles, clientes y base de portal.
- Formulario usa `/api/leads`, guarda lead y envia correos por SMTP Google Workspace.
- `public.leads` no tiene acceso publico.
- Admin en `/admin` con experiencia one-click.
- Admin mobile corregido: menu full-screen, logout dentro del menu, PWA basica.
- Portal cliente base en `/client`.
- Vercel conectado con GitHub. La rama activa es `codex/initial-site`.
- URL temporal de produccion: `https://site-paovergara.vercel.app`.
- Dominio final `paovergara.com` se conectara al cierre del proyecto.

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

Si `pnpm` no esta disponible en la terminal local, usar:

```sh
PATH="$HOME/.local/bin:$PATH" ./node_modules/.bin/next dev -p 3001
PATH="$HOME/.local/bin:$PATH" ./node_modules/.bin/next build
```

Vercel CLI instalado en:

```sh
$HOME/.local/bin/vercel
```

## Criterio de Cambios

- Cambios pequenos, verificables y alineados a la estructura existente.
- Separar frontend, backend, integraciones y datos.
- No exponer credenciales en cliente.
- Crear migraciones para cambios de Supabase.
- Probar build antes de cerrar tareas importantes.
- Verificar web y mobile antes de publicar cambios visuales.
- No publicar sin revisar Vercel `Ready`.
