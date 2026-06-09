# Despliegue y Operaciones

## Desarrollo Local

Ruta del proyecto:

```sh
/Users/MG/Documents/Codex/2026-06-06/pavovergara.com
```

Servidor local:

```sh
pnpm dev
```

URL local habitual:

```text
http://127.0.0.1:3001
```

Si el servidor queda inestable por cache de Next.js:

```sh
rm -rf .next
pnpm dev
```

## Build

Antes de subir cambios importantes:

```sh
pnpm build
```

El build debe pasar antes de desplegar a produccion.

## Vercel

Proyecto:

- `site-paovergara`

Repositorio:

- `adminpaovergara/site_paovergara`

Flujo recomendado:

1. Cambiar codigo en rama.
2. Ejecutar build local.
3. Commit.
4. Push a GitHub.
5. Vercel genera preview automatico.
6. Revisar preview.
7. Promover/mergear cuando este aprobado.

## Variables de Entorno

Ver:

- `docs/production-env.md`

Las variables privadas se configuran en Vercel, no en codigo.

## Supabase en Produccion

Antes de activar formulario real:

1. Configurar `SUPABASE_SERVICE_ROLE_KEY` en Vercel.
2. Configurar SMTP.
3. Probar envio real.
4. Confirmar que `public.leads` no tenga permisos publicos.

## Dominio

El dominio `paovergara.com` se conectara al final, cuando el sitio este aprobado.

Antes de conectar dominio:

- Validar contenido final.
- Validar SEO.
- Validar formulario.
- Revisar redirects del sitio viejo.
- Confirmar DNS y correo existente para no afectar Google Workspace.
